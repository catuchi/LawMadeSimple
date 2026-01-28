// API Response Types for LawMadeSimple
// Based on docs/pre-dev/18-api-specifications.md

// ============================================================================
// Error Codes
// ============================================================================

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// ============================================================================
// Response Meta
// ============================================================================

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================================================
// API Responses
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ResponseMeta;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: ResponseMeta;
  pagination: PaginationMeta;
}

export interface ApiErrorDetail {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
  meta: ResponseMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Content Types (for bookmarks, explanations, etc.)
// ============================================================================

export type ApiContentType = 'law' | 'section' | 'article' | 'scenario' | 'explanation';

// ============================================================================
// Law API Types
// ============================================================================

export interface LawListItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string | null;
  category: string;
  sectionCount: number;
  isActive: boolean;
}

export interface LawDetail extends Omit<LawListItem, 'sectionCount'> {
  effectiveDate: string | null;
  sourceUrl: string | null;
  sections: SectionListItem[];
}

export interface SectionListItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string | null;
  hasSubsections: boolean;
}

export interface SectionDetail {
  id: string;
  slug: string;
  number: string;
  title: string;
  content: string;
  summary: string | null;
  law: {
    slug: string;
    shortTitle: string;
  };
  articles: ArticleItem[];
  subSections: SectionListItem[];
  relatedScenarios: RelatedScenario[];
}

export interface ArticleItem {
  id: string;
  slug: string;
  number: string;
  content: string;
}

export interface RelatedScenario {
  id: string;
  slug: string;
  title: string;
}

// ============================================================================
// Scenario API Types
// ============================================================================

export interface ScenarioListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  isFeatured: boolean;
  relatedLaws: string[];
}

export interface ScenarioDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  relatedSections: RelatedSectionItem[];
}

export interface RelatedSectionItem {
  id: string;
  lawSlug: string;
  sectionSlug: string;
  title: string;
  relevanceNote: string | null;
}

// ============================================================================
// Search API Types
// ============================================================================

export interface SearchResult {
  type: 'law' | 'section' | 'scenario';
  id: string;
  title: string;
  excerpt: string;
  law?: {
    slug: string;
    shortTitle: string;
  };
  relevanceScore: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
}

export interface SearchSuggestion {
  suggestions: string[];
  scenarios: RelatedScenario[];
}

// ============================================================================
// Bookmark API Types
// ============================================================================

export interface BookmarkItem {
  id: string;
  contentType: ApiContentType;
  contentId: string;
  note: string | null;
  createdAt: string;
  content: {
    title: string;
    law?: {
      slug: string;
      shortTitle: string;
    };
  };
}

export interface CreateBookmarkInput {
  contentType: ApiContentType;
  contentId: string;
  note?: string;
}

// ============================================================================
// Feedback API Types
// ============================================================================

export interface CreateFeedbackInput {
  explanationId: string;
  rating?: number;
  feedbackType?: 'helpful' | 'incorrect' | 'unclear' | 'other';
  comment?: string;
}

export interface FeedbackResponse {
  id: string;
  message: string;
}

// ============================================================================
// Explanation API Types
// ============================================================================

export type ExplanationContentType = 'section' | 'article' | 'scenario';

export interface ExplanationExample {
  title: string;
  scenario: string;
  application: string;
}

export interface ExplanationSource {
  law: string;
  section: string;
  title: string;
}

export interface ExplanationData {
  id: string;
  contentType: ExplanationContentType;
  contentId: string;
  explanation: string;
  examples: ExplanationExample[];
  source: ExplanationSource;
  disclaimer: string;
  cached: boolean;
  generatedAt: string;
}

export interface GenerateExplanationInput {
  contentType: ExplanationContentType;
  contentId: string;
  forceRegenerate?: boolean;
}

// SSE Event types for streaming
export interface StreamStartEvent {
  type: 'start';
  id: string;
}

export interface StreamChunkEvent {
  type: 'chunk';
  content: string;
}

export interface StreamDoneEvent {
  type: 'done';
  explanation: ExplanationData;
}

export interface StreamErrorEvent {
  type: 'error';
  code: string;
  message: string;
}

export type StreamEvent = StreamStartEvent | StreamChunkEvent | StreamDoneEvent | StreamErrorEvent;
