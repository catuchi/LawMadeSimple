import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncUserToPrisma } from '@/services/auth/auth.service';
import { getSafeRedirectPath } from '@/lib/utils/redirect';
import { DEFAULT_REDIRECT, AUTH_ERRORS } from '@/constants/auth';

// Valid OTP types for email confirmation
const VALID_OTP_TYPES = ['email', 'signup', 'recovery', 'email_change'] as const;
type OtpType = (typeof VALID_OTP_TYPES)[number];

function isValidOtpType(type: string | null): type is OtpType {
  return type !== null && VALID_OTP_TYPES.includes(type as OtpType);
}

/**
 * Email confirmation handler.
 * Handles the redirect from email confirmation links.
 * Supports both PKCE flow (code param) and legacy flow (token_hash param).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = getSafeRedirectPath(searchParams.get('next'), DEFAULT_REDIRECT.AFTER_SIGN_IN);
  const error = searchParams.get('error');

  // Handle errors from the email link - don't expose provider error details
  if (error) {
    console.error('Email confirm error:', error);
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', AUTH_ERRORS.UNKNOWN_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  let data;
  let verifyError;

  // PKCE flow: exchange code for session
  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    data = result.data;
    verifyError = result.error;
  }
  // Legacy flow: verify OTP token
  else if (tokenHash && isValidOtpType(type)) {
    const result = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    data = result.data;
    verifyError = result.error;
  }
  // No valid parameters
  else {
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', AUTH_ERRORS.UNKNOWN_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  if (verifyError) {
    console.error('Email verification error:', verifyError);
    const redirectUrl = new URL('/sign-in', origin);
    // Use generic error message to avoid exposing internal details
    redirectUrl.searchParams.set('error', AUTH_ERRORS.UNKNOWN_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  // Sync user to Prisma if we have a user
  if (data.user) {
    const syncResult = await syncUserToPrisma(data.user);
    if (!syncResult.success) {
      console.error('User sync failed after email confirmation:', syncResult.error);

      // For recovery flow, still allow (user just needs to reset password)
      // For signup/email change, block if account was deleted
      if (type !== 'recovery') {
        await supabase.auth.signOut();

        const errorMessage =
          syncResult.error === 'ACCOUNT_DELETED'
            ? 'This account has been deleted and cannot be used.'
            : AUTH_ERRORS.USER_SYNC_FAILED;

        const errorUrl = new URL('/sign-in', origin);
        errorUrl.searchParams.set('error', errorMessage);
        return NextResponse.redirect(errorUrl);
      }
    }
  }

  // For password recovery, redirect to reset password page
  if (type === 'recovery') {
    const redirectUrl = new URL('/reset-password', origin);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to the intended destination
  const redirectUrl = new URL(next, origin);
  return NextResponse.redirect(redirectUrl);
}
