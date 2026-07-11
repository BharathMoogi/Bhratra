import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseBrowserClient = () => {
  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseBrowserClient;
};
