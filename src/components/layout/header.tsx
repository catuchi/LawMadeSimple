'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './mobile-menu';
import { useAuth } from '@/hooks/use-auth';
import { UserMenu } from '@/components/auth/user-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Browse', href: '/laws' },
  { label: 'Scenarios', href: '/scenarios' },
  { label: 'About', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-neutral-200)] bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="LawMadeSimple logo"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="font-heading text-primary text-lg font-semibold md:text-xl">
            LawMadeSimple
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'text-primary'
                  : 'hover:text-primary text-[var(--color-neutral-600)]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? (
            <div className="size-8 animate-pulse rounded-full bg-[var(--color-neutral-100)]" />
          ) : user ? (
            <UserMenu user={user} onSignOut={signOut} />
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex size-10 items-center justify-center rounded-md hover:bg-[var(--color-neutral-100)] md:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="size-6 text-[var(--color-neutral-600)]" />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        navItems={navItems}
        currentPath={pathname}
        user={user}
        isLoading={isLoading}
        onSignOut={signOut}
      />
    </header>
  );
}
