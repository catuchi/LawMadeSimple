import { describe, it, expect } from 'vitest';
import {
  success,
  created,
  paginated,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  rateLimited,
  internalError,
  aiUnavailable,
  calculatePagination,
  parsePaginationParams,
} from '@/lib/api/response';

describe('API Response Utilities', () => {
  describe('Success Responses', () => {
    describe('success()', () => {
      it('returns 200 status', async () => {
        const response = success({ id: 1 });
        expect(response.status).toBe(200);
      });

      it('returns success: true', async () => {
        const response = success({ id: 1 });
        const data = await response.json();
        expect(data.success).toBe(true);
      });

      it('includes data in response', async () => {
        const testData = { name: 'Test', value: 123 };
        const response = success(testData);
        const data = await response.json();
        expect(data.data).toEqual(testData);
      });

      it('includes meta with timestamp', async () => {
        const response = success({});
        const data = await response.json();
        expect(data.meta.timestamp).toBeDefined();
        expect(new Date(data.meta.timestamp).toString()).not.toBe('Invalid Date');
      });

      it('includes meta with requestId', async () => {
        const response = success({});
        const data = await response.json();
        expect(data.meta.requestId).toBeDefined();
        expect(typeof data.meta.requestId).toBe('string');
      });

      it('uses provided requestId', async () => {
        const customId = 'custom-request-id';
        const response = success({}, customId);
        const data = await response.json();
        expect(data.meta.requestId).toBe(customId);
      });
    });

    describe('created()', () => {
      it('returns 201 status', async () => {
        const response = created({ id: 'new-item' });
        expect(response.status).toBe(201);
      });

      it('returns success: true with data', async () => {
        const testData = { id: 'new-item', name: 'New' };
        const response = created(testData);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data).toEqual(testData);
      });
    });

    describe('paginated()', () => {
      it('returns 200 status', async () => {
        const response = paginated([], {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasMore: false,
        });
        expect(response.status).toBe(200);
      });

      it('includes pagination meta', async () => {
        const pagination = { page: 2, limit: 10, total: 25, totalPages: 3, hasMore: true };
        const response = paginated([1, 2, 3], pagination);
        const data = await response.json();

        expect(data.pagination).toEqual(pagination);
      });

      it('includes data array', async () => {
        const items = [{ id: 1 }, { id: 2 }];
        const response = paginated(items, {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasMore: false,
        });
        const data = await response.json();

        expect(data.data).toEqual(items);
      });

      it('includes extra data when provided', async () => {
        const extra = { searchMode: 'hybrid', count: 5 };
        const response = paginated(
          [],
          { page: 1, limit: 10, total: 0, totalPages: 0, hasMore: false },
          extra
        );
        const data = await response.json();

        expect(data.extra).toEqual(extra);
      });

      it('omits extra when empty object', async () => {
        const response = paginated(
          [],
          { page: 1, limit: 10, total: 0, totalPages: 0, hasMore: false },
          {}
        );
        const data = await response.json();

        expect(data.extra).toBeUndefined();
      });
    });

    describe('noContent()', () => {
      it('returns 204 status', () => {
        const response = noContent();
        expect(response.status).toBe(204);
      });

      it('returns null body', () => {
        const response = noContent();
        expect(response.body).toBeNull();
      });
    });
  });

  describe('Error Responses', () => {
    describe('badRequest()', () => {
      it('returns 400 status', async () => {
        const response = badRequest('Invalid input');
        expect(response.status).toBe(400);
      });

      it('returns success: false', async () => {
        const response = badRequest('Invalid input');
        const data = await response.json();
        expect(data.success).toBe(false);
      });

      it('returns VALIDATION_ERROR code', async () => {
        const response = badRequest('Invalid input');
        const data = await response.json();
        expect(data.error.code).toBe('VALIDATION_ERROR');
      });

      it('includes custom message', async () => {
        const message = 'Email is required';
        const response = badRequest(message);
        const data = await response.json();
        expect(data.error.message).toBe(message);
      });

      it('includes details when provided', async () => {
        const details = { field: 'email', reason: 'required' };
        const response = badRequest('Validation failed', details);
        const data = await response.json();
        expect(data.error.details).toEqual(details);
      });
    });

    describe('unauthorized()', () => {
      it('returns 401 status', async () => {
        const response = unauthorized();
        expect(response.status).toBe(401);
      });

      it('returns UNAUTHORIZED code', async () => {
        const response = unauthorized();
        const data = await response.json();
        expect(data.error.code).toBe('UNAUTHORIZED');
      });

      it('uses default message', async () => {
        const response = unauthorized();
        const data = await response.json();
        expect(data.error.message).toBe('Authentication required');
      });

      it('uses custom message when provided', async () => {
        const response = unauthorized('Session expired');
        const data = await response.json();
        expect(data.error.message).toBe('Session expired');
      });
    });

    describe('forbidden()', () => {
      it('returns 403 status', async () => {
        const response = forbidden();
        expect(response.status).toBe(403);
      });

      it('returns FORBIDDEN code', async () => {
        const response = forbidden();
        const data = await response.json();
        expect(data.error.code).toBe('FORBIDDEN');
      });
    });

    describe('notFound()', () => {
      it('returns 404 status', async () => {
        const response = notFound('user');
        expect(response.status).toBe(404);
      });

      it('returns NOT_FOUND code', async () => {
        const response = notFound('user');
        const data = await response.json();
        expect(data.error.code).toBe('NOT_FOUND');
      });

      it('includes resource in message', async () => {
        const response = notFound('scenario');
        const data = await response.json();
        expect(data.error.message).toContain('scenario');
      });

      it('includes details when provided', async () => {
        const response = notFound('law', { slug: 'test-law' });
        const data = await response.json();
        expect(data.error.details).toEqual({ slug: 'test-law' });
      });
    });

    describe('conflict()', () => {
      it('returns 409 status', async () => {
        const response = conflict('Already exists');
        expect(response.status).toBe(409);
      });

      it('returns CONFLICT code', async () => {
        const response = conflict('Already exists');
        const data = await response.json();
        expect(data.error.code).toBe('CONFLICT');
      });
    });

    describe('rateLimited()', () => {
      it('returns 429 status', async () => {
        const response = rateLimited();
        expect(response.status).toBe(429);
      });

      it('returns RATE_LIMITED code', async () => {
        const response = rateLimited();
        const data = await response.json();
        expect(data.error.code).toBe('RATE_LIMITED');
      });
    });

    describe('internalError()', () => {
      it('returns 500 status', async () => {
        const response = internalError();
        expect(response.status).toBe(500);
      });

      it('returns INTERNAL_ERROR code', async () => {
        const response = internalError();
        const data = await response.json();
        expect(data.error.code).toBe('INTERNAL_ERROR');
      });
    });

    describe('aiUnavailable()', () => {
      it('returns 503 status', async () => {
        const response = aiUnavailable();
        expect(response.status).toBe(503);
      });

      it('returns AI_UNAVAILABLE code', async () => {
        const response = aiUnavailable();
        const data = await response.json();
        expect(data.error.code).toBe('AI_UNAVAILABLE');
      });
    });
  });

  describe('Pagination Helpers', () => {
    describe('calculatePagination()', () => {
      it('calculates totalPages correctly', () => {
        expect(calculatePagination(1, 10, 25).totalPages).toBe(3);
        expect(calculatePagination(1, 10, 30).totalPages).toBe(3);
        expect(calculatePagination(1, 10, 31).totalPages).toBe(4);
      });

      it('sets hasMore correctly', () => {
        expect(calculatePagination(1, 10, 25).hasMore).toBe(true);
        expect(calculatePagination(2, 10, 25).hasMore).toBe(true);
        expect(calculatePagination(3, 10, 25).hasMore).toBe(false);
      });

      it('handles empty results', () => {
        const result = calculatePagination(1, 10, 0);
        expect(result.total).toBe(0);
        expect(result.totalPages).toBe(0);
        expect(result.hasMore).toBe(false);
      });

      it('returns all provided values', () => {
        const result = calculatePagination(2, 20, 100);
        expect(result.page).toBe(2);
        expect(result.limit).toBe(20);
        expect(result.total).toBe(100);
      });
    });

    describe('parsePaginationParams()', () => {
      it('uses default values when params missing', () => {
        const params = new URLSearchParams();
        const result = parsePaginationParams(params);

        expect(result.page).toBe(1);
        expect(result.limit).toBe(20);
        expect(result.skip).toBe(0);
      });

      it('parses page and limit from params', () => {
        const params = new URLSearchParams('page=3&limit=50');
        const result = parsePaginationParams(params);

        expect(result.page).toBe(3);
        expect(result.limit).toBe(50);
        expect(result.skip).toBe(100); // (3-1) * 50
      });

      it('enforces minimum page of 1', () => {
        const params = new URLSearchParams('page=-5');
        const result = parsePaginationParams(params);

        expect(result.page).toBe(1);
      });

      it('enforces maximum limit', () => {
        const params = new URLSearchParams('limit=500');
        const result = parsePaginationParams(params);

        expect(result.limit).toBe(100); // default maxLimit
      });

      it('uses custom defaults', () => {
        const params = new URLSearchParams();
        const result = parsePaginationParams(params, { page: 1, limit: 50, maxLimit: 200 });

        expect(result.limit).toBe(50);
      });

      it('calculates skip correctly', () => {
        const params = new URLSearchParams('page=5&limit=25');
        const result = parsePaginationParams(params);

        expect(result.skip).toBe(100); // (5-1) * 25
      });
    });
  });
});
