import { useState, useEffect } from 'react';

export interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof BreakpointConfig;

/**
 * Hook for responsive design utilities
 * Provides current screen size information and responsive helpers
 */
export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Current breakpoint detection
  const getCurrentBreakpoint = (): Breakpoint => {
    const { width } = windowSize;
    
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'sm'; // Default to smallest
  };

  const currentBreakpoint = getCurrentBreakpoint();

  // Responsive utilities
  const isMobile = windowSize.width < breakpoints.md;
  const isTablet = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;
  const isLargeDesktop = windowSize.width >= breakpoints.xl;

  // Breakpoint checkers
  const isAbove = (breakpoint: Breakpoint): boolean => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  const isBelow = (breakpoint: Breakpoint): boolean => {
    return windowSize.width < breakpoints[breakpoint];
  };

  const isBetween = (min: Breakpoint, max: Breakpoint): boolean => {
    return windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];
  };

  // Responsive value selector
  const getResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
    // Check from largest to smallest breakpoint
    const orderedBreakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
    
    for (const bp of orderedBreakpoints) {
      if (windowSize.width >= breakpoints[bp] && values[bp] !== undefined) {
        return values[bp];
      }
    }
    
    return undefined;
  };

  // Grid columns calculator for responsive grids
  const getGridColumns = (config: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  }): number => {
    return getResponsiveValue(config) || config.sm || 1;
  };

  // Chart height calculator based on screen size
  const getChartHeight = (config?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  }): number => {
    const defaultConfig = {
      mobile: 250,
      tablet: 300,
      desktop: 400,
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    if (isMobile) return finalConfig.mobile;
    if (isTablet) return finalConfig.tablet;
    return finalConfig.desktop;
  };

  return {
    windowSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isAbove,
    isBelow,
    isBetween,
    getResponsiveValue,
    getGridColumns,
    getChartHeight,
  };
}

/**
 * Hook for managing responsive sidebar state
 */
export function useResponsiveSidebar() {
  const { isMobile, isTablet } = useResponsive();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    if (isTablet && !isMobile) {
      setIsCollapsed(true);
    } else if (!isMobile && !isTablet) {
      setIsCollapsed(false);
    }
  }, [isMobile, isTablet]);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return {
    isCollapsed,
    isMobileOpen,
    toggleSidebar,
    closeMobileSidebar,
    shouldShowOverlay: isMobile && isMobileOpen,
  };
}

/**
 * Hook for responsive table configuration
 */
export function useResponsiveTable() {
  const { isMobile, isTablet, getResponsiveValue } = useResponsive();

  const getPageSize = (): number => {
    return getResponsiveValue({
      sm: 5,
      md: 10,
      lg: 15,
      xl: 20,
    }) || 10;
  };

  const shouldStackColumns = (): boolean => {
    return isMobile;
  };

  const getVisibleColumns = (totalColumns: number): number => {
    if (isMobile) return Math.min(2, totalColumns);
    if (isTablet) return Math.min(4, totalColumns);
    return totalColumns;
  };

  return {
    pageSize: getPageSize(),
    shouldStackColumns: shouldStackColumns(),
    getVisibleColumns,
  };
}