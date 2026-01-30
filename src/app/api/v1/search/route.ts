// GET /api/v1/search - Full-text search across laws, sections, scenarios
// Auth: Optional (but usage limits apply to authenticated users)
// Query params: q, type, mode (keyword|semantic|hybrid), lawIds, page, limit

import { prisma } from '@/lib/db';
import {
  paginated,
  badRequest,
  rateLimited,
  calculatePagination,
  parseSearchParams,
  formatZodErrors,
  searchQuerySchema,
  handleError,
} from '@/lib/api';
import { getCurrentUser } from '@/lib/api/auth';
import { withRateLimit } from '@/lib/api/rate-limit';
import { canPerformSearch, recordUsage } from '@/services/subscription/subscription.service';
import {
  hybridSearch,
  semanticSearch,
  keywordSearch as semanticKeywordSearch,
} from '@/services/search/semantic-search.service';
import type { SearchResult } from '@/types/api';

export async function GET(request: Request) {
  try {
    // Get current user (optional auth)
    const { userId } = await getCurrentUser();

    // Check rate limit
    const rateLimitCheck = await withRateLimit(request, 'search', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    // For authenticated users, check usage limits
    if (userId) {
      const allowed = await canPerformSearch(userId);
      if (!allowed) {
        return rateLimited(
          'Daily search limit reached. Upgrade to premium for unlimited searches.'
        );
      }
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const parsed = parseSearchParams(searchParams, searchQuerySchema);
    if (!parsed.success) {
      return badRequest('Invalid query parameters', formatZodErrors(parsed.error));
    }

    const { q, type, mode, lawIds, page, limit } = parsed.data;

    let results: SearchResult[];
    let totalResults = 0;

    // Use semantic/hybrid search for 'hybrid' or 'semantic' modes
    if (mode === 'hybrid' || mode === 'semantic') {
      const searchFn = mode === 'semantic' ? semanticSearch : hybridSearch;
      const searchType = type === 'law' ? 'all' : type; // Laws don't have embeddings, use 'all' and filter

      try {
        const semanticResults = await searchFn(q, {
          type: searchType,
          limit: limit * 2, // Fetch more for pagination
          lawIds,
        });

        // Filter law results if type was specifically 'law'
        const filteredResults =
          type === 'law' ? semanticResults.filter((r) => r.type === 'law') : semanticResults;

        totalResults = filteredResults.length;

        // Apply pagination
        const skip = (page - 1) * limit;
        results = filteredResults.slice(skip, skip + limit).map((r) => ({
          type: r.type,
          id: r.id,
          title: r.title,
          excerpt: r.excerpt,
          relevanceScore: r.relevanceScore,
          ...(r.law ? { law: r.law } : {}),
        }));
      } catch (error) {
        // Fallback to keyword search if semantic search fails (e.g., no embeddings)
        console.error('Semantic search failed, falling back to keyword:', error);
        const keywordResults = await semanticKeywordSearch(q, { type, limit, lawIds });
        totalResults = keywordResults.length;
        results = keywordResults.map((r) => ({
          type: r.type,
          id: r.id,
          title: r.title,
          excerpt: r.excerpt,
          relevanceScore: r.relevanceScore,
          ...(r.law ? { law: r.law } : {}),
        }));
      }
    } else {
      // Pure keyword search (original behavior)
      const keywordResults = await performKeywordSearch(q, type, lawIds, page, limit);
      results = keywordResults.results;
      totalResults = keywordResults.total;
    }

    const finalResults = results;

    // Sanitize query for logging (prevent log injection, limit length, remove control chars)
    const sanitizedQuery = q
      .substring(0, 200)
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
      .trim();

    // Log search and record usage (fire and forget)
    Promise.all([
      // Log to search analytics
      prisma.searchLog.create({
        data: {
          userId,
          query: sanitizedQuery,
          resultCount: totalResults,
          filters: { type, lawIds },
        },
      }),
      // Record usage for authenticated users (counts toward daily limit)
      userId
        ? recordUsage(userId, 'search_performed', { query: sanitizedQuery })
        : Promise.resolve(),
    ]).catch((err) => console.error('Failed to log search:', err));

    const pagination = calculatePagination(page, limit, totalResults);
    return paginated(finalResults, pagination);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/search' });
  }
}

// Helper: Perform pure keyword search (original implementation)
async function performKeywordSearch(
  q: string,
  type: 'all' | 'law' | 'section' | 'scenario',
  lawIds: string[] | undefined,
  page: number,
  limit: number
): Promise<{ results: SearchResult[]; total: number }> {
  const skip = (page - 1) * limit;
  const results: SearchResult[] = [];
  let totalResults = 0;

  // Search sections
  if (type === 'all' || type === 'section') {
    const sectionWhere = {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { content: { contains: q, mode: 'insensitive' as const } },
        { summary: { contains: q, mode: 'insensitive' as const } },
      ],
      ...(lawIds?.length ? { lawId: { in: lawIds } } : {}),
    };

    const [sectionCount, sections] = await Promise.all([
      prisma.section.count({ where: sectionWhere }),
      prisma.section.findMany({
        where: sectionWhere,
        select: {
          id: true,
          title: true,
          content: true,
          law: {
            select: { slug: true, shortTitle: true },
          },
        },
        take: type === 'section' ? limit : Math.ceil(limit / 3),
        skip: type === 'section' ? skip : 0,
      }),
    ]);

    if (type === 'section') {
      totalResults = sectionCount;
    } else {
      totalResults += sectionCount;
    }

    results.push(
      ...sections.map((section) => ({
        type: 'section' as const,
        id: section.id,
        title: section.title,
        excerpt: createExcerpt(section.content, q),
        law: {
          slug: section.law.slug,
          shortTitle: section.law.shortTitle,
        },
        relevanceScore: calculateRelevance(section.title, section.content, q),
      }))
    );
  }

  // Search scenarios
  if (type === 'all' || type === 'scenario') {
    const scenarioWhere = {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
        { keywords: { has: q.toLowerCase() } },
      ],
    };

    const [scenarioCount, scenarios] = await Promise.all([
      prisma.scenario.count({ where: scenarioWhere }),
      prisma.scenario.findMany({
        where: scenarioWhere,
        select: {
          id: true,
          title: true,
          description: true,
        },
        take: type === 'scenario' ? limit : Math.ceil(limit / 3),
        skip: type === 'scenario' ? skip : 0,
      }),
    ]);

    if (type === 'scenario') {
      totalResults = scenarioCount;
    } else {
      totalResults += scenarioCount;
    }

    results.push(
      ...scenarios.map((scenario) => ({
        type: 'scenario' as const,
        id: scenario.id,
        title: scenario.title,
        excerpt: createExcerpt(scenario.description ?? '', q),
        relevanceScore: calculateRelevance(scenario.title, scenario.description ?? '', q),
      }))
    );
  }

  // Search laws (by title/description)
  if (type === 'all' || type === 'law') {
    const lawWhere = {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { shortTitle: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
      isActive: true,
    };

    const [lawCount, laws] = await Promise.all([
      prisma.law.count({ where: lawWhere }),
      prisma.law.findMany({
        where: lawWhere,
        select: {
          id: true,
          slug: true,
          title: true,
          shortTitle: true,
          description: true,
        },
        take: type === 'law' ? limit : Math.ceil(limit / 3),
        skip: type === 'law' ? skip : 0,
      }),
    ]);

    if (type === 'law') {
      totalResults = lawCount;
    } else {
      totalResults += lawCount;
    }

    results.push(
      ...laws.map((law) => ({
        type: 'law' as const,
        id: law.id,
        title: law.title,
        excerpt: createExcerpt(law.description ?? law.shortTitle, q),
        law: {
          slug: law.slug,
          shortTitle: law.shortTitle,
        },
        relevanceScore: calculateRelevance(law.title, law.description ?? '', q),
      }))
    );
  }

  // Sort by relevance
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Trim to limit for 'all' type
  const finalResults = type === 'all' ? results.slice(0, limit) : results;

  return { results: finalResults, total: totalResults };
}

// Helper: Create excerpt with highlighted search term
function createExcerpt(text: string, query: string, maxLength = 150): string {
  if (!text) return '';

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Extract context around the match
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 50);
  let excerpt = text.slice(start, end);

  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  // Highlight match with markdown bold
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  excerpt = excerpt.replace(regex, '**$1**');

  return excerpt;
}

// Helper: Calculate simple relevance score
function calculateRelevance(title: string, content: string, query: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();

  let score = 0;

  // Title match is worth more
  if (lowerTitle.includes(lowerQuery)) {
    score += 0.5;
    if (lowerTitle.startsWith(lowerQuery)) score += 0.3;
  }

  // Content matches
  const contentMatches = (lowerContent.match(new RegExp(escapeRegex(lowerQuery), 'gi')) || [])
    .length;
  score += Math.min(contentMatches * 0.1, 0.4);

  // Normalize to 0-1
  return Math.min(score, 1);
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
