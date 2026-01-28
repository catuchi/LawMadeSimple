import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

/**
 * Creates a Supabase client for use in browser/client components.
 * This client is suitable for client-side operations like auth state changes.
 */
export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
