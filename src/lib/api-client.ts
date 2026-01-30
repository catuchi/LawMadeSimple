// Client-side API wrapper with typed responses and error handling
// Use this for all frontend API calls instead of raw fetch()

import type {
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiErrorResponse,
  ErrorCode,
  PaginationMeta,
  LawListItem,
  LawDetail,
  SectionDetail,
  ScenarioListItem,
  ScenarioDetail,
  SearchResult,
  SearchSuggestion,
  BookmarkItem,
  CreateBookmarkInput,
  CreateFeedbackInput,
  FeedbackResponse,
  ExplanationData,
  GenerateExplanationInput,
  RelatedScenario,
} from '@/types/api';

// ============================================================================
// Error Handling
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }

  get isRateLimited(): boolean {
    return this.code === 'RATE_LIMITED';
  }

  get isUnauthorized(): boolean {
    return this.code === 'UNAUTHORIZED';
  }

  get isNotFound(): boolean {
    return this.code === 'NOT_FOUND';
  }

  get isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }
}

// ============================================================================
// Base Fetch Wrapper
// ============================================================================

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);

  // Handle non-JSON responses (e.g., 204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  // Check if response indicates an error
  if (!response.ok || data.success === false) {
    const errorData = data as ApiErrorResponse;
    throw new ApiClientError(
      errorData.error?.code ?? 'INTERNAL_ERROR',
      errorData.error?.message ?? 'An unexpected error occurred',
      response.status,
      errorData.error?.details
    );
  }

  return data;
}

// ============================================================================
// Type-safe API Methods
// ============================================================================

// --- Laws ---

interface GetLawsParams {
  category?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export async function getLaws(
  params: GetLawsParams = {},
  signal?: AbortSignal
): Promise<{ data: LawListItem[]; pagination: PaginationMeta }> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('category', params.category);
  if (params.active !== undefined) searchParams.set('active', String(params.active));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const url = `/api/v1/laws${query ? `?${query}` : ''}`;

  const response = await request<ApiPaginatedResponse<LawListItem>>(url, { signal });
  return { data: response.data, pagination: response.pagination };
}

export async function getLaw(lawSlug: string, signal?: AbortSignal): Promise<LawDetail> {
  const response = await request<ApiSuccessResponse<LawDetail>>(
    `/api/v1/laws/${encodeURIComponent(lawSlug)}`,
    { signal }
  );
  return response.data;
}

export async function getSection(
  lawSlug: string,
  sectionSlug: string,
  signal?: AbortSignal
): Promise<SectionDetail> {
  const response = await request<ApiSuccessResponse<SectionDetail>>(
    `/api/v1/laws/${encodeURIComponent(lawSlug)}/sections/${encodeURIComponent(sectionSlug)}`,
    { signal }
  );
  return response.data;
}

// --- Scenarios ---

interface GetScenariosParams {
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export async function getScenarios(
  params: GetScenariosParams = {},
  signal?: AbortSignal
): Promise<{ data: ScenarioListItem[]; pagination: PaginationMeta }> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('category', params.category);
  if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const url = `/api/v1/scenarios${query ? `?${query}` : ''}`;

  const response = await request<ApiPaginatedResponse<ScenarioListItem>>(url, { signal });
  return { data: response.data, pagination: response.pagination };
}

export async function getScenario(slug: string, signal?: AbortSignal): Promise<ScenarioDetail> {
  const response = await request<ApiSuccessResponse<ScenarioDetail>>(
    `/api/v1/scenarios/${encodeURIComponent(slug)}`,
    { signal }
  );
  return response.data;
}

// --- Search ---

export type SearchMode = 'keyword' | 'semantic' | 'hybrid';

interface SearchParams {
  q: string;
  type?: 'all' | 'law' | 'section' | 'scenario';
  mode?: SearchMode;
  lawIds?: string[];
  page?: number;
  limit?: number;
}

