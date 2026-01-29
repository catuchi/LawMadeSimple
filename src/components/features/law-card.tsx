import Link from 'next/link';
import { FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LawCardProps {
  title: string;
  preview?: string;
  lawName: string;
  href: string;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';
  }>;
  updatedAt?: string;
  className?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

export function LawCard({
  title,
  preview,
  lawName,
  href,
  badges = [],
  updatedAt,
  className,
  showDeleteButton,
  onDelete,
}: LawCardProps) {
  return (
    <article
      className={cn(
        'group relative rounded-xl border border-[var(--color-neutral-200)] bg-white p-5 transition-all duration-200 hover:shadow-sm',
        className
      )}
    >
      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant || 'default'}>
              {badge.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Title - Clickable Link */}
      <Link href={href} className="block">
        <h3 className="font-heading group-hover:text-primary text-lg font-semibold text-[var(--color-neutral-800)]">
          {title}
        </h3>
      </Link>

      {/* Preview Text */}
      {preview && (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-neutral-600)]">{preview}</p>
      )}

      {/* Meta Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-neutral-500)]">
        <div className="flex items-center gap-1.5">
          <FileText className="size-3.5" aria-hidden="true" />
          <span>{lawName}</span>
          {updatedAt && (
            <>
              <span className="mx-1.5" aria-hidden="true">
                •
              </span>
              <time>Updated {updatedAt}</time>
            </>
          )}
        </div>

        {/* Delete button for saved items */}
        {showDeleteButton && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="rounded-md p-1 text-[var(--color-neutral-400)] hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)]"
            aria-label="Remove from saved"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
