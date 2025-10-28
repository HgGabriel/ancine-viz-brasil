import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketShareTab } from "@/components/market/MarketShareTab";
import { DistributorRankingTab } from "@/components/market/DistributorRankingTab";

const Market = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mercado</h1>
        <p className="text-muted-foreground">
          Análise de market share e ranking de distribuidoras
        </p>
      </div>

      <Tabs defaultValue="market-share" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market-share">Market Share</TabsTrigger>
          <TabsTrigger value="distributor-ranking">Ranking de Distribuidoras</TabsTrigger>
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