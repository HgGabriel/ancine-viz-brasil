import { Film, TrendingUp, MapPin, Users, AlertCircle } from "lucide-react";
import { KpiCardPercentage, KpiCardNumber } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { LineChart } from "@/components/charts/LineChart";
import { MapChart } from "@/components/charts/MapChart";
import { useOverviewKPIs } from "@/hooks/useKPIs";
import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatNumber, formatCompactNumber } from "@/lib/formatters";



const Overview = () => {
  // Fetch KPI data using the new hooks
  const { marketShare, distribuidoras, salas, bilheteria, isLoading, isError, error } = useOverviewKPIs();

  // Calculate KPI values from the new data structure
  const kpiData = useMemo(() => {
    return {
      marketSharePublic: marketShare.data?.market_share_nacional_publico || 0,
      marketShareRevenue: marketShare.data?.market_share_nacional_renda || 0,
      totalSalas: salas.data?.total_salas || 0,
      topDistribuidora: {
        nome: distribuidoras.data?.top_distribuidor || 'N/A',
        publico: distribuidoras.data?.top_distribuidor_publico || 0
      },
      precoMedioIngresso: bilheteria.data?.preco_medio_ingresso || 0,
      publicoTotal: bilheteria.data?.publico_total || 0,
      rendaTotal: bilheteria.data?.renda_total || 0
    };
  }, [marketShare.data, distribuidoras.data, salas.data, bilheteria.data]);

  // Prepare chart data
  const mapChartData = useMemo(() => {
    if (!salas.data?.salas_por_uf) return [];
    return salas.data.salas_por_uf.map((item: any) => ({
      uf: item.uf,
      value: item.total_salas,
      name: item.nome_uf || item.uf
    }));
  }, [salas.data]);

  // Prepare market share evolution data from bilheteria data
  const chartEvolutionData = useMemo(() => {
    if (!bilheteria.data?.historico_completo) {
      // Fallback mock data
      return [
        { ano: '2019', nacional: 18.2, estrangeiro: 81.8 },
        { ano: '2020', nacional: 22.1, estrangeiro: 77.9 },
        { ano: '2021', nacional: 25.3, estrangeiro: 74.7 },
        { ano: '2022', nacional: 28.7, estrangeiro: 71.3 },
        { ano: '2023', nacional: 31.2, estrangeiro: 68.8 },
      ];
    }
    
    // Process real data if available
    return bilheteria.data.historico_completo.slice(-5).map((item: any) => ({
      ano: item.ano.toString(),
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
              {isLoading ? "..." : kpiData.topDistribuidora.nome}
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
          <LineChart
            data={chartEvolutionData}
            xAxisKey="ano"
            yAxisKeys={["publico_total", "renda_total"]}
            colors={["#009c3b", "#002776"]}
            height={300}
            showLegend={true}
            isLoading={isLoading}
          />
        </ChartWrapper>
        
        <ChartWrapper
          title="Distribuição de Salas por Estado"
          isLoading={isLoading}
        >
          <MapChart
            data={mapChartData}
            height={300}
            isLoading={isLoading}
          />
        </ChartWrapper>
      </div>
    </div>
  );
};

export default Overview;