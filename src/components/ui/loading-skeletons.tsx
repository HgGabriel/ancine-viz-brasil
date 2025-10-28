import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

// KPI Card Skeleton
export function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

// Chart Skeleton
export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${height} rounded-md`} />
      </CardContent>
    </Card>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Table Skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  showHeader = true 
}: { 
  rows?: number; 
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          {showHeader && (
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Page Content Skeleton
export function PageContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Table */}
      <TableSkeleton />
    </div>
  );
}

// Navigation Skeleton
export function NavigationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 px-3 py-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Progressive Loading Indicator
export function ProgressiveLoadingSkeleton({ 
  stage = 1, 
  totalStages = 3,
  message = "Carregando dados..."
}: { 
  stage?: number; 
  totalStages?: number;
  message?: string;
}) {
  const progress = (stage / totalStages) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{message}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full animate-pulse ${
              index < stage ? 'bg-primary' : 'bg-muted'
            }`}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Data Visualization Loading Skeleton
export function DataVisualizationSkeleton({ 
  type = 'chart',
  showTitle = true,
  showLegend = false 
}: { 
  type?: 'chart' | 'map' | 'table';
  showTitle?: boolean;
  showLegend?: boolean;
}) {
  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
      )}
      <CardContent>
        {type === 'chart' && (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-md" />
            {showLegend && (
              <div className="flex justify-center space-x-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {type === 'map' && (
          <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-md" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        )}
        
        {type === 'table' && (
          <TableSkeleton rows={5} columns={4} />
        )}
      </CardContent>
    </Card>
  );
}

// Filter Controls Skeleton
export function FilterControlsSkeleton({ 
  filterCount = 3 
}: { 
  filterCount?: number 
}) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/20 rounded-md">
      {Array.from({ length: filterCount }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      ))}
      <div className="flex items-end">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Dashboard Grid Skeleton
export function DashboardGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Filters */}
      <FilterControlsSkeleton />
      
      {/* Charts and Visualizations */}
      <div className="grid gap-6 md:grid-cols-2">
        <DataVisualizationSkeleton type="chart" showLegend />
        <DataVisualizationSkeleton type="map" />
      </div>
      
      {/* Data Table */}
      <DataVisualizationSkeleton type="table" />
    </div>
  );
}

// Inline Loading Spinner
export function InlineLoadingSpinner({ 
  size = "sm",
  message 
}: { 
  size?: "sm" | "md" | "lg";
  message?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-muted border-t-primary`} />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}