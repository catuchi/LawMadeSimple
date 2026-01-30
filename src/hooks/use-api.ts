'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  search,
  getSearchSuggestions,
  getLaws,
  getScenarios,
  getBookmarks,
  createBookmark,
  deleteBookmark,
  getExplanation,
  ApiClientError,
  getUserFriendlyError,
  type TransformedSuggestion,
} from '@/lib/api-client';
import type {
  SearchResult,
  PaginationMeta,
  LawListItem,
  ScenarioListItem,
  BookmarkItem,
  CreateBookmarkInput,
  ExplanationData,
} from '@/types/api';

// ============================================================================
// Generic API State Hook
// ============================================================================

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
}

interface UseApiOptions {
  enabled?: boolean;
}

function useApiState<T>(initialData: T | null = null): ApiState<T> & {
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    isError: error !== null,
    setData,
    setLoading,
    setError,
    reset,
  };
}

// ============================================================================
// Search Hook
// ============================================================================

type SearchMode = 'keyword' | 'semantic' | 'hybrid';

interface UseSearchParams {
  q: string;
  type?: 'all' | 'law' | 'section' | 'scenario';
  mode?: SearchMode;
  page?: number;
  limit?: number;
}

interface UseSearchResult {
  results: SearchResult[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => Promise<void>;
}

export function useSearch(params: UseSearchParams, options: UseApiOptions = {}): UseSearchResult {
  const { enabled = true } = options;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const { isLoading, error, isError, setLoading, setError } = useApiState<SearchResult[]>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async () => {
    if (!params.q.trim()) {
      setResults([]);
      setPagination(null);
      return;
    }

    // Cancel previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await search(
        {
          q: params.q,
          type: params.type,
          mode: params.mode,
          page: params.page,
          limit: params.limit,
        },
        abortControllerRef.current.signal
      );

      setResults(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Ignore abort errors
      }
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [params.q, params.type, params.mode, params.page, params.limit, setLoading, setError]);

  useEffect(() => {
    if (enabled) {
      fetchResults();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enabled, fetchResults]);

  return {
    results,
    pagination,
    isLoading,
    error,
    isError,
    refetch: fetchResults,
  };
}

// ============================================================================
// Search Suggestions Hook (with Debouncing)
// ============================================================================

interface UseSearchSuggestionsResult {
  suggestions: TransformedSuggestion[];
  isLoading: boolean;
  error: string | null;
}

export function useSearchSuggestions(
  query: string,
  options: { debounceMs?: number; enabled?: boolean; limit?: number } = {}
): UseSearchSuggestionsResult {
  const { debounceMs = 300, enabled = true, limit = 5 } = options;
  const [suggestions, setSuggestions] = useState<TransformedSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const results = await getSearchSuggestions(
          { q: query, limit },
          abortControllerRef.current.signal
        );
        setSuggestions(results);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        // Silently fail on suggestions - don't show error to user
        setSuggestions([]);
        setError(getUserFriendlyError(err));
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortControllerRef.current?.abort();
    };
  }, [query, debounceMs, enabled, limit]);

  return { suggestions, isLoading, error };
}

// ============================================================================
// Laws Hook
// ============================================================================

interface UseLawsParams {
  category?: string;
  page?: number;
  limit?: number;
}

interface UseLawsResult {
  laws: LawListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => Promise<void>;
}

export function useLaws(params: UseLawsParams = {}, options: UseApiOptions = {}): UseLawsResult {
  const { enabled = true } = options;
  const [laws, setLaws] = useState<LawListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const { isLoading, error, isError, setLoading, setError } = useApiState<LawListItem[]>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLaws = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getLaws(params, abortControllerRef.current.signal);
      setLaws(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally tracking individual params
  }, [params.category, params.page, params.limit, setLoading, setError]);

  useEffect(() => {
    if (enabled) {
      fetchLaws();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enabled, fetchLaws]);

  return {
    laws,
    pagination,
    isLoading,
    error,
    isError,
    refetch: fetchLaws,
  };
}

// ============================================================================
// Scenarios Hook
// ============================================================================

