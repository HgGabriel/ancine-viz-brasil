import { Film, TrendingUp, MapPin, Users, AlertCircle } from "lucide-react";
import { KpiCardPercentage, KpiCardNumber } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { LineChart } from "@/components/charts/LineChart";
import { InteractiveBrazilMap } from "@/components/charts/InteractiveBrazilMap";
import { useOverviewKPIs, SalasData, BilheteriaData } from "@/hooks/useKPIs";
import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCompactNumber } from "@/lib/formatters";

interface MapChartDataItem {
  uf: string;
  value: number;
  name: string;
}

const Overview = () => {
  // Fetch KPI data using the new hooks
  const { marketShare, distribuidoras, salas: salasResponse, bilheteria: bilheteriaResponse, isLoading, isError, error } = useOverviewKPIs();

  const salas = salasResponse as { data: SalasData | undefined; isLoading: boolean; isError: boolean; error: Error | null };
  const bilheteria = bilheteriaResponse as { data: BilheteriaData | undefined; isLoading: boolean; isError: boolean; error: Error | null };


  // Prepare chart data
  const mapChartData: MapChartDataItem[] = useMemo(() => {
    if (!salas.data?.salas_por_uf) return [];
    return salas.data.salas_por_uf.map((item) => ({
      uf: item.uf,
      value: item.total_salas,
      name: item.nome_uf || item.uf
    }));
  }, [salas.data]);

  interface OverviewKpiData {
    marketSharePublic: number;
    marketShareRevenue: number;
    totalSalas: number;
    topDistribuidora: {
      distribuidora: string;
      publico: number;
    };
    precoMedioIngresso: number;
    publicoTotal: number;
    rendaTotal: number;
  }

  // Calculate KPI values from the new data structure
  const kpiData: OverviewKpiData = useMemo(() => {
    return {
      marketSharePublic: marketShare.data?.market_share_nacional_publico || 0,
      marketShareRevenue: marketShare.data?.market_share_nacional_renda || 0,
      totalSalas: salas.data?.total_salas || 0,
      topDistribuidora: {
        distribuidora: distribuidoras.data?.top_distribuidor || 'N/A',
        publico: distribuidoras.data?.top_distribuidor_publico || 0
      },
      precoMedioIngresso: bilheteria.data?.preco_medio_ingresso || 0,
      publicoTotal: bilheteria.data?.publico_total || 0,
      rendaTotal: bilheteria.data?.renda_total || 0
    };
  }, [marketShare.data, distribuidoras.data, salas.data, bilheteria.data]);

  // Prepare market share evolution data from bilheteria data
  const chartEvolutionData: HistoricoCompletoItem[] = useMemo(() => {
    if (!bilheteria.data?.historico_completo) {
      // Fallback mock data
      return [
        { ano: 2019, publico_total: 0, renda_total: 0 },
        { ano: 2020, publico_total: 0, renda_total: 0 },
        { ano: 2021, publico_total: 0, renda_total: 0 },
        { ano: 2022, publico_total: 0, renda_total: 0 },
        { ano: 2023, publico_total: 0, renda_total: 0 },
      ];
    }
    
    // Process real data if available
    return bilheteria.data.historico_completo.slice(-5).map((item) => ({
      ano: item.ano,
      publico_total: item.publico_total || 0,
      renda_total: item.renda_total || 0
    }));
  }, [bilheteria.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground">
          Principais indicadores do setor audiovisual brasileiro
        </p>
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar alguns dados. Verifique sua conexão e tente novamente.
            {error && ` (${error.message})`}
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCardPercentage
          title="Market Share (Público)"
          value={kpiData.marketSharePublic}
          icon={Film}
          description="Participação do cinema nacional no público total"
          isLoading={isLoading}
        />
        
        <KpiCardPercentage
          title="Market Share (Renda)"
          value={kpiData.marketShareRevenue}
          icon={TrendingUp}
          description="Participação do cinema nacional na renda total"
          isLoading={isLoading}
        />
        
        <KpiCardNumber
          title="Total de Salas"
          value={kpiData.totalSalas}
          icon={MapPin}
          description="Salas de cinema registradas no Brasil"
          isLoading={isLoading}
        />
        
        <div className="bg-card rounded-lg border-2 border-border/50 hover:border-border transition-all duration-300 hover:shadow-md p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">Top Distribuidora</p>
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">
              {isLoading ? "..." : kpiData.topDistribuidora.distribuidora}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isLoading 
                ? "Carregando..." 
                : `${formatCompactNumber(kpiData.topDistribuidora.publico)} espectadores`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper
          title="Evolução da Bilheteria Anual"
          isLoading={isLoading}
        >
          <LineChart<HistoricoCompletoItem>
            data={chartEvolutionData}
            xAxisKey="ano"
            yAxisKeys={["publico_total", "renda_total"] as (keyof HistoricoCompletoItem)[]}
            colors={["#009c3b", "#002776"]}
            height={300}
            showLegend={true}
            isLoading={isLoading}
          />
        </ChartWrapper>
        
        <ChartWrapper
          title="Mapa do Brasil - Salas de Cinema"
          isLoading={isLoading}
        >
          <InteractiveBrazilMap
            data={mapChartData}
            height={450}
            isLoading={isLoading}
          />
        </ChartWrapper>
      </div>
    </div>
  );
};

export default Overview;