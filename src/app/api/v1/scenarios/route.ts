// GET /api/v1/scenarios - List scenarios
// Auth: Optional
// Query params: category, featured, page, limit

import { prisma } from '@/lib/db';
import {
  paginated,
  badRequest,
  calculatePagination,
  parseSearchParams,
  formatZodErrors,
  scenarioListQuerySchema,
  withRateLimit,
  handleError,
} from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { ScenarioListItem } from '@/types/api';
import type { LawCategory, Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'scenarios', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const parsed = parseSearchParams(searchParams, scenarioListQuerySchema);
    if (!parsed.success) {
      return badRequest('Invalid query parameters', formatZodErrors(parsed.error));
    }

    const { category, featured, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    // Build query filters
    const where: Prisma.ScenarioWhereInput = {};

    if (category) {
      where.category = category as LawCategory;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    // Get total count and scenarios
    const [total, scenarios] = await Promise.all([
      prisma.scenario.count({ where }),
      prisma.scenario.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          category: true,
          isFeatured: true,
          sections: {
            select: {
              section: {
                select: {
                  law: {
                    select: { slug: true },
                  },
                },
              },
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }, { title: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    // Transform to API response format
    const data: ScenarioListItem[] = scenarios.map((scenario) => {
      // Get unique law slugs
      const relatedLaws = [...new Set(scenario.sections.map((ss) => ss.section.law.slug))];

      return {
        id: scenario.id,
        slug: scenario.slug,
        title: scenario.title,
        description: scenario.description,
        category: scenario.category,
        isFeatured: scenario.isFeatured,
        relatedLaws,
      };
    });

    const pagination = calculatePagination(page, limit, total);
    return paginated(data, pagination);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/scenarios' });
  }
}
