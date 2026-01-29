import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  iconEmoji?: string;
  className?: string;
}

export function ScenarioCard({
  title,
  description,
  href,
  icon: Icon,
  iconEmoji,
  className,
}: ScenarioCardProps) {
  return (
    <article className={className}>
      <Link
        href={href}
        className="group relative flex min-h-[160px] flex-col rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[var(--color-primary-300)] hover:shadow-md"
      >
        {/* Icon */}
        <div className="mb-4">
          {iconEmoji ? (
            <span className="text-3xl" aria-hidden="true">
              {iconEmoji}
            </span>
          ) : Icon ? (
            <Icon className="text-primary size-8" aria-hidden="true" />
          ) : null}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-heading group-hover:text-primary text-lg font-semibold text-[var(--color-neutral-800)]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--color-neutral-500)]">{description}</p>
        </div>

        {/* Arrow */}
        <div className="mt-4 flex justify-end">
          <ChevronRight
            className="group-hover:text-primary size-5 text-[var(--color-neutral-400)] transition-all group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </Link>
    </article>
  );
}
