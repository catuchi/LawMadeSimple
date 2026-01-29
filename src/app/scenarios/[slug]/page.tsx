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
import type { ScenarioDetail, ApiSuccessResponse } from '@/types/api';

// Scenario metadata for static generation and SEO
const scenarioMeta: Record<
  string,
  { title: string; description: string; iconEmoji: string; category: string }
> = {
  'landlord-tenant': {
    title: 'Landlord & Tenant Issues',
    description:
      'Understanding your rights as a tenant or landlord under Nigerian law. Learn about rent increases, eviction procedures, security deposits, and property maintenance obligations.',
    iconEmoji: '🏠',
    category: 'property',
  },
  'police-encounters': {
    title: 'Police Encounters',
    description:
      'Know your rights when dealing with Nigerian police. Learn what to do during stops, arrests, and detentions, and understand the legal protections available to you.',
    iconEmoji: '👮',
    category: 'criminal',
  },
  employment: {
    title: 'Employment Rights',
    description:
      'Your rights as an employee in Nigeria. Understand termination procedures, leave entitlements, workplace safety, and protections against unfair dismissal.',
    iconEmoji: '💼',
    category: 'labour',
  },
  business: {
    title: 'Starting a Business',
    description:
      'A guide to legally registering and running a business in Nigeria under CAMA 2020. Learn about company types, registration requirements, and compliance obligations.',
    iconEmoji: '🏢',
    category: 'business',
  },
  tax: {
    title: 'Tax Questions',
    description:
      'Understanding your tax obligations in Nigeria. Learn about personal income tax, corporate tax, VAT, and how to stay compliant with Nigerian tax laws.',
    iconEmoji: '💰',
    category: 'tax',
  },
  'constitutional-rights': {
    title: 'Constitutional Rights',
    description:
      'Your fundamental rights as a Nigerian citizen under the 1999 Constitution. Learn about freedom of speech, movement, religion, and other protected rights.',
    iconEmoji: '📜',
    category: 'constitution',
  },
  copyright: {
    title: 'Copyright & IP Protection',
    description:
      'Protect your creative works under the Nigerian Copyright Act 2022. Learn about registering copyrights for music, art, writing, software, and digital content.',
    iconEmoji: '©️',
    category: 'intellectual_property',
  },
  trademarks: {
    title: 'Trademarks & Branding',
    description:
      'Protect your business name, logo, and brand identity. Learn about trademark registration, infringement, and enforcement in Nigeria.',
    iconEmoji: '™️',
    category: 'intellectual_property',
  },
};

// Map law slugs to display names
const lawDisplayNames: Record<string, string> = {
  'constitution-1999': 'Constitution of Nigeria',
  'criminal-code-act': 'Criminal Code Act',
  'cama-2020': 'CAMA 2020',
  'labour-act': 'Labour Act',
  'lagos-tenancy-law-2011': 'Lagos Tenancy Law 2011',
  'firs-act': 'FIRS Act',
  'copyright-act-2022': 'Copyright Act 2022',
  'trademarks-act': 'Trademarks Act',
  'patents-designs-act': 'Patents & Designs Act',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = scenarioMeta[slug];

  if (!meta) {
    return {
      title: 'Scenario Not Found | LawMadeSimple',
    };
  }

  return {
    title: `${meta.title} | LawMadeSimple`,
    description: meta.description,
  };
}

// Generate static paths for known scenarios
export async function generateStaticParams() {
  return Object.keys(scenarioMeta).map((slug) => ({ slug }));
}

async function getScenarioData(slug: string): Promise<ScenarioDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/scenarios/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch scenario: ${response.status}`);
    }

    const json: ApiSuccessResponse<ScenarioDetail> = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching scenario:', error);
    return null;
  }
}

export default async function ScenarioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = scenarioMeta[slug];

  if (!meta) {
    notFound();
  }

  // Fetch scenario data from API
  const scenario = await getScenarioData(slug);

  // If API returns data, use it; otherwise show placeholder content
  const hasApiData = scenario && scenario.relatedSections.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
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
                items={[{ label: 'Scenarios', href: '/scenarios' }, { label: meta.title }]}
                className="hidden sm:flex"
              />
            </div>

            {/* Title and Description */}
            <div className="flex items-start gap-4">
              <span className="text-4xl" aria-hidden="true">
                {meta.iconEmoji}
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold text-[var(--color-neutral-800)] md:text-3xl">
                  {meta.title}
                </h1>
                <p className="mt-2 text-[var(--color-neutral-600)]">{meta.description}</p>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mt-4">
              <Badge variant="primary">{meta.category.replace('_', ' ')}</Badge>
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
            {hasApiData ? (
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
                      lawName={lawDisplayNames[section.lawSlug] || section.lawSlug}
                      href={`/explain/${section.lawSlug}/${section.sectionSlug}`}
                      badges={[{ label: meta.category.replace('_', ' '), variant: 'primary' }]}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Placeholder when no API data */
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  <span className="text-3xl">{meta.iconEmoji}</span>
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
        {hasApiData && (
          <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-8 md:px-8 md:py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="font-heading mb-6 text-xl font-semibold text-[var(--color-neutral-800)]">
                Related Scenarios
              </h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(scenarioMeta)
                  .filter(([s]) => s !== slug)
                  .slice(0, 4)
                  .map(([s, m]) => (
                    <Link
                      key={s}
                      href={`/scenarios/${s}`}
                      className="flex items-center gap-2 rounded-full border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
                    >
                      <span aria-hidden="true">{m.iconEmoji}</span>
                      {m.title}
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
