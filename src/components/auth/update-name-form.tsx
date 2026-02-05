'use client';

import { useActionState, useEffect, useRef } from 'react';
import { updateUserName } from '@/services/auth/auth.actions';
import type { AuthFormState } from '@/types/auth';

const initialState: AuthFormState = {};

interface UpdateNameFormProps {
  currentName?: string | null;
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserName, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when currentName changes (e.g., after refresh)
  useEffect(() => {
    if (inputRef.current && currentName !== undefined) {
      inputRef.current.value = currentName || '';
    }
  }, [currentName]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </div>
      )}

      {state.success && (
        <div
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          role="alert"
        >
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Display Name
        </label>
        <input
          ref={inputRef}
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          disabled={isPending}
          defaultValue={currentName || ''}
          aria-invalid={!!state.fieldErrors?.name}
          aria-describedby={state.fieldErrors?.name ? 'name-error' : 'name-hint'}
          className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your name"
        />
        {state.fieldErrors?.name ? (
          <p id="name-error" className="text-sm text-red-600" role="alert">
            {state.fieldErrors.name}
          </p>
        ) : (
          <p id="name-hint" className="text-foreground-muted text-xs">
            This name will appear in your avatar initials and profile.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary hover:bg-primary-600 focus:ring-ring rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Name'}
      </button>
    </form>
  );
}
