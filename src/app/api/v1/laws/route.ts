// GET /api/v1/laws - List all laws
// Auth: Optional
// Query params: category, active

import { prisma } from '@/lib/db';
import {
  success,
  badRequest,
  parseSearchParams,
  formatZodErrors,
  lawListQuerySchema,
  withRateLimit,
  handleError,
} from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { LawListItem } from '@/types/api';
import type { LawCategory } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'laws', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const parsed = parseSearchParams(searchParams, lawListQuerySchema);
    if (!parsed.success) {
      return badRequest('Invalid query parameters', formatZodErrors(parsed.error));
    }

    const { category, active } = parsed.data;

    // Build query filters
    const where: {
      category?: LawCategory;
      isActive?: boolean;
    } = {};

    if (category) {
      where.category = category as LawCategory;
    }

    if (active !== undefined) {
      where.isActive = active;
    }

    // Fetch laws with section count
    const laws = await prisma.law.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        shortTitle: true,
        description: true,
        category: true,
        isActive: true,
        _count: {
          select: { sections: true },
        },
      },
      orderBy: { title: 'asc' },
    });

    // Transform to API response format
    const data: LawListItem[] = laws.map((law) => ({
      id: law.id,
      slug: law.slug,
      title: law.title,
      shortTitle: law.shortTitle,
      description: law.description,
      category: law.category,
      sectionCount: law._count.sections,
      isActive: law.isActive,
    }));

    return success(data);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/laws' });
  }
}
