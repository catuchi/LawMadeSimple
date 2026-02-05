import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { LawCard } from '@/components/features/law-card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBadge } from '@/components/ui/disclaimer-badge';
import { prisma } from '@/lib/db';
import type { RelatedSectionItem } from '@/types/api';

// Extended related section with law name from DB
interface RelatedSectionWithLaw extends RelatedSectionItem {
  lawName: string;
}

// Extended scenario detail type with all fields needed for the page
interface ScenarioPageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  iconEmoji: string;
  category: string;
  relatedSections: RelatedSectionWithLaw[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch basic scenario metadata for SEO (lightweight query)
async function getScenarioMeta(slug: string) {
  return prisma.scenario.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenarioMeta(slug);

  if (!scenario) {
    return {
      title: 'Scenario Not Found | LawMadeSimple',
    };
  }

  return {
    title: `${scenario.title} | LawMadeSimple`,
    description: scenario.description || undefined,
  };
}

// Generate static paths from database
export async function generateStaticParams() {
  const scenarios = await prisma.scenario.findMany({
    select: { slug: true },
  });
  return scenarios.map((s) => ({ slug: s.slug }));
}

async function getScenarioData(slug: string): Promise<ScenarioPageData | null> {
  // Query database directly instead of fetching from API
  // This works during build time (static generation) without needing a running server
  // Errors thrown here are caught by error.tsx boundary
  const scenario = await prisma.scenario.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      iconEmoji: true,
      category: true,
      sections: {
        select: {
          relevanceNote: true,
          relevanceOrder: true,
          section: {
            select: {
              id: true,
              slug: true,
              title: true,
              law: {
                select: {
                  slug: true,
                  shortTitle: true,
                },
              },
            },
          },
        },
        orderBy: { relevanceOrder: 'asc' },
      },
    },
  });

  if (!scenario) {
    return null;
  }

  // Transform related sections (include law display name from DB)
  const relatedSections: RelatedSectionWithLaw[] = scenario.sections.map((ss) => ({
    id: ss.section.id,
    lawSlug: ss.section.law.slug,
    sectionSlug: ss.section.slug,
    title: ss.section.title,
    relevanceNote: ss.relevanceNote,
    lawName: ss.section.law.shortTitle,
  }));

  return {
    id: scenario.id,
    slug: scenario.slug,
    title: scenario.title,
    description: scenario.description,
    iconEmoji: scenario.iconEmoji,
    category: scenario.category,
    relatedSections,
  };
}

// Fetch related scenarios for the sidebar (excluding current)
async function getRelatedScenarios(currentSlug: string, limit = 4) {
  return prisma.scenario.findMany({
    where: { slug: { not: currentSlug } },
    select: {
      slug: true,
      title: true,
      iconEmoji: true,
    },
    take: limit,
  });
}

export default async function ScenarioDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch scenario data from database
  const scenario = await getScenarioData(slug);

  if (!scenario) {
    notFound();
  }

  // Fetch related scenarios for sidebar
  const relatedScenarios = await getRelatedScenarios(slug);

  // Check if we have related sections
  const hasRelatedSections = scenario.relatedSections.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-4xl">
            {/* Back link and Breadcrumb */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/scenarios"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-neutral-500)] transition-colors hover:text-[var(--color-primary-500)]"
              >
                <ArrowLeft className="size-4" />
                Back to Scenarios
              </Link>
              <Breadcrumb
                items={[{ label: 'Scenarios', href: '/scenarios' }, { label: scenario.title }]}
                className="hidden sm:flex"
              />
            </div>

            {/* Title and Description */}
            <div className="flex items-start gap-4">
              <span className="text-4xl" aria-hidden="true">
                {scenario.iconEmoji}
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold text-[var(--color-neutral-800)] md:text-3xl">
                  {scenario.title}
                </h1>
                {scenario.description && (
                  <p className="mt-2 text-[var(--color-neutral-600)]">{scenario.description}</p>
                )}
              </div>
            </div>

            {/* Category Badge */}
            <div className="mt-4">
              <Badge variant="primary">{scenario.category.replace('_', ' ')}</Badge>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-b border-[var(--color-neutral-200)] bg-[var(--color-warning-light)] px-4 py-3">
          <div className="mx-auto max-w-4xl">
            <DisclaimerBadge />
          </div>
        </section>

        {/* Related Sections */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            {hasRelatedSections ? (
              <>
                <h2 className="mb-6 text-lg font-medium text-[var(--color-neutral-700)]">
                  {scenario.relatedSections.length} relevant law
                  {scenario.relatedSections.length !== 1 ? 's' : ''} found
                </h2>

                <div className="space-y-4">
                  {scenario.relatedSections.map((section) => (
                    <LawCard
                      key={section.id}
                      title={section.title}
                      preview={section.relevanceNote || undefined}
                      lawName={section.lawName}
                      href={`/explain/${section.lawSlug}/${section.sectionSlug}`}
                      badges={[{ label: scenario.category.replace('_', ' '), variant: 'primary' }]}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Placeholder when no related sections */
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  <span className="text-3xl">{scenario.iconEmoji}</span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Content Coming Soon
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  We&apos;re currently working on adding detailed law explanations for this
                  scenario. Check back soon or browse our available laws.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/laws"
                    className="rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
                  >
                    Browse All Laws
                  </Link>
                  <Link
                    href="/"
                    className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
                  >
                    Search Laws
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Scenarios */}
        {relatedScenarios.length > 0 && (
          <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-8 md:px-8 md:py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="font-heading mb-6 text-xl font-semibold text-[var(--color-neutral-800)]">
                Related Scenarios
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedScenarios.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/scenarios/${s.slug}`}
                    className="flex items-center gap-2 rounded-full border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
                  >
                    <span aria-hidden="true">{s.iconEmoji}</span>
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
