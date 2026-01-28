// GET /api/v1/laws/[lawSlug]/sections/[sectionSlug] - Get section detail
// Auth: Optional

import { prisma } from '@/lib/db';
import { success, notFound, withRateLimit, handleError } from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { SectionDetail, SectionListItem, ArticleItem, RelatedScenario } from '@/types/api';

interface RouteParams {
  params: Promise<{ lawSlug: string; sectionSlug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'laws', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { lawSlug, sectionSlug } = await params;

    // First, find the law
    const law = await prisma.law.findUnique({
      where: { slug: lawSlug },
      select: { id: true, slug: true, shortTitle: true },
    });

    if (!law) {
      return notFound('law', { lawSlug });
    }

    // Then find the section
    const section = await prisma.section.findUnique({
      where: {
        lawId_slug: {
          lawId: law.id,
          slug: sectionSlug,
        },
      },
      include: {
        articles: {
          select: {
            id: true,
            slug: true,
            number: true,
            content: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        subSections: {
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
        scenarios: {
          include: {
            scenario: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
          orderBy: { relevanceOrder: 'asc' },
        },
      },
    });

    if (!section) {
      return notFound('section', { lawSlug, sectionSlug });
    }

    // Transform articles
    const articles: ArticleItem[] = section.articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      number: article.number,
      content: article.content,
    }));

    // Transform sub-sections
    const subSections: SectionListItem[] = section.subSections.map((sub) => ({
      id: sub.id,
      slug: sub.slug,
      number: sub.number,
      title: sub.title,
      summary: sub.summary,
      hasSubsections: sub._count.subSections > 0,
    }));

    // Transform related scenarios
    const relatedScenarios: RelatedScenario[] = section.scenarios.map((ss) => ({
      id: ss.scenario.id,
      slug: ss.scenario.slug,
      title: ss.scenario.title,
    }));

    // Build response
    const data: SectionDetail = {
      id: section.id,
      slug: section.slug,
      number: section.number,
      title: section.title,
      content: section.content,
      summary: section.summary,
      law: {
        slug: law.slug,
        shortTitle: law.shortTitle,
      },
      articles,
      subSections,
      relatedScenarios,
    };

    return success(data);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/laws/[lawSlug]/sections/[sectionSlug]' });
  }
}
