'use client';

import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScenarioPillProps {
  label: string;
  href: string;
  icon?: LucideIcon;
  iconEmoji?: string;
  isActive?: boolean;
  className?: string;
}

export function ScenarioPill({
  label,
  href,
  icon: Icon,
  iconEmoji,
  isActive = false,
  className,
}: ScenarioPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200',
        isActive
          ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)] text-white shadow-md'
          : 'border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-700)] shadow-sm hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] hover:shadow-md',
        className
      )}
    >
      {iconEmoji ? (
        <span className="text-lg" aria-hidden="true">
          {iconEmoji}
        </span>
      ) : Icon ? (
        <Icon
          className={cn('size-[18px]', isActive ? 'text-white' : 'text-[var(--color-primary-500)]')}
          aria-hidden="true"
        />
      ) : null}
      <span>{label}</span>
    </Link>
  );
}
