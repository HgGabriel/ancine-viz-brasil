import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  title: string;
  isLoading?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  isLoading = false,
  children,
  actions,
  className = '',
  responsive = true,
}) => {
  const { isMobile, getChartHeight } = useResponsive();
  const chartHeight = responsive ? getChartHeight() : 300;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0",
        isMobile ? "pb-3 px-4 pt-4" : "pb-4 px-6 pt-6"
      )}>
        <CardTitle className={cn(
          "font-semibold text-foreground",
          isMobile ? "text-base" : "text-lg"
        )}>
          {title}
        </CardTitle>
        {actions && (
          <div className={cn(
            "flex items-center",
            isMobile ? "space-x-1" : "space-x-2"
          )}>
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(
        "pt-0",
        isMobile ? "px-4 pb-4" : "px-6 pb-6"
      )}>
        {isLoading ? (
          <div className="space-y-4">
            {/* Chart area skeleton */}
            <div className="relative">
              <Skeleton 
                className="w-full rounded-md" 
                style={{ height: chartHeight }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-primary" />
                  <span className={cn(
                    "text-muted-foreground",
                    isMobile ? "text-xs" : "text-sm"
                  )}>
                    Processando dados...
                  </span>
                </div>
              </div>
            </div>
            
            {/* Legend skeleton */}
            <div className={cn(
              "flex justify-center",
              isMobile ? "space-x-2" : "space-x-4"
            )}>
              <Skeleton className={cn(
                "h-4",
                isMobile ? "w-12" : "w-16"
              )} />
              <Skeleton className={cn(
                "h-4",
                isMobile ? "w-12" : "w-16"
              )} />
              <Skeleton className={cn(
                "h-4",
                isMobile ? "w-12" : "w-16"
              )} />
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartWrapper;