import React from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { BarChart } from "@/components/charts/BarChart";
import { PaginatedTable } from "@/components/ui/paginated-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Film, Calendar, RotateCcw } from "lucide-react";
import { useApiData } from "@/hooks/useApiData";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { useState } from "react";

interface ObraData {
  cpb: string;
  titulo: string;
  ano_producao: number;
  tipo_obra: string;
  duracao_minutos: number;
  coproducao_internacional: boolean;
}

interface ProductionStats {
  total_obras: number;
  ano_pico_producao: number;
  obras_por_tipo: Array<{ tipo: string; quantidade: number }>;
  obras_por_ano: Array<{ ano: number; quantidade: number }>;
}

export const ProductionProfileTab: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");

  // Fetch production statistics
  const { data: stats, isLoading: statsLoading } = useApiData<ProductionStats>(
    "/producao/estatisticas"
  );

  // Fetch paginated works data with filters
  const {
    data: works,
    paginationInfo,
    isLoading: worksLoading,
    setPage,
    setFilters,
    resetFilters,
  } = usePaginatedData<ObraData>("/producao/obras", {
    pageSize: 15,
    initialFilters: {},
  });

  // Handle filter changes - using backend parameter names (work_type, year)
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    const newFilters: Record<string, any> = {};
    if (value && value !== "all") newFilters.work_type = value;
    if (yearFilter && yearFilter !== "all")
      newFilters.year = parseInt(yearFilter);
    setFilters(newFilters);
  };

  const handleYearFilterChange = (value: string) => {
    setYearFilter(value);
    const newFilters: Record<string, any> = {};
    if (typeFilter && typeFilter !== "all") newFilters.work_type = typeFilter;
    if (value && value !== "all") newFilters.year = parseInt(value);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setTypeFilter("");
    setYearFilter("");
    resetFilters();
  };

  // Table columns configuration
  const columns = [
    {
      id: "titulo",
      header: "Título",
      accessorKey: "titulo" as keyof ObraData,
      sortable: true,
    },
    {
      id: "tipo_obra",
      header: "Tipo",
      accessorKey: "tipo_obra" as keyof ObraData,
      sortable: true,
    },
    {
      id: "ano_producao",
      header: "Ano",
      accessorKey: "ano_producao" as keyof ObraData,
      sortable: true,
    },
    {
      id: "duracao_minutos",
      header: "Duração",
      accessorKey: "duracao_minutos" as keyof ObraData,
      sortable: true,
      cell: (value: number) => {
        if (!value) return "N/A";
        if (value >= 60) {
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
        }
        return `${value} min`;
      },
    },
    {
      id: "coproducao_internacional",
      header: "Coprodução",
      accessorKey: "coproducao_internacional" as keyof ObraData,
      cell: (value: boolean) => (value ? "Sim" : "Não"),
    },
  ];

  // Generate year options for filter (last 20 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

  // Get unique work types from stats for filter
  const workTypes = stats?.obras_por_tipo?.map((item) => item.tipo) || [];

  const filters = (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {workTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={handleYearFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetFilters}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Limpar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard
          title="Total de Obras"
          value={stats?.total_obras || 0}
          icon={Film}
          description="Obras registradas na base de dados"
          isLoading={statsLoading}
        />
        <KpiCard
          title="Ano de Maior Produção"
          value={stats?.ano_pico_producao || 0}
          icon={Calendar}
          description="Ano com maior número de obras produzidas"
          isLoading={statsLoading}
          formatValue={(val: string | number) => val.toString()}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Obras por Tipo" isLoading={statsLoading}>
          <BarChart
            data={stats?.obras_por_tipo || []}
            xAxisKey="tipo"
            yAxisKey="quantidade"
            orientation="horizontal"
            height={300}
          />
        </ChartWrapper>

        <ChartWrapper title="Obras por Ano" isLoading={statsLoading}>
          <BarChart
            data={stats?.obras_por_ano?.slice(-10) || []} // Show last 10 years
            xAxisKey="ano"
            yAxisKey="quantidade"
            orientation="vertical"
            height={300}
          />
        </ChartWrapper>
      </div>

      {/* Works Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Obras Registradas</h3>
        <PaginatedTable
          columns={columns}
          data={works}
          paginationInfo={paginationInfo}
          onPageChange={setPage}
          isLoading={worksLoading}
          filters={filters}
          emptyMessage="Nenhuma obra encontrada com os filtros aplicados."
        />
      </div>
    </div>
  );
};
