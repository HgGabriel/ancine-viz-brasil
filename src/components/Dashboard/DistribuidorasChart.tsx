import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDistribuidorasRanking } from "@/hooks/useAncineApi";

export const DistribuidorasChart = () => {
  const { data, isLoading, error } = useDistribuidorasRanking(10);

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.ranking) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Ranking de Distribuidoras</CardTitle>
          <CardDescription>Top 10 por público</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Dados não disponíveis
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.ranking.map((item: any) => ({
    nome: item.distribuidora_nome?.substring(0, 20) || "N/A",
    publico: item.total_publico || 0,
    renda: (item.total_renda || 0) / 1000000, // em milhões
  }));

  return (
    <Card className="border-2 border-blue/20 hover:border-blue/40 transition-colors">
      <CardHeader>
        <CardTitle>Ranking de Distribuidoras</CardTitle>
        <CardDescription>
          Top 10 distribuidoras por público e renda (em milhões)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" />
            <YAxis dataKey="nome" type="category" width={150} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number, name: string) => {
                if (name === "publico") {
                  return [value.toLocaleString(), "Público"];
                }
                return [`R$ ${value.toFixed(2)}M`, "Renda"];
              }}
            />
            <Legend />
            <Bar dataKey="publico" fill="hsl(var(--primary))" name="Público" />
            <Bar dataKey="renda" fill="hsl(var(--blue))" name="Renda (R$ Milhões)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
