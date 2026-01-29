import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerBadgeProps {
  className?: string;
  compact?: boolean;
}

export function DisclaimerBadge({ className, compact = false }: DisclaimerBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border border-[var(--color-warning)] bg-[var(--color-warning-light)] px-3 py-2 text-sm text-[var(--color-neutral-700)]',
        compact && 'px-2 py-1.5 text-xs',
        className
      )}
      role="alert"
    >
      <AlertCircle
        className={cn(
          'shrink-0 text-[var(--color-warning)]',
          compact ? 'mt-0.5 size-3.5' : 'mt-0.5 size-4'
        )}
      />
      <span>
        {compact
          ? 'Legal information, not legal advice.'
          : 'This is legal information, not legal advice. Consult a lawyer for your specific situation.'}
      </span>
    </div>
  );
}
