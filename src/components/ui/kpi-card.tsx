import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { cn, formatNumber, formatCurrency, formatPercentage } from "@/lib/utils";
import { KpiCardProps } from "@/types/ui";
import { useResponsive } from "@/hooks/useResponsive";

const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend, 
    isLoading, 
    formatValue,
    className,
    ...props 
  }, ref) => {
    const { isMobile, isTablet } = useResponsive();
    
    // Default value formatter
    const defaultFormatValue = (val: string | number): string => {
      if (typeof val === 'string') return val;
      return formatNumber(val);
    };

    const formatter = formatValue || defaultFormatValue;

    if (isLoading) {
      return (
        <Card ref={ref} className={cn("border-2", className)} {...props}>
          <CardHeader className={cn(
            "flex flex-row items-center justify-between space-y-0",
            isMobile ? "pb-1 px-4 pt-4" : "pb-2 px-6 pt-6"
          )}>
            <Skeleton className={cn(
              "h-4",
              isMobile ? "w-20" : "w-24"
            )} />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent className={cn(
            isMobile ? "px-4 pb-4" : "px-6 pb-6"
          )}>
            <Skeleton className={cn(
              "mb-2",
              isMobile ? "h-6 w-16" : "h-8 w-20"
            )} />
            <Skeleton className={cn(
              "h-3",
              isMobile ? "w-24" : "w-32"
            )} />
          </CardContent>
        </Card>
      );
    }

    const formattedValue = formatter(value);
    const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;
    const trendColor = trend?.isPositive 
      ? "text-green-600 dark:text-green-400" 
      : "text-red-600 dark:text-red-400";

    return (
      <Card 
        ref={ref} 
        className={cn(
          "border-2 transition-all duration-300 hover:shadow-md",
          "border-border/50 hover:border-border",
          className
        )} 
        {...props}
      >
        <CardHeader className={cn(
          "flex flex-row items-center justify-between space-y-0",
          isMobile ? "pb-1 px-4 pt-4" : "pb-2 px-6 pt-6"
        )}>
          <CardTitle className={cn(
            "font-medium text-muted-foreground leading-tight",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {title}
          </CardTitle>
          {Icon && (
            <div className={cn(
              "rounded-full bg-primary/10 text-primary flex-shrink-0",
              isMobile ? "p-1.5" : "p-2"
            )}>
              <Icon className={cn(
                isMobile ? "h-3 w-3" : "h-4 w-4"
              )} />
            </div>
          )}
        </CardHeader>
        <CardContent className={cn(
          isMobile ? "px-4 pb-4" : "px-6 pb-6"
        )}>
          <div className={cn(
            "flex items-baseline gap-2 mb-1",
            isMobile && "flex-wrap"
          )}>
            <div className={cn(
              "font-bold tracking-tight",
              isMobile ? "text-lg" : isTablet ? "text-xl" : "text-2xl"
            )}>
              {formattedValue}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 font-medium",
                trendColor,
                isMobile ? "text-xs" : "text-sm"
              )}>
                <TrendIcon className={cn(
                  isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                )} />
                <span>{formatPercentage(Math.abs(trend.value), 1)}</span>
                {trend.label && !isMobile && (
                  <span className="text-xs text-muted-foreground">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>
          {description && (
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              isMobile ? "text-xs" : "text-xs"
            )}>
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
);

KpiCard.displayName = "KpiCard";

// Specialized KPI card variants
const KpiCardCurrency = React.forwardRef<HTMLDivElement, Omit<KpiCardProps, 'formatValue'>>(
  (props, ref) => (
    <KpiCard 
      ref={ref} 
      {...props} 
      formatValue={(val) => typeof val === 'number' ? formatCurrency(val) : val.toString()}
    />
  )
);

KpiCardCurrency.displayName = "KpiCardCurrency";

const KpiCardPercentage = React.forwardRef<HTMLDivElement, Omit<KpiCardProps, 'formatValue'>>(
  (props, ref) => (
    <KpiCard 
      ref={ref} 
      {...props} 
      formatValue={(val) => typeof val === 'number' ? formatPercentage(val) : val.toString()}
    />
  )
);

KpiCardPercentage.displayName = "KpiCardPercentage";

const KpiCardNumber = React.forwardRef<HTMLDivElement, Omit<KpiCardProps, 'formatValue'>>(
  (props, ref) => (
    <KpiCard 
      ref={ref} 
      {...props} 
      formatValue={(val) => typeof val === 'number' ? formatNumber(val) : val.toString()}
    />
  )
);

KpiCardNumber.displayName = "KpiCardNumber";

export { 
  KpiCard, 
  KpiCardCurrency, 
  KpiCardPercentage, 
  KpiCardNumber 
};