interface UseScenariosParams {
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

interface UseScenariosResult {
  scenarios: ScenarioListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => Promise<void>;
}

export function useScenarios(
  params: UseScenariosParams = {},
  options: UseApiOptions = {}
): UseScenariosResult {
  const { enabled = true } = options;
  const [scenarios, setScenarios] = useState<ScenarioListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const { isLoading, error, isError, setLoading, setError } = useApiState<ScenarioListItem[]>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchScenarios = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getScenarios(params, abortControllerRef.current.signal);
      setScenarios(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally tracking individual params
  }, [params.category, params.featured, params.page, params.limit, setLoading, setError]);

  useEffect(() => {
    if (enabled) {
      fetchScenarios();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enabled, fetchScenarios]);

  return {
    scenarios,
    pagination,
    isLoading,
    error,
    isError,
    refetch: fetchScenarios,
  };
}

// ============================================================================
// Bookmarks Hook
// ============================================================================

interface UseBookmarksResult {
  bookmarks: BookmarkItem[];
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => Promise<void>;
  addBookmark: (input: CreateBookmarkInput) => Promise<BookmarkItem | null>;
  removeBookmark: (id: string) => Promise<boolean>;
  isAdding: boolean;
  isRemoving: string | null;
}

export function useBookmarks(options: UseApiOptions = {}): UseBookmarksResult {
  const { enabled = true } = options;
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const { isLoading, error, isError, setLoading, setError } = useApiState<BookmarkItem[]>();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBookmarks = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await getBookmarks(abortControllerRef.current.signal);
      setBookmarks(response.data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  useEffect(() => {
    if (enabled) {
      fetchBookmarks();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enabled, fetchBookmarks]);

  const addBookmark = useCallback(
    async (input: CreateBookmarkInput): Promise<BookmarkItem | null> => {
      setIsAdding(true);
      try {
        const bookmark = await createBookmark(input);
        setBookmarks((prev) => [bookmark, ...prev]);
        return bookmark;
      } catch (err) {
        setError(getUserFriendlyError(err));
        return null;
      } finally {
        setIsAdding(false);
      }
    },
    [setError]
  );

  const removeBookmark = useCallback(
    async (id: string): Promise<boolean> => {
      setIsRemoving(id);
      try {
        await deleteBookmark(id);
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        return true;
      } catch (err) {
        setError(getUserFriendlyError(err));
        return false;
      } finally {
        setIsRemoving(null);
      }
    },
    [setError]
  );

  return {
    bookmarks,
    isLoading,
    error,
    isError,
    refetch: fetchBookmarks,
    addBookmark,
    removeBookmark,
    isAdding,
    isRemoving,
  };
}

// ============================================================================
// Explanation Hook
// ============================================================================

interface UseExplanationResult {
  explanation: ExplanationData | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  notFound: boolean;
  refetch: () => Promise<void>;
}

export function useExplanation(
  contentType: 'section' | 'article' | 'scenario',
  contentId: string,
  options: UseApiOptions = {}
): UseExplanationResult {
  const { enabled = true } = options;
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { isLoading, error, isError, setLoading, setError } = useApiState<ExplanationData>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchExplanation = useCallback(async () => {
    if (!contentId) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getExplanation(contentType, contentId, abortControllerRef.current.signal);
      setExplanation(data);
      setNotFound(data === null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (err instanceof ApiClientError && err.isNotFound) {
        setNotFound(true);
        setExplanation(null);
      } else {
        setError(getUserFriendlyError(err));
      }
    } finally {
      setLoading(false);
    }
  }, [contentType, contentId, setLoading, setError]);

  useEffect(() => {
    if (enabled) {
      fetchExplanation();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enabled, fetchExplanation]);

  return {
    explanation,
    isLoading,
    error,
    isError,
    notFound,
    refetch: fetchExplanation,
  };
}

// ============================================================================
// Re-export utilities and types
// ============================================================================

export { ApiClientError, getUserFriendlyError } from '@/lib/api-client';
export type { TransformedSuggestion } from '@/lib/api-client';
