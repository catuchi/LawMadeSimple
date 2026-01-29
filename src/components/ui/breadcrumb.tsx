import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
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
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
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
