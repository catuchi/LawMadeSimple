'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { syncUserToPrisma } from './auth.service';
import { getSafeRedirectPath } from '@/lib/utils/redirect';
import type { AuthFormState } from '@/types/auth';
import {
  AUTH_ERRORS,
  AUTH_SUCCESS,
  DEFAULT_REDIRECT,
  PASSWORD_REQUIREMENTS,
} from '@/constants/auth';
import { getUserByEmail } from './auth.service';

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * Requires: 8+ chars, uppercase, lowercase, and a number
 */
function isValidPassword(password: string): boolean {
  if (
    password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH ||
    password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH
  ) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Gets the origin URL for redirects
 * In production, always uses configured URL to prevent header manipulation
 */
async function getOrigin(): Promise<string> {
  // In production, always use the configured URL for security
  if (process.env.NODE_ENV === 'production') {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL must be configured in production');
    }
    return appUrl;
  }

  // In development, allow origin header for flexibility
  const headersList = await headers();
  const origin = headersList.get('origin');
  return origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Sign up with email and password
 */
export async function signUp(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const acceptedTos = formData.get('tos') === 'on';

  // Validate inputs
  const fieldErrors: AuthFormState['fieldErrors'] = {};

  if (!email) {
    fieldErrors.email = AUTH_ERRORS.REQUIRED_FIELD;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = AUTH_ERRORS.INVALID_EMAIL;
  }

  if (!password) {
    fieldErrors.password = AUTH_ERRORS.REQUIRED_FIELD;
  } else if (!isValidPassword(password)) {
    fieldErrors.password = AUTH_ERRORS.WEAK_PASSWORD;
  }

  if (!acceptedTos) {
    fieldErrors.tos = AUTH_ERRORS.TOS_REQUIRED;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      // Check if user exists in our database - they may have used OAuth
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return { error: AUTH_ERRORS.EMAIL_EXISTS_WITH_OAUTH };
      }
      return { error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS };
    }
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.SIGN_UP };
}

/**
 * Sign in with email and password
 */
export async function signIn(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string | null;

  // Validate inputs
  const fieldErrors: AuthFormState['fieldErrors'] = {};

  if (!email) {
    fieldErrors.email = AUTH_ERRORS.REQUIRED_FIELD;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = AUTH_ERRORS.INVALID_EMAIL;
  }

  if (!password) {
    fieldErrors.password = AUTH_ERRORS.REQUIRED_FIELD;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      // Check if user exists in our database (they may have signed up with OAuth)
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        // User exists but password is wrong - they likely used OAuth
        return { error: AUTH_ERRORS.INVALID_CREDENTIALS_TRY_OAUTH };
      }
      return { error: AUTH_ERRORS.INVALID_CREDENTIALS };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: AUTH_ERRORS.EMAIL_NOT_CONFIRMED };
    }
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    return { error: error.message };
  }

  // Sync user to Prisma
  if (data.user) {
    const syncResult = await syncUserToPrisma(data.user);
    if (!syncResult.success) {
      console.error('User sync failed after sign in');
    }
  }

  // Redirect to the intended destination or home (validated for security)
  const destination = getSafeRedirectPath(redirectTo, DEFAULT_REDIRECT.AFTER_SIGN_IN);
  redirect(destination);
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(DEFAULT_REDIRECT.AFTER_SIGN_OUT);
}

/**
 * Send magic link email
 */
export async function sendMagicLink(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { fieldErrors: { email: AUTH_ERRORS.REQUIRED_FIELD } };
  }

  if (!isValidEmail(email)) {
    return { fieldErrors: { email: AUTH_ERRORS.INVALID_EMAIL } };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.MAGIC_LINK_SENT };
}

/**
 * Request password reset email
 */
export async function forgotPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { fieldErrors: { email: AUTH_ERRORS.REQUIRED_FIELD } };
  }

  if (!isValidEmail(email)) {
    return { fieldErrors: { email: AUTH_ERRORS.INVALID_EMAIL } };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    if (error.message.includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.PASSWORD_RESET_SENT };
}

/**
 * Reset password with new password
 */
export async function resetPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate inputs
  const fieldErrors: AuthFormState['fieldErrors'] = {};

  if (!password) {
    fieldErrors.password = AUTH_ERRORS.REQUIRED_FIELD;
  } else if (!isValidPassword(password)) {
    fieldErrors.password = AUTH_ERRORS.WEAK_PASSWORD;
  }

  if (password !== confirmPassword) {
    return { error: AUTH_ERRORS.PASSWORDS_DONT_MATCH };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.PASSWORD_RESET };
}

