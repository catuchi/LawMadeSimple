// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// Only initialize if DSN is configured
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay (capture 10% of sessions, 100% on error)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Environment
    environment: process.env.NODE_ENV,

    // Filter out common noise
    ignoreErrors: [
      // Browser extensions
      /^chrome-extension:/,
      /^moz-extension:/,
      // Network errors that are user-side
      'Network Error',
      'Load failed',
      'Failed to fetch',
      // User cancelled requests
      'AbortError',
    ],
  });
}
