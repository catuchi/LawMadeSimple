import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBadge } from '@/components/ui/disclaimer-badge';
import type { LawDetail, ApiSuccessResponse } from '@/types/api';

// Category display info
const categoryInfo: Record<string, { label: string; iconEmoji: string }> = {
  constitution: { label: 'Constitution', iconEmoji: '📜' },
  criminal: { label: 'Criminal Law', iconEmoji: '👮' },
  business: { label: 'Business Law', iconEmoji: '🏢' },
  labour: { label: 'Labour Law', iconEmoji: '💼' },
  property: { label: 'Property Law', iconEmoji: '🏠' },
  tax: { label: 'Tax Law', iconEmoji: '💰' },
  intellectual_property: { label: 'Intellectual Property', iconEmoji: '©️' },
};

interface PageProps {
  params: Promise<{ lawSlug: string }>;
}

async function getLawData(lawSlug: string): Promise<LawDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/laws/${lawSlug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch law: ${response.status}`);
    }

    const json: ApiSuccessResponse<LawDetail> = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching law:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lawSlug } = await params;
  const law = await getLawData(lawSlug);

  if (!law) {
    return {
      title: 'Law Not Found | LawMadeSimple',
    };
  }

  return {
    title: `${law.shortTitle} | LawMadeSimple`,
    description:
      law.description || `Browse sections of ${law.title} with plain language explanations.`,
  };
}

export default async function LawDetailPage({ params }: PageProps) {
  const { lawSlug } = await params;
  const law = await getLawData(lawSlug);

  if (!law) {
    notFound();
  }

  const catInfo = categoryInfo[law.category] || { label: law.category, iconEmoji: '📄' };

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
                href="/laws"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-neutral-500)] transition-colors hover:text-[var(--color-primary-500)]"
              >
                <ArrowLeft className="size-4" />
                Back to Laws
              </Link>
              <Breadcrumb
                items={[{ label: 'Laws', href: '/laws' }, { label: law.shortTitle }]}
                className="hidden sm:flex"
              />
            </div>

            {/* Law Title */}
            <div className="flex items-start gap-4">
              <span className="text-4xl" aria-hidden="true">
                {catInfo.iconEmoji}
              </span>
              <div className="flex-1">
                <h1 className="font-heading text-2xl font-bold text-[var(--color-neutral-800)] md:text-3xl">
                  {law.title}
                </h1>
                {law.description && (
                  <p className="mt-2 text-[var(--color-neutral-600)]">{law.description}</p>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="primary">{catInfo.label}</Badge>
              <span className="text-sm text-[var(--color-neutral-500)]">
                <FileText className="mr-1 inline size-4" />
                {law.sections.length} section{law.sections.length !== 1 ? 's' : ''}
              </span>
              {law.effectiveDate && (
                <span className="text-sm text-[var(--color-neutral-500)]">
                  Effective:{' '}
                  {new Date(law.effectiveDate).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
              {law.sourceUrl && (
                <a
                  href={law.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[var(--color-primary-500)] hover:underline"
                >
                  View Original
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-b border-[var(--color-neutral-200)] bg-[var(--color-warning-light)] px-4 py-3">
          <div className="mx-auto max-w-4xl">
            <DisclaimerBadge />
          </div>
        </section>

        {/* Sections List */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-lg font-medium text-[var(--color-neutral-700)]">
              Sections in this Law
            </h2>

            {law.sections.length === 0 ? (
              /* Empty State */
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
                  <FileText className="size-8 text-[var(--color-neutral-400)]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Sections Coming Soon
                </h3>
                <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">
                  We&apos;re currently working on adding sections for this law. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {law.sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`/explain/${law.slug}/${section.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-[var(--color-neutral-200)] bg-white p-4 transition-all hover:border-[var(--color-primary-300)] hover:shadow-md"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-[var(--color-primary-500)]">
                          {section.number}
                        </span>
                        <h3 className="font-heading group-hover:text-primary font-semibold text-[var(--color-neutral-800)]">
                          {section.title}
                        </h3>
                      </div>
                      {section.summary && (
                        <p className="mt-1 line-clamp-1 text-sm text-[var(--color-neutral-600)]">
                          {section.summary}
                        </p>
                      )}
                      {section.hasSubsections && (
                        <span className="mt-2 inline-block text-xs text-[var(--color-neutral-500)]">
                          Contains subsections
                        </span>
                      )}
                    </div>
                    <ChevronRight className="group-hover:text-primary size-5 shrink-0 text-[var(--color-neutral-400)] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Related Actions */}
        <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading mb-4 text-lg font-semibold text-[var(--color-neutral-800)]">
              Related Resources
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/search?q=${encodeURIComponent(law.shortTitle)}`}
                className="rounded-full border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
              >
                Search in this law
              </Link>
              <Link
                href="/scenarios"
                className="rounded-full border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
              >
                Browse Scenarios
              </Link>
              <Link
                href="/laws"
                className="rounded-full border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
              >
                View All Laws
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
