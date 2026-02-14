import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Terms of Service - LawMadeSimple',
  description: 'Terms of Service for LawMadeSimple - Rules and conditions for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb items={[{ label: 'Terms of Service' }]} className="mb-4" />
            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-[var(--color-neutral-500)]">Last updated: February 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-neutral max-w-none rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-sm md:p-8">
              <p className="lead text-lg text-[var(--color-neutral-600)]">
                Welcome to LawMadeSimple. By using our website and services, you agree to these
                Terms of Service. Please read them carefully.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using LawMadeSimple (&quot;the Service&quot;), you agree to be bound
                by these Terms of Service and our{' '}
                <Link href="/privacy" className="text-[var(--color-primary-500)]">
                  Privacy Policy
                </Link>
                . If you do not agree to these terms, please do not use the Service.
              </p>

              <h2>2. Description of Service</h2>
              <p>LawMadeSimple provides:</p>
              <ul>
                <li>Access to Nigerian law content in plain language</li>
                <li>AI-powered explanations of legal provisions</li>
                <li>Scenario-based legal information discovery</li>
                <li>Search functionality for Nigerian laws</li>
                <li>Bookmarking and personalization features</li>
              </ul>

              <h2>3. Important Disclaimer</h2>
              <div className="rounded-lg border border-[var(--color-warning)] bg-[var(--color-warning-light)] p-4">
                <p className="font-semibold text-[var(--color-neutral-700)]">
                  Legal Information, Not Legal Advice
                </p>
                <p className="mt-2 text-sm">
                  The information provided by LawMadeSimple is for general informational and
                  educational purposes only. It does not constitute legal advice and should not be
                  relied upon as such. Always consult a qualified lawyer for advice on your specific
                  legal situation.
                </p>
              </div>
              <p>
                We make no guarantees about the accuracy, completeness, or timeliness of the
                information. Laws change, and AI-generated explanations may contain errors. For full
                details, see our{' '}
                <Link href="/disclaimer" className="text-[var(--color-primary-500)]">
                  Legal Disclaimer
                </Link>
                .
              </p>

              <h2>4. User Accounts</h2>
              <h3>Registration</h3>
              <p>
                To access certain features, you must create an account. You agree to provide
                accurate information and keep your account credentials secure.
              </p>

              <h3>Account Responsibility</h3>
              <p>
                You are responsible for all activities under your account. Notify us immediately if
                you suspect unauthorized access.
              </p>

              <h3>Account Termination</h3>
              <p>
                We may suspend or terminate accounts that violate these terms or for any other
                reason at our discretion. You may delete your account at any time through{' '}
                <Link href="/settings" className="text-[var(--color-primary-500)]">
                  Account Settings
                </Link>
                .
              </p>

              <h2>5. Acceptable Use</h2>
              <p>You agree NOT to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape, copy, or redistribute our content without permission</li>
                <li>Use automated tools to access the Service excessively</li>
                <li>Impersonate others or provide false information</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service to provide legal advice to others</li>
              </ul>

              <h2>6. Intellectual Property</h2>
              <h3>Our Content</h3>
              <p>
                The Service, including its design, features, and AI-generated explanations, is
                protected by copyright and other intellectual property laws. You may not reproduce,
                distribute, or create derivative works without our permission.
              </p>

              <h3>Law Content</h3>
              <p>
                Nigerian laws themselves are public domain. However, our organization, formatting,
                explanations, and annotations are our intellectual property.
              </p>

              <h3>User Content</h3>
              <p>
                Any feedback, suggestions, or content you submit may be used by us to improve the
                Service without compensation to you.
              </p>

              <h2>7. Service Tiers</h2>
              <h3>Free Tier</h3>
              <ul>
                <li>Limited AI explanations per day</li>
                <li>Basic search functionality</li>
                <li>Access to law content</li>
              </ul>

              <h3>Premium Tier</h3>
              <ul>
                <li>Unlimited AI explanations</li>
                <li>Priority support</li>
                <li>Advanced features (when available)</li>
              </ul>
              <p>
                Premium subscriptions are billed according to the plan selected. Refunds are handled
                on a case-by-case basis.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law:</p>
              <ul>
                <li>
                  We are not liable for any indirect, incidental, or consequential damages arising
                  from your use of the Service
                </li>
                <li>
                  We are not responsible for decisions made based on information from the Service
                </li>
                <li>
                  Our total liability is limited to the amount you paid for the Service in the past
                  12 months
                </li>
              </ul>

              <h2>9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless LawMadeSimple and its affiliates from any
                claims, damages, or expenses arising from your use of the Service or violation of
                these terms.
              </p>

              <h2>10. Modifications to Service</h2>
              <p>
                We may modify, suspend, or discontinue any part of the Service at any time without
                notice. We are not liable for any modification, suspension, or discontinuation.
              </p>

              <h2>11. Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. We will notify you of
                significant changes via email or notice on the website. Continued use after changes
                constitutes acceptance.
              </p>

              <h2>12. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Federal Republic of Nigeria. Any
                disputes shall be resolved in the courts of Nigeria.
              </p>

              <h2>13. Severability</h2>
              <p>
                If any provision of these terms is found invalid, the remaining provisions will
                continue in full force and effect.
              </p>

              <h2>14. Contact</h2>
              <p>For questions about these Terms of Service:</p>
              <ul>
                <li>
                  Email: <a href="mailto:legal@lawmadesimple.ng">legal@lawmadesimple.ng</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
