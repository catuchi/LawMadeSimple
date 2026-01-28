import { SubscriptionTier } from '@prisma/client';

/**
 * Usage limits per subscription tier
 * null = unlimited
 */
export const TIER_LIMITS: Record<
  SubscriptionTier,
  {
    explanationsPerDay: number | null;
    explanationsPerMonth: number | null;
    searchesPerDay: number | null;
  }
> = {
  free: {
    explanationsPerDay: 5,
    explanationsPerMonth: 50,
    searchesPerDay: 20,
  },
  premium: {
    explanationsPerDay: null,
    explanationsPerMonth: null,
    searchesPerDay: null,
  },
} as const;

/**
 * Default tier for new users
 */
export const DEFAULT_TIER: SubscriptionTier = 'free';

/**
 * Grace period in days after subscription expires
 * User keeps premium features during this period
 */
export const GRACE_PERIOD_DAYS = 3;
