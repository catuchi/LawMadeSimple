// GET /api/v1/search/suggestions - Autocomplete suggestions
// Auth: Optional
// Query params: q, limit

import { prisma } from '@/lib/db';
import {
  success,
  badRequest,
  parseSearchParams,
  formatZodErrors,
  searchSuggestionsQuerySchema,
  withRateLimit,
  handleError,
} from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import type { SearchSuggestion, RelatedScenario } from '@/types/api';

export async function GET(request: Request) {
  try {
    // Rate limiting
    const { userId } = await getCurrentUser();
    const rateLimitCheck = await withRateLimit(request, 'search', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const parsed = parseSearchParams(searchParams, searchSuggestionsQuerySchema);
    if (!parsed.success) {
      return badRequest('Invalid query parameters', formatZodErrors(parsed.error));
    }

    const { q, limit } = parsed.data;

    // Get matching scenarios (common user questions)
    const scenarios = await prisma.scenario.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { keywords: { has: q.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
    });

    // Get recent popular searches matching the query
    const recentSearches = await prisma.searchLog.groupBy({
      by: ['query'],
      where: {
        query: { startsWith: q, mode: 'insensitive' },
        resultCount: { gt: 0 }, // Only searches that had results
      },
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    // Build suggestions from popular searches
    const suggestions = recentSearches.map((s) => s.query);

    // Add scenario titles as suggestions if we don't have enough
    if (suggestions.length < limit) {
      const scenarioTitles = scenarios
        .map((s) => s.title)
        .filter((title) => !suggestions.includes(title));
      suggestions.push(...scenarioTitles.slice(0, limit - suggestions.length));
    }

    // Transform scenarios for response
    const scenarioResults: RelatedScenario[] = scenarios.map((scenario) => ({
      id: scenario.id,
      slug: scenario.slug,
      title: scenario.title,
    }));

    const data: SearchSuggestion = {
      suggestions: suggestions.slice(0, limit),
      scenarios: scenarioResults,
    };

    return success(data);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/search/suggestions' });
  }
}
