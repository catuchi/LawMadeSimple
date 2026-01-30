import { describe, it, expect, afterEach, vi } from 'vitest';

// Mock database before importing services
vi.mock('@/lib/db', () => ({
  prisma: {
    section: { findUnique: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    scenario: { findUnique: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    $executeRaw: vi.fn(),
  },
}));

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0), index: 0 }],
      }),
    },
  })),
}));

// Now import the services after mocking
import {
  generateContentHash,
  isContentStale,
  validateEmbeddingConfig,
} from '@/services/embedding/embedding.service';
import { calculateRRFScore, mergeWithRRF } from '@/services/search/semantic-search.service';

describe('embedding.service', () => {
  describe('generateContentHash', () => {
    it('returns consistent hash for same content', () => {
      const hash1 = generateContentHash('test content');
      const hash2 = generateContentHash('test content');
      expect(hash1).toBe(hash2);
    });

    it('returns different hash for different content', () => {
      const hash1 = generateContentHash('test content 1');
      const hash2 = generateContentHash('test content 2');
      expect(hash1).not.toBe(hash2);
    });

    it('returns 64-character SHA256 hex string', () => {
      const hash = generateContentHash('any content');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('handles empty string', () => {
      const hash = generateContentHash('');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('handles unicode content', () => {
      const hash1 = generateContentHash('Unicode: 日本語 한국어');
      const hash2 = generateContentHash('Unicode: 日本語 한국어');
      expect(hash1).toBe(hash2);
    });
  });

  describe('isContentStale', () => {
    it('returns true when current hash is null', () => {
      expect(isContentStale(null, 'new content')).toBe(true);
    });

    it('returns true when content has changed', () => {
      const oldHash = generateContentHash('old content');
      expect(isContentStale(oldHash, 'new content')).toBe(true);
    });

    it('returns false when content has not changed', () => {
      const content = 'same content';
      const hash = generateContentHash(content);
      expect(isContentStale(hash, content)).toBe(false);
    });
  });

  describe('validateEmbeddingConfig', () => {
    const originalEnv = process.env.OPENAI_API_KEY;

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.OPENAI_API_KEY = originalEnv;
      } else {
        delete process.env.OPENAI_API_KEY;
      }
    });

    it('returns valid=false when OPENAI_API_KEY is not set', () => {
      delete process.env.OPENAI_API_KEY;
      const result = validateEmbeddingConfig();
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not set');
    });

    it('returns valid=false when OPENAI_API_KEY is too short', () => {
      process.env.OPENAI_API_KEY = 'short';
      const result = validateEmbeddingConfig();
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too short');
    });

    it('returns valid=true when OPENAI_API_KEY is valid', () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890123456789012345678901234567890';
      const result = validateEmbeddingConfig();
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('semantic-search.service', () => {
  describe('calculateRRFScore', () => {
    const k = 60; // Standard RRF constant

    it('returns 0 when both ranks are null', () => {
      expect(calculateRRFScore(null, null, k, 0.6)).toBe(0);
    });

    it('calculates correct score for semantic-only result', () => {
      // rank 1, weight 0.6, k=60: 0.6 / (60 + 1) = 0.0098...
      const score = calculateRRFScore(1, null, k, 0.6);
      expect(score).toBeCloseTo(0.6 / 61, 6);
    });

    it('calculates correct score for keyword-only result', () => {
      // rank 1, weight 0.4 (1-0.6), k=60: 0.4 / (60 + 1) = 0.0065...
      const score = calculateRRFScore(null, 1, k, 0.6);
      expect(score).toBeCloseTo(0.4 / 61, 6);
    });

    it('calculates correct score for combined result', () => {
      // Both rank 1: (0.6 / 61) + (0.4 / 61) = 1 / 61
      const score = calculateRRFScore(1, 1, k, 0.6);
      expect(score).toBeCloseTo(1 / 61, 6);
    });

    it('higher ranked items have higher scores', () => {
      const rank1Score = calculateRRFScore(1, 1, k, 0.6);
      const rank5Score = calculateRRFScore(5, 5, k, 0.6);
      expect(rank1Score).toBeGreaterThan(rank5Score);
    });

    it('semantic weight affects score distribution', () => {
      // With high semantic weight, semantic rank matters more
      const highSemanticWeight = calculateRRFScore(1, 10, k, 0.9);
      const lowSemanticWeight = calculateRRFScore(1, 10, k, 0.1);

      // With semantic weight 0.9, rank 1 semantic contributes more
      // With semantic weight 0.1, rank 10 keyword contributes more
      expect(highSemanticWeight).toBeGreaterThan(lowSemanticWeight);
    });
  });

  describe('mergeWithRRF', () => {
    it('merges empty arrays', () => {
      const result = mergeWithRRF([], [], 0.6);
      expect(result).toHaveLength(0);
    });

    it('handles semantic-only results', () => {
      const semantic = [
        { id: 'a', title: 'A', similarity: 0.9 },
        { id: 'b', title: 'B', similarity: 0.8 },
      ];
      const result = mergeWithRRF(semantic, [], 0.6);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('a'); // Higher rank = higher score
      expect(result[0].semanticRank).toBe(1);
      expect(result[0].keywordRank).toBeNull();
    });

    it('handles keyword-only results', () => {
      const keyword = [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
      ];
      const result = mergeWithRRF([], keyword, 0.6);

      expect(result).toHaveLength(2);
      expect(result[0].semanticRank).toBeNull();
      expect(result[0].keywordRank).toBe(1);
    });

    it('merges overlapping results correctly', () => {
      const semantic = [
        { id: 'a', title: 'A', similarity: 0.9 },
        { id: 'b', title: 'B', similarity: 0.8 },
      ];
      const keyword = [
        { id: 'b', title: 'B' }, // Also in semantic
        { id: 'c', title: 'C' },
      ];

      const result = mergeWithRRF(semantic, keyword, 0.6);

      // Should have 3 unique items
      expect(result).toHaveLength(3);

      // 'b' appears in both, should have both ranks
      const itemB = result.find((r) => r.id === 'b');
      expect(itemB?.semanticRank).toBe(2);
      expect(itemB?.keywordRank).toBe(1);

      // 'b' should be ranked highest since it appears in both
      expect(result[0].id).toBe('b');
    });

    it('preserves original properties', () => {
      const semantic = [{ id: 'a', title: 'A', extra: 'data', similarity: 0.9 }];
      const result = mergeWithRRF(semantic, [], 0.6);

      expect(result[0].extra).toBe('data');
    });

    it('sorts by RRF score descending', () => {
      const semantic = [
        { id: 'a', title: 'A', similarity: 0.9 }, // rank 1
        { id: 'b', title: 'B', similarity: 0.8 }, // rank 2
      ];
      const keyword = [
        { id: 'c', title: 'C' }, // rank 1
        { id: 'd', title: 'D' }, // rank 2
      ];

      const result = mergeWithRRF(semantic, keyword, 0.5); // Equal weights

      // All items have rank 1 or 2, so order depends on which list
      // With equal weights, semantic rank 1 = keyword rank 1
      expect(result[0].rrfScore).toBeGreaterThanOrEqual(result[1].rrfScore);
      expect(result[1].rrfScore).toBeGreaterThanOrEqual(result[2].rrfScore);
      expect(result[2].rrfScore).toBeGreaterThanOrEqual(result[3].rrfScore);
    });
  });
});
