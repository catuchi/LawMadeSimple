'use client';

import { useActionState, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { signIn, sendSignInOtp, verifySignInOtp } from '@/services/auth/auth.actions';
import { OAuthButtons } from './oauth-buttons';
import type { AuthFormState } from '@/types/auth';

interface SignInFormProps {
  redirectTo?: string;
}

const initialState: AuthFormState = {};

export function SignInForm({ redirectTo }: SignInFormProps) {
  const [passwordState, passwordAction, isPasswordPending] = useActionState(signIn, initialState);
  const [otpSendState, otpSendAction, isOtpSendPending] = useActionState(
    sendSignInOtp,
    initialState
  );
  const [otpVerifyState, otpVerifyAction, isOtpVerifyPending] = useActionState(
    verifySignInOtp,
    initialState
  );

  // Mode: 'password' or 'code'
  const [mode, setMode] = useState<'password' | 'code'>('password');
  // Email stored when switching to code mode
  const [otpEmail, setOtpEmail] = useState('');
  // 6-digit code input
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Form ref for resend functionality
  const otpFormRef = useRef<HTMLFormElement>(null);

  const isPending = isPasswordPending || isOtpSendPending || isOtpVerifyPending;

  // Derive whether code was sent from action state
  const codeSent = !!otpSendState.success;

  // Focus first code input when code is sent
  const focusFirstCodeInput = useCallback(() => {
    setTimeout(() => {
      codeInputRefs.current[0]?.focus();
    }, 0);
  }, []);

  const handleSwitchToCodeMode = () => {
    // Get email from password form if available
    const emailInput = document.getElementById('email') as HTMLInputElement;
    if (emailInput?.value) {
      setOtpEmail(emailInput.value);
    }
    setMode('code');
    setCodeDigits(['', '', '', '', '', '']);
  };

  const handleSwitchToPasswordMode = () => {
    setMode('password');
    setCodeDigits(['', '', '', '', '', '']);
  };

  const handleCodeDigitChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...codeDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setCodeDigits(newDigits);
      // Focus the next empty input or the last one
      const nextEmpty = newDigits.findIndex((d) => !d);
      codeInputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    }
  };

  const handleResendCode = () => {
    setCodeDigits(['', '', '', '', '', '']);
    // Submit the OTP form again to resend
    if (otpFormRef.current) {
      otpFormRef.current.requestSubmit();
    }
  };

  // Password mode form
  if (mode === 'password') {
    return (
      <div className="space-y-6">
        <OAuthButtons disabled={isPending} />

        <p className="text-foreground-muted text-center text-xs">
          Previously signed up with Google, Apple, or Facebook? Use those buttons above.
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="text-foreground-muted bg-white px-2">Or continue with email</span>
          </div>
        </div>

        <form action={passwordAction} className="space-y-4">
          {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

          {passwordState.error && (
            <div
              className="border-error/20 bg-error-light text-error-dark rounded-lg border p-3 text-sm"
              role="alert"
              aria-live="polite"
            >
              {passwordState.error}
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
              aria-invalid={!!passwordState.fieldErrors?.email}
              aria-describedby={passwordState.fieldErrors?.email ? 'email-error' : undefined}
              className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="you@example.com"
            />
            {passwordState.fieldErrors?.email && (
              <p id="email-error" className="text-error text-sm" role="alert">
                {passwordState.fieldErrors.email}
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
              aria-invalid={!!passwordState.fieldErrors?.password}
              aria-describedby={passwordState.fieldErrors?.password ? 'password-error' : undefined}
              className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
            {passwordState.fieldErrors?.password && (
              <p id="password-error" className="text-error text-sm" role="alert">
                {passwordState.fieldErrors.password}
              </p>
            )}
            <button
              type="button"
              onClick={handleSwitchToCodeMode}
              className="text-primary/70 hover:text-primary text-sm transition-colors"
            >
              Sign in with a code instead
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="bg-primary hover:bg-primary-600 focus:ring-ring w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPasswordPending ? 'Signing in...' : 'Sign in'}
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

  // Code mode - Step 1: Enter email and send code
  if (!codeSent) {
    return (
      <div className="space-y-6">
        <OAuthButtons disabled={isPending} />

        <p className="text-foreground-muted text-center text-xs">
          Previously signed up with Google, Apple, or Facebook? Use those buttons above.
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="text-foreground-muted bg-white px-2">Or continue with email</span>
          </div>
        </div>

        <form
          ref={otpFormRef}
          action={async (formData) => {
            const email = formData.get('email') as string;
            setOtpEmail(email);
            await otpSendAction(formData);
            focusFirstCodeInput();
          }}
          className="space-y-4"
        >
          {otpSendState.error && (
            <div
              className="border-error/20 bg-error-light text-error-dark rounded-lg border p-3 text-sm"
              role="alert"
              aria-live="polite"
            >
              {otpSendState.error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="otp-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="otp-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              defaultValue={otpEmail}
              aria-invalid={!!otpSendState.fieldErrors?.email}
              aria-describedby={otpSendState.fieldErrors?.email ? 'otp-email-error' : undefined}
              className="border-border placeholder:text-foreground-muted focus:border-primary focus:ring-ring/20 block w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="you@example.com"
            />
            {otpSendState.fieldErrors?.email && (
              <p id="otp-email-error" className="text-error text-sm" role="alert">
                {otpSendState.fieldErrors.email}
              </p>
            )}
          </div>

          <p className="text-foreground-muted text-sm">
            We&apos;ll send a 6-digit code to your email.
          </p>

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="bg-primary hover:bg-primary-600 focus:ring-ring w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOtpSendPending ? 'Sending code...' : 'Send code'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleSwitchToPasswordMode}
          className="text-foreground-muted hover:text-primary w-full text-center text-sm transition-colors"
        >
          Sign in with password instead
        </button>

        <p className="text-foreground-muted text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  // Code mode - Step 2: Enter the 6-digit code
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-success-light text-success-dark mx-auto mb-4 rounded-lg p-3 text-sm">
          Code sent to <span className="font-medium">{otpEmail}</span>
        </div>
      </div>

      {/* Hidden form for resending code */}
      <form
        ref={otpFormRef}
        action={async (formData) => {
          await otpSendAction(formData);
          focusFirstCodeInput();
        }}
        className="hidden"
      >
        <input type="hidden" name="email" value={otpEmail} />
      </form>

      <form action={otpVerifyAction} className="space-y-4">
        <input type="hidden" name="email" value={otpEmail} />
        <input type="hidden" name="token" value={codeDigits.join('')} />
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        {otpVerifyState.error && (
          <div
            className="border-error/20 bg-error-light text-error-dark rounded-lg border p-3 text-sm"
            role="alert"
            aria-live="polite"
          >
            {otpVerifyState.error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-center text-sm font-medium">Enter the 6-digit code</label>
          <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
            {codeDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  codeInputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                disabled={isPending}
                className="border-border focus:border-primary focus:ring-ring/20 h-12 w-10 rounded-lg border bg-white text-center text-lg font-semibold focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || codeDigits.some((d) => !d)}
          aria-busy={isPending}
          className="bg-primary hover:bg-primary-600 focus:ring-ring w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOtpVerifyPending ? 'Verifying...' : 'Verify and sign in'}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={isOtpSendPending}
          className="text-primary text-sm hover:underline disabled:opacity-50"
        >
          {isOtpSendPending ? 'Sending...' : 'Resend code'}
        </button>
        <span className="text-foreground-muted mx-2">·</span>
        <button
          type="button"
          onClick={handleSwitchToPasswordMode}
          className="text-foreground-muted hover:text-primary text-sm transition-colors"
        >
          Use password
        </button>
      </div>
    </div>
  );
}
