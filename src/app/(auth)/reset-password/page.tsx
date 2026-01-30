import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password - LawMadeSimple',
  description: 'Set a new password for your LawMadeSimple account.',
};

export default async function ResetPasswordPage() {
  // Verify user has a valid recovery session before showing the form
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No valid session means the recovery link is invalid/expired
  if (!user) {
    return (
      <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-foreground font-serif text-2xl font-bold">Link expired</h1>
          <p className="text-foreground-muted mt-2 text-sm">
            This password reset link has expired or is invalid.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-foreground-muted text-center text-sm">
            Password reset links expire after 1 hour for security. Please request a new one.
          </p>

          <Link
            href="/forgot-password"
            className="bg-primary hover:bg-primary-600 focus:ring-ring block w-full rounded-lg px-4 py-3 text-center text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Request new reset link
          </Link>

          <p className="text-foreground-muted text-center text-sm">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-foreground font-serif text-2xl font-bold">Reset your password</h1>
        <p className="text-foreground-muted mt-2 text-sm">Enter your new password below</p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
