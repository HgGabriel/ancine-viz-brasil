import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingState {
  isLoading: boolean;
  stage: number;
  totalStages: number;
  message: string;
  progress: number;
}

export interface LoadingStageConfig {
  message: string;
  duration?: number; // Optional minimum duration for this stage
}

/**
 * Hook for managing complex loading states with multiple stages
 * Useful for progressive loading of data visualizations and complex operations
 */
export function useLoadingState(stages: LoadingStageConfig[] = []) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    stage: 0,
    totalStages: stages.length,
    message: '',
    progress: 0,
  });

  const stageTimeouts = useRef<NodeJS.Timeout[]>([]);

  const startLoading = useCallback((customMessage?: string) => {
    // Clear any existing timeouts
    stageTimeouts.current.forEach(timeout => clearTimeout(timeout));
    stageTimeouts.current = [];

    setLoadingState({
      isLoading: true,
      stage: 1,
      totalStages: stages.length || 1,
      message: customMessage || stages[0]?.message || 'Carregando...',
      progress: stages.length > 0 ? (1 / stages.length) * 100 : 0,
    });
  }, [stages]);

  const nextStage = useCallback((customMessage?: string) => {
    setLoadingState(prev => {
      if (!prev.isLoading || prev.stage >= prev.totalStages) {
        return prev;
      }

      const nextStageIndex = prev.stage;
      const newStage = prev.stage + 1;
      const newProgress = (newStage / prev.totalStages) * 100;
      const newMessage = customMessage || stages[nextStageIndex]?.message || prev.message;

      return {
        ...prev,
        stage: newStage,
        message: newMessage,
        progress: newProgress,
      };
    });
  }, [stages]);

  const finishLoading = useCallback(() => {
    // Clear any existing timeouts
    stageTimeouts.current.forEach(timeout => clearTimeout(timeout));
    stageTimeouts.current = [];

    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      stage: prev.totalStages,
      progress: 100,
    }));
  }, []);

  const setCustomProgress = useCallback((progress: number, message?: string) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100),
      message: message || prev.message,
    }));
  }, []);

  // Auto-advance stages with minimum duration
  const autoAdvanceStage = useCallback((stageIndex: number, minDuration: number) => {
    const timeout = setTimeout(() => {
      nextStage();
    }, minDuration);
    
    stageTimeouts.current.push(timeout);
  }, [nextStage]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      stageTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    loadingState,
    startLoading,
    nextStage,
    finishLoading,
    setCustomProgress,
    autoAdvanceStage,
  };
}

/**
 * Simplified loading state hook for basic loading operations
 */
export function useSimpleLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  const toggleLoading = useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
}

/**
 * Hook for managing loading states of multiple operations
 * Useful when you have multiple async operations that can run independently
 */
export function useMultipleLoadingStates<T extends string>(keys: T[]) {
  const [loadingStates, setLoadingStates] = useState<Record<T, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>)
  );

  const setLoading = useCallback((key: T, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const startLoading = useCallback((key: T) => setLoading(key, true), [setLoading]);
  const stopLoading = useCallback((key: T) => setLoading(key, false), [setLoading]);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const isAllLoading = Object.values(loadingStates).every(Boolean);

  const startAllLoading = useCallback(() => {
    setLoadingStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<T, boolean>)
    );
  }, []);

  const stopAllLoading = useCallback(() => {
    setLoadingStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>)
    );
  }, []);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    isAnyLoading,
    isAllLoading,
    startAllLoading,
    stopAllLoading,
  };
}

/**
 * Hook for debounced loading states
 * Prevents flickering when loading states change rapidly
 */
export function useDebouncedLoading(isLoading: boolean, delay = 200) {
  const [debouncedLoading, setDebouncedLoading] = useState(isLoading);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedLoading(isLoading);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, delay]);

  return debouncedLoading;
}