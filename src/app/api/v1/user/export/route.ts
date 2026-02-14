import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import type { Bookmark, ContentType, Feedback, UsageRecord } from '@prisma/client';

// Type for bookmark query result
type BookmarkSelect = Pick<Bookmark, 'id' | 'contentType' | 'contentId' | 'note' | 'createdAt'>;

// Type for enriched bookmark
type EnrichedBookmark = BookmarkSelect & Record<string, unknown>;

// Type for feedback query result
type FeedbackSelect = Pick<Feedback, 'id' | 'feedbackType' | 'rating' | 'comment' | 'createdAt'> & {
  explanation: { contentType: ContentType; contentId: string };
};

// Type for usage record query result
type UsageRecordSelect = Pick<
  UsageRecord,
  'id' | 'action' | 'metadata' | 'tokenCount' | 'createdAt'
>;

/**
 * GET /api/v1/user/export
 * Export all user data for NDPR compliance (data portability)
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch bookmarks with related content info
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: authUser.id },
      select: {
        id: true,
        contentType: true,
        contentId: true,
        note: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich bookmarks with content details
    const enrichedBookmarks: EnrichedBookmark[] = await Promise.all(
      bookmarks.map(async (bookmark: BookmarkSelect) => {
        let contentDetails: Record<string, unknown> = {};

        if (bookmark.contentType === 'section') {
          const section = await prisma.section.findUnique({
            where: { id: bookmark.contentId },
            select: {
              id: true,
              title: true,
              number: true,
              law: {
                select: {
                  id: true,
                  title: true,
                  shortTitle: true,
                  slug: true,
                },
              },
            },
          });
          if (section) {
            contentDetails = {
              sectionTitle: section.title,
              sectionNumber: section.number,
              lawTitle: section.law.shortTitle,
              lawSlug: section.law.slug,
            };
          }
        } else if (bookmark.contentType === 'scenario') {
          const scenario = await prisma.scenario.findUnique({
            where: { id: bookmark.contentId },
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
            },
          });
          if (scenario) {
            contentDetails = {
              scenarioTitle: scenario.title,
              scenarioSlug: scenario.slug,
              category: scenario.category,
            };
          }
        } else if (bookmark.contentType === 'law') {
          const law = await prisma.law.findUnique({
            where: { id: bookmark.contentId },
            select: {
              id: true,
              title: true,
              shortTitle: true,
              slug: true,
              category: true,
            },
          });
          if (law) {
            contentDetails = {
              lawTitle: law.shortTitle,
              lawSlug: law.slug,
              category: law.category,
            };
          }
        }

        return {
          ...bookmark,
          ...contentDetails,
        };
      })
    );

    // Fetch feedback submissions
    const feedback = await prisma.feedback.findMany({
      where: { userId: authUser.id },
      select: {
        id: true,
        feedbackType: true,
        rating: true,
        comment: true,
        createdAt: true,
        explanation: {
          select: {
            contentType: true,
            contentId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch usage records
    const usageRecords = await prisma.usageRecord.findMany({
      where: { userId: authUser.id },
      select: {
        id: true,
        action: true,
        metadata: true,
        tokenCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit to last 1000 records
    });

    // Fetch subscription info
    const subscription = await prisma.subscription.findUnique({
      where: { userId: authUser.id },
      select: {
        tier: true,
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        createdAt: true,
      },
    });

    // Compile export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
        accountCreated: user.createdAt.toISOString(),
        lastUpdated: user.updatedAt.toISOString(),
      },
      subscription: subscription
        ? {
            tier: subscription.tier,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart.toISOString(),
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
            subscribedAt: subscription.createdAt.toISOString(),
          }
        : null,
      bookmarks: enrichedBookmarks.map((b: EnrichedBookmark) => ({
        ...b,
        createdAt: (b.createdAt as Date).toISOString(),
      })),
      feedback: feedback.map((f: FeedbackSelect) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      })),
      usageHistory: usageRecords.map((u: UsageRecordSelect) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      dataRetentionNote:
        'This export contains all personal data we hold about you. ' +
        'Usage records are kept for 90 days. AI explanations are cached for 30 days. ' +
        'To request deletion, visit Settings > Delete Account.',
    };

    // Return as downloadable JSON
    const response = NextResponse.json(exportData);
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="lawmadesimple-data-export-${new Date().toISOString().split('T')[0]}.json"`
    );
    response.headers.set('Content-Type', 'application/json');

    return response;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
