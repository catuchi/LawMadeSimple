import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  // Find the last item with an href for the mobile back link
  const backItem = [...items].reverse().find((item) => item.href);
  const backHref = backItem?.href || '/';
  const backLabel = backItem?.label || 'Home';

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      {/* Mobile: Simple back link */}
      <Link
        href={backHref}
        className="flex items-center gap-1 text-sm text-[var(--color-neutral-500)] transition-colors hover:text-[var(--color-primary-500)] sm:hidden"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        <span className="max-w-[150px] truncate">{backLabel}</span>
      </Link>

      {/* Desktop: Full breadcrumb trail */}
      <ol className="hidden flex-wrap items-center gap-1.5 text-sm sm:flex">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-[var(--color-neutral-500)] transition-colors hover:text-[var(--color-primary-500)]"
          >
            <Home className="size-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="size-4 text-[var(--color-neutral-400)]" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'max-w-[200px] truncate',
                    isLast
                      ? 'font-medium text-[var(--color-neutral-800)]'
                      : 'text-[var(--color-neutral-500)]'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="max-w-[200px] truncate text-[var(--color-neutral-500)] transition-colors hover:text-[var(--color-primary-500)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
