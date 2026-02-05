import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSearchSuggestions } from '@/hooks/use-api';

// Mock the API client
vi.mock('@/lib/api-client', () => ({
  getSearchSuggestions: vi.fn(),
  getUserFriendlyError: vi.fn((err) => err?.message || 'Error'),
}));

import { getSearchSuggestions } from '@/lib/api-client';

const mockGetSearchSuggestions = getSearchSuggestions as ReturnType<typeof vi.fn>;

describe('useSearchSuggestions - Debouncing Behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockGetSearchSuggestions.mockReset();
    mockGetSearchSuggestions.mockResolvedValue([
      { id: '1', title: 'Test Result', type: 'scenario', slug: 'test' },
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not call API immediately when query changes', () => {
    renderHook(() => useSearchSuggestions('test query', { enabled: true }));

    // API should not be called yet (debounce hasn't elapsed)
    expect(mockGetSearchSuggestions).not.toHaveBeenCalled();
  });

  it('calls API after debounce delay (default 300ms)', async () => {
    const { result } = renderHook(() =>
      useSearchSuggestions('test query', { enabled: true, debounceMs: 300 })
    );

    // Initially loading should be false
    expect(result.current.isLoading).toBe(false);

    // Advance time by 300ms
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // API should now be called
    expect(mockGetSearchSuggestions).toHaveBeenCalledTimes(1);
    expect(mockGetSearchSuggestions).toHaveBeenCalledWith(
      { q: 'test query', limit: 5 },
      expect.any(AbortSignal)
    );
  });

  it('does not call API before debounce completes', async () => {
    renderHook(() => useSearchSuggestions('test query', { enabled: true, debounceMs: 300 }));

    // Advance only 200ms (less than debounce)
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // API should NOT be called yet
    expect(mockGetSearchSuggestions).not.toHaveBeenCalled();
  });

  it('cancels previous timer when query changes rapidly', async () => {
    const { rerender } = renderHook(({ query }) => useSearchSuggestions(query, { enabled: true }), {
      initialProps: { query: 'a' },
    });

    // Type 'ab' after 100ms
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    rerender({ query: 'ab' });

    // Type 'abc' after another 100ms
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    rerender({ query: 'abc' });

    // At this point, 200ms have passed but no API call yet
    expect(mockGetSearchSuggestions).not.toHaveBeenCalled();

    // Advance 300ms more (total 500ms from last change)
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Only ONE call with final query
    expect(mockGetSearchSuggestions).toHaveBeenCalledTimes(1);
    expect(mockGetSearchSuggestions).toHaveBeenCalledWith(
      { q: 'abc', limit: 5 },
      expect.any(AbortSignal)
    );
  });

  it('does not call API when query is too short (< 2 chars)', async () => {
    renderHook(() => useSearchSuggestions('a', { enabled: true }));

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockGetSearchSuggestions).not.toHaveBeenCalled();
  });

  it('does not call API when disabled', async () => {
    renderHook(() => useSearchSuggestions('test query', { enabled: false }));

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockGetSearchSuggestions).not.toHaveBeenCalled();
  });

  it('respects custom debounceMs option', async () => {
    renderHook(() => useSearchSuggestions('test', { enabled: true, debounceMs: 500 }));

    // After 300ms (default), should not call
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(mockGetSearchSuggestions).not.toHaveBeenCalled();

    // After 500ms total, should call
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(mockGetSearchSuggestions).toHaveBeenCalledTimes(1);
  });

  it('returns suggestions after successful API call', async () => {
    const mockSuggestions = [
      { id: '1', title: 'Tenant Rights', type: 'scenario' as const, slug: 'tenant-rights' },
      { id: '2', title: 'Rental Agreement', type: 'keyword' as const },
    ];
    mockGetSearchSuggestions.mockResolvedValue(mockSuggestions);

    const { result } = renderHook(() =>
      useSearchSuggestions('tenant', { enabled: true, debounceMs: 300 })
    );

    // Advance timers and flush all promises
    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.suggestions).toEqual(mockSuggestions);
  });

  it('clears suggestions when query is cleared', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useSearchSuggestions(query, { enabled: true }),
      { initialProps: { query: 'test' } }
    );

    // Let the first query complete
    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.suggestions.length).toBeGreaterThan(0);

    // Clear the query
    rerender({ query: '' });

    // Suggestions should be cleared immediately (no debounce for clearing)
    expect(result.current.suggestions).toEqual([]);
  });
});
