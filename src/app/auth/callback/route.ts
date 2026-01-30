import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncUserToPrisma } from '@/services/auth/auth.service';
import { getSafeRedirectPath } from '@/lib/utils/redirect';
import { DEFAULT_REDIRECT, AUTH_ERRORS } from '@/constants/auth';

/**
 * OAuth and Magic Link callback handler.
 * Exchanges the auth code for a session and syncs the user to Prisma.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = getSafeRedirectPath(searchParams.get('next'), DEFAULT_REDIRECT.AFTER_SIGN_IN);
  const error = searchParams.get('error');

  // Handle OAuth errors - don't expose provider error details to users
  if (error) {
    console.error('OAuth callback error:', error);
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', AUTH_ERRORS.OAUTH_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  // No code means something went wrong
  if (!code) {
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', AUTH_ERRORS.OAUTH_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();

  // Exchange the code for a session
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('Code exchange error:', exchangeError);
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', AUTH_ERRORS.OAUTH_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  // Sync user to Prisma if we have a user
  if (data.user) {
    const syncResult = await syncUserToPrisma(data.user);
    if (!syncResult.success) {
      console.error('User sync failed after OAuth callback:', syncResult.error);

      // Sign out to prevent inconsistent state
      await supabase.auth.signOut();

      // Handle deleted account
      const errorMessage =
        syncResult.error === 'ACCOUNT_DELETED'
          ? 'This account has been deleted and cannot be used.'
          : AUTH_ERRORS.USER_SYNC_FAILED;

      const errorUrl = new URL('/sign-in', origin);
      errorUrl.searchParams.set('error', errorMessage);
      return NextResponse.redirect(errorUrl);
    }
  }

  // Redirect to the intended destination
  const redirectUrl = new URL(next, origin);
  return NextResponse.redirect(redirectUrl);
}
