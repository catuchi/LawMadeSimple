'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchBar } from '@/components/features/search-bar';
import { LawCard } from '@/components/features/law-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResult, ApiPaginatedResponse, PaginationMeta } from '@/types/api';

type SearchType = 'all' | 'law' | 'section' | 'scenario';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as SearchType) || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchType>(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch results when query, type, or page changes
  useEffect(() => {
    if (!initialQuery) {
      setResults([]);
      setPagination(null);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: initialQuery,
          type,
          page: page.toString(),
          limit: '10',
        });

        const response = await fetch(`/api/v1/search?${params}`);
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('You have reached your daily search limit. Please try again later.');
          }
          throw new Error('Failed to fetch search results');
        }

        const data: ApiPaginatedResponse<SearchResult> = await response.json();
        setResults(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [initialQuery, type, page]);

  // Reset page when type changes
  useEffect(() => {
    setPage(1);
  }, [type]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    // Update URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('q', newQuery);
    window.history.pushState({}, '', url);
  };

  const handleTypeChange = (newType: SearchType) => {
    setType(newType);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('type', newType);
    window.history.pushState({}, '', url);
  };

  const getResultHref = (result: SearchResult) => {
    switch (result.type) {
      case 'law':
        return `/laws/${result.law?.slug}`;
      case 'scenario':
        return `/scenarios/${result.id}`;
      case 'section':
        return `/explain/${result.law?.slug}/${result.id}`;
      default:
        return '#';
    }
  };

  const typeFilters: { value: SearchType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'section', label: 'Sections' },
    { value: 'scenario', label: 'Scenarios' },
    { value: 'law', label: 'Laws' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Search Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8">
          <div className="mx-auto max-w-4xl">
            <SearchBar defaultValue={query} onSearch={handleSearch} size="default" autoFocus />
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-[var(--background-secondary)] px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-4xl">
            {initialQuery ? (
              <>
                {/* Results Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {isLoading ? (
                      <Skeleton className="h-6 w-48" />
                    ) : pagination ? (
                      <p className="text-[var(--color-neutral-700)]">
                        <span className="font-medium">{pagination.total}</span> result
                        {pagination.total !== 1 ? 's' : ''} for &quot;
                        <span className="font-medium">{initialQuery}</span>&quot;
                      </p>
                    ) : error ? null : (
                      <p className="text-[var(--color-neutral-700)]">
                        No results for &quot;<span className="font-medium">{initialQuery}</span>
                        &quot;
                      </p>
                    )}
                  </div>

                  {/* Type Filters */}
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => handleTypeChange(filter.value)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                          type === filter.value
                            ? 'bg-[var(--color-primary-500)] text-white'
                            : 'bg-white text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]'
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className="mb-6 flex items-start gap-3 rounded-lg border border-[var(--color-error)] bg-[var(--color-error-light)] p-4">
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-[var(--color-error)]" />
                    <div>
                      <p className="font-medium text-[var(--color-error-dark)]">Search Error</p>
                      <p className="text-sm text-[var(--color-neutral-700)]">{error}</p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-5"
                      >
                        <Skeleton className="mb-3 h-5 w-24" />
                        <Skeleton className="mb-2 h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-4 h-4 w-40" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Results List */}
                {!isLoading && !error && results.length > 0 && (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <LawCard
                        key={`${result.type}-${result.id}`}
                        title={result.title}
                        preview={result.excerpt.replace(/\*\*/g, '')} // Remove markdown bold
                        lawName={result.law?.shortTitle || 'Scenario'}
                        href={getResultHref(result)}
                        badges={[
                          {
                            label: result.type.charAt(0).toUpperCase() + result.type.slice(1),
                            variant:
                              result.type === 'scenario'
                                ? 'accent'
                                : result.type === 'law'
                                  ? 'primary'
                                  : 'default',
                          },
                        ]}
                      />
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && results.length === 0 && (
                  <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
                      <Search className="size-8 text-[var(--color-neutral-400)]" />
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                      No results found
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                      We couldn&apos;t find any laws matching &quot;{initialQuery}&quot;. Try
                      different keywords or browse our scenarios.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Link
                        href="/scenarios"
                        className="rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
                      >
                        Browse Scenarios
                      </Link>
                      <Link
                        href="/laws"
                        className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
                      >
                        Browse Laws
                      </Link>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {!isLoading && pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 text-sm text-[var(--color-neutral-600)]">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Query State */
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  <Search className="size-8 text-[var(--color-primary-500)]" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Search Nigerian Laws
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  Describe your legal situation in your own words and we&apos;ll find the relevant
                  laws for you.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Badge>Try: &quot;tenant rights&quot;</Badge>
                  <Badge>Try: &quot;police arrest&quot;</Badge>
                  <Badge>Try: &quot;employment termination&quot;</Badge>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[var(--color-primary-500)] border-t-transparent" />
          </main>
          <Footer />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
