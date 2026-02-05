import type { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In - LawMadeSimple',
  description: 'Sign in to your LawMadeSimple account.',
};

interface SignInPageProps {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirectTo, error } = await searchParams;

  return (
    <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-foreground font-serif text-2xl font-bold">Welcome back</h1>
        <p className="text-foreground-muted mt-2 text-sm">Sign in to access your account</p>
      </div>

      {error && (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          <p>{error}</p>
          {error.toLowerCase().includes('confirm') && (
            <p className="mt-1">
              <Link href="/resend-confirmation" className="font-medium underline">
                Resend confirmation email
              </Link>
            </p>
          )}
        </div>
      )}

      <SignInForm redirectTo={redirectTo} />

      <p className="text-foreground-muted mt-6 text-center text-xs">
        Need to confirm your email?{' '}
        <Link href="/resend-confirmation" className="text-primary hover:underline">
          Resend confirmation
        </Link>
      </p>
    </div>
  );
}
