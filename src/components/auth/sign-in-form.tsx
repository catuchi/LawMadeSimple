'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn } from '@/services/auth/auth.actions';
import { OAuthButtons } from './oauth-buttons';
import type { AuthFormState } from '@/types/auth';

interface SignInFormProps {
  redirectTo?: string;
}

const initialState: AuthFormState = {};

export function SignInForm({ redirectTo }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="space-y-6">
      <OAuthButtons disabled={isPending} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-foreground-muted bg-white px-2">Or continue with email</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        {state.error && (
          <div
            className="border-error/20 bg-error-light text-error-dark rounded-lg border p-3 text-sm"
            role="alert"
            aria-live="polite"
          >
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
            className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="you@example.com"
          />
          {state.fieldErrors?.email && (
            <p id="email-error" className="text-error text-sm" role="alert">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Link href="/forgot-password" className="text-primary text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isPending}
            aria-invalid={!!state.fieldErrors?.password}
            aria-describedby={state.fieldErrors?.password ? 'password-error' : undefined}
            className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
          />
          {state.fieldErrors?.password && (
            <p id="password-error" className="text-error text-sm" role="alert">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="bg-primary hover:bg-primary-600 focus:ring-ring w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-foreground-muted text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
