import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ScenarioCard } from '@/components/features/scenario-card';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Legal Scenarios | LawMadeSimple',
  description:
    'Browse common legal scenarios in Nigeria. Find explanations for landlord-tenant issues, employment rights, business registration, and more.',
};

// Fetch all scenarios from database
async function getScenarios() {
  return prisma.scenario.findMany({
    select: {
      slug: true,
      title: true,
      description: true,
      iconEmoji: true,
      isFeatured: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }],
  });
}

export default async function ScenariosPage() {
  const scenarios = await getScenarios();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb items={[{ label: 'Scenarios' }]} className="mb-4" />

            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              Legal Scenarios
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-neutral-600)]">
              Browse common situations Nigerians face and understand the laws that protect you.
              Select a scenario to see relevant laws explained in plain language.
            </p>
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
                  <span className="text-3xl">📋</span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Scenarios Coming Soon
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  We&apos;re working on adding common legal scenarios. In the meantime, browse our
                  collection of Nigerian laws.
                </p>
                <Link
                  href="/laws"
                  className="mt-6 inline-block rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
                >
                  Browse All Laws
                </Link>
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
