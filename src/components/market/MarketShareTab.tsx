import { KpiCardPercentage } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { PieChart } from "@/components/charts/PieChart";
import { useMarketShare } from "@/hooks/useAncineApi";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export const MarketShareTab = () => {
  const { data: marketShareData, isLoading, error } = useMarketShare();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Erro ao carregar dados de market share
      </div>
    );
  }

  // Prepare data for pie charts
  const publicData = marketShareData ? [
    {
      name: "Cinema Nacional",
      value: marketShareData.market_share_nacional_publico,
      color: "#009c3b"
    },
    {
      name: "Cinema Estrangeiro", 
      value: 100 - marketShareData.market_share_nacional_publico,
      color: "#002776"
    }
  ] : [];

  const revenueData = marketShareData ? [
    {
      name: "Cinema Nacional",
      value: marketShareData.market_share_nacional_renda,
      color: "#009c3b"
    },
    {
      name: "Cinema Estrangeiro",
      value: 100 - marketShareData.market_share_nacional_renda,
      color: "#002776"
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCardPercentage
          title="Market Share Nacional (Público)"
          value={marketShareData?.market_share_nacional_publico || 0}
          icon={Users}
          description="Participação do cinema brasileiro no público total"
          isLoading={isLoading}
        />
        
        <KpiCardPercentage
          title="Market Share Nacional (Renda)"
          value={marketShareData?.market_share_nacional_renda || 0}
          icon={DollarSign}
          description="Participação do cinema brasileiro na renda total"
          isLoading={isLoading}
        />
        
        <KpiCardPercentage
          title="Market Share Estrangeiro (Público)"
          value={marketShareData ? 100 - marketShareData.market_share_nacional_publico : 0}
          icon={Users}
          description="Participação do cinema estrangeiro no público total"
          isLoading={isLoading}
        />
        
        <KpiCardPercentage
          title="Market Share Estrangeiro (Renda)"
          value={marketShareData ? 100 - marketShareData.market_share_nacional_renda : 0}
          icon={DollarSign}
          description="Participação do cinema estrangeiro na renda total"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper
          title="Distribuição de Público"
          isLoading={isLoading}
        >
          <PieChart
            data={publicData}
            isLoading={isLoading}
            showLegend={true}
            height={300}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Distribuição de Renda"
          isLoading={isLoading}
        >
          <PieChart
            data={revenueData}
            isLoading={isLoading}
            showLegend={true}
            height={300}
          />
        </ChartWrapper>
      </div>
    </div>
  );
};