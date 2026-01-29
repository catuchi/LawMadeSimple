import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ScenarioCard } from '@/components/features/scenario-card';

export const metadata: Metadata = {
  title: 'Legal Scenarios | LawMadeSimple',
  description:
    'Browse common legal scenarios in Nigeria. Find explanations for landlord-tenant issues, employment rights, business registration, and more.',
};

// Scenario data - maps to categories in the database
const scenarioCategories = [
  {
    slug: 'landlord-tenant',
    title: 'Landlord & Tenant Issues',
    description:
      'Understand your rights as a tenant or landlord including rent increases, eviction notice periods, and security deposits.',
    iconEmoji: '🏠',
    category: 'property',
  },
  {
    slug: 'police-encounters',
    title: 'Police Encounters',
    description:
      'Know what to do when stopped by police, your rights during arrest, and how to protect yourself legally.',
    iconEmoji: '👮',
    category: 'criminal',
  },
  {
    slug: 'employment',
    title: 'Employment Rights',
    description:
      'Know your rights at work including termination, leave entitlements, workplace safety, and unfair dismissal.',
    iconEmoji: '💼',
    category: 'labour',
  },
  {
    slug: 'business',
    title: 'Starting a Business',
    description:
      'Step-by-step guide to registering your business in Nigeria under CAMA 2020, compliance requirements, and more.',
    iconEmoji: '🏢',
    category: 'business',
  },
  {
    slug: 'tax',
    title: 'Tax Questions',
    description:
      'Understand your tax obligations as an individual or business owner under Nigerian tax laws.',
    iconEmoji: '💰',
    category: 'tax',
  },
  {
    slug: 'constitutional-rights',
    title: 'Constitutional Rights',
    description:
      'Your fundamental rights as a Nigerian citizen under the 1999 Constitution including freedom of speech, movement, and more.',
    iconEmoji: '📜',
    category: 'constitution',
  },
  {
    slug: 'copyright',
    title: 'Copyright & IP',
    description:
      'Protect your creative work under the Copyright Act 2022 - music, art, writing, software, and digital content.',
    iconEmoji: '©️',
    category: 'intellectual_property',
  },
  {
    slug: 'trademarks',
    title: 'Trademarks & Branding',
    description:
      'Register and protect your business name, logo, and brand identity under Nigerian trademark law.',
    iconEmoji: '™️',
    category: 'intellectual_property',
  },
];

export default function ScenariosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {scenarioCategories.map((scenario) => (
                <ScenarioCard
                  key={scenario.slug}
                  title={scenario.title}
                  description={scenario.description}
                  href={`/scenarios/${scenario.slug}`}
                  iconEmoji={scenario.iconEmoji}
                />
              ))}
            </div>
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
