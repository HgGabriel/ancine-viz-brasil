import React, { createContext, useContext, useCallback, useState } from 'react';
import { useMultipleLoadingStates } from '@/hooks/useLoadingState';

interface LoadingContextType {
  // Global loading states for different operations
  isDataLoading: boolean;
  isChartLoading: boolean;
  isTableLoading: boolean;
  isNavigationLoading: boolean;
  
  // Methods to control loading states
  setDataLoading: (loading: boolean) => void;
  setChartLoading: (loading: boolean) => void;
  setTableLoading: (loading: boolean) => void;
  setNavigationLoading: (loading: boolean) => void;
  
  // Utility methods
  isAnyLoading: boolean;
  setAllLoading: (loading: boolean) => void;
  
  // Progressive loading for complex operations
  startProgressiveLoading: (stages: string[]) => void;
  nextProgressiveStage: () => void;
  finishProgressiveLoading: () => void;
  progressiveState: {
    isActive: boolean;
    currentStage: number;
    totalStages: number;
    currentMessage: string;
    progress: number;
  };
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const LOADING_KEYS = ['data', 'chart', 'table', 'navigation'] as const;
type LoadingKey = typeof LOADING_KEYS[number];

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const {
    loadingStates,
    setLoading,
    isAnyLoading,
    startAllLoading,
    stopAllLoading,
  } = useMultipleLoadingStates(LOADING_KEYS);

  // Progressive loading state
  const [progressiveState, setProgressiveState] = useState({
    isActive: false,
    currentStage: 0,
    totalStages: 0,
    stages: [] as string[],
    currentMessage: '',
    progress: 0,
  });

  const startProgressiveLoading = useCallback((stages: string[]) => {
    setProgressiveState({
      isActive: true,
      currentStage: 0,
      totalStages: stages.length,
      stages,
      currentMessage: stages[0] || 'Carregando...',
      progress: 0,
    });
  }, []);

  const nextProgressiveStage = useCallback(() => {
    setProgressiveState(prev => {
      if (!prev.isActive || prev.currentStage >= prev.totalStages - 1) {
        return prev;
      }

      const nextStage = prev.currentStage + 1;
      const progress = ((nextStage + 1) / prev.totalStages) * 100;

      return {
        ...prev,
        currentStage: nextStage,
        currentMessage: prev.stages[nextStage] || 'Carregando...',
        progress,
      };
    });
  }, []);

  const finishProgressiveLoading = useCallback(() => {
    setProgressiveState(prev => ({
      ...prev,
      isActive: false,
      currentStage: prev.totalStages,
      progress: 100,
    }));
  }, []);

  const contextValue: LoadingContextType = {
    // Individual loading states
    isDataLoading: loadingStates.data,
    isChartLoading: loadingStates.chart,
    isTableLoading: loadingStates.table,
    isNavigationLoading: loadingStates.navigation,

    // Methods to control loading states
    setDataLoading: (loading: boolean) => setLoading('data', loading),
    setChartLoading: (loading: boolean) => setLoading('chart', loading),
    setTableLoading: (loading: boolean) => setLoading('table', loading),
    setNavigationLoading: (loading: boolean) => setLoading('navigation', loading),

    // Utility methods
    isAnyLoading,
    setAllLoading: (loading: boolean) => loading ? startAllLoading() : stopAllLoading(),

    // Progressive loading
    startProgressiveLoading,
    nextProgressiveStage,
    finishProgressiveLoading,
    progressiveState: {
      isActive: progressiveState.isActive,
      currentStage: progressiveState.currentStage + 1, // 1-indexed for display
      totalStages: progressiveState.totalStages,
      currentMessage: progressiveState.currentMessage,
      progress: progressiveState.progress,
    },
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to access the loading context
 * Provides access to global loading states and methods
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

/**
 * Higher-order component to wrap components with loading context
 */
export function withLoadingProvider<P extends object>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = (props: P) => (
    <LoadingProvider>
      <Component {...props} />
    </LoadingProvider>
  );

  WrappedComponent.displayName = `withLoadingProvider(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for managing loading state of a specific operation
 * Automatically integrates with the global loading context
 */
export function useOperationLoading(
  operationType: 'data' | 'chart' | 'table' | 'navigation'
) {
  const loading = useLoading();
  
  const isLoading = loading[`is${operationType.charAt(0).toUpperCase() + operationType.slice(1)}Loading` as keyof LoadingContextType] as boolean;
  const setLoading = loading[`set${operationType.charAt(0).toUpperCase() + operationType.slice(1)}Loading` as keyof LoadingContextType] as (loading: boolean) => void;

  const startLoading = useCallback(() => setLoading(true), [setLoading]);
  const stopLoading = useCallback(() => setLoading(false), [setLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading,
  };
}