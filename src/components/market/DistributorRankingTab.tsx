import { useState } from "react";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { BarChart } from "@/components/charts/BarChart";
import { PaginatedTable } from "@/components/ui/paginated-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDistribuidorasRanking } from "@/hooks/useAncineApi";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Column } from "@/types/ui";

interface DistribuidoraData {
  distribuidora_nome: string;
  total_publico: number;
  total_renda: number;
  total_filmes: number;
}

export const DistributorRankingTab = () => {
  const [selectedMetric, setSelectedMetric] = useState<'publico' | 'renda'>('publico');
  const [selectedFilter, setSelectedFilter] = useState<'geral' | 'nacional' | 'estrangeiro'>('geral');

  // Fetch top 10 distributors for chart
  const { data: topDistributors, isLoading: isLoadingTop } = useDistribuidorasRanking(10);

  // Fetch paginated data for table
  const {
    data: tableData,
    paginationInfo,
    isLoading: isLoadingTable,
    setPage,
    setFilters,
    filters
  } = usePaginatedData<DistribuidoraData>('/estatisticas/ranking_distribuidoras', {
    pageSize: 20,
    initialFilters: { tipo: selectedFilter !== 'geral' ? selectedFilter : undefined }
  });

  // Prepare chart data
  const chartData = topDistributors?.ranking?.map((item: DistribuidoraData) => ({
    name: item.distribuidora_nome.length > 20 
      ? item.distribuidora_nome.substring(0, 20) + '...' 
      : item.distribuidora_nome,
    fullName: item.distribuidora_nome,
    publico: item.total_publico,
    renda: item.total_renda / 1000000, // Convert to millions for better readability
    filmes: item.total_filmes
  })) || [];

  // Table columns
  const columns: Column<DistribuidoraData>[] = [
    {
      id: 'position',
      header: 'Posição',
      accessorKey: 'distribuidora_nome',
      cell: (_, row) => {
        const index = tableData.findIndex(item => item.distribuidora_nome === row.distribuidora_nome);
        return (paginationInfo.currentPage - 1) * paginationInfo.pageSize + index + 1;
      }
    },
    {
      id: 'name',
      header: 'Distribuidora',
      accessorKey: 'distribuidora_nome',
      sortable: true
    },
    {
      id: 'films',
      header: 'Total de Filmes',
      accessorKey: 'total_filmes',
      cell: (value) => formatNumber(value),
      sortable: true
    },
    {
      id: 'public',
      header: 'Público Total',
      accessorKey: 'total_publico',
      cell: (value) => formatNumber(value),
      sortable: true
    },
    {
      id: 'revenue',
      header: 'Renda Total',
      accessorKey: 'total_renda',
      cell: (value) => formatCurrency(value),
      sortable: true
    }
  ];

  // Handle filter changes
  const handleMetricChange = (value: 'publico' | 'renda') => {
    setSelectedMetric(value);
  };

  const handleFilterChange = (value: 'geral' | 'nacional' | 'estrangeiro') => {
    setSelectedFilter(value);
    setFilters({
      ...filters,
      tipo: value !== 'geral' ? value : undefined
    });
  };

  const filterControls = (
    <div className="flex gap-4 items-end">
      <div className="space-y-2">
        <Label htmlFor="metric-select">Métrica</Label>
        <Select value={selectedMetric} onValueChange={handleMetricChange}>
          <SelectTrigger className="w-40" id="metric-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publico">Público</SelectItem>
            <SelectItem value="renda">Renda</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="filter-select">Filtro</Label>
        <Select value={selectedFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40" id="filter-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geral">Geral</SelectItem>
            <SelectItem value="nacional">Nacional</SelectItem>
            <SelectItem value="estrangeiro">Estrangeiro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top 10 Chart */}
      <ChartWrapper
        title={`Top 10 Distribuidoras por ${selectedMetric === 'publico' ? 'Público' : 'Renda'}`}
        isLoading={isLoadingTop}
        actions={
          <Select value={selectedMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publico">Público</SelectItem>
              <SelectItem value="renda">Renda (M)</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <BarChart
          data={chartData}
          xAxisKey="name"
          yAxisKey={selectedMetric}
          orientation="horizontal"
          isLoading={isLoadingTop}
          height={400}
          colors={['#009c3b']}
        />
      </ChartWrapper>

      {/* Paginated Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Ranking Completo de Distribuidoras</h3>
        </div>
        
        <PaginatedTable
          columns={columns}
          data={tableData}
          paginationInfo={paginationInfo}
          onPageChange={setPage}
          isLoading={isLoadingTable}
          filters={filterControls}
          emptyMessage="Nenhuma distribuidora encontrada"
        />
      </div>
    </div>
  );
};