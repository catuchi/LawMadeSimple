import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Re-export Supabase types for convenience
export type { SupabaseUser, Session };

// Auth provider types
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook' | 'magic_link';

// Form state for server actions
export interface AuthFormState {
  error?: string;
  success?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    name?: string;
    tos?: string;
  };
}

// Sign up form data
export interface SignUpFormData {
  email: string;
  password: string;
  name?: string;
}

// Sign in form data
export interface SignInFormData {
  email: string;
  password: string;
}

// Magic link form data
export interface MagicLinkFormData {
  email: string;
}

// Password reset request form data
export interface ForgotPasswordFormData {
  email: string;
}

// Password reset form data
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Auth context state
export interface AuthContextState {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth context actions
export interface AuthContextActions {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Combined auth context type
export type AuthContextValue = AuthContextState & AuthContextActions;

// User sync data (Supabase → Prisma)
export interface UserSyncData {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

// OAuth callback result
export interface OAuthCallbackResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}
