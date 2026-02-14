import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getLaws } from '@/app/api/v1/laws/route';
import { GET as getLawBySlug } from '@/app/api/v1/laws/[lawSlug]/route';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    law: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
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

describe('Laws API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/laws', () => {
    const mockLaws = [
      {
        id: 'law-1',
        slug: 'constitution-1999',
        title: 'Constitution of the Federal Republic of Nigeria 1999',
        shortTitle: 'Constitution 1999',
        description: 'The supreme law of Nigeria',
        category: 'constitution',
        isActive: true,
        _count: { sections: 13 },
      },
      {
        id: 'law-2',
        slug: 'criminal-code-act',
        title: 'Criminal Code Act',
        shortTitle: 'Criminal Code',
        description: 'Criminal offenses in Nigeria',
        category: 'criminal',
        isActive: true,
        _count: { sections: 18 },
      },
    ];

    it('returns list of laws', async () => {
      vi.mocked(prisma.law.findMany).mockResolvedValue(mockLaws);

      const request = new Request('http://localhost:3000/api/v1/laws');
      const response = await getLaws(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].slug).toBe('constitution-1999');
      expect(data.data[0].sectionCount).toBe(13);
    });

    it('filters by category', async () => {
      vi.mocked(prisma.law.findMany).mockResolvedValue([mockLaws[0]]);

      const request = new Request('http://localhost:3000/api/v1/laws?category=constitution');
      const response = await getLaws(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].category).toBe('constitution');

      // Verify the filter was passed to Prisma
      expect(prisma.law.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'constitution' }),
        })
      );
    });

    it('filters by active status', async () => {
      vi.mocked(prisma.law.findMany).mockResolvedValue(mockLaws);

      const request = new Request('http://localhost:3000/api/v1/laws?active=true');
      const response = await getLaws(request);

      expect(response.status).toBe(200);
      expect(prisma.law.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        })
      );
    });

    it('rejects invalid category', async () => {
      const request = new Request('http://localhost:3000/api/v1/laws?category=invalid');
      const response = await getLaws(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns empty array when no laws exist', async () => {
      vi.mocked(prisma.law.findMany).mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/v1/laws');
      const response = await getLaws(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('transforms response to correct format', async () => {
      vi.mocked(prisma.law.findMany).mockResolvedValue([mockLaws[0]]);

      const request = new Request('http://localhost:3000/api/v1/laws');
      const response = await getLaws(request);
      const data = await response.json();

      const law = data.data[0];
      expect(law).toHaveProperty('id');
      expect(law).toHaveProperty('slug');
      expect(law).toHaveProperty('title');
      expect(law).toHaveProperty('shortTitle');
      expect(law).toHaveProperty('description');
      expect(law).toHaveProperty('category');
      expect(law).toHaveProperty('sectionCount');
      expect(law).toHaveProperty('isActive');
      // Should not have _count (internal Prisma field)
      expect(law).not.toHaveProperty('_count');
    });
  });

  describe('GET /api/v1/laws/[lawSlug]', () => {
    const mockLawWithSections = {
      id: 'law-1',
      slug: 'constitution-1999',
      title: 'Constitution of the Federal Republic of Nigeria 1999',
      shortTitle: 'Constitution 1999',
      description: 'The supreme law of Nigeria',
      category: 'constitution',
      effectiveDate: new Date('1999-05-29'),
      sourceUrl: 'https://example.com/constitution.pdf',
      isActive: true,
      sections: [
        {
          id: 'section-1',
          slug: 'section-33',
          number: '33',
          title: 'Right to Life',
          summary: 'Every person has a right to life',
          _count: { subSections: 2 },
        },
        {
          id: 'section-2',
          slug: 'section-34',
          number: '34',
          title: 'Right to Dignity',
          summary: 'Every individual is entitled to respect',
          _count: { subSections: 0 },
        },
      ],
    };

    it('returns law with sections', async () => {
      vi.mocked(prisma.law.findUnique).mockResolvedValue(mockLawWithSections);

      const request = new Request('http://localhost:3000/api/v1/laws/constitution-1999');
      const response = await getLawBySlug(request, {
        params: Promise.resolve({ lawSlug: 'constitution-1999' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.slug).toBe('constitution-1999');
      expect(data.data.sections).toHaveLength(2);
    });

    it('returns 404 for non-existent law', async () => {
      vi.mocked(prisma.law.findUnique).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/api/v1/laws/nonexistent');
      const response = await getLawBySlug(request, {
        params: Promise.resolve({ lawSlug: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('transforms sections correctly', async () => {
      vi.mocked(prisma.law.findUnique).mockResolvedValue(mockLawWithSections);

      const request = new Request('http://localhost:3000/api/v1/laws/constitution-1999');
      const response = await getLawBySlug(request, {
        params: Promise.resolve({ lawSlug: 'constitution-1999' }),
      });
      const data = await response.json();

      const section = data.data.sections[0];
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('slug');
      expect(section).toHaveProperty('number');
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('summary');
      expect(section).toHaveProperty('hasSubsections');
      expect(section.hasSubsections).toBe(true);
      // Should not have _count
      expect(section).not.toHaveProperty('_count');
    });

    it('formats effectiveDate as ISO string', async () => {
      vi.mocked(prisma.law.findUnique).mockResolvedValue(mockLawWithSections);

      const request = new Request('http://localhost:3000/api/v1/laws/constitution-1999');
      const response = await getLawBySlug(request, {
        params: Promise.resolve({ lawSlug: 'constitution-1999' }),
      });
      const data = await response.json();

      expect(data.data.effectiveDate).toBe('1999-05-29T00:00:00.000Z');
    });

    it('handles null effectiveDate', async () => {
      const lawWithoutDate = { ...mockLawWithSections, effectiveDate: null };
      vi.mocked(prisma.law.findUnique).mockResolvedValue(lawWithoutDate);

      const request = new Request('http://localhost:3000/api/v1/laws/constitution-1999');
      const response = await getLawBySlug(request, {
        params: Promise.resolve({ lawSlug: 'constitution-1999' }),
      });
      const data = await response.json();

      expect(data.data.effectiveDate).toBeNull();
    });

    it('uses slug from params for lookup', async () => {
      vi.mocked(prisma.law.findUnique).mockResolvedValue(mockLawWithSections);

      const request = new Request('http://localhost:3000/api/v1/laws/my-custom-slug');
      await getLawBySlug(request, {
        params: Promise.resolve({ lawSlug: 'my-custom-slug' }),
      });

      expect(prisma.law.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'my-custom-slug' },
        })
      );
    });
  });
});
