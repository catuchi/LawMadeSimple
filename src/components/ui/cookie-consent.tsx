'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'lms-cookie-consent';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      // Slight delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  const handleDismiss = () => {
    // Dismissing is the same as accepting for essential-only cookies
    handleAccept();
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="animate-slide-up fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-xl border border-[var(--color-neutral-200)] bg-white p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:left-auto sm:w-96"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
          <Cookie className="size-5 text-[var(--color-primary-500)]" />
        </div>

        <div className="flex-1">
          <h2 id="cookie-consent-title" className="font-semibold text-[var(--color-neutral-800)]">
            Cookie Notice
          </h2>
          <p
            id="cookie-consent-description"
            className="mt-1 text-sm text-[var(--color-neutral-600)]"
          >
            We use essential cookies for authentication and security. We don&apos;t use tracking
            cookies.{' '}
            <Link
              href="/privacy"
              className="text-[var(--color-primary-500)] underline hover:text-[var(--color-primary-600)]"
            >
              Learn more
            </Link>
          </p>

          <div className="mt-3 flex gap-2">
            <Button onClick={handleAccept} size="sm">
              Accept
            </Button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="rounded-full p-1 text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
          aria-label="Dismiss cookie notice"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}
