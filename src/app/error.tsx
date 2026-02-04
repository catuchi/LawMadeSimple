'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ErrorState } from '@/components/ui/error-state';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (Sentry configured in next.config.ts)
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex flex-1 items-center justify-center p-4">
        <ErrorState
          title="Something went wrong"
          message={
            error.message ||
            'An unexpected error occurred. Please try again or contact support if the problem persists.'
          }
          onRetry={reset}
          backHref="/"
          backLabel="Go to homepage"
        />
      </main>

      <Footer />
    </div>
  );
}
