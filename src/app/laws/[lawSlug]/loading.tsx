import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LawDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Page Header Skeleton */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-4xl">
            {/* Back link and Breadcrumb */}
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="hidden h-5 w-48 sm:block" />
            </div>

            {/* Law Title */}
            <div className="flex items-start gap-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-8 w-3/4" />
                <Skeleton className="h-5 w-full max-w-lg" />
              </div>
            </div>

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </section>

        {/* Disclaimer Skeleton */}
        <section className="border-b border-[var(--color-neutral-200)] bg-[var(--color-warning-light)] px-4 py-3">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="h-5 w-72" />
          </div>
        </section>

        {/* Sections List Skeleton */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="mb-6 h-6 w-40" />

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-neutral-200)] bg-white p-4"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-baseline gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="mt-2 h-4 w-3/4" />
                  </div>
                  <Skeleton className="size-5" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Actions Skeleton */}
        <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
