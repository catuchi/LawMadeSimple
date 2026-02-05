'use client';

import Link from 'next/link';
import { ChevronDown, Bookmark, Settings, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar, getUserDisplayData } from './user-avatar';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const { name, email, avatarUrl } = getUserDisplayData(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-[var(--color-neutral-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2"
          aria-label="User menu"
        >
          <UserAvatar name={name} email={email} avatarUrl={avatarUrl} size="sm" />
          <ChevronDown className="size-4 text-[var(--color-neutral-500)]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {name && <p className="text-sm font-medium text-[var(--color-neutral-900)]">{name}</p>}
            <p className="truncate text-xs text-[var(--color-neutral-500)]">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/saved" className="flex items-center gap-2">
            <Bookmark className="size-4" />
            <span>Saved Items</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onSignOut}
          className="flex items-center gap-2 text-[var(--color-error-600)] focus:bg-[var(--color-error-50)] focus:text-[var(--color-error-600)]"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
