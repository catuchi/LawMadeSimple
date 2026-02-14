import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Legal Disclaimer - LawMadeSimple',
  description:
    'Legal disclaimer for LawMadeSimple - Important information about the limitations of our legal information service.',
};

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="animate-page-enter flex-1">
        {/* Page Header */}
        <section className="border-b border-[var(--color-neutral-200)] bg-white px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb items={[{ label: 'Legal Disclaimer' }]} className="mb-4" />
            <h1 className="font-heading text-3xl font-bold text-[var(--color-neutral-800)] md:text-4xl">
              Legal Disclaimer
            </h1>
            <p className="mt-3 text-[var(--color-neutral-500)]">Last updated: February 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[var(--background-secondary)] px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            {/* Primary Warning */}
            <div className="mb-8 flex items-start gap-4 rounded-2xl border border-[var(--color-warning)] bg-[var(--color-warning-light)] p-6">
              <AlertTriangle className="mt-1 size-8 shrink-0 text-[var(--color-warning)]" />
              <div>
                <h2 className="text-xl font-bold text-[var(--color-neutral-800)]">
                  This Is Not Legal Advice
                </h2>
                <p className="mt-2 text-[var(--color-neutral-700)]">
                  The information provided on LawMadeSimple is for general informational and
                  educational purposes only. It should not be construed as legal advice or a
                  substitute for consultation with a qualified legal professional.
                </p>
              </div>
            </div>

            <div className="prose prose-neutral max-w-none rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-sm md:p-8">
              <h2>1. No Attorney-Client Relationship</h2>
              <p>
                Using LawMadeSimple does not create an attorney-client relationship between you and
                us or any of our affiliates. The information on this website is provided &quot;as
                is&quot; without any warranty or guarantee.
              </p>

              <h2>2. Information Accuracy</h2>
              <p>While we strive to provide accurate and up-to-date information:</p>
              <ul>
                <li>
                  Laws change frequently, and our content may not reflect the most recent updates
                </li>
                <li>AI-generated explanations may contain errors or inaccuracies</li>
                <li>We do not guarantee the completeness or correctness of any information</li>
                <li>
                  Different jurisdictions may have different laws (e.g., Lagos vs federal law)
                </li>
              </ul>
              <p>
                Always verify information with official sources or a qualified lawyer before making
                legal decisions.
              </p>

              <h2>3. AI-Generated Content</h2>
              <p>
                Our plain language explanations and examples are generated using artificial
                intelligence (AI). While this technology is powerful:
              </p>
              <ul>
                <li>AI may misinterpret or oversimplify complex legal concepts</li>
                <li>Examples provided may not apply to your specific situation</li>
                <li>AI cannot consider the unique circumstances of your case</li>
                <li>AI explanations are not reviewed by lawyers before publication</li>
              </ul>

              <h2>4. Not a Substitute for Professional Advice</h2>
              <p>
                <strong>You should always consult a qualified lawyer if:</strong>
              </p>
              <ul>
                <li>You are facing a legal dispute or proceedings</li>
                <li>You need advice on a specific legal matter</li>
                <li>You are making important decisions with legal implications</li>
                <li>You are entering into contracts or legal agreements</li>
                <li>You need representation in court or before a tribunal</li>
              </ul>

              <h2>5. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, LawMadeSimple and its owners,
                operators, affiliates, and partners shall not be liable for:
              </p>
              <ul>
                <li>Any decisions made or actions taken based on information from this website</li>
                <li>Any direct, indirect, incidental, or consequential damages</li>
                <li>Any errors or omissions in the content</li>
                <li>Any loss of data, profits, or business opportunities</li>
              </ul>

              <h2>6. Third-Party Links</h2>
              <p>
                Our website may contain links to external websites. We are not responsible for the
                content, accuracy, or practices of these third-party sites.
              </p>

              <h2>7. User Responsibility</h2>
              <p>By using this website, you acknowledge that:</p>
              <ul>
                <li>You are using the information at your own risk</li>
                <li>You will not rely solely on this website for legal decisions</li>
                <li>You will seek professional legal advice when needed</li>
                <li>You understand the limitations of AI-generated content</li>
              </ul>

              <h2>8. Geographic Limitations</h2>
              <p>
                The information on this website relates primarily to Nigerian federal laws and
                select state laws. It may not apply to:
              </p>
              <ul>
                <li>Other states or local government areas with different laws</li>
                <li>Customary law matters</li>
                <li>Sharia law matters in applicable states</li>
                <li>International or cross-border legal issues</li>
              </ul>

              <h2>9. Updates and Changes</h2>
              <p>
                We reserve the right to update, modify, or remove any content on this website at any
                time without notice. We are not obligated to update outdated information.
              </p>

              <h2>10. Contact a Lawyer</h2>
              <p>If you need legal advice, we recommend:</p>
              <ul>
                <li>Consulting the Nigerian Bar Association for lawyer referrals</li>
                <li>Seeking assistance from Legal Aid Council of Nigeria for those who qualify</li>
                <li>Contacting a licensed legal practitioner in your jurisdiction</li>
              </ul>

              <h2>Contact Us</h2>
              <p>If you have questions about this disclaimer:</p>
              <ul>
                <li>
                  Email: <a href="mailto:legal@lawmadesimple.ng">legal@lawmadesimple.ng</a>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="mb-4 text-[var(--color-neutral-600)]">
                Understand the limitations? Continue exploring Nigerian law.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/laws"
                  className="rounded-lg bg-[var(--color-primary-500)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
                >
                  Browse Laws
                </Link>
                <Link
                  href="/scenarios"
                  className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-6 py-3 font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
                >
                  View Scenarios
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
