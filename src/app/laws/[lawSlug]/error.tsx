'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ErrorState } from '@/components/ui/error-state';

export default function LawDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Law detail error:', error);
  }, [error]);

  const isNetworkError =
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('connect');

  const isNotFound = error.message.includes('404') || error.message.includes('not found');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex flex-1 items-center justify-center p-4">
        <ErrorState
          title={isNotFound ? 'Law not found' : 'Failed to load law'}
          message={
            isNotFound
              ? 'The law you are looking for does not exist or has been removed.'
              : isNetworkError
                ? 'Unable to connect to the server. Please check your connection and try again.'
                : error.message || 'An error occurred while loading this law. Please try again.'
          }
          variant={isNotFound ? 'not-found' : isNetworkError ? 'network' : 'default'}
          onRetry={isNotFound ? undefined : reset}
          backHref="/laws"
          backLabel="Browse all laws"
        />
      </main>

      <Footer />
    </div>
  );
}
