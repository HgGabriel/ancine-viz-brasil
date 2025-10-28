import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface BackgroundRefetchOptions {
  /**
   * Interval in milliseconds for background refetching
   * Default: 5 minutes (300000ms)
   */
  interval?: number;
  
  /**
   * Whether to refetch when the tab becomes visible
   * Default: true
   */
  refetchOnFocus?: boolean;
  
  /**
   * Whether to refetch when the network reconnects
   * Default: true
   */
  refetchOnReconnect?: boolean;
  
  /**
   * Whether background refetching is enabled
   * Default: true
   */
  enabled?: boolean;
  
  /**
   * Query keys to refetch in the background
   * If not provided, all queries will be refetched
   */
  queryKeys?: string[][];
}

/**
 * Hook for managing background refetching of critical data
 * Ensures data stays fresh without user interaction
 * 
 * @param options - Configuration options for background refetching
 */
export function useBackgroundRefetch(options: BackgroundRefetchOptions = {}) {
  const {
    interval = 5 * 60 * 1000, // 5 minutes
    refetchOnFocus = true,
    refetchOnReconnect = true,
    enabled = true,
    queryKeys,
  } = options;

  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout>();
  const isDocumentVisible = useRef(true);

  // Function to refetch queries
  const refetchQueries = () => {
    if (!enabled) return;

    if (queryKeys && queryKeys.length > 0) {
      // Refetch specific queries
      queryKeys.forEach(queryKey => {
        queryClient.refetchQueries({
          queryKey,
          type: 'active',
        });
      });
    } else {
      // Refetch all active queries
      queryClient.refetchQueries({
        type: 'active',
        stale: true, // Only refetch stale queries
      });
    }
  };

  // Set up background interval refetching
  useEffect(() => {
    if (!enabled || !interval) return;

    intervalRef.current = setInterval(() => {
      // Only refetch if document is visible to avoid unnecessary requests
      if (isDocumentVisible.current) {
        refetchQueries();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval]);

  // Handle visibility change
  useEffect(() => {
    if (!refetchOnFocus) return;

    const handleVisibilityChange = () => {
      const wasVisible = isDocumentVisible.current;
      isDocumentVisible.current = !document.hidden;

      // Refetch when tab becomes visible after being hidden
      if (!wasVisible && isDocumentVisible.current) {
        refetchQueries();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetchOnFocus]);

  // Handle network reconnection
  useEffect(() => {
    if (!refetchOnReconnect) return;

    const handleOnline = () => {
      refetchQueries();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [refetchOnReconnect]);

  // Manual refetch function
  const manualRefetch = () => {
    refetchQueries();
  };

  return {
    refetch: manualRefetch,
    isEnabled: enabled,
  };
}

/**
 * Hook for background refetching of critical dashboard data
 * Pre-configured for ANCINE Dashboard use cases
 */
export function useDashboardBackgroundRefetch() {
  return useBackgroundRefetch({
    interval: 10 * 60 * 1000, // 10 minutes for dashboard data
    queryKeys: [
      ['api', '/estatisticas/market_share'],
      ['api', '/estatisticas/ranking_distribuidoras'],
      ['api', '/estatisticas/salas_por_uf'],
    ],
  });
}