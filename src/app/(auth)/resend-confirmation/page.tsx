import type { Metadata } from 'next';
import { ResendConfirmationForm } from '@/components/auth/resend-confirmation-form';

export const metadata: Metadata = {
  title: 'Resend Confirmation - LawMadeSimple',
  description: 'Resend your email confirmation link.',
};

export default function ResendConfirmationPage() {
  return (
    <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-foreground font-serif text-2xl font-bold">Resend confirmation</h1>
        <p className="text-foreground-muted mt-2 text-sm">
          Didn&apos;t receive your confirmation email? Enter your email below and we&apos;ll send
          you a new one.
        </p>
      </div>

      <ResendConfirmationForm />
    </div>
  );
}
