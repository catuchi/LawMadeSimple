import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/db';
import type { LawCategory } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Browse Nigerian Laws | LawMadeSimple',
  description:
    'Browse and explore Nigerian federal laws including the Constitution, Criminal Code, CAMA 2020, Labour Act, and more. All laws explained in plain language.',
};

// Category display info
const categoryInfo: Record<string, { label: string; iconEmoji: string; description: string }> = {
  constitution: {
    label: 'Constitution',
    iconEmoji: '📜',
    description: 'Fundamental rights and government structure',
  },
  criminal: {
    label: 'Criminal Law',
    iconEmoji: '👮',
    description: 'Offenses and criminal procedures',
  },
  business: {
    label: 'Business Law',
    iconEmoji: '🏢',
    description: 'Company registration and corporate governance',
  },
  labour: {
    label: 'Labour Law',
    iconEmoji: '💼',
    description: 'Employment rights and workplace regulations',
  },
  property: {
    label: 'Property Law',
    iconEmoji: '🏠',
    description: 'Land, tenancy, and real estate',
  },
  tax: {
    label: 'Tax Law',
    iconEmoji: '💰',
    description: 'Taxation and revenue regulations',
  },
  intellectual_property: {
    label: 'Intellectual Property',
    iconEmoji: '©️',
    description: 'Copyright, trademarks, and patents',
  },
};

interface LawListItem {
  id: string;
  title: string;
  shortTitle: string;
  slug: string;
  category: LawCategory;
  description: string | null;
  _count: { sections: number };
}

async function getLaws(): Promise<LawListItem[]> {
  try {
    // Direct Prisma query instead of HTTP fetch (avoids build timeout)
    const laws = await prisma.law.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        shortTitle: true,
        slug: true,
        category: true,
        description: true,
        _count: { select: { sections: true } },
      },
      orderBy: [{ category: 'asc' }, { title: 'asc' }],
    });
    return laws;
  } catch (error) {
    console.error('Error fetching laws:', error);
    return [];
  }
}

export default async function LawsPage() {
  const laws = await getLaws();

  // Group laws by category
  const lawsByCategory = laws.reduce(
    (acc, law) => {
      const category = law.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(law);
      return acc;
    },
    {} as Record<string, LawListItem[]>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb items={[{ label: 'Laws' }]} className="mb-4" />

            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              Browse Nigerian Laws
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--color-neutral-600)]">
              Explore federal laws covered by LawMadeSimple. Each law is broken down into sections
              with plain language explanations and practical examples.
            </p>
          </div>
        </section>

        {/* Laws by Category */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-6xl">
            {laws.length === 0 ? (
              /* Empty State */
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
                  <FileText className="size-8 text-[var(--color-neutral-400)]" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Content Coming Soon
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  We&apos;re currently working on adding laws to the database. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(lawsByCategory).map(([category, categoryLaws]) => {
                  const info = categoryInfo[category] || {
                    label: category,
                    iconEmoji: '📄',
                    description: '',
                  };

                  return (
                    <div key={category}>
                      {/* Category Header */}
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">
                          {info.iconEmoji}
                        </span>
                        <div>
                          <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                            {info.label}
                          </h2>
                          {info.description && (
                            <p className="text-sm text-[var(--color-neutral-500)]">
                              {info.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Laws Grid */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryLaws.map((law) => (
                          <Link
                            key={law.id}
                            href={`/laws/${law.slug}`}
                            className="group rounded-xl border border-[var(--color-neutral-200)] bg-white p-5 transition-all hover:border-[var(--color-primary-300)] hover:shadow-md"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-heading group-hover:text-primary font-semibold text-[var(--color-neutral-800)]">
                                  {law.shortTitle}
                                </h3>
                                {law.description && (
                                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-neutral-600)]">
                                    {law.description}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="group-hover:text-primary mt-1 size-5 shrink-0 text-[var(--color-neutral-400)] transition-transform group-hover:translate-x-1" />
                            </div>

                            <div className="mt-4 flex items-center gap-3 text-xs text-[var(--color-neutral-500)]">
                              <div className="flex items-center gap-1">
                                <FileText className="size-3.5" />
                                <span>
                                  {law._count.sections} section
                                  {law._count.sections !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <Badge variant="default" className="text-[10px]">
                                {info.label}
                              </Badge>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-12 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
              Not sure where to start?
            </h2>
            <p className="mt-2 text-[var(--color-neutral-600)]">
              Browse our scenarios to find laws relevant to your specific situation.
            </p>
            <div className="mt-6">
              <Link
                href="/scenarios"
                className="inline-block rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
              >
                Browse Scenarios
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
