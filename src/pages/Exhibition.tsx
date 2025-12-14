import React from "react";
import { Building2, MapPin, Users, Building, Map, Network } from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { InteractiveBrazilMap } from "@/components/charts/InteractiveBrazilMap";
import { BarChart } from "@/components/charts/BarChart";
import { ExhibitionDataTable } from "@/components/exhibition/ExhibitionDataTable";
import { useExhibitionData } from "@/hooks/useExhibitionApi";
import { PageContext } from "@/components/ui/context-card";

// Define interfaces for data structures
interface SalasPorUF {
  uf: string;
  nome_uf: string;
  total_salas: number;
  total_complexos: number;
}

interface TopMunicipio {
  municipio: string;
  uf: string;
  total_salas: number;
  total_complexos: number;
}

interface GrupoExibicao {
  grupo_exibicao: string;
  total_salas: number;
  total_complexos: number;
  participacao_mercado: number;
}

interface ExhibitionData {
  total_salas: number;
  total_complexos: number;
  salas_por_uf: SalasPorUF[];
  top_municipios: TopMunicipio[];
  grupos_exibicao: GrupoExibicao[];
}

const Exhibition = () => {
  const { data, isLoading: exhibitionLoading } = useExhibitionData();
  const exhibitionData = data as ExhibitionData | undefined;

  // Calculate KPIs from the data
  const totalComplexes = exhibitionData?.total_complexos || 0;
  const totalTheaters = exhibitionData?.total_salas || 0;
  const avgTheatersPerComplex =
    totalComplexes > 0 ? totalTheaters / totalComplexes : 0;

  // Calculate additional metrics for better insights
  const largestState = exhibitionData?.salas_por_uf?.reduce(
    (max: SalasPorUF, current: SalasPorUF) =>
      current.total_salas > (max?.total_salas || 0) ? current : max,
    {} as SalasPorUF
  );
  const topExhibitionGroup = exhibitionData?.grupos_exibicao?.[0];

  // Prepare data for the Brazil map
  const mapData =
    exhibitionData?.salas_por_uf?.map((item: SalasPorUF) => ({
      uf: item.uf,
      value: item.total_salas,
      name: item.nome_uf || item.uf,
    })) || [];

  // Prepare data for top municipalities chart
  const topMunicipalities =
    exhibitionData?.top_municipios?.slice(0, 10).map((item: TopMunicipio) => ({
      municipio: item.municipio,
      total_salas: item.total_salas,
    })) || [];

  // Prepare data for exhibition groups chart
  const exhibitionGroups =
    exhibitionData?.grupos_exibicao
      ?.slice(0, 10)
      .map((item: GrupoExibicao) => ({
        grupo: item.grupo_exibicao,
        total_salas: item.total_salas,
      })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Exibição</h1>
        <p className="text-muted-foreground">
          Distribuição geográfica de salas de cinema no Brasil
        </p>
      </div>

      {/* Context Cards */}
      <PageContext
        cards={[
          {
            title: "Infraestrutura de Cinema",
            description:
              "O parque exibidor brasileiro é composto por complexos cinematográficos distribuídos pelo país. Cada complexo pode conter múltiplas salas de projeção, variando de pequenos cinemas locais a grandes multiplex em shoppings centers.",
            icon: Building,
            variant: "highlight",
          },
          {
            title: "Concentração Geográfica",
            description:
              "A distribuição de salas de cinema no Brasil é desigual, com forte concentração nas regiões Sul e Sudeste. Políticas públicas buscam democratizar o acesso ao cinema em cidades do interior e regiões menos atendidas.",
            icon: Map,
            variant: "info",
          },
          {
            title: "Grupos Exibidores",
            description:
              "O mercado de exibição é dominado por grandes redes como Cinemark, Kinoplex e UCI. Esses grupos controlam parte significativa das salas e têm poder de negociação sobre quais filmes serão exibidos e por quanto tempo.",
            icon: Network,
            variant: "default",
          },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total de Complexos"
          value={totalComplexes}
          icon={Building2}
          description={`Maior concentração: ${largestState?.nome_uf || "N/A"}`}
          isLoading={exhibitionLoading}
        />
        <KpiCard
          title="Total de Salas"
          value={totalTheaters}
          icon={MapPin}
          description={`${largestState?.uf || "N/A"}: ${
            largestState?.total_salas || 0
          } salas`}
          isLoading={exhibitionLoading}
        />
        <KpiCard
          title="Média de Salas por Complexo"
          value={avgTheatersPerComplex.toFixed(1)}
          icon={Users}
          description={`Líder: ${topExhibitionGroup?.grupo_exibicao || "N/A"}`}
          isLoading={exhibitionLoading}
        />
      </div>

      {/* Main Map Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper
          title="Mapa Interativo - Salas por Estado"
          isLoading={exhibitionLoading}
        >
          <InteractiveBrazilMap
            data={mapData}
            isLoading={exhibitionLoading}
            height={450}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Top 10 Municípios por Número de Salas"
          isLoading={exhibitionLoading}
        >
          <BarChart
            data={topMunicipalities}
            xAxisKey="municipio"
            yAxisKey="total_salas"
            isLoading={exhibitionLoading}
            orientation="vertical"
            height={400}
          />
        </ChartWrapper>
      </div>

      {/* Exhibition Groups Chart */}
      <ChartWrapper
        title="Ranking dos Grupos de Exibição por Número de Salas"
        isLoading={exhibitionLoading}
      >
        <BarChart
          data={exhibitionGroups}
          xAxisKey="grupo"
          yAxisKey="total_salas"
          isLoading={exhibitionLoading}
          orientation="horizontal"
          height={350}
        />
      </ChartWrapper>

      {/* Complexes Data Table */}
      <ExhibitionDataTable />
    </div>
  );
};

export default Exhibition;
