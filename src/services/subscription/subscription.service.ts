import { SubscriptionTier, UsageAction, Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import {
  TIER_LIMITS,
  DEFAULT_TIER,
  GRACE_PERIOD_DAYS,
  GUEST_LIMITS,
} from '@/constants/subscription';

// ============================================================================
// Types
// ============================================================================

export interface UsageCheckResult {
  allowed: boolean;
  remaining: number | null; // null = unlimited
  limit: number | null;
  used: number;
  resetAt: Date;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  isActive: boolean;
  currentPeriodEnd: Date | null;
}

// ============================================================================
// Subscription Queries
// ============================================================================

/**
 * Get user's current subscription tier
 * Returns 'free' if no subscription exists
 */
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { tier: true, status: true, currentPeriodEnd: true },
  });

  if (!subscription) return DEFAULT_TIER;

  // Check if subscription is still active
  if (!isSubscriptionActive(subscription)) {
    return DEFAULT_TIER;
  }

  return subscription.tier;
}

/**
 * Get full subscription details for a user
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      tier: true,
      status: true,
      currentPeriodEnd: true,
    },
  });

  if (!subscription) {
    return {
      tier: DEFAULT_TIER,
      status: 'active',
      isActive: true,
      currentPeriodEnd: null,
    };
  }

  return {
    tier: subscription.tier,
    status: subscription.status,
    isActive: isSubscriptionActive(subscription),
    currentPeriodEnd: subscription.currentPeriodEnd,
  };
}

/**
 * Check if a subscription is currently active
 * Includes grace period for expired subscriptions
 */
function isSubscriptionActive(subscription: {
  status: string;
  currentPeriodEnd: Date | null;
}): boolean {
  if (subscription.status === 'cancelled' || subscription.status === 'expired') {
    return false;
  }

  if (subscription.status === 'past_due') {
    // Allow grace period
    if (subscription.currentPeriodEnd) {
      const graceEnd = new Date(subscription.currentPeriodEnd);
      graceEnd.setDate(graceEnd.getDate() + GRACE_PERIOD_DAYS);
      return new Date() < graceEnd;
    }
    return false;
  }

  return true;
}

// ============================================================================
// Usage Checking
// ============================================================================

/**
 * Check if user can perform an action based on their usage limits
 */
export async function checkUsageLimit(
  userId: string,
  action: UsageAction
): Promise<UsageCheckResult> {
  const tier = await getUserTier(userId);
  const limits = TIER_LIMITS[tier];

  const { limit, period } = getActionLimit(action, limits);

  // Unlimited
  if (limit === null) {
    return {
      allowed: true,
      remaining: null,
      limit: null,
      used: 0,
      resetAt: getNextReset(period),
    };
  }

  const used = await countUsage(userId, action, period);
  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    remaining,
    limit,
    used,
    resetAt: getNextReset(period),
  };
}

/**
 * Quick check if user can generate an explanation
 */
export async function canGenerateExplanation(userId: string): Promise<boolean> {
  const result = await checkUsageLimit(userId, 'explanation_generated');
  return result.allowed;
}

/**
 * Quick check if user can perform a search
 */
export async function canPerformSearch(userId: string): Promise<boolean> {
  const result = await checkUsageLimit(userId, 'search_performed');
  return result.allowed;
}

// ============================================================================
// Usage Recording
// ============================================================================

/**
 * Record a usage event
 */
export async function recordUsage(
  userId: string,
  action: UsageAction,
  metadata?: Prisma.InputJsonValue,
  tokenCount?: number
): Promise<void> {
  await prisma.usageRecord.create({
    data: {
      userId,
      action,
      metadata,
      tokenCount,
    },
  });
}

/**
 * Record an explanation generation
 */
export async function recordExplanationUsage(
  userId: string,
  sectionId: string,
  modelUsed: string,
  tokenCount?: number
): Promise<void> {
  await recordUsage(userId, 'explanation_generated', { sectionId, modelUsed }, tokenCount);
}

// ============================================================================
// Usage Statistics
// ============================================================================

/**
 * Get usage summary for a user (for dashboard display)
 */
export async function getUsageSummary(userId: string) {
  const tier = await getUserTier(userId);
  const limits = TIER_LIMITS[tier];

  const todayStart = getStartOfDay();
  const monthStart = getStartOfMonth();

  const [dailyExplanations, monthlyExplanations, dailySearches] = await Promise.all([
    prisma.usageRecord.count({
      where: {
        userId,
        action: 'explanation_generated',
        createdAt: { gte: todayStart },
      },
    }),
    prisma.usageRecord.count({
      where: {
        userId,
        action: 'explanation_generated',
        createdAt: { gte: monthStart },
      },
    }),
    prisma.usageRecord.count({
      where: {
        userId,
        action: 'search_performed',
        createdAt: { gte: todayStart },
      },
    }),
  ]);

  return {
    tier,
    explanations: {
      daily: {
        used: dailyExplanations,
        limit: limits.explanationsPerDay,
        remaining: limits.explanationsPerDay
          ? Math.max(0, limits.explanationsPerDay - dailyExplanations)
          : null,
      },
      monthly: {
        used: monthlyExplanations,
        limit: limits.explanationsPerMonth,
        remaining: limits.explanationsPerMonth
          ? Math.max(0, limits.explanationsPerMonth - monthlyExplanations)
          : null,
      },
    },
    searches: {
      daily: {
        used: dailySearches,
        limit: limits.searchesPerDay,
        remaining: limits.searchesPerDay
          ? Math.max(0, limits.searchesPerDay - dailySearches)
          : null,
      },
    },
  };
}

