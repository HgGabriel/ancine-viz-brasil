import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MapChartData {
  uf: string;
  value: number;
  name: string;
}

interface MapChartProps {
  data: MapChartData[];
  isLoading?: boolean;
  colorScale?: string[];
  height?: number;
}

// Brazilian regions with their states and colors
const brazilianRegions = {
  'Norte': {
    states: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
    color: '#10b981'
  },
  'Nordeste': {
    states: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
    color: '#0b3ef5ff'
  },
  'Centro-Oeste': {
    states: ['DF', 'GO', 'MT', 'MS'],
    color: '#ef4444'
  },
  'Sudeste': {
    states: ['ES', 'MG', 'RJ', 'SP'],
    color: '#3b82f6'
  },
  'Sul': {
    states: ['PR', 'RS', 'SC'],
    color: '#8b5cf6'
  }
};

export const MapChart: React.FC<MapChartProps> = ({
  data,
  isLoading = false,
  height = 400,
}) => {
  if (isLoading || !data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted/20 rounded-md"
        style={{ height }}
      >
        <span className="text-muted-foreground">Carregando mapa do Brasil...</span>
      </div>
    );
  }

  // Get region for each state
  const getRegionForState = (uf: string): { region: string; color: string } => {
    for (const [regionName, regionData] of Object.entries(brazilianRegions)) {
      if (regionData.states.includes(uf)) {
        return { region: regionName, color: regionData.color };
      }
    }
    return { region: 'Outros', color: '#6b7280' };
  };

  // Prepare data with regions and colors
  const chartData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 15) // Show top 15 states
    .map(item => {
      const { region, color } = getRegionForState(item.uf);
      return {
        ...item,
        region,
        color,
        displayName: `${item.uf} (${item.name || item.uf})`
      };
    });

  // Calculate regional totals for the summary
  const regionalTotals = Object.entries(brazilianRegions).map(([regionName, regionData]) => {
    const regionStates = data.filter(item => regionData.states.includes(item.uf));
    const total = regionStates.reduce((sum, item) => sum + item.value, 0);
    return {
      region: regionName,
      total,
      color: regionData.color,
      stateCount: regionStates.length
    };
  }).sort((a, b) => b.total - a.total);

  const formatValue = (value: number): string => {
    return value.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Regional Summary */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {regionalTotals.map(({ region, total, color, stateCount }) => (
          <div
            key={region}
            className="p-2 rounded-lg border border-border bg-card"
            style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
          >
            <div className="text-xs font-semibold text-muted-foreground">{region}</div>
            <div className="text-sm font-bold">{formatValue(total)}</div>
            <div className="text-xs text-muted-foreground">{stateCount} estados</div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div style={{ height: height - 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="uf"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => formatValue(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number, name, props) => [
                `${formatValue(value)} salas`,
                `${props.payload.name || props.payload.uf} - ${props.payload.region}`
              ]}
              labelFormatter={(label) => `Estado: ${label}`}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs">
        {Object.entries(brazilianRegions).map(([regionName, regionData]) => (
          <div key={regionName} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: regionData.color }}
            />
            <span>{regionName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapChart;