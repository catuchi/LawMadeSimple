import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ScenarioCard } from '@/components/features/scenario-card';
import { prisma } from '@/lib/db';
import { LawCategory } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Legal Scenarios | LawMadeSimple',
  description:
    'Browse common legal scenarios in Nigeria. Find explanations for landlord-tenant issues, employment rights, business registration, and more.',
};

// Category display names and icons
const categoryInfo: Record<LawCategory, { label: string; emoji: string }> = {
  constitution: { label: 'Constitutional Rights', emoji: '📜' },
  criminal: { label: 'Criminal Law', emoji: '👮' },
  business: { label: 'Business', emoji: '🏢' },
  labour: { label: 'Employment', emoji: '💼' },
  property: { label: 'Property & Tenancy', emoji: '🏠' },
  tax: { label: 'Tax', emoji: '💰' },
  intellectual_property: { label: 'Intellectual Property', emoji: '©️' },
};

// All categories in display order
const allCategories = [
  'property',
  'criminal',
  'labour',
  'constitution',
  'business',
  'tax',
  'intellectual_property',
] as LawCategory[];

// Fetch scenarios with optional category filter
async function getScenarios(category?: LawCategory) {
  return prisma.scenario.findMany({
    select: {
      slug: true,
      title: true,
      description: true,
      iconEmoji: true,
      isFeatured: true,
      category: true,
    },
    where: category ? { category } : undefined,
    orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }],
  });
}

interface ScenariosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ScenariosPage({ searchParams }: ScenariosPageProps) {
  const params = await searchParams;
  const categoryParam = params.category as LawCategory | undefined;

  // Validate category parameter
  const validCategory =
    categoryParam && allCategories.includes(categoryParam) ? categoryParam : undefined;

  const scenarios = await getScenarios(validCategory);
  // Build breadcrumb items
  const breadcrumbItems = validCategory
    ? [{ label: 'Scenarios', href: '/scenarios' }, { label: categoryInfo[validCategory].label }]
    : [{ label: 'Scenarios' }];

  // Get page title and description based on category
  const pageTitle = validCategory
    ? `${categoryInfo[validCategory].label} Scenarios`
    : 'Legal Scenarios';
  const pageDescription = validCategory
    ? `Browse ${categoryInfo[validCategory].label.toLowerCase()} scenarios and understand the laws that protect you.`
    : 'Browse common situations Nigerians face and understand the laws that protect you. Select a scenario to see relevant laws explained in plain language.';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb items={breadcrumbItems} className="mb-4" />

            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-neutral-600)]">{pageDescription}</p>

            {/* Category Filter Pills */}
            <div className="mt-6">
              <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:snap-none md:flex-wrap md:overflow-x-visible md:px-0 md:pb-0">
                <Link
                  href="/scenarios"
                  className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    !validCategory
                      ? 'bg-[var(--color-primary-500)] text-white'
                      : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
                  }`}
                >
                  All
                </Link>
                {allCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/scenarios?category=${cat}`}
                    className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      validCategory === cat
                        ? 'bg-[var(--color-primary-500)] text-white'
                        : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
                    }`}
                  >
                    <span className="mr-1.5">{categoryInfo[cat].emoji}</span>
                    {categoryInfo[cat].label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scenarios Grid */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-6xl">
            {scenarios.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.slug}
                    title={scenario.title}
                    description={scenario.description}
                    href={`/scenarios/${scenario.slug}`}
                    iconEmoji={scenario.iconEmoji}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  <span className="text-3xl">
                    {validCategory ? categoryInfo[validCategory].emoji : '📋'}
                  </span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  {validCategory
                    ? `No ${categoryInfo[validCategory].label} Scenarios Yet`
                    : 'Scenarios Coming Soon'}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  {validCategory
                    ? `We're working on adding ${categoryInfo[validCategory].label.toLowerCase()} scenarios. Try browsing other categories or our collection of Nigerian laws.`
                    : "We're working on adding common legal scenarios. In the meantime, browse our collection of Nigerian laws."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {validCategory && (
                    <Link
                      href="/scenarios"
                      className="rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
                    >
                      View All Scenarios
                    </Link>
                  )}
                  <Link
                    href="/laws"
                    className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
                      validCategory
                        ? 'border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]'
                        : 'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]'
                    }`}
                  >
                    Browse All Laws
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-12 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-2 text-[var(--color-neutral-600)]">
              Try searching for your specific situation or browse our full collection of Nigerian
              laws.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
              >
                Search Laws
              </Link>
              <Link
                href="/laws"
                className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
              >
                Browse All Laws
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