export async function search(
  params: SearchParams,
  signal?: AbortSignal
): Promise<{ data: SearchResult[]; pagination: PaginationMeta }> {
  const searchParams = new URLSearchParams();
  searchParams.set('q', params.q);
  if (params.type) searchParams.set('type', params.type);
  if (params.mode) searchParams.set('mode', params.mode);
  if (params.lawIds?.length) searchParams.set('lawIds', params.lawIds.join(','));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/search?${searchParams.toString()}`;
  const response = await request<ApiPaginatedResponse<SearchResult>>(url, { signal });
  return { data: response.data, pagination: response.pagination };
}

export interface TransformedSuggestion {
  id: string;
  title: string;
  type: 'recent' | 'scenario';
  category?: string;
  slug?: string;
}

interface GetSuggestionsParams {
  q: string;
  limit?: number;
}

export async function getSearchSuggestions(
  params: GetSuggestionsParams,
  signal?: AbortSignal
): Promise<TransformedSuggestion[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('q', params.q);
  if (params.limit) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/search/suggestions?${searchParams.toString()}`;
  const response = await request<ApiSuccessResponse<SearchSuggestion>>(url, { signal });

  // Transform API response to component-expected format
  const suggestions: TransformedSuggestion[] = [];

  // Add text suggestions as "recent" type
  response.data.suggestions.forEach((text, index) => {
    suggestions.push({
      id: `suggestion-${index}`,
      title: text,
      type: 'recent',
    });
  });

  // Add scenarios with their category
  response.data.scenarios.forEach((scenario: RelatedScenario) => {
    // Avoid duplicates
    if (!suggestions.some((s) => s.title === scenario.title)) {
      suggestions.push({
        id: scenario.id,
        title: scenario.title,
        type: 'scenario',
        slug: scenario.slug,
      });
    }
  });

  return suggestions;
}

// --- Bookmarks ---

export async function getBookmarks(
  signal?: AbortSignal
): Promise<{ data: BookmarkItem[]; pagination: PaginationMeta }> {
  const response = await request<ApiPaginatedResponse<BookmarkItem>>('/api/v1/bookmarks', {
    signal,
  });
  return { data: response.data, pagination: response.pagination };
}

export async function createBookmark(
  input: CreateBookmarkInput,
  signal?: AbortSignal
): Promise<BookmarkItem> {
  const response = await request<ApiSuccessResponse<BookmarkItem>>('/api/v1/bookmarks', {
    method: 'POST',
    body: input,
    signal,
  });
  return response.data;
}

export async function deleteBookmark(id: string, signal?: AbortSignal): Promise<void> {
  await request<void>(`/api/v1/bookmarks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    signal,
  });
}

// --- Feedback ---

export async function submitFeedback(
  input: CreateFeedbackInput,
  signal?: AbortSignal
): Promise<FeedbackResponse> {
  const response = await request<ApiSuccessResponse<FeedbackResponse>>('/api/v1/feedback', {
    method: 'POST',
    body: input,
    signal,
  });
  return response.data;
}

// --- Explanations ---

export async function getExplanation(
  contentType: 'section' | 'article' | 'scenario',
  contentId: string,
  signal?: AbortSignal
): Promise<ExplanationData | null> {
  try {
    const response = await request<ApiSuccessResponse<ExplanationData>>(
      `/api/v1/explanations/${contentType}/${encodeURIComponent(contentId)}`,
      { signal }
    );
    return response.data;
  } catch (error) {
    // Return null if explanation not found (expected case)
    if (error instanceof ApiClientError && error.isNotFound) {
      return null;
    }
    throw error;
  }
}

// Streaming explanation - returns an async generator
export async function* streamExplanation(
  input: GenerateExplanationInput,
  signal?: AbortSignal
): AsyncGenerator<
  { type: 'chunk'; content: string } | { type: 'done'; explanation: ExplanationData }
> {
  const response = await fetch('/api/v1/explanations/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;
    throw new ApiClientError(
      errorData.error?.code ?? 'INTERNAL_ERROR',
      errorData.error?.message ?? 'Failed to generate explanation',
      response.status,
      errorData.error?.details
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiClientError('INTERNAL_ERROR', 'No response body', 500);
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const event = JSON.parse(data);
            if (event.type === 'chunk') {
              yield { type: 'chunk', content: event.content };
            } else if (event.type === 'done') {
              yield { type: 'done', explanation: event.explanation };
            } else if (event.type === 'error') {
              throw new ApiClientError(
                event.code ?? 'INTERNAL_ERROR',
                event.message ?? 'Stream error',
                500
              );
            }
          } catch (e) {
            if (e instanceof ApiClientError) throw e;
            // Skip malformed JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================================================
// Export Error Utilities
// ============================================================================

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function getUserFriendlyError(error: unknown): string {
  if (error instanceof ApiClientError) {
    switch (error.code) {
      case 'RATE_LIMITED':
        return "You've made too many requests. Please wait a moment and try again.";
      case 'UNAUTHORIZED':
        return 'Please sign in to continue.';
      case 'FORBIDDEN':
        return "You don't have permission to access this resource.";
      case 'NOT_FOUND':
        return 'The requested content could not be found.';
      case 'AI_UNAVAILABLE':
        return 'Our AI service is temporarily unavailable. Please try again later.';
      case 'VALIDATION_ERROR':
        return error.message;
      default:
        return 'Something went wrong. Please try again.';
    }
  }
  return 'Something went wrong. Please try again.';
}
