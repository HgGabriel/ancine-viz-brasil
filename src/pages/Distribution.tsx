import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistributionTrendsTab } from "@/components/distribution/DistributionTrendsTab";
import { ReleaseExplorerTab } from "@/components/distribution/ReleaseExplorerTab";
import { PageContext } from "@/components/ui/context-card";
import { DollarSign, Calendar, Tv } from "lucide-react";

const Distribution = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Distribuição</h1>
        <p className="text-muted-foreground">
          Análise de bilheteria e padrões de lançamento
        </p>
      </div>

      {/* Context Cards */}
      <PageContext
        cards={[
          {
            title: "Bilheteria e Renda",
            description:
              "A bilheteria representa o total de ingressos vendidos, enquanto a renda é o valor arrecadado. Esses indicadores medem o sucesso comercial dos filmes e a saúde financeira do circuito exibidor brasileiro.",
            icon: DollarSign,
            variant: "highlight",
          },
          {
            title: "Janelas de Lançamento",
            description:
              "Os filmes seguem janelas temporais específicas: primeiro nas salas de cinema, depois em plataformas de streaming, TV paga e aberta. A estratégia de lançamento impacta diretamente no desempenho comercial.",
            icon: Calendar,
            variant: "info",
          },
          {
            title: "Transformação Digital",
            description:
              "O mercado de distribuição passou por grandes mudanças com o crescimento do streaming. A pandemia acelerou essa transformação, alterando padrões de consumo e desafiando o modelo tradicional de exibição.",
            icon: Tv,
            variant: "default",
          },
        ]}
      />

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trends">Tendências e KPIs</TabsTrigger>
          <TabsTrigger value="explorer">Explorador de Lançamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <DistributionTrendsTab />
        </TabsContent>

        <TabsContent value="explorer" className="space-y-6">
          <ReleaseExplorerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Distribution;
