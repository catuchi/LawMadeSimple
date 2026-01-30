import { AlertCircle, RefreshCw, WifiOff, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ErrorVariant = 'default' | 'network' | 'unauthorized' | 'rate-limited' | 'not-found';

interface ErrorStateProps {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
  compact?: boolean;
  backHref?: string;
  backLabel?: string;
}

const variantConfig: Record<
  ErrorVariant,
  { icon: React.ElementType; title: string; iconColor: string }
> = {
  default: {
    icon: AlertCircle,
    title: 'Something went wrong',
    iconColor: 'text-[var(--color-error)]',
  },
  network: {
    icon: WifiOff,
    title: 'Connection error',
    iconColor: 'text-[var(--color-error)]',
  },
  unauthorized: {
    icon: Lock,
    title: 'Sign in required',
    iconColor: 'text-[var(--color-primary-500)]',
  },
  'rate-limited': {
    icon: Clock,
    title: 'Too many requests',
    iconColor: 'text-[var(--color-accent)]',
  },
  'not-found': {
    icon: AlertCircle,
    title: 'Not found',
    iconColor: 'text-[var(--color-neutral-500)]',
  },
};

export function ErrorState({
  title,
  message,
  variant = 'default',
  onRetry,
  isRetrying = false,
  className,
  compact = false,
  backHref,
  backLabel = 'Go back',
}: ErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title ?? config.title;

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg border border-[var(--color-error)] bg-[var(--color-error-light)] p-4',
          className
        )}
        role="alert"
      >
        <Icon className={cn('mt-0.5 size-5 shrink-0', config.iconColor)} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--color-error-dark)]">{displayTitle}</p>
          <p className="text-sm text-[var(--color-neutral-700)]">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-error-dark)] transition-colors hover:bg-[var(--color-error)]/10 disabled:opacity-50"
          >
            <RefreshCw className={cn('size-4', isRetrying && 'animate-spin')} />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-neutral-200)] bg-white p-8 text-center',
        className
      )}
      role="alert"
    >
      <div
        className={cn(
          'mx-auto mb-4 flex size-16 items-center justify-center rounded-full',
          variant === 'unauthorized'
            ? 'bg-[var(--color-primary-50)]'
            : variant === 'rate-limited'
              ? 'bg-[var(--color-accent)]/10'
              : 'bg-[var(--color-error-light)]'
        )}
      >
        <Icon className={cn('size-8', config.iconColor)} aria-hidden="true" />
      </div>

      <h2 className="font-heading text-xl font-semibold text-[var(--color-neutral-800)]">
        {displayTitle}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-[var(--color-neutral-600)]">{message}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)] disabled:opacity-50"
          >
            <RefreshCw className={cn('size-4', isRetrying && 'animate-spin')} />
            {isRetrying ? 'Retrying...' : 'Try again'}
          </button>
        )}

        {backHref && (
          <Link
            href={backHref}
            className="rounded-lg border border-[var(--color-neutral-300)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-50)]"
          >
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export function InlineError({
  message,
  onRetry,
  isRetrying = false,
  className,
}: {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn('flex items-center gap-2 text-sm text-[var(--color-error)]', className)}
      role="alert"
    >
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="ml-1 font-medium underline hover:no-underline disabled:opacity-50"
        >
          {isRetrying ? 'Retrying...' : 'Retry'}
        </button>
      )}
    </div>
  );
}
