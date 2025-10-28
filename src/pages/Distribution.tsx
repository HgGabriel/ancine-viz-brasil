import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistributionTrendsTab } from "@/components/distribution/DistributionTrendsTab";
import { ReleaseExplorerTab } from "@/components/distribution/ReleaseExplorerTab";

const Distribution = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Distribuição</h1>
        <p className="text-muted-foreground">
          Análise de bilheteria e padrões de lançamento
        </p>
      </div>

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