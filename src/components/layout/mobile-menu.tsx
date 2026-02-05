'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Bookmark, Settings, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserAvatar, getUserDisplayData } from '@/components/auth/user-avatar';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: Array<{ label: string; href: string }>;
  currentPath: string;
  user: User | null;
  isLoading: boolean;
  onSignOut?: () => void;
}

export function MobileMenu({
  open,
  onOpenChange,
  navItems,
  currentPath,
  user,
  isLoading,
  onSignOut,
}: MobileMenuProps) {
  const handleLinkClick = () => {
    onOpenChange(false);
  };

  const handleSignOut = () => {
    onOpenChange(false);
    onSignOut?.();
  };

  const userDisplayData = user ? getUserDisplayData(user) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-menu"
        side="right"
        className="w-full max-w-[320px] gap-0 p-0"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="flex h-14 flex-row items-center justify-between border-b border-[var(--color-neutral-200)] px-4">
          <SheetTitle className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="LawMadeSimple logo"
              width={24}
              height={24}
              className="size-6"
            />
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

        {/* Scrollable content area */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Navigation */}
          <nav aria-label="Main navigation" className="px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                aria-current={currentPath === item.href ? 'page' : undefined}
                className={cn(
                  'block border-b border-[var(--color-neutral-100)] py-4 text-base font-medium transition-colors',
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
          <div className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            {isLoading ? (
              <div className="m-4 h-10 animate-pulse rounded-md bg-[var(--color-neutral-100)]" />
            ) : user && userDisplayData ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 border-b border-[var(--color-neutral-200)] p-4">
                  <UserAvatar
                    name={userDisplayData.name}
                    email={userDisplayData.email}
                    avatarUrl={userDisplayData.avatarUrl}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    {userDisplayData.name && (
                      <p className="truncate text-sm font-medium text-[var(--color-neutral-900)]">
                        {userDisplayData.name}
                      </p>
                    )}
                    <p className="truncate text-xs text-[var(--color-neutral-500)]">
                      {userDisplayData.email}
                    </p>
                  </div>
                </div>

                {/* User Links */}
                <div className="flex flex-col p-2">
                  <Link
                    href="/saved"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-200)]"
                  >
                    <Bookmark className="size-5" />
                    <span>Saved Items</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-200)]"
                  >
                    <Settings className="size-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--color-error-600)] transition-colors hover:bg-[var(--color-error-50)]"
                  >
                    <LogOut className="size-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 p-4">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
