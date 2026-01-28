'use client';

import { useContext } from 'react';
import { AuthContext } from '@/components/auth/auth-provider';
import type { AuthContextValue } from '@/types/auth';

/**
 * Hook to access the auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
