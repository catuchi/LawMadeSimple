import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up - LawMadeSimple',
  description: 'Create your LawMadeSimple account.',
};

export default function SignUpPage() {
  return (
    <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-foreground font-serif text-2xl font-bold">Create an account</h1>
        <p className="text-foreground-muted mt-2 text-sm">Start understanding Nigerian law today</p>
      </div>

      <SignUpForm />
    </div>
  );
}
