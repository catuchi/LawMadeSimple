'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UsageData {
  subscription: {
    tier: 'free' | 'premium';
    status: string;
    isActive: boolean;
  };
  usage: {
    explanations: {
      used: number;
      limit: number | null;
      remaining: number | null;
      resetAt: string;
    };
    searches: {
      used: number;
      limit: number | null;
      remaining: number | null;
      resetAt: string;
    };
  };
  limits: {
    explanationsPerDay: number | null;
    explanationsPerMonth: number | null;
    searchesPerDay: number | null;
  };
}

export function UsageStatus() {
  const [data, setData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/v1/user/usage');
        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }
        const usageData = await response.json();
        setData(usageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (isLoading) {
    return (
      <div className="border-border rounded-lg border bg-white p-4">
        <div className="animate-pulse space-y-3">
          <div className="bg-background-secondary h-4 w-24 rounded" />
          <div className="bg-background-secondary h-3 w-full rounded" />
          <div className="bg-background-secondary h-3 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border-border rounded-lg border bg-white p-4">
        <p className="text-foreground-muted text-sm">Unable to load usage data</p>
      </div>
    );
  }

  const { subscription, usage } = data;
  const isPremium = subscription.tier === 'premium';

  // Calculate progress percentage for the progress bar
  const explanationProgress =
    usage.explanations.limit !== null
      ? Math.min((usage.explanations.used / usage.explanations.limit) * 100, 100)
      : 0;

  // Format reset time
  const resetTime = new Date(usage.explanations.resetAt);
  const now = new Date();
  const hoursUntilReset = Math.max(
    0,
    Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  return (
    <div className="border-border space-y-4 rounded-lg border bg-white p-4">
      {/* Tier Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isPremium ? 'Premium' : 'Free Plan'}
          </span>
          {!isPremium && (
            <Link
              href="/pricing"
              className="text-primary hover:text-primary-600 text-xs font-medium"
            >
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Explanation Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-muted">AI Explanations Today</span>
          <span className="text-foreground font-medium">
            {usage.explanations.limit !== null ? (
              <>
                {usage.explanations.used} / {usage.explanations.limit}
              </>
            ) : (
              'Unlimited'
            )}
          </span>
        </div>

        {usage.explanations.limit !== null && (
          <>
            {/* Progress Bar */}
            <div className="bg-background-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full transition-all ${
                  explanationProgress >= 100
                    ? 'bg-red-500'
                    : explanationProgress >= 80
                      ? 'bg-amber-500'
                      : 'bg-primary'
                }`}
                style={{ width: `${explanationProgress}%` }}
              />
            </div>

            {/* Reset Info */}
            <p className="text-foreground-muted text-xs">
              {usage.explanations.remaining === 0 ? (
                <span className="text-red-600">Limit reached. Resets in {hoursUntilReset}h</span>
              ) : (
                <>Resets in {hoursUntilReset}h</>
              )}
            </p>
          </>
        )}
      </div>

      {/* Search Usage */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-muted">Searches Today</span>
          <span className="text-foreground font-medium">
            {usage.searches.limit !== null ? (
              <>
                {usage.searches.used} / {usage.searches.limit}
              </>
            ) : (
              'Unlimited'
            )}
          </span>
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {!isPremium && (
        <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
          <p className="text-foreground text-sm font-medium">Need more explanations?</p>
          <p className="text-foreground-muted mt-1 text-xs">
            Upgrade to Premium for unlimited AI explanations and priority support.
          </p>
          <Link
            href="/pricing"
            className="bg-primary hover:bg-primary-600 mt-2 inline-block rounded px-3 py-1.5 text-xs font-medium text-white transition-colors"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