/**
 * Initiate OAuth sign-in (Google)
 */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth error:', error);
    redirect(`/sign-in?error=${encodeURIComponent(AUTH_ERRORS.OAUTH_ERROR)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Initiate OAuth sign-in (Apple)
 */
export async function signInWithApple(): Promise<void> {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Apple OAuth error:', error);
    redirect(`/sign-in?error=${encodeURIComponent(AUTH_ERRORS.OAUTH_ERROR)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Initiate OAuth sign-in (Facebook)
 */
export async function signInWithFacebook(): Promise<void> {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Facebook OAuth error:', error);
    redirect(`/sign-in?error=${encodeURIComponent(AUTH_ERRORS.OAUTH_ERROR)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Send OTP code for sign-in (6-digit code instead of magic link)
 */
export async function sendSignInOtp(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { fieldErrors: { email: AUTH_ERRORS.REQUIRED_FIELD } };
  }

  if (!isValidEmail(email)) {
    return { fieldErrors: { email: AUTH_ERRORS.INVALID_EMAIL } };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Only allow existing users
    },
  });

  if (error) {
    if (error.message.includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    if (error.message.includes('Signups not allowed')) {
      return { error: AUTH_ERRORS.OTP_USER_NOT_FOUND };
    }
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.OTP_SENT };
}

/**
 * Verify OTP code and sign in
 */
export async function verifySignInOtp(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;
  const redirectTo = formData.get('redirectTo') as string | null;

  if (!email || !token) {
    return { error: AUTH_ERRORS.REQUIRED_FIELD };
  }

  if (token.length !== 6 || !/^\d{6}$/.test(token)) {
    return { error: AUTH_ERRORS.INVALID_OTP };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    if (error.message.includes('Token has expired')) {
      return { error: AUTH_ERRORS.OTP_EXPIRED };
    }
    if (error.message.includes('Invalid') || error.message.includes('invalid')) {
      return { error: AUTH_ERRORS.INVALID_OTP };
    }
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    return { error: error.message };
  }

  // Sync user to Prisma
  if (data.user) {
    const syncResult = await syncUserToPrisma(data.user);
    if (!syncResult.success) {
      console.error('User sync failed after OTP sign in');
    }
  }

  // Redirect to the intended destination or home
  const destination = getSafeRedirectPath(redirectTo, DEFAULT_REDIRECT.AFTER_SIGN_IN);
  redirect(destination);
}

/**
 * Resend confirmation email
 */
export async function resendConfirmationEmail(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { fieldErrors: { email: AUTH_ERRORS.REQUIRED_FIELD } };
  }

  if (!isValidEmail(email)) {
    return { fieldErrors: { email: AUTH_ERRORS.INVALID_EMAIL } };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.CONFIRMATION_RESENT };
}

/**
 * Update user email (requires authentication)
 */
export async function updateEmail(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const newEmail = formData.get('email') as string;

  if (!newEmail) {
    return { fieldErrors: { email: AUTH_ERRORS.REQUIRED_FIELD } };
  }

  if (!isValidEmail(newEmail)) {
    return { fieldErrors: { email: AUTH_ERRORS.INVALID_EMAIL } };
  }

  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: AUTH_ERRORS.NOT_AUTHENTICATED };
  }

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: AUTH_ERRORS.RATE_LIMITED };
    }
    if (error.message.includes('already registered')) {
      return { error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS };
    }
    return { error: error.message };
  }

  return { success: AUTH_SUCCESS.EMAIL_CHANGE_SENT };
}

/**
 * Delete user account (requires authentication and confirmation)
 */
export async function deleteAccount(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const confirmation = formData.get('confirmation') as string;

  if (confirmation !== 'DELETE') {
    return { error: AUTH_ERRORS.DELETE_CONFIRMATION_MISMATCH };
  }

  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: AUTH_ERRORS.NOT_AUTHENTICATED };
  }

  // Delete user from Prisma first
  const { deleteUser } = await import('./auth.service');
  const deleteResult = await deleteUser(user.id);

  if (!deleteResult.success) {
    return { error: AUTH_ERRORS.UNKNOWN_ERROR };
  }

  // Sign out the user (this will also invalidate their session)
  await supabase.auth.signOut();

  // Note: Full account deletion from Supabase Auth requires admin API
  // For now, we delete Prisma data and sign out. User can't sign in without Prisma record.

  return { success: AUTH_SUCCESS.ACCOUNT_DELETED };
}
