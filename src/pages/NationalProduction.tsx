import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionProfileTab } from "@/components/production/ProductionProfileTab";
import { CoProductionsTab } from "@/components/production/CoProductionsTab";
import { PageContext } from "@/components/ui/context-card";
import { Film, Globe, Coins } from "lucide-react";

const NationalProduction = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Produção Nacional
        </h1>
        <p className="text-muted-foreground">
          Análise da produção audiovisual brasileira e coproduções
        </p>
      </div>

      {/* Context Cards */}
      <PageContext
        cards={[
          {
            title: "Ciclo de Produção",
            description:
              "A produção audiovisual brasileira passa por diversas etapas: desenvolvimento, pré-produção, filmagem, pós-produção e distribuição. A ANCINE acompanha e registra obras em todas essas fases, desde longas-metragens até séries para televisão.",
            icon: Film,
            variant: "highlight",
          },
          {
            title: "Coproduções Internacionais",
            description:
              "O Brasil mantém acordos de coprodução com diversos países, permitindo acesso a recursos, mercados e expertise internacional. Essas parcerias fortalecem a indústria nacional e ampliam o alcance das produções brasileiras.",
            icon: Globe,
            variant: "info",
          },
          {
            title: "Financiamento e Incentivos",
            description:
              "A produção nacional é apoiada por mecanismos como a Lei do Audiovisual, Lei Rouanet, FSA (Fundo Setorial do Audiovisual) e editais regionais. Esses incentivos fiscais são fundamentais para viabilizar projetos cinematográficos.",
            icon: Coins,
            variant: "default",
          },
        ]}
      />

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
