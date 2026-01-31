import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchBar } from '@/components/features/search-bar';
import { ScenarioPill } from '@/components/features/scenario-pill';
import { ScenarioCard } from '@/components/features/scenario-card';

const scenarioPills = [
  { label: 'Landlord Issues', href: '/scenarios/landlord-tenant', iconEmoji: '🏠' },
  { label: 'Police Encounters', href: '/scenarios/police-encounters', iconEmoji: '👮' },
  { label: 'Employment', href: '/scenarios/employment', iconEmoji: '💼' },
  { label: 'Starting a Business', href: '/scenarios/business', iconEmoji: '🏢' },
  { label: 'Tax Questions', href: '/scenarios/tax', iconEmoji: '💰' },
  { label: 'My Rights', href: '/scenarios/constitutional-rights', iconEmoji: '⚖️' },
];

const popularTopics = [
  {
    title: 'Tenant Rights',
    description:
      'Understand your rights as a tenant including rent increases, eviction notice periods, and security deposits.',
    href: '/scenarios/landlord-tenant',
    iconEmoji: '🏠',
  },
  {
    title: 'Know Your Rights',
    description:
      'What to do when stopped by police, your rights during arrest, and how to protect yourself legally.',
    href: '/scenarios/police-encounters',
    iconEmoji: '👮',
  },
  {
    title: 'Register a Business',
    description: 'Step-by-step guide to registering your business in Nigeria under CAMA 2020.',
    href: '/scenarios/business',
    iconEmoji: '🏢',
  },
  {
    title: 'Employment Rights',
    description:
      'Know your rights at work including termination, leave entitlements, and workplace safety.',
    href: '/scenarios/employment',
    iconEmoji: '💼',
  },
  {
    title: 'Copyright Protection',
    description:
      'Protect your creative work under the Copyright Act 2022 - music, art, writing, and more.',
    href: '/scenarios/copyright',
    iconEmoji: '©️',
  },
  {
    title: 'Constitutional Rights',
    description: 'Your fundamental rights as a Nigerian citizen under the 1999 Constitution.',
    href: '/scenarios/constitutional-rights',
    iconEmoji: '📜',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[var(--color-primary-50)] to-white px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="mx-auto max-w-4xl text-center">
            {/* Title */}
            <h1 className="font-heading text-4xl font-bold tracking-tight text-[var(--color-primary-500)] md:text-5xl lg:text-6xl">
              LawMadeSimple
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg text-[var(--color-neutral-600)] md:text-xl">
              Nigerian law in plain language
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar size="hero" autoFocus />
            </div>
          </div>
        </section>

        {/* Scenario Pills Section */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white py-8">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-6 text-center text-sm font-medium tracking-wide text-[var(--color-neutral-500)] uppercase">
              I&apos;m dealing with...
            </h2>

            {/* Pills - horizontal scroll on mobile, wrap on desktop */}
            <div className="relative">
              {/* Fade gradient hints - mobile only */}
              <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-6 bg-gradient-to-r from-white to-transparent md:hidden" />
              <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />

              <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:snap-none md:flex-wrap md:justify-center md:overflow-x-visible md:px-0 md:pb-0">
                {scenarioPills.map((pill) => (
                  <ScenarioPill
                    key={pill.href}
                    label={pill.label}
                    href={pill.href}
                    iconEmoji={pill.iconEmoji}
                    className="snap-start"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Topics Section */}
        <section className="bg-[var(--background-secondary)] px-4 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-heading mb-8 text-center text-2xl font-semibold text-[var(--color-neutral-800)] md:text-3xl">
              Popular Topics
            </h2>

            {/* Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularTopics.map((topic) => (
                <ScenarioCard
                  key={topic.href}
                  title={topic.title}
                  description={topic.description}
                  href={topic.href}
                  iconEmoji={topic.iconEmoji}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Value Proposition Section */}
        <section className="border-t border-[var(--color-neutral-200)] bg-white px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading mb-8 text-center text-2xl font-semibold text-[var(--color-neutral-800)]">
              Why LawMadeSimple?
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
                  <span className="text-2xl" aria-hidden="true">
                    📖
                  </span>
                </div>
                <h3 className="font-heading mb-2 font-semibold text-[var(--color-neutral-800)]">
                  Plain Language
                </h3>
                <p className="text-sm text-[var(--color-neutral-600)]">
                  Legal jargon translated into everyday words you can understand and act on.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-accent-50)]">
                  <span className="text-2xl" aria-hidden="true">
                    💡
                  </span>
                </div>
                <h3 className="font-heading mb-2 font-semibold text-[var(--color-neutral-800)]">
                  Practical Examples
                </h3>
                <p className="text-sm text-[var(--color-neutral-600)]">
                  Real scenarios showing exactly how Nigerian laws apply to your situation.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
                  <span className="text-2xl" aria-hidden="true">
                    🔍
                  </span>
                </div>
                <h3 className="font-heading mb-2 font-semibold text-[var(--color-neutral-800)]">
                  Easy Search
                </h3>
                <p className="text-sm text-[var(--color-neutral-600)]">
                  Describe your situation in your own words and find relevant laws instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
