import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ValueType,
  NameType,
} from 'recharts';

interface LineChartProps<TData extends Record<string, any>> {
  data: TData[];
  xAxisKey: keyof TData;
  yAxisKeys: (keyof TData)[];
  isLoading?: boolean;
  colors?: string[];
  showLegend?: boolean;
  height?: number;
  strokeWidth?: number;
}

const defaultColors = ['#009c3b', '#002776', '#ffdf00', '#8884d8', '#82ca9d', '#ffc658'];

export const LineChart = <TData extends Record<string, any>>({
  data,
  xAxisKey,
  yAxisKeys,
  isLoading = false,
  colors = defaultColors,
  showLegend = true,
  height = 300,
  strokeWidth = 2,
}: React.PropsWithChildren<LineChartProps<TData>>) => {
  if (isLoading || !data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted/20 rounded-md"
        style={{ height }}
      >
        <span className="text-muted-foreground">Carregando dados...</span>
      </div>
    );
  }

  const formatTooltipValue = (value: ValueType, name: NameType) => {
    if (typeof value === 'number') {
      return [value.toLocaleString('pt-BR'), name];
    }
    return [value, name];
  };

  const formatAxisValue = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        
        <XAxis 
          dataKey={xAxisKey as string}
          className="text-xs"
        />
        
        <YAxis 
          tickFormatter={formatAxisValue}
          className="text-xs"
        />
        
        <Tooltip
          formatter={formatTooltipValue}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        
        {showLegend && <Legend />}
        
        {yAxisKeys.map((key, index) => (
          <Line
            key={key as string}
            type="monotone"
            dataKey={key as string}
            stroke={colors[index % colors.length]}
            strokeWidth={strokeWidth}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;