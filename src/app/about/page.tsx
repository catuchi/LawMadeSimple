import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'About - LawMadeSimple',
  description:
    'Learn about LawMadeSimple - democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language.',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb items={[{ label: 'About' }]} className="mb-4" />
            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              About LawMadeSimple
            </h1>
            <p className="mt-3 text-lg text-[var(--color-neutral-600)]">
              Democratizing Nigerian law for everyone
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-8 rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-sm md:p-8">
              {/* Mission */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Our Mission
                </h2>
                <p className="mt-3 text-[var(--color-neutral-600)]">
                  LawMadeSimple exists to bridge the gap between complex legal language and everyday
                  understanding. We believe every Nigerian deserves to understand the laws that
                  govern their lives, regardless of their legal background.
                </p>
              </div>

              {/* The Problem */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  The Problem We Solve
                </h2>
                <p className="mt-3 text-[var(--color-neutral-600)]">
                  Nigerian laws are written in complex legal language that most people struggle to
                  understand. This creates a barrier that prevents ordinary citizens, small business
                  owners, and young professionals from knowing their rights and responsibilities.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-neutral-600)]">
                  <li>Tenants unaware of their rights under tenancy laws</li>
                  <li>Employees who don&apos;t know their protections under the Labour Act</li>
                  <li>Citizens unfamiliar with their constitutional rights</li>
                  <li>Small business owners confused by regulatory requirements</li>
                </ul>
              </div>

              {/* Our Approach */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Our Approach
                </h2>
                <p className="mt-3 text-[var(--color-neutral-600)]">
                  We use AI technology to translate legal jargon into plain, easy-to-understand
                  language. Our platform:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-neutral-600)]">
                  <li>
                    <strong>Plain Language Explanations:</strong> Every law section is explained in
                    simple terms
                  </li>
                  <li>
                    <strong>Practical Examples:</strong> Real-world scenarios showing how laws apply
                  </li>
                  <li>
                    <strong>Scenario-Based Discovery:</strong> Find relevant laws by describing your
                    situation
                  </li>
                  <li>
                    <strong>Smart Search:</strong> Search using everyday language, not legal terms
                  </li>
                </ul>
              </div>

              {/* Technology */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Built With Modern Technology
                </h2>
                <p className="mt-3 text-[var(--color-neutral-600)]">
                  LawMadeSimple is built using cutting-edge technologies to deliver fast, reliable,
                  and accessible legal information:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-neutral-600)]">
                  <li>AI-powered explanations using GPT-4</li>
                  <li>Semantic search to understand natural language queries</li>
                  <li>Mobile-responsive design for access anywhere</li>
                  <li>Progressive Web App (PWA) for offline access</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg border border-[var(--color-warning)] bg-[var(--color-warning-light)] p-4">
                <h2 className="font-semibold text-[var(--color-neutral-700)]">Important Notice</h2>
                <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
                  LawMadeSimple provides legal information, not legal advice. Our explanations are
                  for educational purposes and should not be relied upon as a substitute for
                  professional legal advice. Always consult a qualified lawyer for your specific
                  legal situation.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
                  Get in Touch
                </h2>
                <p className="mt-3 text-[var(--color-neutral-600)]">
                  Have questions, feedback, or suggestions? We&apos;d love to hear from you.
                </p>
                <p className="mt-2 text-[var(--color-neutral-600)]">
                  Email:{' '}
                  <a
                    href="mailto:hello@lawmadesimple.ng"
                    className="text-[var(--color-primary-500)] underline hover:text-[var(--color-primary-600)]"
                  >
                    hello@lawmadesimple.ng
                  </a>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex rounded-lg bg-[var(--color-primary-500)] px-8 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
              >
                Start Exploring Laws
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
