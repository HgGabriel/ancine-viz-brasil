import {
  Film,
  TrendingUp,
  MapPin,
  Users,
  AlertCircle,
  Info,
  Database,
  Target,
} from "lucide-react";
import { KpiCardPercentage, KpiCardNumber } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { LineChart } from "@/components/charts/LineChart";
import { InteractiveBrazilMap } from "@/components/charts/InteractiveBrazilMap";
import { useOverviewKPIs } from "@/hooks/useKPIs";
import { HistoricoCompletoItem } from "@/types/ui";
import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCompactNumber } from "@/lib/formatters";
import { PageContext } from "@/components/ui/context-card";

interface MapChartDataItem {
  uf: string;
  value: number;
  name: string;
}

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

const Overview = () => {
  // Fetch KPI data using the new hooks
  const { marketShare, distribuidoras, salas, bilheteria } = useOverviewKPIs();

  const общийIsError =
    marketShare.isError ||
    distribuidoras.isError ||
    salas.isError ||
    bilheteria.isError;
  const error =
    marketShare.error ||
    distribuidoras.error ||
    salas.error ||
    bilheteria.error;

  // Prepare chart data
  const mapChartData: MapChartDataItem[] = useMemo(() => {
    if (!salas.data?.salas_por_uf) return [];
    return salas.data.salas_por_uf.map((item) => ({
      uf: item.uf,
      value: item.total_salas,
      name: item.nome_uf || item.uf,
    }));
  }, [salas.data]);

  // Calculate KPI values from the new data structure
  const kpiData: OverviewKpiData = useMemo(() => {
    const publicoTotal = bilheteria.data?.publico_total || 0;
    const rendaTotal = bilheteria.data?.renda_total || 0;
    const precoMedioIngresso = publicoTotal > 0 ? rendaTotal / publicoTotal : 0;

    return {
      marketSharePublic: marketShare.data?.market_share_nacional_publico || 0,
      marketShareRevenue: marketShare.data?.market_share_nacional_renda || 0,
      totalSalas: salas.data?.total_salas || 0,
      topDistribuidora: {
        distribuidora: distribuidoras.data?.top_distribuidor || "N/A",
        publico: distribuidoras.data?.top_distribuidor_publico || 0,
      },
      precoMedioIngresso,
      publicoTotal,
      rendaTotal,
    };
  }, [marketShare.data, distribuidoras.data, salas.data, bilheteria.data]);

  // Prepare market share evolution data from bilheteria data
  const chartEvolutionData: HistoricoCompletoItem[] = useMemo(() => {
    if (!bilheteria.data?.historico_completo) {
      // Fallback mock data
      return [
        { ano: "2019", publico_total: 0, renda_total: 0 },
        { ano: "2020", publico_total: 0, renda_total: 0 },
        { ano: "2021", publico_total: 0, renda_total: 0 },
        { ano: "2022", publico_total: 0, renda_total: 0 },
        { ano: "2023", publico_total: 0, renda_total: 0 },
      ];
    }

    // Process real data if available
    return bilheteria.data.historico_completo.slice(-5).map((item) => ({
      ano: item.ano,
      publico_total: item.publico_total || 0,
      renda_total: item.renda_total || 0,
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
      {общийIsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar alguns dados. Verifique sua conexão e tente
            novamente.
            {error && ` (${error.message})`}
          </AlertDescription>
        </Alert>
      )}

      {/* Context Cards */}
      <PageContext
        cards={[
          {
            title: "O que é a ANCINE?",
            description:
              "A Agência Nacional do Cinema (ANCINE) é a agência reguladora que fomenta, regula e fiscaliza a indústria cinematográfica e videofonográfica brasileira. Os dados apresentados neste dashboard são derivados dos registros oficiais da agência.",
            icon: Info,
            variant: "highlight",
          },
          {
            title: "Fonte dos Dados",
            description:
              "As informações exibidas são coletadas a partir das bases de dados públicas da ANCINE, incluindo o Observatório Brasileiro do Cinema e do Audiovisual (OCA), que consolida estatísticas sobre produção, distribuição e exibição.",
            icon: Database,
            variant: "info",
          },
          {
            title: "Objetivo do Dashboard",
            description:
              "Este painel oferece uma visão consolidada do mercado audiovisual brasileiro, permitindo análise de tendências, comparação de desempenho e acompanhamento dos principais indicadores do setor.",
            icon: Target,
            variant: "default",
          },
        ]}
        className="mb-2"
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCardPercentage
          title="Market Share (Público)"
          value={kpiData.marketSharePublic}
          icon={Film}
          description="Participação do cinema nacional no público total"
          isLoading={marketShare.isLoading}
        />

        <KpiCardPercentage
          title="Market Share (Renda)"
          value={kpiData.marketShareRevenue}
          icon={TrendingUp}
          description="Participação do cinema nacional na renda total"
          isLoading={marketShare.isLoading}
        />

        <KpiCardNumber
          title="Total de Salas"
          value={kpiData.totalSalas}
          icon={MapPin}
          description="Salas de cinema registradas no Brasil"
          isLoading={salas.isLoading}
        />

        <div className="bg-card rounded-lg border-2 border-border/50 hover:border-border transition-all duration-300 hover:shadow-md p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Top Distribuidora
            </p>
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">
              {distribuidoras.isLoading
                ? "..."
                : kpiData.topDistribuidora.distribuidora}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {distribuidoras.isLoading
                ? "Carregando..."
                : `${formatCompactNumber(
                    kpiData.topDistribuidora.publico
                  )} espectadores`}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bilheteria - Show KPI cards for single year, chart for multiple years */}
        {chartEvolutionData.length === 1 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Bilheteria {chartEvolutionData[0].ano}
            </h3>
            <div className="space-y-4">
              <KpiCardNumber
                title="Público Total"
                value={chartEvolutionData[0].publico_total}
                icon={Users}
                description={`Total de espectadores em ${chartEvolutionData[0].ano}`}
                isLoading={bilheteria.isLoading}
              />
              <KpiCardNumber
                title="Renda Total"
                value={chartEvolutionData[0].renda_total}
                icon={TrendingUp}
                description={`Receita total em ${chartEvolutionData[0].ano}`}
                isLoading={bilheteria.isLoading}
                prefix="R$"
              />
              <KpiCardNumber
                title="Preço Médio"
                value={
                  chartEvolutionData[0].publico_total > 0
                    ? chartEvolutionData[0].renda_total /
                      chartEvolutionData[0].publico_total
                    : 0
                }
                icon={Film}
                description="Valor médio por ingresso"
                isLoading={bilheteria.isLoading}
                prefix="R$"
              />
            </div>
          </div>
        ) : (
          <ChartWrapper
            title="Evolução da Bilheteria Anual"
            isLoading={bilheteria.isLoading}
          >
            <LineChart<HistoricoCompletoItem>
              data={chartEvolutionData}
              xAxisKey="ano"
              yAxisKeys={
                [
                  "publico_total",
                  "renda_total",
                ] as (keyof HistoricoCompletoItem)[]
              }
              colors={["#009c3b", "#002776"]}
              height={300}
              showLegend={true}
              isLoading={bilheteria.isLoading}
            />
          </ChartWrapper>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Mapa do Brasil - Salas de Cinema
          </h3>
          <InteractiveBrazilMap
            data={mapChartData}
            height={450}
            isLoading={salas.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
