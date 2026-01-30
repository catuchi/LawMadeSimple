'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { AuthContextValue } from '@/types/auth';

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  // Initialize auth state
  // Uses getUser() instead of getSession() for security - getUser() validates
  // the JWT with Supabase server, while getSession() only reads from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // getUser() validates the session with the server (more secure)
        const {
          data: { user: validatedUser },
        } = await supabase.auth.getUser();

        if (validatedUser) {
          // Get fresh session after validation
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          setSession(currentSession);
          setUser(validatedUser);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign out function
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    const {
      data: { session: newSession },
    } = await supabase.auth.refreshSession();
    setSession(newSession);
    setUser(newSession?.user ?? null);
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      signOut,
      refreshSession,
    }),
    [user, session, isLoading, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
