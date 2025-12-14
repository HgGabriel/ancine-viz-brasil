import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: Array<Record<string, any>>;
  xAxisKey: string;
  yAxisKey: string | string[];
  isLoading?: boolean;
  orientation?: "horizontal" | "vertical";
  colors?: string[];
  showLegend?: boolean;
  height?: number;
  responsive?: boolean;
}

const defaultColors = [
  "#009c3b",
  "#002776",
  "#ffdf00",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  isLoading = false,
  orientation = "vertical",
  colors = defaultColors,
  showLegend = false,
  height,
  responsive = true,
}) => {
  const { isMobile, isTablet, getChartHeight } = useResponsive();

  // Calculate responsive height
  const chartHeight =
    height ||
    (responsive
      ? getChartHeight({
          mobile: 250,
          tablet: 300,
          desktop: 350,
        })
      : 300);

  // Responsive margins
  const getMargins = () => {
    if (isMobile) {
      return {
        top: 10,
        right: 10,
        left: orientation === "horizontal" ? 60 : 10,
        bottom: orientation === "vertical" ? 40 : 10,
      };
    }
    if (isTablet) {
      return {
        top: 15,
        right: 20,
        left: orientation === "horizontal" ? 80 : 15,
        bottom: orientation === "vertical" ? 30 : 15,
      };
    }
    return {
      top: 20,
      right: 30,
      left: orientation === "horizontal" ? 100 : 20,
      bottom: orientation === "vertical" ? 20 : 20,
    };
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-muted/20 rounded-md space-y-3"
        style={{ height: chartHeight }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary" />
        <span
          className={cn(
            "text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}
        >
          Carregando gráfico...
        </span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted/10 rounded-md border-2 border-dashed border-muted"
        style={{ height: chartHeight }}
      >
        <span
          className={cn(
            "text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}
        >
          Nenhum dado disponível
        </span>
      </div>
    );
  }

  const yAxisKeys = Array.isArray(yAxisKey) ? yAxisKey : [yAxisKey];

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === "number") {
      return [value.toLocaleString("pt-BR"), name];
    }
    return [value, name];
  };

  const formatAxisValue = (value: any) => {
    if (typeof value === "number") {
      // Don't format years (values between 1900 and 2100)
      if (value >= 1900 && value <= 2100) {
        return value.toString();
      }
      // Shorter format for mobile
      if (isMobile && value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (isMobile && value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString("pt-BR");
    }
    // Truncate long labels on mobile
    if (isMobile && typeof value === "string" && value.length > 10) {
      return `${value.substring(0, 8)}...`;
    }
    return value;
  };

  const margins = getMargins();

  return (
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <RechartsBarChart
          data={data}
          layout={orientation === "horizontal" ? "vertical" : "horizontal"}
          margin={margins}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="opacity-30"
            stroke="hsl(var(--border))"
          />

          {orientation === "horizontal" ? (
            <>
              <XAxis
                type="number"
                tickFormatter={formatAxisValue}
                className={cn("text-xs", isMobile && "text-[10px]")}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                width={margins.left}
                className={cn("text-xs", isMobile && "text-[10px]")}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={formatAxisValue}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xAxisKey}
                className={cn("text-xs", isMobile && "text-[10px]")}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={formatAxisValue}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                tickFormatter={formatAxisValue}
                className={cn("text-xs", isMobile && "text-[10px]")}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
            </>
          )}

          <Tooltip
            formatter={formatTooltipValue}
            labelStyle={{
              color: "hsl(var(--foreground))",
              fontSize: isMobile ? "12px" : "14px",
            }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize: isMobile ? "12px" : "14px",
            }}
          />

          {showLegend && !isMobile && (
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          )}

          {yAxisKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={
                orientation === "horizontal" ? [0, 4, 4, 0] : [4, 4, 0, 0]
              }
              maxBarSize={isMobile ? 30 : 50}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
