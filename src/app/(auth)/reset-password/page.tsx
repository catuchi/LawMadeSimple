import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password - LawMadeSimple',
  description: 'Set a new password for your LawMadeSimple account.',
};

export default function ResetPasswordPage() {
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
