import React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { BarChart } from '@/components/charts/BarChart';
import { PaginatedTable } from '@/components/ui/paginated-table';
import { Globe, TrendingUp } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { usePaginatedData } from '@/hooks/usePaginatedData';

interface CoProductionStats {
  taxa_coproducao: number;
  principais_paises_parceiros: Array<{ pais: string; quantidade: number }>;
  comparacao_performance: {
    coproducoes: { publico_medio: number; renda_media: number };
    nacionais: { publico_medio: number; renda_media: number };
  };
}

interface CoProductionWork {
  cpb: string;
  titulo: string;
  ano_producao: number;
  tipo_obra: string;
  paises_coproducao: string[];
  publico_total?: number;
  renda_total?: number;
}

export const CoProductionsTab: React.FC = () => {
  // Fetch co-production statistics
  const { data: stats, isLoading: statsLoading } = useApiData<CoProductionStats>('/producao/coproducoes/estatisticas');

  // Fetch paginated co-production works
  const {
    data: coProductions,
    paginationInfo,
    isLoading: worksLoading,
    setPage,
  } = usePaginatedData<CoProductionWork>('/producao/coproducoes', {
    pageSize: 15,
    initialFilters: { coproducao_internacional: true },
  });

  // Calculate performance difference
  const performanceDiff = stats?.comparacao_performance ? 
    ((stats.comparacao_performance.coproducoes.publico_medio - stats.comparacao_performance.nacionais.publico_medio) / 
     stats.comparacao_performance.nacionais.publico_medio) * 100 : 0;

  // Get top partner country
  const topPartner = stats?.principais_paises_parceiros?.[0]?.pais || 'N/A';

  // Table columns configuration
  const columns = [
    {
      id: 'titulo',
      header: 'Título',
      accessorKey: 'titulo' as keyof CoProductionWork,
      sortable: true,
    },
    {
      id: 'ano_producao',
      header: 'Ano',
      accessorKey: 'ano_producao' as keyof CoProductionWork,
      sortable: true,
    },
    {
      id: 'tipo_obra',
      header: 'Tipo',
      accessorKey: 'tipo_obra' as keyof CoProductionWork,
      sortable: true,
    },
    {
      id: 'paises_coproducao',
      header: 'Países Parceiros',
      accessorKey: 'paises_coproducao' as keyof CoProductionWork,
      cell: (value: string[]) => value?.join(', ') || 'N/A',
    },
    {
      id: 'publico_total',
      header: 'Público',
      accessorKey: 'publico_total' as keyof CoProductionWork,
      sortable: true,
      cell: (value: number) => value ? value.toLocaleString('pt-BR') : 'N/A',
    },
    {
      id: 'renda_total',
      header: 'Renda (R$)',
      accessorKey: 'renda_total' as keyof CoProductionWork,
      sortable: true,
      cell: (value: number) => value ? 
        new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value) : 'N/A',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard
          title="Taxa de Coprodução"
          value={stats?.taxa_coproducao || 0}
          icon={Globe}
          description="Percentual de obras em coprodução internacional"
          isLoading={statsLoading}
          formatValue={(val) => `${Number(val).toFixed(1)}%`}
        />
        <KpiCard
          title="Principal Parceiro"
          value={topPartner}
          icon={TrendingUp}
          description="País com maior número de coproduções"
          isLoading={statsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper
          title="Principais Países Parceiros"
          isLoading={statsLoading}
        >
          <BarChart
            data={stats?.principais_paises_parceiros?.slice(0, 10) || []}
            xAxisKey="pais"
            yAxisKey="quantidade"
            orientation="horizontal"
            height={300}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Performance: Coproduções vs Nacionais"
          isLoading={statsLoading}
        >
          <BarChart
            data={[
              {
                categoria: 'Público Médio',
                'Coproduções': stats?.comparacao_performance?.coproducoes?.publico_medio || 0,
                'Nacionais': stats?.comparacao_performance?.nacionais?.publico_medio || 0,
              },
              {
                categoria: 'Renda Média (R$)',
                'Coproduções': stats?.comparacao_performance?.coproducoes?.renda_media || 0,
                'Nacionais': stats?.comparacao_performance?.nacionais?.renda_media || 0,
              },
            ]}
            xAxisKey="categoria"
            yAxisKey={['Coproduções', 'Nacionais']}
            orientation="vertical"
            height={300}
            showLegend={true}
          />
        </ChartWrapper>
      </div>

      {/* Performance Insight */}
      {stats?.comparacao_performance && (
        <div className="bg-card rounded-lg border p-4">
          <h4 className="font-semibold mb-2">Análise de Performance</h4>
          <p className="text-sm text-muted-foreground">
            As coproduções internacionais têm um desempenho{' '}
            <span className={performanceDiff > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {performanceDiff > 0 ? 'superior' : 'inferior'}
            </span>{' '}
            às produções puramente nacionais, com uma diferença de{' '}
            <span className="font-medium">
              {Math.abs(performanceDiff).toFixed(1)}%
            </span>{' '}
            no público médio.
          </p>
        </div>
      )}

      {/* Co-productions Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Coproduções Internacionais</h3>
        <PaginatedTable
          columns={columns}
          data={coProductions}
          paginationInfo={paginationInfo}
          onPageChange={setPage}
          isLoading={worksLoading}
          emptyMessage="Nenhuma coprodução encontrada."
        />
      </div>
    </div>
  );
};