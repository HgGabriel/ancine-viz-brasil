import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMarketShare } from "@/hooks/useAncineApi";

const COLORS = {
  nacional: "hsl(var(--primary))",
  estrangeiro: "hsl(var(--blue))",
};

export const MarketShareChart = () => {
  const { data, isLoading, error } = useMarketShare();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Market Share do Cinema Nacional</CardTitle>
          <CardDescription>Público e Renda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Dados não disponíveis
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: "Cinema Nacional",
      value: data.market_share_nacional_publico || 0,
      renda: data.market_share_nacional_renda || 0,
    },
    {
      name: "Cinema Estrangeiro",
      value: 100 - (data.market_share_nacional_publico || 0),
      renda: 100 - (data.market_share_nacional_renda || 0),
    },
  ];

  return (
    <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <CardHeader>
        <CardTitle>Market Share do Cinema Nacional</CardTitle>
        <CardDescription>
          Participação do cinema brasileiro no mercado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? COLORS.nacional : COLORS.estrangeiro}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
