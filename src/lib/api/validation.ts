// API Validation Schemas using Zod

import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

export const uuidSchema = z.string().uuid('Invalid ID format');

// ============================================================================
// Laws API Schemas
// ============================================================================

export const lawListQuerySchema = z.object({
  category: z
    .enum([
      'constitution',
      'criminal',
      'business',
      'labour',
      'property',
      'tax',
      'intellectual_property',
    ])
    .optional(),
  active: z
    .string()
    .transform((val) => val === 'true')
    .optional()
    .default(true),
});

export type LawListQuery = z.infer<typeof lawListQuerySchema>;

// ============================================================================
// Scenarios API Schemas
// ============================================================================

export const scenarioListQuerySchema = z.object({
  category: z
    .enum([
      'constitution',
      'criminal',
      'business',
      'labour',
      'property',
      'tax',
      'intellectual_property',
    ])
    .optional(),
  featured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type ScenarioListQuery = z.infer<typeof scenarioListQuerySchema>;

// ============================================================================
// Search API Schemas
// ============================================================================

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  type: z.enum(['law', 'section', 'scenario', 'all']).optional().default('all'),
  mode: z.enum(['keyword', 'semantic', 'hybrid']).optional().default('hybrid'),
  lawIds: z
    .string()
    .transform((val) => val.split(',').filter(Boolean))
    .optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchMode = 'keyword' | 'semantic' | 'hybrid';

export const searchSuggestionsQuerySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
  limit: z.coerce.number().int().positive().max(10).optional().default(5),
});

export type SearchSuggestionsQuery = z.infer<typeof searchSuggestionsQuerySchema>;

// ============================================================================
// Bookmarks API Schemas
// ============================================================================

export const bookmarkListQuerySchema = z.object({
  type: z.enum(['law', 'section', 'article', 'scenario', 'explanation', 'all']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type BookmarkListQuery = z.infer<typeof bookmarkListQuerySchema>;

export const createBookmarkSchema = z.object({
  contentType: z.enum(['law', 'section', 'article', 'scenario', 'explanation']),
  contentId: uuidSchema,
  note: z.string().max(500).optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;

// ============================================================================
// Feedback API Schemas
// ============================================================================

export const createFeedbackSchema = z.object({
  explanationId: uuidSchema,
  rating: z.number().int().min(1).max(5).optional(),
  feedbackType: z.enum(['helpful', 'incorrect', 'unclear', 'other']).optional(),
  comment: z.string().max(1000).optional(),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

export function parseSearchParams<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  return errors;
}
