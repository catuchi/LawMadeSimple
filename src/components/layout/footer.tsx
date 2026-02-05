import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Laws', href: '/laws' },
  { label: 'Scenarios', href: '/scenarios' },
  { label: 'About', href: '/about' },
];

const lawLinks = [
  { label: 'Constitution', href: '/laws/constitution' },
  { label: 'Criminal Code', href: '/laws/criminal-code' },
  { label: 'CAMA', href: '/laws/cama' },
  { label: 'Labour Act', href: '/laws/labour-act' },
];

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Top Section - responsive grid: 1 col mobile, 2 cols sm, 4 cols lg */}
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Brand - spans full width on sm screens */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="LawMadeSimple logo"
                width={24}
                height={24}
                className="size-6"
              />
              <span className="font-heading text-primary text-lg font-semibold">LawMadeSimple</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-neutral-600)]">
              Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand
              language.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h2 className="font-heading text-sm font-semibold text-[var(--color-neutral-800)]">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary text-sm text-[var(--color-neutral-600)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Laws */}
          <nav aria-label="Browse laws">
            <h2 className="font-heading text-sm font-semibold text-[var(--color-neutral-800)]">
              Laws
            </h2>
            <ul className="mt-4 space-y-3">
              {lawLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary text-sm text-[var(--color-neutral-600)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal pages">
            <h2 className="font-heading text-sm font-semibold text-[var(--color-neutral-800)]">
              Legal
            </h2>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary text-sm text-[var(--color-neutral-600)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-8 rounded-lg border border-[var(--color-warning)] bg-[var(--color-warning-light)] p-4"
          role="region"
          aria-labelledby="disclaimer-heading"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 size-5 shrink-0 text-[var(--color-warning)]"
              aria-hidden="true"
            />
            <div>
              <h2 id="disclaimer-heading" className="font-medium text-[var(--color-neutral-700)]">
                Legal Disclaimer
              </h2>
              <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
                This platform provides legal information, not legal advice. The information on this
                website is for general informational purposes only and should not be relied upon as
                a substitute for professional legal advice. Always consult a qualified lawyer for
                your specific legal situation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-[var(--color-neutral-200)] pt-8 text-center">
          <p className="text-sm text-[var(--color-neutral-500)]">
            © {new Date().getFullYear()} LawMadeSimple. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