// ============================================================================
// Subscription Management
// ============================================================================

/**
 * Create or update a user's subscription (called after payment)
 */
export async function upsertSubscription(
  userId: string,
  data: {
    tier: SubscriptionTier;
    paymentProvider?: string;
    externalId?: string;
    currentPeriodEnd?: Date;
  }
): Promise<void> {
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      tier: data.tier,
      status: 'active',
      paymentProvider: data.paymentProvider,
      externalId: data.externalId,
      currentPeriodEnd: data.currentPeriodEnd,
    },
    update: {
      tier: data.tier,
      status: 'active',
      paymentProvider: data.paymentProvider,
      externalId: data.externalId,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelledAt: null,
    },
  });
}

/**
 * Cancel a subscription (user requested)
 */
export async function cancelSubscription(userId: string): Promise<void> {
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
    },
  });
}

/**
 * Mark subscription as expired (called by webhook or cron)
 */
export async function expireSubscription(userId: string): Promise<void> {
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'expired',
    },
  });
}

// ============================================================================
// Helpers
// ============================================================================

type Period = 'day' | 'month';

function getActionLimit(
  action: UsageAction,
  limits: (typeof TIER_LIMITS)[SubscriptionTier]
): { limit: number | null; period: Period } {
  switch (action) {
    case 'explanation_generated':
    case 'explanation_regenerated':
      // Check daily limit first (more restrictive)
      return { limit: limits.explanationsPerDay, period: 'day' };
    case 'search_performed':
      return { limit: limits.searchesPerDay, period: 'day' };
    default:
      return { limit: null, period: 'day' };
  }
}

async function countUsage(userId: string, action: UsageAction, period: Period): Promise<number> {
  const startDate = period === 'day' ? getStartOfDay() : getStartOfMonth();

  return prisma.usageRecord.count({
    where: {
      userId,
      action,
      createdAt: { gte: startDate },
    },
  });
}

function getStartOfDay(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function getStartOfMonth(): Date {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now;
}

function getNextReset(period: Period): Date {
  const now = new Date();
  if (period === 'day') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  } else {
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);
    return nextMonth;
  }
}

// ============================================================================
// Guest Usage (Anonymous Users)
// ============================================================================

/**
 * Hash IP address for privacy (we don't store raw IPs)
 */
function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').substring(0, 32);
}

/**
 * Get today's date (date only, no time) for daily tracking
 */
function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export interface GuestUsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  resetAt: Date;
}

/**
 * Check if a guest (anonymous) user can perform an action
 * Uses IP-based daily limits stored in database
 */
export async function checkGuestUsageLimit(
  ipAddress: string,
  action: UsageAction
): Promise<GuestUsageCheckResult> {
  const ipHash = hashIP(ipAddress);
  const today = getToday();
  const tomorrow = getNextReset('day');

  // Get limit for this action
  let limit: number;
  switch (action) {
    case 'explanation_generated':
    case 'explanation_regenerated':
      limit = GUEST_LIMITS.explanationsPerDay;
      break;
    case 'search_performed':
      limit = GUEST_LIMITS.searchesPerDay;
      break;
    default:
      limit = 10; // Default fallback
  }

  // Check current usage
  const usage = await prisma.guestUsage.findUnique({
    where: {
      ipHash_action_date: {
        ipHash,
        action,
        date: today,
      },
    },
  });

  const used = usage?.count ?? 0;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    remaining,
    limit,
    used,
    resetAt: tomorrow,
  };
}

/**
 * Record guest usage (call after successful action)
 */
export async function recordGuestUsage(ipAddress: string, action: UsageAction): Promise<void> {
  const ipHash = hashIP(ipAddress);
  const today = getToday();

  await prisma.guestUsage.upsert({
    where: {
      ipHash_action_date: {
        ipHash,
        action,
        date: today,
      },
    },
    update: {
      count: { increment: 1 },
    },
    create: {
      ipHash,
      action,
      date: today,
      count: 1,
    },
  });
}

/**
 * Cleanup old guest usage records (call periodically via cron)
 * Keeps last 7 days for abuse detection
 */
export async function cleanupOldGuestUsage(): Promise<number> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const result = await prisma.guestUsage.deleteMany({
    where: {
      date: { lt: sevenDaysAgo },
    },
  });

  return result.count;
}
