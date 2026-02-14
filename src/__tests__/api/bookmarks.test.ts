import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/v1/bookmarks/route';
import { DELETE } from '@/app/api/v1/bookmarks/[id]/route';

// Mock dependencies - use importOriginal to keep AuthError
vi.mock('@/lib/api/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/auth')>();
  return {
    ...actual,
    requireAuth: vi.fn(),
  };
});

vi.mock('@/lib/db', () => ({
  prisma: {
    bookmark: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    section: {
      findUnique: vi.fn(),
    },
    law: {
      findUnique: vi.fn(),
    },
    scenario: {
      findUnique: vi.fn(),
    },
    article: {
      findUnique: vi.fn(),
    },
    explanation: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/api/rate-limit', () => ({
  withRateLimit: vi.fn().mockResolvedValue({ error: null }),
}));

import { prisma } from '@/lib/db';
import { requireAuth, AuthError } from '@/lib/api/auth';

describe('Bookmarks API', () => {
  const mockUserId = 'user-123';
  // Use valid UUIDs for content IDs
  const sectionId = '550e8400-e29b-41d4-a716-446655440001';
  const scenarioId = '550e8400-e29b-41d4-a716-446655440002';
  const lawId = '550e8400-e29b-41d4-a716-446655440003';
  const bookmarkId1 = '550e8400-e29b-41d4-a716-446655440010';
  const bookmarkId2 = '550e8400-e29b-41d4-a716-446655440011';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue({
      userId: mockUserId,
      user: { id: mockUserId, email: 'test@example.com' } as never,
    });
  });

  describe('GET /api/v1/bookmarks', () => {
    const mockBookmarks = [
      {
        id: bookmarkId1,
        userId: mockUserId,
        contentType: 'section',
        contentId: sectionId,
        note: 'Important section',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: bookmarkId2,
        userId: mockUserId,
        contentType: 'scenario',
        contentId: scenarioId,
        note: null,
        createdAt: new Date('2024-01-14'),
      },
    ];

    const mockSectionContent = {
      title: 'Right to Life',
      law: { slug: 'constitution-1999', shortTitle: 'Constitution 1999' },
    };

    const mockScenarioContent = {
      title: 'Police arrest without warrant',
    };

    it('returns user bookmarks', async () => {
      vi.mocked(prisma.bookmark.count).mockResolvedValue(2);
      vi.mocked(prisma.bookmark.findMany).mockResolvedValue(mockBookmarks as never);
      vi.mocked(prisma.section.findUnique).mockResolvedValue(mockSectionContent as never);
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenarioContent as never);

      const request = new Request('http://localhost:3000/api/v1/bookmarks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.pagination).toBeDefined();
    });

    it('requires authentication', async () => {
      vi.mocked(requireAuth).mockRejectedValue(new AuthError('Authentication required'));

      const request = new Request('http://localhost:3000/api/v1/bookmarks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('filters by content type', async () => {
      vi.mocked(prisma.bookmark.count).mockResolvedValue(1);
      vi.mocked(prisma.bookmark.findMany).mockResolvedValue([mockBookmarks[0]] as never);
      vi.mocked(prisma.section.findUnique).mockResolvedValue(mockSectionContent as never);

      const request = new Request('http://localhost:3000/api/v1/bookmarks?type=section');
      await GET(request);

      expect(prisma.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            contentType: 'section',
          }),
        })
      );
    });

    it('supports pagination', async () => {
      vi.mocked(prisma.bookmark.count).mockResolvedValue(25);
      vi.mocked(prisma.bookmark.findMany).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/bookmarks?page=2&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
      expect(data.pagination.page).toBe(2);
    });

    it('includes content details for section bookmarks', async () => {
      vi.mocked(prisma.bookmark.count).mockResolvedValue(1);
      vi.mocked(prisma.bookmark.findMany).mockResolvedValue([mockBookmarks[0]] as never);
      vi.mocked(prisma.section.findUnique).mockResolvedValue(mockSectionContent as never);

      const request = new Request('http://localhost:3000/api/v1/bookmarks');
      const response = await GET(request);
      const data = await response.json();

      expect(data.data[0].content.title).toBe('Right to Life');
      expect(data.data[0].content.law.slug).toBe('constitution-1999');
    });

    it('handles missing content gracefully', async () => {
      vi.mocked(prisma.bookmark.count).mockResolvedValue(1);
      vi.mocked(prisma.bookmark.findMany).mockResolvedValue([mockBookmarks[0]] as never);
      vi.mocked(prisma.section.findUnique).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/api/v1/bookmarks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].content.title).toBe('Unknown Section');
    });
  });

  describe('POST /api/v1/bookmarks', () => {
    const createRequest = (body: object) =>
      new Request('http://localhost:3000/api/v1/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

    it('creates a new bookmark', async () => {
      vi.mocked(prisma.section.findUnique).mockResolvedValue({ id: sectionId } as never);
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.bookmark.create).mockResolvedValue({
        id: 'bookmark-new',
        userId: mockUserId,
        contentType: 'section',
        contentId: sectionId,
        note: 'My note',
        createdAt: new Date(),
      } as never);

      const request = createRequest({
        contentType: 'section',
        contentId: sectionId,
        note: 'My note',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('bookmark-new');
    });

    it('requires authentication', async () => {
      vi.mocked(requireAuth).mockRejectedValue(new AuthError('Authentication required'));

      const request = createRequest({
        contentType: 'section',
        contentId: sectionId,
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('validates request body - invalid contentType', async () => {
      const request = createRequest({
        contentType: 'invalid',
        contentId: sectionId,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('validates request body - invalid contentId format', async () => {
      const request = createRequest({
        contentType: 'section',
        contentId: 'not-a-uuid',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('rejects duplicate bookmarks', async () => {
      vi.mocked(prisma.section.findUnique).mockResolvedValue({ id: sectionId } as never);
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue({
        id: 'existing-bookmark',
      } as never);

      const request = createRequest({
        contentType: 'section',
        contentId: sectionId,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error.code).toBe('CONFLICT');
      expect(data.error.details.bookmarkId).toBe('existing-bookmark');
    });

    it('rejects non-existent content', async () => {
      vi.mocked(prisma.section.findUnique).mockResolvedValue(null);

      const request = createRequest({
        contentType: 'section',
        contentId: sectionId,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('allows bookmarking scenarios', async () => {
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue({ id: scenarioId } as never);
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.bookmark.create).mockResolvedValue({
        id: 'bookmark-new',
        userId: mockUserId,
        contentType: 'scenario',
        contentId: scenarioId,
        note: null,
        createdAt: new Date(),
      } as never);

      const request = createRequest({
        contentType: 'scenario',
        contentId: scenarioId,
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(prisma.scenario.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: scenarioId },
        })
      );
    });

    it('allows bookmarking laws', async () => {
      vi.mocked(prisma.law.findUnique).mockResolvedValue({ id: lawId } as never);
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.bookmark.create).mockResolvedValue({
        id: 'bookmark-new',
        userId: mockUserId,
        contentType: 'law',
        contentId: lawId,
        note: null,
        createdAt: new Date(),
      } as never);

      const request = createRequest({
        contentType: 'law',
        contentId: lawId,
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });
  });

  describe('DELETE /api/v1/bookmarks/[id]', () => {
    it('deletes own bookmark', async () => {
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue({
        userId: mockUserId,
      } as never);
      vi.mocked(prisma.bookmark.delete).mockResolvedValue({} as never);

      const request = new Request(`http://localhost:3000/api/v1/bookmarks/${bookmarkId1}`, {
        method: 'DELETE',
      });
      const response = await DELETE(request, {
        params: Promise.resolve({ id: bookmarkId1 }),
      });

      expect(response.status).toBe(204);
      expect(prisma.bookmark.delete).toHaveBeenCalledWith({
        where: { id: bookmarkId1 },
      });
    });

    it('requires authentication', async () => {
      vi.mocked(requireAuth).mockRejectedValue(new AuthError('Authentication required'));

      const request = new Request(`http://localhost:3000/api/v1/bookmarks/${bookmarkId1}`, {
        method: 'DELETE',
      });
      const response = await DELETE(request, {
        params: Promise.resolve({ id: bookmarkId1 }),
      });

      expect(response.status).toBe(401);
    });

    it('returns 404 for non-existent bookmark', async () => {
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue(null);

      const request = new Request(`http://localhost:3000/api/v1/bookmarks/${bookmarkId1}`, {
        method: 'DELETE',
      });
      const response = await DELETE(request, {
        params: Promise.resolve({ id: bookmarkId1 }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('forbids deleting other users bookmarks', async () => {
      vi.mocked(prisma.bookmark.findUnique).mockResolvedValue({
        userId: 'different-user',
      } as never);

      const request = new Request(`http://localhost:3000/api/v1/bookmarks/${bookmarkId1}`, {
        method: 'DELETE',
      });
      const response = await DELETE(request, {
        params: Promise.resolve({ id: bookmarkId1 }),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error.code).toBe('FORBIDDEN');
      expect(prisma.bookmark.delete).not.toHaveBeenCalled();
    });
  });
});
