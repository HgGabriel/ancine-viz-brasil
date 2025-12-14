import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/apiClient";
import { useQueryErrorHandler } from "./useErrorHandler";

export interface UseApiDataOptions<T>
  extends Omit<UseQueryOptions<T, ApiError>, "queryKey" | "queryFn"> {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

export interface UseApiDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
  isRefetching: boolean;
}

/**
 * Base hook for fetching data from the ANCINE API
 * Provides consistent error handling, loading states, and caching
 *
 * @param endpoint - API endpoint to fetch from (e.g., '/estatisticas/market_share')
 * @param options - Configuration options for the query
 * @returns Query result with data, loading states, and refetch function
 */
export function useApiData<T = any>(
  endpoint: string,
  options: UseApiDataOptions<T> = {}
): UseApiDataResult<T> {
  const {
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    ...queryOptions
  } = options;

  const onError = useQueryErrorHandler();

  const query = useQuery<T, ApiError>({
    queryKey: ["api", endpoint],
    queryFn: async () => {
      const response = await apiClient.get<{
        success?: boolean;
        data?: T;
        [key: string]: any;
      }>(endpoint);
      // Extract data field if response follows standard API response format
      if (response && typeof response === "object" && "data" in response) {
        return response.data as T;
      }
      return response as T;
    },
    enabled,
    refetchInterval,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) except for 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError,
    ...queryOptions,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}

/**
 * Hook for fetching data with parameters
 * Useful for endpoints that accept query parameters
 *
 * @param endpoint - API endpoint to fetch from
 * @param params - Query parameters to include in the request
 * @param options - Configuration options for the query
 * @returns Query result with data, loading states, and refetch function
 */
export function useApiDataWithParams<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
  options: UseApiDataOptions<T> = {}
): UseApiDataResult<T> {
  const {
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000,
    ...queryOptions
  } = options;

  const onError = useQueryErrorHandler();

  const query = useQuery<T, ApiError>({
    queryKey: ["api", endpoint, params],
    queryFn: async () => {
      return apiClient.get<T>(endpoint, params);
    },
    enabled,
    refetchInterval,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) except for 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError,
    ...queryOptions,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
