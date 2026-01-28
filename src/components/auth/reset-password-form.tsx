'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/services/auth/auth.actions';
import type { AuthFormState } from '@/types/auth';
import { PASSWORD_REQUIREMENTS } from '@/constants/auth';

const initialState: AuthFormState = {};

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <div className="space-y-6">
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
            {state.success}
            <Link href="/sign-in" className="text-primary mt-2 block font-medium hover:underline">
              Return to sign in
            </Link>
          </div>
        )}

        {!state.success && (
          <>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="bg-primary hover:bg-primary-600 focus:ring-ring w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Resetting...' : 'Reset password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
