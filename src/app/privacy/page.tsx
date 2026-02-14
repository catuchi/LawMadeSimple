import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy - LawMadeSimple',
  description:
    'Privacy Policy for LawMadeSimple - How we collect, use, and protect your personal data in compliance with NDPR.',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb items={[{ label: 'Privacy Policy' }]} className="mb-4" />
            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-[var(--color-neutral-500)]">Last updated: February 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-neutral max-w-none rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-sm md:p-8">
              <p className="lead text-lg text-[var(--color-neutral-600)]">
                LawMadeSimple (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
                protecting your privacy and personal data in accordance with the Nigeria Data
                Protection Regulation (NDPR) and other applicable data protection laws.
              </p>

              <h2>1. Data We Collect</h2>
              <p>We collect the following types of personal data:</p>

              <h3>Account Information</h3>
              <ul>
                <li>Email address (required for account creation)</li>
                <li>Name (optional, for personalization)</li>
                <li>Profile picture (if you sign in with Google, Apple, or Facebook)</li>
              </ul>

              <h3>Usage Data</h3>
              <ul>
                <li>Search queries (to improve search results)</li>
                <li>Bookmarked sections and scenarios</li>
                <li>AI explanation requests and feedback</li>
                <li>Device and browser information</li>
              </ul>

              <h3>Technical Data</h3>
              <ul>
                <li>IP address (hashed for privacy, used for rate limiting)</li>
                <li>Cookies and similar technologies (for authentication)</li>
              </ul>

              <h2>2. How We Use Your Data</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul>
                <li>
                  <strong>Service Delivery:</strong> To provide AI-powered legal explanations,
                  search functionality, and bookmarking features
                </li>
                <li>
                  <strong>Account Management:</strong> To authenticate users and manage your account
                </li>
                <li>
                  <strong>Service Improvement:</strong> To analyze usage patterns and improve our
                  platform
                </li>
                <li>
                  <strong>Rate Limiting:</strong> To prevent abuse and ensure fair usage
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable laws and regulations
                </li>
              </ul>

              <h2>3. Legal Basis for Processing</h2>
              <p>We process your data based on:</p>
              <ul>
                <li>
                  <strong>Consent:</strong> When you create an account and accept our terms
                </li>
                <li>
                  <strong>Contract:</strong> To provide the services you requested
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> For security, fraud prevention, and service
                  improvement
                </li>
              </ul>

              <h2>4. Third-Party Services</h2>
              <p>
                We use trusted third-party services to operate our platform. These providers are
                contractually obligated to protect your data:
              </p>
              <ul>
                <li>
                  <strong>Supabase:</strong> Database hosting and authentication (EU-based)
                </li>
                <li>
                  <strong>OpenAI:</strong> AI-powered explanations (data not retained for training)
                </li>
                <li>
                  <strong>Vercel:</strong> Website hosting and analytics
                </li>
                <li>
                  <strong>Sentry:</strong> Error tracking and monitoring
                </li>
              </ul>

              <h2>5. Data Retention</h2>
              <ul>
                <li>
                  <strong>Account Data:</strong> Retained until you delete your account
                </li>
                <li>
                  <strong>AI Explanations:</strong> Cached for 30 days to improve performance
                </li>
                <li>
                  <strong>Usage Logs:</strong> Retained for 90 days, then anonymized
                </li>
                <li>
                  <strong>Guest Data:</strong> IP hashes retained for 24 hours only
                </li>
              </ul>

              <h2>6. Your Rights Under NDPR</h2>
              <p>You have the following rights regarding your personal data:</p>
              <ul>
                <li>
                  <strong>Right of Access:</strong> Request a copy of your data
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Correct inaccurate data
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your data
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Export your data in a standard format
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to certain data processing
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw consent at any time
                </li>
              </ul>

              <p>
                To exercise these rights, go to{' '}
                <Link href="/settings" className="text-[var(--color-primary-500)]">
                  Account Settings
                </Link>{' '}
                or email us at{' '}
                <a href="mailto:privacy@lawmadesimple.ng">privacy@lawmadesimple.ng</a>.
              </p>

              <h2>7. Data Security</h2>
              <p>We implement appropriate security measures including:</p>
              <ul>
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure session management</li>
              </ul>

              <h2>8. Cookies</h2>
              <p>We use essential cookies for:</p>
              <ul>
                <li>Authentication and session management</li>
                <li>Security (CSRF protection)</li>
                <li>Remembering your preferences</li>
              </ul>
              <p>
                We do not use tracking cookies or sell your data to advertisers. See our{' '}
                <Link href="/terms" className="text-[var(--color-primary-500)]">
                  Terms of Service
                </Link>{' '}
                for more details.
              </p>

              <h2>9. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for children under 13. We do not knowingly collect
                data from children. If you believe a child has provided us with personal data,
                please contact us immediately.
              </p>

              <h2>10. International Data Transfers</h2>
              <p>
                Your data may be processed in countries outside Nigeria. When transferring data
                internationally, we ensure appropriate safeguards are in place to protect your data
                in accordance with NDPR requirements.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of
                significant changes by email or through a notice on our website. Your continued use
                of the service after changes constitutes acceptance of the updated policy.
              </p>

              <h2>12. Contact Us</h2>
              <p>For privacy-related inquiries or to exercise your rights:</p>
              <ul>
                <li>
                  Email: <a href="mailto:privacy@lawmadesimple.ng">privacy@lawmadesimple.ng</a>
                </li>
                <li>
                  Data Protection Officer:{' '}
                  <a href="mailto:dpo@lawmadesimple.ng">dpo@lawmadesimple.ng</a>
                </li>
              </ul>

              <h2>13. Supervisory Authority</h2>
              <p>
                If you are not satisfied with our response, you have the right to lodge a complaint
                with the National Information Technology Development Agency (NITDA), the supervisory
                authority for data protection in Nigeria.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
