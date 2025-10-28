import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionProfileTab } from "@/components/production/ProductionProfileTab";
import { CoProductionsTab } from "@/components/production/CoProductionsTab";

const NationalProduction = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Produção Nacional</h1>
        <p className="text-muted-foreground">
          Análise da produção audiovisual brasileira e coproduções
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil da Produção</TabsTrigger>
          <TabsTrigger value="co-productions">Coproduções</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ProductionProfileTab />
        </TabsContent>
        
        <TabsContent value="co-productions" className="space-y-6">
          <CoProductionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NationalProduction;