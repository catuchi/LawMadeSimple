import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription, checkUsageLimit } from '@/services/subscription/subscription.service';
import { TIER_LIMITS } from '@/constants/subscription';

/**
 * GET /api/v1/user/usage
 * Get current user's subscription tier and usage stats
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [subscription, explanationUsage, searchUsage] = await Promise.all([
      getUserSubscription(user.id),
      checkUsageLimit(user.id, 'explanation_generated'),
      checkUsageLimit(user.id, 'search_performed'),
    ]);

    const tierLimits = TIER_LIMITS[subscription.tier];

    return NextResponse.json({
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        isActive: subscription.isActive,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      usage: {
        explanations: {
          used: explanationUsage.used,
          limit: explanationUsage.limit,
          remaining: explanationUsage.remaining,
          resetAt: explanationUsage.resetAt,
        },
        searches: {
          used: searchUsage.used,
          limit: searchUsage.limit,
          remaining: searchUsage.remaining,
          resetAt: searchUsage.resetAt,
        },
      },
      limits: {
        explanationsPerDay: tierLimits.explanationsPerDay,
        explanationsPerMonth: tierLimits.explanationsPerMonth,
        searchesPerDay: tierLimits.searchesPerDay,
      },
    });
  } catch (error) {
    console.error('Error fetching user usage:', error);
    return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 });
  }
}
