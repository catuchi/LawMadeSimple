'use client';

import { useActionState } from 'react';
import { updateEmail } from '@/services/auth/auth.actions';
import type { AuthFormState } from '@/types/auth';

const initialState: AuthFormState = {};

interface UpdateEmailFormProps {
  currentEmail?: string;
}

export function UpdateEmailForm({ currentEmail }: UpdateEmailFormProps) {
  const [state, formAction, isPending] = useActionState(updateEmail, initialState);

  return (
    <div className="space-y-4">
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
          </div>
        )}

        {currentEmail && (
          <div className="space-y-2">
            <label className="text-foreground-muted block text-sm">Current Email</label>
            <p className="text-sm font-medium">{currentEmail}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            New Email
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
            placeholder="newemail@example.com"
          />
          {state.fieldErrors?.email && (
            <p id="email-error" className="text-error text-sm" role="alert">
              {state.fieldErrors.email}
            </p>
          )}
          <p className="text-foreground-muted text-xs">
            You will receive confirmation emails at both your old and new email addresses.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending || !!state.success}
          aria-busy={isPending}
          className="bg-primary hover:bg-primary-600 focus:ring-ring rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Updating...' : 'Update email'}
        </button>
      </form>
    </div>
  );
}
