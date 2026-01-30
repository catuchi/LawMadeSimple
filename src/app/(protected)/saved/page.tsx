'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import type { BookmarkItem, ApiPaginatedResponse } from '@/types/api';

export default function SavedItemsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/bookmarks?page=${page}&limit=10`);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        throw new Error('Failed to fetch bookmarks');
      }

      const json: ApiPaginatedResponse<BookmarkItem> = await response.json();
      setBookmarks(json.data);
      setTotalPages(json.pagination.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load saved items';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [user, page]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [user, isAuthLoading, fetchBookmarks]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Delete bookmark
  const handleDelete = async (bookmarkId: string) => {
    setDeletingId(bookmarkId);

    try {
      const response = await fetch(`/api/v1/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }

      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      toast.success('Removed from saved items');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setDeletingId(null);
    }
  };

  // Get href for a bookmark
  const getBookmarkHref = (bookmark: BookmarkItem): string => {
    switch (bookmark.contentType) {
      case 'section':
        return bookmark.content.law
          ? `/explain/${bookmark.content.law.slug}/${bookmark.contentId}`
          : '#';
      case 'law':
        return bookmark.content.law ? `/laws/${bookmark.content.law.slug}` : '#';
      case 'scenario':
        return `/scenarios/${bookmark.contentId}`;
      default:
        return '#';
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show sign in prompt for unauthenticated users
  if (!isAuthLoading && !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
              <Bookmark className="size-8 text-[var(--color-primary-500)]" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[var(--color-neutral-800)]">
              Sign in to view saved items
            </h1>
            <p className="mt-2 max-w-md text-[var(--color-neutral-600)]">
              Create an account or sign in to save laws and explanations for quick access later.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-4xl">
            <Breadcrumb items={[{ label: 'Saved Items' }]} className="mb-4" />

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                <Bookmark className="size-5 text-[var(--color-primary-500)]" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-[var(--color-neutral-800)] md:text-3xl">
                  Saved Items
                </h1>
                <p className="text-sm text-[var(--color-neutral-600)]">
                  Your bookmarked laws and explanations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            {isLoading || isAuthLoading ? (
              /* Loading State */
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-5"
                  >
                    <Skeleton className="mb-3 h-5 w-24" />
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="mt-4 h-4 w-40" />
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <ErrorState
                message={error}
                variant={error.includes('Too many') ? 'rate-limited' : 'default'}
                onRetry={handleRetry}
                isRetrying={isRetrying}
              />
            ) : bookmarks.length === 0 ? (
              /* Empty State */
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
                  <Bookmark className="size-8 text-[var(--color-neutral-400)]" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  No saved items yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  Bookmark explanations to access them easily later. Look for the bookmark icon on
                  any explanation page.
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
            ) : (
              /* Bookmarks List */
              <>
                <div className="space-y-4">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="group rounded-xl border border-[var(--color-neutral-200)] bg-white p-5 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Content Type Badge */}
                          <span className="mb-2 inline-block rounded-full bg-[var(--color-primary-50)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary-700)]">
                            {bookmark.contentType.charAt(0).toUpperCase() +
                              bookmark.contentType.slice(1)}
                          </span>

                          {/* Title Link */}
                          <Link href={getBookmarkHref(bookmark)} className="block">
                            <h3 className="font-heading group-hover:text-primary text-lg font-semibold text-[var(--color-neutral-800)]">
                              {bookmark.content.title}
                            </h3>
                          </Link>

                          {/* Note */}
                          {bookmark.note && (
                            <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
                              {bookmark.note}
                            </p>
                          )}

                          {/* Meta */}
                          <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-neutral-500)]">
                            {bookmark.content.law && (
                              <>
                                <span>{bookmark.content.law.shortTitle}</span>
                                <span aria-hidden="true">•</span>
                              </>
                            )}
                            <time>Saved {formatDate(bookmark.createdAt)}</time>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bookmark.id)}
                          disabled={deletingId === bookmark.id}
                          className="shrink-0 text-[var(--color-neutral-400)] hover:text-[var(--color-error)]"
                          aria-label="Remove from saved"
                        >
                          {deletingId === bookmark.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 text-sm text-[var(--color-neutral-600)]">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
