// GET /api/v1/scenarios/[slug] - Get scenario with related sections
// Auth: Optional

import { prisma } from '@/lib/db';
import { success, notFound, withRateLimit, handleError } from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { ScenarioDetail, RelatedSectionItem } from '@/types/api';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'scenarios', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { slug } = await params;

    // Fetch scenario with related sections
    // Use explicit select to avoid fetching Unsupported pgvector embedding field
    const scenario = await prisma.scenario.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        isFeatured: true,
        viewCount: true,
        sections: {
          select: {
            relevanceNote: true,
            relevanceOrder: true,
            section: {
              select: {
                id: true,
                slug: true,
                title: true,
                law: {
                  select: { slug: true },
                },
              },
            },
          },
          orderBy: { relevanceOrder: 'asc' },
        },
      },
    });

    if (!scenario) {
      return notFound('scenario', { slug });
    }

    // Increment view count (fire and forget)
    prisma.scenario
      .update({
        where: { id: scenario.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => console.error('Failed to increment view count:', err));

    // Transform related sections
    const relatedSections: RelatedSectionItem[] = scenario.sections.map((ss) => ({
      id: ss.section.id,
      lawSlug: ss.section.law.slug,
      sectionSlug: ss.section.slug,
      title: ss.section.title,
      relevanceNote: ss.relevanceNote,
    }));

    // Build response
    const data: ScenarioDetail = {
      id: scenario.id,
      slug: scenario.slug,
      title: scenario.title,
      description: scenario.description,
      category: scenario.category,
      relatedSections,
    };

    return success(data);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/scenarios/[slug]' });
  }
}
