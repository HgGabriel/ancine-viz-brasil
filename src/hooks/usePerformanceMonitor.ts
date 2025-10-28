import { useEffect, useRef, useCallback } from 'react';

export interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export interface PerformanceMonitorOptions {
  /**
   * Whether performance monitoring is enabled
   * Default: true in development, false in production
   */
  enabled?: boolean;
  
  /**
   * Threshold in milliseconds for slow render warnings
   * Default: 100ms
   */
  slowRenderThreshold?: number;
  
  /**
   * Whether to log performance metrics to console
   * Default: true in development
   */
  logToConsole?: boolean;
  
  /**
   * Callback for handling performance metrics
   */
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

/**
 * Hook for monitoring component render performance
 * Helps identify performance bottlenecks in the dashboard
 * 
 * @param componentName - Name of the component being monitored
 * @param options - Configuration options
 */
export function usePerformanceMonitor(
  componentName: string,
  options: PerformanceMonitorOptions = {}
) {
  const {
    enabled = import.meta.env.DEV,
    slowRenderThreshold = 100,
    logToConsole = import.meta.env.DEV,
    onMetrics,
  } = options;

  const renderStartTime = useRef<number>();
  const renderCount = useRef(0);
  const totalRenderTime = useRef(0);

  // Start timing at the beginning of render
  if (enabled) {
    renderStartTime.current = performance.now();
  }

  // Measure render time after render completes
  useEffect(() => {
    if (!enabled || !renderStartTime.current) return;

    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
    };

    // Log slow renders
    if (logToConsole && renderTime > slowRenderThreshold) {
      console.warn(
        `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`,
        {
          renderTime,
          averageRenderTime: (totalRenderTime.current / renderCount.current).toFixed(2),
          renderCount: renderCount.current,
        }
      );
    }

    // Call metrics callback
    onMetrics?.(metrics);
  });

  const getAverageRenderTime = useCallback(() => {
    return renderCount.current > 0 
      ? totalRenderTime.current / renderCount.current 
      : 0;
  }, []);

  const getRenderStats = useCallback(() => {
    return {
      totalRenders: renderCount.current,
      totalRenderTime: totalRenderTime.current,
      averageRenderTime: getAverageRenderTime(),
    };
  }, [getAverageRenderTime]);

  return {
    getAverageRenderTime,
    getRenderStats,
  };
}

/**
 * Hook for monitoring API request performance
 * Tracks request timing and success rates
 */
export function useApiPerformanceMonitor() {
  const requestMetrics = useRef<Map<string, {
    count: number;
    totalTime: number;
    successCount: number;
    errorCount: number;
  }>>(new Map());

  const recordRequest = useCallback((
    endpoint: string,
    duration: number,
    success: boolean
  ) => {
    const current = requestMetrics.current.get(endpoint) || {
      count: 0,
      totalTime: 0,
      successCount: 0,
      errorCount: 0,
    };

    current.count += 1;
    current.totalTime += duration;
    
    if (success) {
      current.successCount += 1;
    } else {
      current.errorCount += 1;
    }

    requestMetrics.current.set(endpoint, current);

    // Log slow API requests in development
    if (import.meta.env.DEV && duration > 2000) {
      console.warn(`🐌 Slow API request to ${endpoint}: ${duration.toFixed(2)}ms`);
    }
  }, []);

  const getRequestStats = useCallback((endpoint?: string) => {
    if (endpoint) {
      const stats = requestMetrics.current.get(endpoint);
      if (!stats) return null;

      return {
        endpoint,
        averageTime: stats.totalTime / stats.count,
        successRate: (stats.successCount / stats.count) * 100,
        totalRequests: stats.count,
      };
    }

    // Return stats for all endpoints
    const allStats: Array<{
      endpoint: string;
      averageTime: number;
      successRate: number;
      totalRequests: number;
    }> = [];

    requestMetrics.current.forEach((stats, endpoint) => {
      allStats.push({
        endpoint,
        averageTime: stats.totalTime / stats.count,
        successRate: (stats.successCount / stats.count) * 100,
        totalRequests: stats.count,
      });
    });

    return allStats;
  }, []);

  return {
    recordRequest,
    getRequestStats,
  };
}

/**
 * Hook for monitoring memory usage and detecting memory leaks
 */
export function useMemoryMonitor(options: { interval?: number; enabled?: boolean } = {}) {
  const { interval = 30000, enabled = import.meta.env.DEV } = options;
  const memoryHistory = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled || !('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        memoryHistory.current.push(usedMB);

        // Keep only last 10 measurements
        if (memoryHistory.current.length > 10) {
          memoryHistory.current.shift();
        }

        // Check for memory growth trend
        if (memoryHistory.current.length >= 5) {
          const recent = memoryHistory.current.slice(-5);
          const isGrowing = recent.every((val, i) => i === 0 || val > recent[i - 1]);
          
          if (isGrowing && usedMB > 50) { // Alert if growing and over 50MB
            console.warn('📈 Memory usage is growing:', {
              currentUsage: `${usedMB.toFixed(2)}MB`,
              trend: recent.map(val => `${val.toFixed(2)}MB`),
            });
          }
        }
      }
    };

    const intervalId = setInterval(checkMemory, interval);
    checkMemory(); // Initial check

    return () => clearInterval(intervalId);
  }, [interval, enabled]);

  const getCurrentMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / 1024 / 1024,
        total: memory.totalJSHeapSize / 1024 / 1024,
        limit: memory.jsHeapSizeLimit / 1024 / 1024,
      };
    }
    return null;
  }, []);

  return {
    getCurrentMemoryUsage,
    memoryHistory: memoryHistory.current,
  };
}