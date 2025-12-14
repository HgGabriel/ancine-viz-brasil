import { ChartConfig } from "@/components/ui/chart";
import { LucideIcon } from "lucide-react";

export type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export interface KPIProps {
  title: string;
  value: string | number;
  description: string;
  icon?: LucideIcon;
  isLoading?: boolean;
}

export interface KPICardProps {
  title: string;
  value: number;
  description: string;
  icon?: LucideIcon;
  isLoading?: boolean;
}

export interface KPICardPercentageProps extends KPICardProps {
  value: number;
}

export interface ChartCardProps {
  title: string;
  chartData: Record<string, any>[];
  chartConfig: ChartConfig;
  isLoading?: boolean;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: any[];
  pageSize?: number;
  onFilterChange?: (filters: Record<string, string>) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  totalRows?: number;
  currentPage?: number;
  filterValue?: string;
  setFilterValue?: (value: string) => void;
  columnFilters?: any;
  setColumnFilters?: any;
  columnVisibility?: any;
  setColumnVisibility?: any;
  rowSelection?: any;
  setRowSelection?: any;
}

export interface SalasPorUfItem {
  uf: string;
  total_salas: number;
  nome_uf: string;
}

export interface SalasData {
  total_salas: number;
  total_estados_com_salas: number;
  estado_com_mais_salas: string;
  maior_numero_salas: number;
  salas_por_uf: SalasPorUfItem[];
  data_original: SalasPorUfItem[];
  metadata: any;
}

export interface HistoricoCompletoItem {
  ano: string;
  publico_total: number;
  renda_total: number;
}

export interface BilheteriaData {
  ano_atual: string;
  publico_total: number;
  renda_total: number;
  publico_variacao_anual: number;
  renda_variacao_anual: number;
  historico_completo: HistoricoCompletoItem[];
  metadata: any;
}