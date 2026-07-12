import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // 5 min default — most data doesn't change mid-session
        staleTime: 5 * 60 * 1000,
        // Keep unused data in memory for 10 min before garbage collecting
        gcTime: 10 * 60 * 1000,
        // Don't re-fetch just because the window was re-focused
        refetchOnWindowFocus: false,
        // Do re-fetch if the user comes back online
        refetchOnReconnect: true,
        // Avoid double-fetch on component mount when data is fresh
        refetchOnMount: false,
        // 2 retries on failure before showing error
        retry: 2,
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a fresh instance per request
    return createQueryClient();
  } else {
    // Browser: reuse the same instance — avoids re-creating during React
    // suspense and keeps the in-memory cache alive across navigations.
    if (!browserQueryClient) browserQueryClient = createQueryClient();
    return browserQueryClient;
  }
}
