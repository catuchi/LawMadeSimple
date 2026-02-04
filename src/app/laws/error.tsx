'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ErrorState } from '@/components/ui/error-state';

export default function LawsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Laws page error:', error);
  }, [error]);

  // Determine error variant based on message
  const isNetworkError =
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('connect');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex flex-1 items-center justify-center p-4">
        <ErrorState
          title="Failed to load laws"
          message={
            isNetworkError
              ? 'Unable to connect to the server. Please check your connection and try again.'
              : error.message || 'An error occurred while loading the laws. Please try again.'
          }
          variant={isNetworkError ? 'network' : 'default'}
          onRetry={reset}
          backHref="/"
          backLabel="Go to homepage"
        />
      </main>

      <Footer />
    </div>
  );
}
