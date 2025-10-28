import { KpiCard, KpiCardCurrency, KpiCardNumber } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { useDistributionKPIs, useDistributionTrends, useGenrePerformance } from "@/hooks/useAncineApi";
import { TrendingUp, Users, DollarSign, Ticket } from "lucide-react";

export const DistributionTrendsTab = () => {
  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useDistributionKPIs();
  const { data: trendsData, isLoading: trendsLoading, error: trendsError } = useDistributionTrends();
  const { data: genreData, isLoading: genreLoading, error: genreError } = useGenrePerformance();

  if (kpiError || trendsError || genreError) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Erro ao carregar dados de distribuição
      </div>
    );
  }

  // Calculate average ticket price
  const averageTicketPrice = kpiData?.total_renda && kpiData?.total_publico 
    ? kpiData.total_renda / kpiData.total_publico 
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCardNumber
          title="Público Total (Ano Atual)"
          value={kpiData?.total_publico || 0}
          icon={Users}
          description="Total de espectadores no ano corrente"
          isLoading={kpiLoading}
        />
        
        <KpiCardCurrency
          title="Renda Total (Ano Atual)"
          value={kpiData?.total_renda || 0}
          icon={DollarSign}
          description="Receita total de bilheteria no ano corrente"
          isLoading={kpiLoading}
        />
        
        <KpiCardCurrency
          title="Preço Médio do Ingresso"
          value={averageTicketPrice}
          icon={Ticket}
          description="Valor médio pago por ingresso"
          isLoading={kpiLoading}
        />
      </div>

      {/* Trend Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Evolução Anual do Público"
          isLoading={trendsLoading}
        >
          <LineChart
            data={trendsData?.public_evolution || []}
            xAxisKey="ano"
            yAxisKeys={["publico_total"]}
            isLoading={trendsLoading}
            colors={["#009c3b"]}
            height={300}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Evolução Anual da Renda"
          isLoading={trendsLoading}
        >
          <LineChart
            data={trendsData?.revenue_evolution || []}
            xAxisKey="ano"
            yAxisKeys={["renda_total"]}
            isLoading={trendsLoading}
            colors={["#002776"]}
            height={300}
          />
        </ChartWrapper>
      </div>

      {/* Genre Performance Chart */}
      <ChartWrapper
        title="Desempenho Médio por Gênero (Conteúdo Nacional)"
        isLoading={genreLoading}
      >
        <BarChart
          data={genreData || []}
          xAxisKey="genero"
          yAxisKey="publico_medio"
          isLoading={genreLoading}
          orientation="horizontal"
          colors={["#009c3b"]}
          height={400}
        />
      </ChartWrapper>
    </div>
  );
};