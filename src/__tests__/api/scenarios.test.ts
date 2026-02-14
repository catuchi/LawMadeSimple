import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getScenarios } from '@/app/api/v1/scenarios/route';
import { GET as getScenarioBySlug } from '@/app/api/v1/scenarios/[slug]/route';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    scenario: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/api/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ userId: null, user: null }),
}));

vi.mock('@/lib/api/rate-limit', () => ({
  withRateLimit: vi.fn().mockResolvedValue({ error: null }),
}));

import { prisma } from '@/lib/db';

describe('Scenarios API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/scenarios', () => {
    const mockScenarios = [
      {
        id: 'scenario-1',
        slug: 'police-arrest',
        title: 'Police arrest without warrant',
        description: 'What to do when police arrest you without a warrant',
        category: 'criminal',
        isFeatured: true,
        sections: [
          { section: { law: { slug: 'constitution-1999' } } },
          { section: { law: { slug: 'criminal-code-act' } } },
        ],
      },
      {
        id: 'scenario-2',
        slug: 'landlord-eviction',
        title: 'Landlord trying to evict you',
        description: 'Your rights when a landlord wants to evict you',
        category: 'property',
        isFeatured: false,
        sections: [{ section: { law: { slug: 'lagos-tenancy-law' } } }],
      },
    ];

    it('returns paginated list of scenarios', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(2);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios');
      const response = await getScenarios(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBe(2);
    });

    it('filters by category', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(1);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([mockScenarios[0]] as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios?category=criminal');
      const response = await getScenarios(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].category).toBe('criminal');
    });

    it('filters by featured status', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(1);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([mockScenarios[0]] as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios?featured=true');
      const response = await getScenarios(request);

      expect(response.status).toBe(200);
      expect(prisma.scenario.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isFeatured: true }),
        })
      );
    });

    it('supports pagination', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(25);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/scenarios?page=2&limit=10');
      const response = await getScenarios(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.scenario.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.totalPages).toBe(3);
    });

    it('extracts unique related law slugs', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(1);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([mockScenarios[0]] as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios');
      const response = await getScenarios(request);
      const data = await response.json();

      expect(data.data[0].relatedLaws).toEqual(['constitution-1999', 'criminal-code-act']);
    });

    it('returns empty array when no scenarios exist', async () => {
      vi.mocked(prisma.scenario.count).mockResolvedValue(0);
      vi.mocked(prisma.scenario.findMany).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/scenarios');
      const response = await getScenarios(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it('rejects invalid category', async () => {
      const request = new Request('http://localhost:3000/api/v1/scenarios?category=invalid');
      const response = await getScenarios(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('rejects invalid pagination params', async () => {
      const request = new Request('http://localhost:3000/api/v1/scenarios?page=-1');
      const response = await getScenarios(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/scenarios/[slug]', () => {
    const mockScenarioDetail = {
      id: 'scenario-1',
      slug: 'police-arrest',
      title: 'Police arrest without warrant',
      description: 'What to do when police arrest you without a warrant',
      category: 'criminal',
      isFeatured: true,
      viewCount: 100,
      sections: [
        {
          relevanceNote: 'Covers your fundamental right against arbitrary arrest',
          relevanceOrder: 1,
          section: {
            id: 'section-1',
            slug: 'section-35',
            title: 'Right to Personal Liberty',
            law: { slug: 'constitution-1999' },
          },
        },
        {
          relevanceNote: 'Defines powers of arrest',
          relevanceOrder: 2,
          section: {
            id: 'section-2',
            slug: 'section-10',
            title: 'Arrest by Police',
            law: { slug: 'criminal-code-act' },
          },
        },
      ],
    };

    it('returns scenario with related sections', async () => {
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenarioDetail as never);
      vi.mocked(prisma.scenario.update).mockResolvedValue(mockScenarioDetail as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios/police-arrest');
      const response = await getScenarioBySlug(request, {
        params: Promise.resolve({ slug: 'police-arrest' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.slug).toBe('police-arrest');
      expect(data.data.relatedSections).toHaveLength(2);
    });

    it('returns 404 for non-existent scenario', async () => {
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/api/v1/scenarios/nonexistent');
      const response = await getScenarioBySlug(request, {
        params: Promise.resolve({ slug: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('transforms related sections correctly', async () => {
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenarioDetail as never);
      vi.mocked(prisma.scenario.update).mockResolvedValue(mockScenarioDetail as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios/police-arrest');
      const response = await getScenarioBySlug(request, {
        params: Promise.resolve({ slug: 'police-arrest' }),
      });
      const data = await response.json();

      const section = data.data.relatedSections[0];
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('lawSlug');
      expect(section).toHaveProperty('sectionSlug');
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('relevanceNote');
      expect(section.lawSlug).toBe('constitution-1999');
      expect(section.sectionSlug).toBe('section-35');
    });

    it('increments view count on access', async () => {
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenarioDetail as never);
      vi.mocked(prisma.scenario.update).mockResolvedValue(mockScenarioDetail as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios/police-arrest');
      await getScenarioBySlug(request, {
        params: Promise.resolve({ slug: 'police-arrest' }),
      });

      // Allow the async update to be called
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(prisma.scenario.update).toHaveBeenCalledWith({
        where: { id: 'scenario-1' },
        data: { viewCount: { increment: 1 } },
      });
    });

    it('uses slug from params for lookup', async () => {
      vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenarioDetail as never);
      vi.mocked(prisma.scenario.update).mockResolvedValue(mockScenarioDetail as never);

      const request = new Request('http://localhost:3000/api/v1/scenarios/my-custom-slug');
      await getScenarioBySlug(request, {
        params: Promise.resolve({ slug: 'my-custom-slug' }),
      });

      expect(prisma.scenario.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'my-custom-slug' },
        })
      );
    });
  });
});
