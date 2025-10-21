import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { KPICard } from "@/components/Dashboard/KPICard";
import { MarketShareChart } from "@/components/Dashboard/MarketShareChart";
import { DistribuidorasChart } from "@/components/Dashboard/DistribuidorasChart";
import { SalasMapChart } from "@/components/Dashboard/SalasMapChart";
import { Film, TrendingUp, MapPin, Users } from "lucide-react";
import { useMarketShare, useSalasPorUF, useDistribuidorasRanking } from "@/hooks/useAncineApi";

const Index = () => {
  const { data: marketShareData, isLoading: marketShareLoading } = useMarketShare();
  const { data: salasData, isLoading: salasLoading } = useSalasPorUF();
  const { data: distribuidorasData, isLoading: distribuidorasLoading } = useDistribuidorasRanking(1);

  const totalSalas = salasData?.salas_por_uf?.reduce(
    (acc: number, item: any) => acc + item.total_salas,
    0
  ) || 0;

  const topDistribuidora = distribuidorasData?.ranking?.[0];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Market Share Nacional"
            value={`${marketShareData?.market_share_nacional_publico?.toFixed(1) || 0}%`}
            icon={<Film className="h-5 w-5" />}
            description="Participação de público"
            isLoading={marketShareLoading}
            variant="primary"
          />
          <KPICard
            title="Renda Nacional"
            value={`${marketShareData?.market_share_nacional_renda?.toFixed(1) || 0}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            description="Participação de renda"
            isLoading={marketShareLoading}
            variant="blue"
          />
          <KPICard
            title="Total de Salas"
            value={totalSalas.toLocaleString()}
            icon={<MapPin className="h-5 w-5" />}
            description="Salas ativas no Brasil"
            isLoading={salasLoading}
            variant="accent"
          />
          <KPICard
            title="Top Distribuidora"
            value={topDistribuidora?.total_publico?.toLocaleString() || "N/A"}
            icon={<Users className="h-5 w-5" />}
            description={topDistribuidora?.distribuidora_nome?.substring(0, 25) || "Carregando..."}
            isLoading={distribuidorasLoading}
            variant="primary"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MarketShareChart />
          <SalasMapChart />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <DistribuidorasChart />
        </div>



        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Dados fornecidos pela API ANCINE • Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
