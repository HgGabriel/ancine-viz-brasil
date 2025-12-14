import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketShareTab } from "@/components/market/MarketShareTab";
import { DistributorRankingTab } from "@/components/market/DistributorRankingTab";
import { PageContext } from "@/components/ui/context-card";
import { PieChart, Trophy, TrendingUp } from "lucide-react";

const Market = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mercado</h1>
        <p className="text-muted-foreground">
          Análise de market share e ranking de distribuidoras
        </p>
      </div>

      {/* Context Cards */}
      <PageContext
        cards={[
          {
            title: "O que é Market Share?",
            description:
              "O market share representa a participação de filmes nacionais em relação ao total de público e renda do mercado cinematográfico brasileiro. É um indicador crucial para avaliar a competitividade do cinema brasileiro frente às produções estrangeiras.",
            icon: PieChart,
            variant: "highlight",
          },
          {
            title: "Papel das Distribuidoras",
            description:
              "As distribuidoras são responsáveis por levar os filmes até as salas de cinema. Elas negociam com exibidores, definem estratégias de lançamento e são peça-chave no sucesso comercial de uma obra.",
            icon: Trophy,
            variant: "info",
          },
          {
            title: "Dinâmica do Mercado",
            description:
              "O mercado audiovisual brasileiro é altamente competitivo, com grandes estúdios internacionais dominando a bilheteria. Políticas de fomento e cotas de tela são instrumentos utilizados para fortalecer a produção nacional.",
            icon: TrendingUp,
            variant: "default",
          },
        ]}
      />

      <Tabs defaultValue="market-share" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market-share">Market Share</TabsTrigger>
          <TabsTrigger value="distributor-ranking">
            Ranking de Distribuidoras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market-share" className="space-y-6">
          <MarketShareTab />
        </TabsContent>

        <TabsContent value="distributor-ranking" className="space-y-6">
          <DistributorRankingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Market;
