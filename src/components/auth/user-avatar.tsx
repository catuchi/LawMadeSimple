'use client';

import { User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Extracts initials from a name or email.
 * - "John Doe" → "JD"
 * - "John" → "J"
 * - "john.doe@example.com" → "J"
 */
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (email) {
    return email[0].toUpperCase();
  }

  return '?';
}

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
};

const iconSizes = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

export function UserAvatar({ name, email, avatarUrl, size = 'sm', className }: UserAvatarProps) {
  const initials = getInitials(name, email);
  const hasAvatar = !!avatarUrl;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-100)] font-medium text-[var(--color-primary-700)]',
        sizeClasses[size],
        className
      )}
    >
      {hasAvatar ? (
        <Image
          src={avatarUrl}
          alt={name || email || 'User avatar'}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      ) : initials !== '?' ? (
        <span>{initials}</span>
      ) : (
        <User className={iconSizes[size]} />
      )}
    </div>
  );
}

/**
 * Helper to extract user display data from Supabase user object.
 * Use this in components that have access to the Supabase user.
 */
export function getUserDisplayData(user: {
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
}) {
  const metadata = user.user_metadata || {};

  return {
    name: metadata.full_name || metadata.name || null,
    email: user.email || null,
    avatarUrl: metadata.avatar_url || metadata.picture || null,
  };
}
