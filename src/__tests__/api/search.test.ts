import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/v1/search/route';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    section: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    scenario: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    law: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    searchLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/api/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ userId: null, user: null }),
}));

vi.mock('@/lib/api/rate-limit', () => ({
  withRateLimit: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('@/services/subscription/subscription.service', () => ({
  canPerformSearch: vi.fn().mockResolvedValue(true),
  recordUsage: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/services/search/semantic-search.service', () => ({
  hybridSearch: vi.fn(),
  semanticSearch: vi.fn(),
  keywordSearch: vi.fn(),
}));

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/api/auth';
import { canPerformSearch, recordUsage } from '@/services/subscription/subscription.service';
import {
  hybridSearch,
  semanticSearch,
  keywordSearch,
} from '@/services/search/semantic-search.service';

describe('Search API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default mocks
    vi.mocked(prisma.searchLog.create).mockResolvedValue({} as never);
  });

  describe('GET /api/v1/search - Keyword Mode', () => {
    const mockSections = [
      {
        id: 'section-1',
        title: 'Right to Life',
        content: 'Every person has a right to life and no one shall be deprived...',
        law: { slug: 'constitution-1999', shortTitle: 'Constitution 1999' },
      },
    ];

    const mockScenarios = [
      {
        id: 'scenario-1',
        title: 'Police arrest without warrant',
        description: 'What to do when police arrest you',
      },
    ];

    const mockLaws = [
      {
        id: 'law-1',
        slug: 'constitution-1999',
        title: 'Constitution of the Federal Republic of Nigeria 1999',
        shortTitle: 'Constitution 1999',
        description: 'The supreme law of Nigeria',
      },
    ];

    it('returns search results for valid query', async () => {
      vi.mocked(prisma.section.count).mockResolvedValue(1);
      vi.mocked(prisma.section.findMany).mockResolvedValue(mockSections);
      vi.mocked(prisma.scenario.count).mockResolvedValue(1);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios);
      vi.mocked(prisma.law.count).mockResolvedValue(1);
      vi.mocked(prisma.law.findMany).mockResolvedValue(mockLaws);

      const request = new Request('http://localhost:3000/api/v1/search?q=arrest&mode=keyword');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.extra.searchMode).toBe('keyword');
    });

    it('requires query parameter', async () => {
      const request = new Request('http://localhost:3000/api/v1/search');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('rejects empty query', async () => {
      const request = new Request('http://localhost:3000/api/v1/search?q=');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('filters by type=section', async () => {
      vi.mocked(prisma.section.count).mockResolvedValue(1);
      vi.mocked(prisma.section.findMany).mockResolvedValue(mockSections);

      const request = new Request(
        'http://localhost:3000/api/v1/search?q=right&type=section&mode=keyword'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      // Should only search sections, not scenarios or laws
      expect(prisma.scenario.findMany).not.toHaveBeenCalled();
      expect(prisma.law.findMany).not.toHaveBeenCalled();
    });

    it('filters by type=scenario', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(1);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios);

      const request = new Request(
        'http://localhost:3000/api/v1/search?q=police&type=scenario&mode=keyword'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.section.findMany).not.toHaveBeenCalled();
      expect(prisma.law.findMany).not.toHaveBeenCalled();
    });

    it('filters by type=law', async () => {
      vi.mocked(prisma.law.count).mockResolvedValue(1);
      vi.mocked(prisma.law.findMany).mockResolvedValue(mockLaws);

      const request = new Request(
        'http://localhost:3000/api/v1/search?q=constitution&type=law&mode=keyword'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.section.findMany).not.toHaveBeenCalled();
      expect(prisma.scenario.findMany).not.toHaveBeenCalled();
    });

    it('returns pagination info', async () => {
      vi.mocked(prisma.section.count).mockResolvedValue(25);
      vi.mocked(prisma.section.findMany).mockResolvedValue([]);
      vi.mocked(prisma.scenario.count).mockResolvedValue(0);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([]);
      vi.mocked(prisma.law.count).mockResolvedValue(0);
      vi.mocked(prisma.law.findMany).mockResolvedValue([]);

      const request = new Request(
        'http://localhost:3000/api/v1/search?q=test&page=2&limit=10&mode=keyword'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(10);
    });

    it('logs search to searchLog', async () => {
      vi.mocked(prisma.section.count).mockResolvedValue(0);
      vi.mocked(prisma.section.findMany).mockResolvedValue([]);
      vi.mocked(prisma.scenario.count).mockResolvedValue(0);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([]);
      vi.mocked(prisma.law.count).mockResolvedValue(0);
      vi.mocked(prisma.law.findMany).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/search?q=test+query&mode=keyword');
      await GET(request);

      // Allow async logging
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(prisma.searchLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            query: 'test query',
          }),
        })
      );
    });
  });

  describe('GET /api/v1/search - Hybrid Mode', () => {
    const mockHybridResults = [
      {
        type: 'section' as const,
        id: 'section-1',
        title: 'Right to Life',
        excerpt: 'Every person has a right to life...',
        relevanceScore: 0.95,
        law: { slug: 'constitution-1999', shortTitle: 'Constitution 1999' },
      },
      {
        type: 'scenario' as const,
        id: 'scenario-1',
        title: 'Unlawful detention',
        excerpt: 'When police detain you unlawfully...',
        relevanceScore: 0.85,
      },
    ];

    it('uses hybrid search by default', async () => {
      vi.mocked(hybridSearch).mockResolvedValue(mockHybridResults);

      const request = new Request('http://localhost:3000/api/v1/search?q=right+to+life');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(hybridSearch).toHaveBeenCalledWith('right to life', expect.any(Object));
      expect(data.extra.searchMode).toBe('hybrid');
      expect(data.extra.semanticAvailable).toBe(true);
    });

    it('uses semantic search when mode=semantic', async () => {
      vi.mocked(semanticSearch).mockResolvedValue(mockHybridResults);

      const request = new Request('http://localhost:3000/api/v1/search?q=arrest&mode=semantic');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(semanticSearch).toHaveBeenCalled();
      expect(hybridSearch).not.toHaveBeenCalled();
      expect(data.extra.searchMode).toBe('semantic');
    });

    it('falls back to keyword search on semantic failure', async () => {
      vi.mocked(hybridSearch).mockRejectedValue(new Error('OpenAI API failed'));
      vi.mocked(keywordSearch).mockResolvedValue([
        {
          type: 'section' as const,
          id: 'section-1',
          title: 'Fallback Result',
          excerpt: 'This is from keyword search',
          relevanceScore: 0.5,
        },
      ]);

      const request = new Request('http://localhost:3000/api/v1/search?q=test&mode=hybrid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.extra.searchMode).toBe('keyword_fallback');
      expect(data.extra.semanticAvailable).toBe(false);
      expect(keywordSearch).toHaveBeenCalled();
    });

    it('transforms hybrid results correctly', async () => {
      vi.mocked(hybridSearch).mockResolvedValue(mockHybridResults);

      const request = new Request('http://localhost:3000/api/v1/search?q=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.data[0]).toHaveProperty('type');
      expect(data.data[0]).toHaveProperty('id');
      expect(data.data[0]).toHaveProperty('title');
      expect(data.data[0]).toHaveProperty('excerpt');
      expect(data.data[0]).toHaveProperty('relevanceScore');
    });
  });

  describe('GET /api/v1/search - Rate Limiting & Usage', () => {
    it('checks usage limits for authenticated users', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        userId: 'user-1',
        user: { id: 'user-1', email: 'test@example.com' } as never,
      });
      vi.mocked(canPerformSearch).mockResolvedValue(true);
      vi.mocked(hybridSearch).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/search?q=test');
      await GET(request);

      expect(canPerformSearch).toHaveBeenCalledWith('user-1');
    });

    it('returns 429 when usage limit exceeded', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        userId: 'user-1',
        user: { id: 'user-1', email: 'test@example.com' } as never,
      });
      vi.mocked(canPerformSearch).mockResolvedValue(false);

      const request = new Request('http://localhost:3000/api/v1/search?q=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error.message).toContain('limit');
    });

    it('records usage for authenticated users', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        userId: 'user-1',
        user: { id: 'user-1', email: 'test@example.com' } as never,
      });
      vi.mocked(canPerformSearch).mockResolvedValue(true);
      vi.mocked(hybridSearch).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/search?q=test');
      await GET(request);

      // Allow async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(recordUsage).toHaveBeenCalledWith('user-1', 'search_performed', expect.any(Object));
    });

    it('does not record usage for guests', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ userId: null, user: null });
      vi.mocked(hybridSearch).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/search?q=test');
      await GET(request);

      // Allow async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(recordUsage).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/search - Query Validation', () => {
    it('rejects invalid type parameter', async () => {
      const request = new Request('http://localhost:3000/api/v1/search?q=test&type=invalid');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('rejects invalid mode parameter', async () => {
      const request = new Request('http://localhost:3000/api/v1/search?q=test&mode=invalid');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('rejects invalid page number', async () => {
      const request = new Request('http://localhost:3000/api/v1/search?q=test&page=0');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('rejects negative limit', async () => {
      const request = new Request('http://localhost:3000/api/v1/search?q=test&limit=-5');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('accepts lawIds filter', async () => {
      vi.mocked(hybridSearch).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/search?q=test&lawIds=law-1,law-2');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(hybridSearch).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({
          lawIds: ['law-1', 'law-2'],
        })
      );
    });
  });
});
