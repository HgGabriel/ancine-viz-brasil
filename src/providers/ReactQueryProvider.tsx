import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Create a client with optimized settings for the ANCINE Dashboard
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 10 minutes by default for better performance
      staleTime: 10 * 60 * 1000,
      // Keep data in cache for 30 minutes to reduce API calls
      gcTime: 30 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enable background refetching for real-time updates
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Background refetch interval for critical data (30 minutes)
      refetchInterval: 30 * 60 * 1000,
      // Only refetch in background if data is stale
      refetchIntervalInBackground: false,
      // Network mode for better offline handling
      networkMode: 'online',
      // Retry on network errors
      retryOnMount: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export { queryClient };