// GET /api/v1/bookmarks - List user bookmarks (auth required)
// POST /api/v1/bookmarks - Create bookmark (auth required)

import { prisma } from '@/lib/db';
import {
  paginated,
  created,
  badRequest,
  conflict,
  calculatePagination,
  parseSearchParams,
  formatZodErrors,
  bookmarkListQuerySchema,
  createBookmarkSchema,
  withRateLimit,
  handleError,
  safeParseJson,
} from '@/lib/api';
import { requireAuth } from '@/lib/api/auth';
import type { BookmarkItem } from '@/types/api';
import type { ContentType, Prisma } from '@prisma/client';

// GET /api/v1/bookmarks
export async function GET(request: Request) {
  try {
    // Require authentication
    const { userId } = await requireAuth();

    // Rate limiting (already authenticated, so pass userId)
    const rateLimitCheck = await withRateLimit(request, 'bookmarks', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const parsed = parseSearchParams(searchParams, bookmarkListQuerySchema);
    if (!parsed.success) {
      return badRequest('Invalid query parameters', formatZodErrors(parsed.error));
    }

    const { type, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    // Build query filters
    const where: Prisma.BookmarkWhereInput = { userId };

    if (type && type !== 'all') {
      where.contentType = type as ContentType;
    }

    // Get total count and bookmarks
    const [total, bookmarks] = await Promise.all([
      prisma.bookmark.count({ where }),
      prisma.bookmark.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Fetch content details for each bookmark
    const data: BookmarkItem[] = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const content = await getBookmarkContent(bookmark.contentType, bookmark.contentId);
        return {
          id: bookmark.id,
          contentType: bookmark.contentType as BookmarkItem['contentType'],
          contentId: bookmark.contentId,
          note: bookmark.note,
          createdAt: bookmark.createdAt.toISOString(),
          content,
        };
      })
    );

    const pagination = calculatePagination(page, limit, total);
    return paginated(data, pagination);
  } catch (error) {
    return handleError(error, { endpoint: 'GET /api/v1/bookmarks' });
  }
}

// POST /api/v1/bookmarks
export async function POST(request: Request) {
  try {
    // Require authentication
    const { userId } = await requireAuth();

    // Rate limiting
    const rateLimitCheck = await withRateLimit(request, 'bookmarks', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    // Parse and validate request body
    const { data: body, error: jsonError } = await safeParseJson(request);
    if (jsonError) {
      return badRequest(jsonError);
    }

    const parsed = createBookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Invalid request body', formatZodErrors(parsed.error));
    }

    const { contentType, contentId, note } = parsed.data;

    // Verify content exists
    const contentExists = await verifyContentExists(contentType as ContentType, contentId);
    if (!contentExists) {
      return badRequest('Content not found', { contentType, contentId });
    }

    // Check for duplicate bookmark
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType: contentType as ContentType,
          contentId,
        },
      },
    });

    if (existing) {
      return conflict('Bookmark already exists', { bookmarkId: existing.id });
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        contentType: contentType as ContentType,
        contentId,
        note,
      },
    });

    return created({
      id: bookmark.id,
      contentType: bookmark.contentType,
      contentId: bookmark.contentId,
      note: bookmark.note,
      createdAt: bookmark.createdAt.toISOString(),
    });
  } catch (error) {
    return handleError(error, { endpoint: 'POST /api/v1/bookmarks' });
  }
}

// Helper: Get content details for a bookmark
async function getBookmarkContent(
  contentType: ContentType,
  contentId: string
): Promise<BookmarkItem['content']> {
  switch (contentType) {
    case 'section': {
      const section = await prisma.section.findUnique({
        where: { id: contentId },
        select: {
          title: true,
          law: { select: { slug: true, shortTitle: true } },
        },
      });
      return section ? { title: section.title, law: section.law } : { title: 'Unknown Section' };
    }
    case 'law': {
      const law = await prisma.law.findUnique({
        where: { id: contentId },
        select: { title: true, slug: true, shortTitle: true },
      });
      return law
        ? { title: law.title, law: { slug: law.slug, shortTitle: law.shortTitle } }
        : { title: 'Unknown Law' };
    }
    case 'scenario': {
      const scenario = await prisma.scenario.findUnique({
        where: { id: contentId },
        select: { title: true },
      });
      return { title: scenario?.title ?? 'Unknown Scenario' };
    }
    case 'article': {
      const article = await prisma.article.findUnique({
        where: { id: contentId },
        select: {
          number: true,
          section: {
            select: {
              title: true,
              law: { select: { slug: true, shortTitle: true } },
            },
          },
        },
      });
      return article
        ? {
            title: `Article ${article.number} - ${article.section.title}`,
            law: article.section.law,
          }
        : { title: 'Unknown Article' };
    }
    case 'explanation': {
      const explanation = await prisma.explanation.findUnique({
        where: { id: contentId },
        select: { contentType: true, contentId: true },
      });
      if (!explanation) return { title: 'Unknown Explanation' };
      // Recursively get the source content title
      return getBookmarkContent(explanation.contentType, explanation.contentId);
    }
    default:
      return { title: 'Unknown Content' };
  }
}

// Helper: Verify content exists
// Use explicit select: { id: true } to avoid fetching Unsupported pgvector embedding fields
async function verifyContentExists(contentType: ContentType, contentId: string): Promise<boolean> {
  switch (contentType) {
    case 'section':
      return !!(await prisma.section.findUnique({
        where: { id: contentId },
        select: { id: true },
      }));
    case 'law':
      return !!(await prisma.law.findUnique({ where: { id: contentId }, select: { id: true } }));
    case 'scenario':
      return !!(await prisma.scenario.findUnique({
        where: { id: contentId },
        select: { id: true },
      }));
    case 'article':
      return !!(await prisma.article.findUnique({
        where: { id: contentId },
        select: { id: true },
      }));
    case 'explanation':
      return !!(await prisma.explanation.findUnique({
        where: { id: contentId },
        select: { id: true },
      }));
    default:
      return false;
  }
}
