import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSalasPorUF } from "@/hooks/useAncineApi";

export const SalasMapChart = () => {
  const { data, isLoading, error } = useSalasPorUF();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.salas_por_uf) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Salas por Estado</CardTitle>
          <CardDescription>Distribuição geográfica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Dados não disponíveis
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.salas_por_uf
    .sort((a: any, b: any) => b.total_salas - a.total_salas)
    .slice(0, 15)
    .map((item: any) => ({
      uf: item.uf,
      total: item.total_salas,
    }));

  return (
    <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
      <CardHeader>
        <CardTitle>Salas de Cinema por Estado</CardTitle>
        <CardDescription>
          Top 15 estados com mais salas de cinema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="uf" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => [value.toLocaleString(), "Salas"]}
            />
            <Bar dataKey="total" fill="hsl(var(--accent))" name="Total de Salas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
