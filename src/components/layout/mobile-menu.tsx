'use client';

import Link from 'next/link';
import { Scale, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: Array<{ label: string; href: string }>;
  currentPath: string;
  user: User | null;
  isLoading: boolean;
}

export function MobileMenu({
  open,
  onOpenChange,
  navItems,
  currentPath,
  user,
  isLoading,
}: MobileMenuProps) {
  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-menu"
        side="right"
        className="w-full max-w-[320px] p-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex h-14 flex-row items-center justify-between border-b border-[var(--color-neutral-200)] px-4">
          <SheetTitle className="flex items-center gap-2">
            <Scale className="text-primary size-6" />
            <span className="font-heading text-primary text-lg font-semibold">LawMadeSimple</span>
          </SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 hover:bg-[var(--color-neutral-100)]"
            aria-label="Close menu"
          >
            <X className="size-5 text-[var(--color-neutral-500)]" />
          </button>
        </SheetHeader>

        <nav aria-label="Main navigation" className="flex flex-col px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              aria-current={currentPath === item.href ? 'page' : undefined}
              className={cn(
                'border-b border-[var(--color-neutral-100)] py-4 text-base font-medium transition-colors',
                currentPath === item.href
                  ? 'text-primary'
                  : 'hover:text-primary text-[var(--color-neutral-700)]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="mt-auto border-t border-[var(--color-neutral-200)] p-4">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-md bg-[var(--color-neutral-100)]" />
          ) : user ? (
            <Link href="/dashboard" onClick={handleLinkClick}>
              <Button className="w-full">Dashboard</Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/sign-in" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={handleLinkClick}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
