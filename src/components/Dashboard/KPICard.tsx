import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  isLoading?: boolean;
  variant?: "primary" | "accent" | "blue";
}

export const KPICard = ({
  title,
  value,
  icon,
  trend,
  description,
  isLoading,
  variant = "primary",
}: KPICardProps) => {
  const variantStyles = {
    primary: "border-primary/20 hover:border-primary/40 hover:shadow-brazil",
    accent: "border-accent/20 hover:border-accent/40",
    blue: "border-blue/20 hover:border-blue/40",
  };

  const iconStyles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent-foreground",
    blue: "bg-blue/10 text-blue",
  };

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 transition-all duration-300 ${variantStyles[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${iconStyles[variant]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? "text-primary" : "text-destructive"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
