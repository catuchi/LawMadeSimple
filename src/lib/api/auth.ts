// API Authentication Utilities
// Get current user from request using Supabase Auth

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import type { User } from '@prisma/client';

interface AuthResult {
  user: User | null;
  userId: string | null;
}

/**
 * Get the current authenticated user from the request.
 * Returns null if not authenticated (for optional auth endpoints).
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables not configured');
      return { user: null, userId: null };
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only for API routes
        },
      },
    });

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return { user: null, userId: null };
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    return {
      user,
      userId: supabaseUser.id,
    };
  } catch {
    return { user: null, userId: null };
  }
}

/**
 * Require authentication for an endpoint.
 * Throws if user is not authenticated.
 */
export async function requireAuth(): Promise<{ user: User; userId: string }> {
  const { user, userId } = await getCurrentUser();

  if (!userId) {
    throw new AuthError('Authentication required');
  }

  if (!user) {
    throw new AuthError('User not found');
  }

  return { user, userId };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
