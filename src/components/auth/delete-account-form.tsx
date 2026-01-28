'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/services/auth/auth.actions';
import type { AuthFormState } from '@/types/auth';

const initialState: AuthFormState = {};

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(deleteAccount, initialState);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  // Redirect to home after successful deletion
  if (state.success) {
    router.push('/');
    return null;
  }

  if (!showConfirmation) {
    return (
      <div className="space-y-4">
        <div className="border-warning/20 bg-warning-light rounded-lg border p-4">
          <h3 className="text-warning-dark font-medium">Delete Account</h3>
          <p className="text-warning-dark/80 mt-1 text-sm">
            Once you delete your account, all of your data will be permanently removed. This action
            cannot be undone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className="text-error hover:bg-error/10 focus:ring-error rounded-lg border border-current px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Delete my account
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-error/20 bg-error-light rounded-lg border p-4">
        <h3 className="text-error-dark font-medium">Are you sure?</h3>
        <p className="text-error-dark/80 mt-1 text-sm">
          This will permanently delete your account and all associated data including:
        </p>
        <ul className="text-error-dark/80 mt-2 list-inside list-disc text-sm">
          <li>Your profile information</li>
          <li>Your bookmarks</li>
          <li>Your feedback history</li>
        </ul>
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

        <div className="space-y-2">
          <label htmlFor="confirmation" className="block text-sm font-medium">
            Type <span className="font-mono font-bold">DELETE</span> to confirm
          </label>
          <input
            id="confirmation"
            name="confirmation"
            type="text"
            required
            disabled={isPending}
            autoComplete="off"
            className="border-border placeholder:text-foreground-muted focus:border-error focus:ring-error/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="DELETE"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowConfirmation(false)}
            disabled={isPending}
            className="border-border text-foreground focus:ring-ring rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="bg-error hover:bg-error-dark focus:ring-error rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Permanently delete account'}
          </button>
        </div>
      </form>
    </div>
  );
}
