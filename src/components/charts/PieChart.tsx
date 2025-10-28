import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  isLoading?: boolean;
  showLegend?: boolean;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
}

const defaultColors = ['#009c3b', '#002776', '#ffdf00', '#8884d8', '#82ca9d', '#ffc658'];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  isLoading = false,
  showLegend = true,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  colors = defaultColors,
}) => {
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

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((value / total) * 100).toFixed(1);
      return [`${value.toLocaleString('pt-BR')} (${percentage}%)`, name];
    }
    return [value, name];
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        
        <Tooltip
          formatter={formatTooltipValue}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        
        {showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;