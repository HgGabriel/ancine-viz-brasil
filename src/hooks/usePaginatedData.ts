import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { apiClient, ApiError } from "@/lib/apiClient";
import { useDebounce, useDebouncedCallback } from "./useDebounce";

// Backend response interface for paginated data
interface BackendPaginatedResponse<T> {
  success: boolean;
  data: T[];
  metadata?: {
    pagination?: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  pagination?: {
    // Fallback for direct pagination structure
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface UsePaginatedDataOptions {
  pageSize?: number;
  initialFilters?: Record<string, any>;
  initialSortBy?: string;
  initialSortDirection?: "asc" | "desc";
  enabled?: boolean;
  staleTime?: number;
  syncWithUrl?: boolean;
}

export interface UsePaginatedDataResult<T> {
  data: T[];
  paginationInfo: PaginationInfo;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
  isRefetching: boolean;

  // State management functions
  setPage: (page: number) => void;
  setFilters: (filters: Record<string, any>) => void;
  setFiltersDebounced: (filters: Record<string, any>) => void;
  setSort: (column: string, direction: "asc" | "desc") => void;
  resetFilters: () => void;

  // Current state
  currentPage: number;
  filters: Record<string, any>;
  sortBy: string | null;
  sortDirection: "asc" | "desc";
}

/**
 * Hook for fetching paginated data with filtering and sorting
 * Supports URL synchronization for shareable filtered states
 *
 * @param endpoint - API endpoint to fetch from
 * @param options - Configuration options
 * @returns Paginated data result with state management functions
 */
export function usePaginatedData<T = any>(
  endpoint: string,
  options: UsePaginatedDataOptions = {}
): UsePaginatedDataResult<T> {
  const {
    pageSize = 20,
    initialFilters = {},
    initialSortBy,
    initialSortDirection = "asc",
    enabled = true,
    staleTime = 5 * 60 * 1000,
    syncWithUrl = true,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params if syncWithUrl is enabled
  const getInitialPage = () => {
    if (syncWithUrl) {
      const pageParam = searchParams.get("page");
      return pageParam ? parseInt(pageParam, 10) : 1;
    }
    return 1;
  };

  const getInitialFilters = () => {
    if (syncWithUrl) {
      const urlFilters: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "sortBy" && key !== "sortDirection") {
          urlFilters[key] = value;
        }
      });
      return { ...initialFilters, ...urlFilters };
    }
    return initialFilters;
  };

  const getInitialSort = () => {
    if (syncWithUrl) {
      const sortBy = searchParams.get("sortBy") || initialSortBy;
      const sortDirection =
        (searchParams.get("sortDirection") as "asc" | "desc") ||
        initialSortDirection;
      return { sortBy, sortDirection };
    }
    return { sortBy: initialSortBy, sortDirection: initialSortDirection };
  };

  // State management
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [filters, setFiltersState] =
    useState<Record<string, any>>(getInitialFilters);
  const [sortBy, setSortBy] = useState<string | null>(
    getInitialSort().sortBy || null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    getInitialSort().sortDirection
  );

  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 500); // Increased to 500ms for better performance

  // Update URL when state changes (if syncWithUrl is enabled)
  useEffect(() => {
    if (!syncWithUrl) return;

    const newParams = new URLSearchParams();

    // Add page if not 1
    if (currentPage > 1) {
      newParams.set("page", currentPage.toString());
    }

    // Add filters
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        newParams.set(key, String(value));
      }
    });

    // Add sort parameters
    if (sortBy) {
      newParams.set("sortBy", sortBy);
      newParams.set("sortDirection", sortDirection);
    }

    setSearchParams(newParams, { replace: true });
  }, [
    currentPage,
    debouncedFilters,
    sortBy,
    sortDirection,
    syncWithUrl,
    setSearchParams,
  ]);

  // Build query parameters - using per_page to match backend API
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: currentPage,
      per_page: pageSize,
      ...debouncedFilters,
    };

    if (sortBy) {
      params.sort_by = sortBy;
      params.sort_direction = sortDirection;
    }

    return params;
  }, [currentPage, pageSize, debouncedFilters, sortBy, sortDirection]);

  // Fetch data using React Query
  const query = useQuery<BackendPaginatedResponse<T>, ApiError>({
    queryKey: ["paginated", endpoint, queryParams],
    queryFn: async () => {
      return apiClient.get<BackendPaginatedResponse<T>>(endpoint, queryParams);
    },
    enabled,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: keepPreviousData, // Keep previous data while loading new page (React Query v5)
    // Enhanced caching and performance settings
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchOnWindowFocus: false, // Disable for paginated data to avoid disruption
    refetchOnMount: false, // Use cached data if available
    // Background refetch for data freshness
    refetchInterval: syncWithUrl ? undefined : 5 * 60 * 1000, // 5 minutes if not synced with URL
    refetchIntervalInBackground: false,
  });

  // Extract pagination info from response - handles both metadata.pagination and direct pagination
  const paginationInfo: PaginationInfo = useMemo(() => {
    // Check for metadata.pagination structure (new backend format)
    const metadataPagination = query.data?.metadata?.pagination;
    if (metadataPagination) {
      return {
        currentPage: metadataPagination.page || currentPage,
        totalPages: metadataPagination.total_pages || 1,
        totalItems: metadataPagination.total || 0,
        pageSize: metadataPagination.per_page || pageSize,
      };
    }

    // Fallback to direct pagination structure
    const directPagination = query.data?.pagination;
    return {
      currentPage: directPagination?.current_page || currentPage,
      totalPages: directPagination?.total_pages || 1,
      totalItems: directPagination?.total_items || 0,
      pageSize: directPagination?.page_size || pageSize,
    };
  }, [
    query.data?.metadata?.pagination,
    query.data?.pagination,
    currentPage,
    pageSize,
  ]);

  // State management functions
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setFilters = useCallback((newFilters: Record<string, any>) => {
    setFiltersState(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Debounced filter setter for better performance with rapid filter changes
  const setFiltersDebounced = useDebouncedCallback(setFilters, 300);

  const setSort = useCallback((column: string, direction: "asc" | "desc") => {
    setSortBy(column);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sort changes
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    setCurrentPage(1);
    setSortBy(initialSortBy || null);
    setSortDirection(initialSortDirection);
  }, [initialFilters, initialSortBy, initialSortDirection]);

  return {
    data: query.data?.data || [],
    paginationInfo,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,

    // State management
    setPage,
    setFilters,
    setFiltersDebounced,
    setSort,
    resetFilters,

    // Current state
    currentPage,
    filters,
    sortBy,
    sortDirection,
  };
}
