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
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
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

  // Verify we have the required parameters
  if (!tokenHash) {
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', AUTH_ERRORS.UNKNOWN_ERROR);
    return NextResponse.redirect(redirectUrl);
  }

  // Validate OTP type
  if (!isValidOtpType(type)) {
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', 'Invalid confirmation type');
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();

  // Verify the OTP token
  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (verifyError) {
    console.error('Email verification error:', verifyError);
    const redirectUrl = new URL('/sign-in', origin);
    redirectUrl.searchParams.set('error', verifyError.message);
    return NextResponse.redirect(redirectUrl);
  }

  // Sync user to Prisma if we have a user
  if (data.user) {
    const syncResult = await syncUserToPrisma(data.user);
    if (!syncResult.success) {
      console.error('User sync failed after email confirmation');
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
