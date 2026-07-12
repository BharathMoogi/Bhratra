import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const getSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Suppress errors during Server Component reads
        }
      },
    },
  });
};

/**
 * getCachedUser — memoized per-request auth lookup.
 *
 * React's `cache()` deduplicates this call across all Server Components
 * rendered in the same request, so the Supabase session is fetched exactly
 * once regardless of how many pages/layouts call it.
 *
 * Usage (Server Components only):
 *   const user = await getCachedUser();
 */
export const getCachedUser = cache(async () => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
