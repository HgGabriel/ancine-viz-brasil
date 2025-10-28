import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  minItemWidth?: string;
  autoFit?: boolean;
}

/**
 * Responsive grid component that adapts to different screen sizes
 * Provides flexible column layouts and gap spacing
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = { sm: 4, md: 6, lg: 6, xl: 6 },
  minItemWidth,
  autoFit = false,
}) => {
  const { getGridColumns, getResponsiveValue } = useResponsive();

  const currentCols = getGridColumns(cols);
  const currentGap = getResponsiveValue(gap) || 4;

  // Generate grid classes
  const getGridClasses = () => {
    if (autoFit && minItemWidth) {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
        gap: `${currentGap * 0.25}rem`,
      };
    }

    const colsClass = `grid-cols-${currentCols}`;
    const gapClass = `gap-${currentGap}`;
    
    return cn('grid', colsClass, gapClass);
  };

  if (autoFit && minItemWidth) {
    return (
      <div 
        className={cn('grid', className)}
        style={getGridClasses() as React.CSSProperties}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {children}
    </div>
  );
};

/**
 * Responsive KPI grid specifically for dashboard KPI cards
 */
export const KpiGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <ResponsiveGrid
      cols={{ sm: 1, md: 2, lg: 2, xl: 4, '2xl': 4 }}
      gap={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

/**
 * Responsive chart grid for dashboard visualizations
 */
export const ChartGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'mixed' | 'single';
}> = ({ children, className, variant = 'default' }) => {
  const getColsConfig = () => {
    switch (variant) {
      case 'single':
        return { sm: 1, md: 1, lg: 1, xl: 1 };
      case 'mixed':
        return { sm: 1, md: 1, lg: 2, xl: 2 };
      default:
        return { sm: 1, md: 1, lg: 2, xl: 2 };
    }
  };

  return (
    <ResponsiveGrid
      cols={getColsConfig()}
      gap={{ sm: 4, md: 6, lg: 6, xl: 8 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

/**
 * Responsive content grid for general dashboard content
 */
export const ContentGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  sidebar?: boolean;
}> = ({ children, className, sidebar = false }) => {
  const colsConfig = sidebar 
    ? { sm: 1, md: 1, lg: 3, xl: 4 }
    : { sm: 1, md: 1, lg: 1, xl: 1 };

  return (
    <ResponsiveGrid
      cols={colsConfig}
      gap={{ sm: 4, md: 6, lg: 8, xl: 8 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

export default ResponsiveGrid;