// Auth route paths
export const AUTH_ROUTES = {
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CALLBACK: '/auth/callback',
  CONFIRM: '/auth/confirm',
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = ['/dashboard', '/bookmarks', '/profile', '/settings'] as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = ['/', '/laws', '/scenarios', '/search'] as const;

// Routes that should redirect to dashboard if user is already authenticated
export const AUTH_PAGES = [
  AUTH_ROUTES.SIGN_IN,
  AUTH_ROUTES.SIGN_UP,
  AUTH_ROUTES.FORGOT_PASSWORD,
] as const;

// Default redirect paths
export const DEFAULT_REDIRECT = {
  AFTER_SIGN_IN: '/dashboard',
  AFTER_SIGN_OUT: '/',
  AFTER_SIGN_UP: '/sign-in',
  UNAUTHENTICATED: '/sign-in',
} as const;

// Auth error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  EMAIL_NOT_CONFIRMED: 'Please confirm your email before signing in.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  OAUTH_ERROR: 'Unable to complete sign in. Please try again.',
  MAGIC_LINK_SENT: 'Check your email for the magic link.',
  PASSWORD_RESET_SENT: 'Check your email for password reset instructions.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  RATE_LIMITED: 'Too many attempts. Please try again later.',
  USER_SYNC_FAILED: 'Failed to sync user data. Please try again.',
  TOS_REQUIRED: 'You must accept the Terms of Service to continue.',
  NOT_AUTHENTICATED: 'You must be signed in to perform this action.',
  DELETE_CONFIRMATION_MISMATCH: 'Please type "DELETE" to confirm account deletion.',
} as const;

// Auth success messages
export const AUTH_SUCCESS = {
  SIGN_UP: 'Account created! Please check your email to confirm.',
  SIGN_IN: 'Welcome back!',
  SIGN_OUT: 'You have been signed out.',
  PASSWORD_RESET: 'Your password has been reset successfully.',
  EMAIL_CONFIRMED: 'Your email has been confirmed.',
  MAGIC_LINK_SENT: 'Magic link sent! Check your email.',
  PASSWORD_RESET_SENT: 'Password reset email sent! Check your inbox.',
  CONFIRMATION_RESENT: 'Confirmation email resent! Check your inbox.',
  EMAIL_CHANGE_SENT: 'Email change request sent! Check both your old and new email addresses.',
  ACCOUNT_DELETED: 'Your account has been deleted.',
} as const;

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 72, // bcrypt limitation
} as const;

// Session configuration
export const SESSION_CONFIG = {
  COOKIE_NAME: 'sb-auth-token',
  MAX_AGE: 60 * 60 * 24 * 7, // 7 days in seconds
} as const;
