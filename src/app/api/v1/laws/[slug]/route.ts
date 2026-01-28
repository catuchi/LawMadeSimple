// GET /api/v1/laws/[slug] - Get law with sections
// Auth: Optional

import { prisma } from '@/lib/db';
import { success, notFound, withRateLimit, handleError } from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { LawDetail, SectionListItem } from '@/types/api';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'laws', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { slug } = await params;

    // Fetch law with top-level sections
    const law = await prisma.law.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { parentSectionId: null }, // Only top-level sections
          select: {
            id: true,
            slug: true,
            number: true,
            title: true,
            summary: true,
            _count: {
              select: { subSections: true },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!law) {
      return notFound('law', { slug });
    }

    // Transform sections
    const sections: SectionListItem[] = law.sections.map((section) => ({
      id: section.id,
      slug: section.slug,
      number: section.number,
      title: section.title,
      summary: section.summary,
      hasSubsections: section._count.subSections > 0,
    }));

    // Build response
    const data: LawDetail = {
      id: law.id,
      slug: law.slug,
      title: law.title,
      shortTitle: law.shortTitle,
      description: law.description,
      category: law.category,
      effectiveDate: law.effectiveDate?.toISOString() ?? null,
      sourceUrl: law.sourceUrl,
      isActive: law.isActive,
      sections,
    };

    return success(data);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/laws/[slug]' });
  }
}
