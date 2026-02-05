'use client';

import { useActionState, useRef, useEffect } from 'react';
import { changePassword } from '@/services/auth/auth.actions';
import { PasswordInput } from '@/components/ui/password-input';
import type { AuthFormState } from '@/types/auth';
import { PASSWORD_REQUIREMENTS } from '@/constants/auth';

const initialState: AuthFormState = {};

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear form on success
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
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
        <label htmlFor="currentPassword" className="block text-sm font-medium">
          Current Password
        </label>
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          required
          disabled={isPending}
          aria-invalid={!!state.fieldErrors?.currentPassword}
          aria-describedby={
            state.fieldErrors?.currentPassword ? 'current-password-error' : undefined
          }
          placeholder="Enter your current password"
        />
        {state.fieldErrors?.currentPassword && (
          <p id="current-password-error" className="text-sm text-red-600" role="alert">
            {state.fieldErrors.currentPassword}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium">
          New Password
        </label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-invalid={!!state.fieldErrors?.newPassword}
          aria-describedby="new-password-hint new-password-error"
          placeholder="Enter your new password"
        />
        {state.fieldErrors?.newPassword ? (
          <p id="new-password-error" className="text-sm text-red-600" role="alert">
            {state.fieldErrors.newPassword}
          </p>
        ) : (
          <p id="new-password-hint" className="text-foreground-muted text-xs">
            {PASSWORD_REQUIREMENTS.MIN_LENGTH}+ characters with uppercase, lowercase, and a number
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm New Password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-invalid={!!state.fieldErrors?.confirmPassword}
          aria-describedby={
            state.fieldErrors?.confirmPassword ? 'confirm-password-error' : undefined
          }
          placeholder="Confirm your new password"
        />
        {state.fieldErrors?.confirmPassword && (
          <p id="confirm-password-error" className="text-sm text-red-600" role="alert">
            {state.fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary hover:bg-primary-600 focus:ring-ring rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Changing password...' : 'Change password'}
      </button>
    </form>
  );
}
