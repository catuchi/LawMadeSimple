import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password - LawMadeSimple',
  description: 'Reset your LawMadeSimple password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-foreground font-serif text-2xl font-bold">Forgot your password?</h1>
        <p className="text-foreground-muted mt-2 text-sm">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
