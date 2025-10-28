import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Loading state interface
export interface LoadingState {
  isLoading?: boolean;
}

// KPI Card interfaces
export interface TrendData {
  value: number;
  isPositive: boolean;
  label?: string;
}

export interface KpiCardProps extends BaseComponentProps, LoadingState {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: TrendData;
  formatValue?: (value: string | number) => string;
}

// Table interfaces
export interface Column<T = any> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: any;
}

export interface PaginatedTableProps<T = any> extends BaseComponentProps, LoadingState {
  columns: Column<T>[];
  data: T[];
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void;
  onFilterChange?: (filters: FilterConfig) => void;
  filters?: ReactNode;
  emptyMessage?: string;
  showPagination?: boolean;
}

// Chart interfaces
export interface ChartWrapperProps extends BaseComponentProps, LoadingState {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  description?: string;
}

export interface BaseChartProps extends LoadingState {
  data: Array<Record<string, any>>;
  colors?: string[];
  height?: number;
  responsive?: boolean;
}

export interface BarChartProps extends BaseChartProps {
  xAxisKey: string;
  yAxisKey: string;
  orientation?: 'horizontal' | 'vertical';
  showGrid?: boolean;
  showTooltip?: boolean;
}

export interface LineChartProps extends BaseChartProps {
  xAxisKey: string;
  yAxisKeys: string[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export interface PieChartProps extends BaseChartProps {
  dataKey: string;
  nameKey: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export interface MapChartProps extends BaseChartProps {
  data: Array<{ uf: string; value: number; name: string }>;
  colorScale?: string[];
  showTooltip?: boolean;
}

// Navigation interfaces
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps extends BaseComponentProps {
  items: NavigationItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
  currentPath?: string;
}

// Layout interfaces
export interface MainLayoutProps extends BaseComponentProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
}

export interface HeaderProps extends BaseComponentProps {
  title?: string;
  showThemeToggle?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

// Form interfaces
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterSelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  data: T[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
    last_id?: string;
  };
  success?: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
}

// Theme interfaces
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  mode: 'light' | 'dark';
}

// Skeleton interfaces
export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
}

export interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  height?: string;
}

// Utility types
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type ComponentState = 'default' | 'loading' | 'error' | 'success';

// Event handler types
export type ClickHandler = (event: React.MouseEvent) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler = (event: React.FormEvent) => void;