import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LawsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Page Header Skeleton */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Skeleton className="mb-4 h-5 w-20" />
            <Skeleton className="mb-2 h-10 w-80" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
        </section>

        {/* Laws Grid Skeleton */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-6xl space-y-10">
            {/* Category 1 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-5"
                  >
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="mb-1 h-4 w-full" />
                    <Skeleton className="mb-4 h-4 w-2/3" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2 */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-6 w-28" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-5"
                  >
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="mb-1 h-4 w-full" />
                    <Skeleton className="mb-4 h-4 w-2/3" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
