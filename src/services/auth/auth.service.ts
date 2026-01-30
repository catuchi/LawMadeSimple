import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import type { UserSyncData } from '@/types/auth';

/**
 * Extracts user data from a Supabase user for syncing to Prisma.
 * Throws an error if the user has no email (phone-only users are not supported).
 */
export function extractUserSyncData(supabaseUser: SupabaseUser): UserSyncData {
  const { id, email, user_metadata } = supabaseUser;

  if (!email) {
    throw new Error('User email is required for sync. Phone-only authentication is not supported.');
  }

  return {
    id,
    email,
    name: user_metadata?.full_name || user_metadata?.name || null,
    avatarUrl: user_metadata?.avatar_url || user_metadata?.picture || null,
  };
}

/**
 * Syncs a Supabase user to the Prisma User model.
 * Uses upsert to create or update the user record.
 * Called after successful sign-in, OAuth callback, or email confirmation.
 *
 * Returns error if user was previously deleted (soft delete).
 */
export async function syncUserToPrisma(supabaseUser: SupabaseUser) {
  const userData = extractUserSyncData(supabaseUser);

  try {
    // Check if user exists and was deleted
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { deletedAt: true },
    });

    if (existingUser?.deletedAt) {
      return {
        success: false,
        error: 'ACCOUNT_DELETED',
        message: 'This account has been deleted.',
      };
    }

    const user = await prisma.user.upsert({
      where: { id: userData.id },
      create: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        preferences: {},
      },
      update: {
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('Failed to sync user to Prisma:', error);
    return { success: false, error };
  }
}

/**
 * Gets a user from Prisma by their ID (Supabase auth.users.id).
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error('Failed to get user by ID:', error);
    return null;
  }
}

/**
 * Gets a user from Prisma by their email.
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Failed to get user by email:', error);
    return null;
  }
}

/**
 * Updates user preferences in Prisma.
 */
export async function updateUserPreferences(userId: string, preferences: Prisma.InputJsonValue) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences },
    });
    return { success: true, user };
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    return { success: false, error };
  }
}

/**
 * Soft deletes a user from Prisma (for account deletion).
 * Sets deletedAt timestamp instead of hard delete to:
 * 1. Preserve data integrity (foreign keys)
 * 2. Prevent re-registration with same Supabase ID
 * 3. Allow potential account recovery in future
 */
export async function deleteUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        // Clear sensitive data but keep record
        name: null,
        avatarUrl: null,
        preferences: {},
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, error };
  }
}

/**
 * Check if a user account has been deleted.
 */
export async function isUserDeleted(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { deletedAt: true },
    });
    return !!user?.deletedAt;
  } catch {
    return false;
  }
}
