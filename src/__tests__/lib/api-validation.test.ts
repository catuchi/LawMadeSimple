import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  slugSchema,
  uuidSchema,
  lawListQuerySchema,
  scenarioListQuerySchema,
  searchQuerySchema,
  searchSuggestionsQuerySchema,
  bookmarkListQuerySchema,
  createBookmarkSchema,
  createFeedbackSchema,
  parseSearchParams,
  formatZodErrors,
} from '@/lib/api/validation';

describe('Validation Schemas', () => {
  describe('slugSchema', () => {
    it('accepts valid slugs', () => {
      expect(slugSchema.parse('constitution-1999')).toBe('constitution-1999');
      expect(slugSchema.parse('section-33')).toBe('section-33');
      expect(slugSchema.parse('labour-act')).toBe('labour-act');
    });

    it('rejects empty strings', () => {
      expect(() => slugSchema.parse('')).toThrow();
    });

    it('rejects uppercase letters', () => {
      expect(() => slugSchema.parse('Constitution-1999')).toThrow();
    });

    it('rejects spaces', () => {
      expect(() => slugSchema.parse('my slug')).toThrow();
    });

    it('rejects special characters', () => {
      expect(() => slugSchema.parse('slug_with_underscore')).toThrow();
      expect(() => slugSchema.parse('slug.with.dots')).toThrow();
    });
  });

  describe('uuidSchema', () => {
    it('accepts valid UUIDs', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(uuidSchema.parse(uuid)).toBe(uuid);
    });

    it('rejects invalid UUIDs', () => {
      expect(() => uuidSchema.parse('not-a-uuid')).toThrow();
      expect(() => uuidSchema.parse('123')).toThrow();
      expect(() => uuidSchema.parse('')).toThrow();
    });
  });

  describe('lawListQuerySchema', () => {
    it('accepts valid categories', () => {
      expect(lawListQuerySchema.parse({ category: 'constitution' }).category).toBe('constitution');
      expect(lawListQuerySchema.parse({ category: 'criminal' }).category).toBe('criminal');
      expect(lawListQuerySchema.parse({ category: 'labour' }).category).toBe('labour');
    });

    it('rejects invalid categories', () => {
      expect(() => lawListQuerySchema.parse({ category: 'invalid' })).toThrow();
    });

    it('transforms active string to boolean', () => {
      expect(lawListQuerySchema.parse({ active: 'true' }).active).toBe(true);
      expect(lawListQuerySchema.parse({ active: 'false' }).active).toBe(false);
    });

    it('defaults active to true', () => {
      expect(lawListQuerySchema.parse({}).active).toBe(true);
    });

    it('allows omitting category', () => {
      expect(lawListQuerySchema.parse({}).category).toBeUndefined();
    });
  });

  describe('scenarioListQuerySchema', () => {
    it('accepts page and limit', () => {
      const result = scenarioListQuerySchema.parse({ page: '2', limit: '50' });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('coerces string numbers', () => {
      const result = scenarioListQuerySchema.parse({ page: '3' });
      expect(result.page).toBe(3);
    });

    it('defaults page to 1 and limit to 20', () => {
      const result = scenarioListQuerySchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('rejects negative page', () => {
      expect(() => scenarioListQuerySchema.parse({ page: '-1' })).toThrow();
    });

    it('rejects limit over 100', () => {
      expect(() => scenarioListQuerySchema.parse({ limit: '101' })).toThrow();
    });

    it('transforms featured string', () => {
      expect(scenarioListQuerySchema.parse({ featured: 'true' }).featured).toBe(true);
      expect(scenarioListQuerySchema.parse({ featured: 'false' }).featured).toBe(false);
    });
  });

  describe('searchQuerySchema', () => {
    it('requires query q', () => {
      expect(() => searchQuerySchema.parse({})).toThrow();
      expect(() => searchQuerySchema.parse({ q: '' })).toThrow();
    });

    it('accepts valid query', () => {
      const result = searchQuerySchema.parse({ q: 'arrest' });
      expect(result.q).toBe('arrest');
    });

    it('defaults type to all', () => {
      const result = searchQuerySchema.parse({ q: 'test' });
      expect(result.type).toBe('all');
    });

    it('defaults mode to hybrid', () => {
      const result = searchQuerySchema.parse({ q: 'test' });
      expect(result.mode).toBe('hybrid');
    });

    it('accepts valid type values', () => {
      expect(searchQuerySchema.parse({ q: 'test', type: 'law' }).type).toBe('law');
      expect(searchQuerySchema.parse({ q: 'test', type: 'section' }).type).toBe('section');
      expect(searchQuerySchema.parse({ q: 'test', type: 'scenario' }).type).toBe('scenario');
    });

    it('accepts valid mode values', () => {
      expect(searchQuerySchema.parse({ q: 'test', mode: 'keyword' }).mode).toBe('keyword');
      expect(searchQuerySchema.parse({ q: 'test', mode: 'semantic' }).mode).toBe('semantic');
      expect(searchQuerySchema.parse({ q: 'test', mode: 'hybrid' }).mode).toBe('hybrid');
    });

    it('splits lawIds by comma', () => {
      const result = searchQuerySchema.parse({ q: 'test', lawIds: 'law1,law2,law3' });
      expect(result.lawIds).toEqual(['law1', 'law2', 'law3']);
    });

    it('filters empty lawIds', () => {
      const result = searchQuerySchema.parse({ q: 'test', lawIds: 'law1,,law2,' });
      expect(result.lawIds).toEqual(['law1', 'law2']);
    });
  });

  describe('searchSuggestionsQuerySchema', () => {
    it('requires minimum 2 characters', () => {
      expect(() => searchSuggestionsQuerySchema.parse({ q: 'a' })).toThrow();
    });

    it('accepts 2+ characters', () => {
      expect(searchSuggestionsQuerySchema.parse({ q: 'ab' }).q).toBe('ab');
    });

    it('defaults limit to 5', () => {
      expect(searchSuggestionsQuerySchema.parse({ q: 'test' }).limit).toBe(5);
    });

    it('caps limit at 10', () => {
      expect(() => searchSuggestionsQuerySchema.parse({ q: 'test', limit: '15' })).toThrow();
    });
  });

  describe('bookmarkListQuerySchema', () => {
    it('accepts valid content types', () => {
      expect(bookmarkListQuerySchema.parse({ type: 'law' }).type).toBe('law');
      expect(bookmarkListQuerySchema.parse({ type: 'section' }).type).toBe('section');
      expect(bookmarkListQuerySchema.parse({ type: 'scenario' }).type).toBe('scenario');
      expect(bookmarkListQuerySchema.parse({ type: 'all' }).type).toBe('all');
    });

    it('rejects invalid type', () => {
      expect(() => bookmarkListQuerySchema.parse({ type: 'invalid' })).toThrow();
    });
  });

  describe('createBookmarkSchema', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    it('accepts valid bookmark data', () => {
      const result = createBookmarkSchema.parse({
        contentType: 'section',
        contentId: validUuid,
      });
      expect(result.contentType).toBe('section');
      expect(result.contentId).toBe(validUuid);
    });

    it('accepts optional note', () => {
      const result = createBookmarkSchema.parse({
        contentType: 'section',
        contentId: validUuid,
        note: 'My note',
      });
      expect(result.note).toBe('My note');
    });

    it('rejects note over 500 chars', () => {
      expect(() =>
        createBookmarkSchema.parse({
          contentType: 'section',
          contentId: validUuid,
          note: 'a'.repeat(501),
        })
      ).toThrow();
    });

    it('rejects invalid contentType', () => {
      expect(() =>
        createBookmarkSchema.parse({
          contentType: 'invalid',
          contentId: validUuid,
        })
      ).toThrow();
    });

    it('rejects invalid contentId', () => {
      expect(() =>
        createBookmarkSchema.parse({
          contentType: 'section',
          contentId: 'not-a-uuid',
        })
      ).toThrow();
    });
  });

  describe('createFeedbackSchema', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    it('accepts valid feedback', () => {
      const result = createFeedbackSchema.parse({
        explanationId: validUuid,
        rating: 5,
        feedbackType: 'helpful',
      });
      expect(result.rating).toBe(5);
      expect(result.feedbackType).toBe('helpful');
    });

    it('requires explanationId', () => {
      expect(() => createFeedbackSchema.parse({ rating: 5 })).toThrow();
    });

    it('rejects rating outside 1-5', () => {
      expect(() => createFeedbackSchema.parse({ explanationId: validUuid, rating: 0 })).toThrow();
      expect(() => createFeedbackSchema.parse({ explanationId: validUuid, rating: 6 })).toThrow();
    });

    it('accepts valid feedbackType values', () => {
      expect(
        createFeedbackSchema.parse({ explanationId: validUuid, feedbackType: 'incorrect' })
          .feedbackType
      ).toBe('incorrect');
      expect(
        createFeedbackSchema.parse({ explanationId: validUuid, feedbackType: 'unclear' })
          .feedbackType
      ).toBe('unclear');
    });

    it('rejects comment over 1000 chars', () => {
      expect(() =>
        createFeedbackSchema.parse({
          explanationId: validUuid,
          comment: 'a'.repeat(1001),
        })
      ).toThrow();
    });
  });
});

describe('Validation Helpers', () => {
  describe('parseSearchParams()', () => {
    const testSchema = z.object({
      name: z.string().min(1),
      age: z.coerce.number().optional(),
    });

    it('returns success with valid data', () => {
      const params = new URLSearchParams('name=John&age=25');
      const result = parseSearchParams(params, testSchema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John');
        expect(result.data.age).toBe(25);
      }
    });

    it('returns error with invalid data', () => {
      const params = new URLSearchParams('name=&age=25');
      const result = parseSearchParams(params, testSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('handles missing optional fields', () => {
      const params = new URLSearchParams('name=John');
      const result = parseSearchParams(params, testSchema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.age).toBeUndefined();
      }
    });
  });

  describe('formatZodErrors()', () => {
    it('formats single error', () => {
      const schema = z.object({ name: z.string().min(1) });
      const result = schema.safeParse({ name: '' });

      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        expect(formatted.name).toBeDefined();
        expect(formatted.name.length).toBeGreaterThan(0);
      }
    });

    it('formats multiple field errors', () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      });
      const result = schema.safeParse({ name: '', email: 'invalid' });

      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        expect(formatted.name).toBeDefined();
        expect(formatted.email).toBeDefined();
      }
    });

    it('groups multiple errors on same field', () => {
      const schema = z.object({
        password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase'),
      });
      const result = schema.safeParse({ password: 'abc' });

      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        expect(formatted.password.length).toBe(2);
      }
    });

    it('handles nested paths', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(1),
        }),
      });
      const result = schema.safeParse({ user: { name: '' } });

      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        expect(formatted['user.name']).toBeDefined();
      }
    });
  });
});
