import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { useEffect } from 'react';

export function useAuth() {
  const supabase = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  // Queries current authenticated user info
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return null;
      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache profile for 5 mins
  });

  // Sync auth state changes (e.g. login, signout, token refreshes)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  // Logout mutation
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear(); // Clear all cached queries for security
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut: signOut.mutate,
    isSigningOut: signOut.isPending,
  };
}
