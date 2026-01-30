'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUp } from '@/services/auth/auth.actions';
import { OAuthButtons } from './oauth-buttons';
import type { AuthFormState } from '@/types/auth';
import { PASSWORD_REQUIREMENTS } from '@/constants/auth';

const initialState: AuthFormState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <div className="space-y-6">
      <OAuthButtons disabled={isPending} />

      <p className="text-foreground-muted text-center text-xs">
        Already have an account with Google, Apple, or Facebook? Use those buttons above to sign in.
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-foreground-muted bg-white px-2">Or create account with email</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <div
            className="border-error/20 bg-error-light text-error-dark rounded-lg border p-3 text-sm"
            role="alert"
            aria-live="polite"
          >
            {state.error}
          </div>
        )}

        {state.success && (
          <div
            className="border-success/20 bg-success-light text-success-dark rounded-lg border p-3 text-sm"
            role="alert"
            aria-live="polite"
          >
            <p>{state.success}</p>
            <p className="mt-2">
              Didn&apos;t receive it?{' '}
              <Link href="/resend-confirmation" className="font-medium underline">
                Resend confirmation email
              </Link>
            </p>
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
            disabled={isPending || !!state.success}
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
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending || !!state.success}
            aria-invalid={!!state.fieldErrors?.password}
            aria-describedby="password-hint password-error"
            className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
          />
          <p id="password-hint" className="text-foreground-muted text-xs">
            Minimum {PASSWORD_REQUIREMENTS.MIN_LENGTH} characters
          </p>
          {state.fieldErrors?.password && (
            <p id="password-error" className="text-error text-sm" role="alert">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              id="tos"
              name="tos"
              type="checkbox"
              disabled={isPending || !!state.success}
              aria-invalid={!!state.fieldErrors?.tos}
              aria-describedby={state.fieldErrors?.tos ? 'tos-error' : undefined}
              className="border-border focus:ring-ring text-primary mt-1 h-4 w-4 rounded border focus:ring-2 focus:ring-offset-2"
            />
            <label htmlFor="tos" className="text-sm">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {state.fieldErrors?.tos && (
            <p id="tos-error" className="text-error text-sm" role="alert">
              {state.fieldErrors.tos}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || !!state.success}
          aria-busy={isPending}
          className="bg-primary hover:bg-primary-600 focus:ring-ring w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-foreground-muted text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
