import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BrazilMapChartData {
  uf: string;
  value: number;
  name: string;
}

interface BrazilMapChartProps {
  data: BrazilMapChartData[];
  isLoading?: boolean;
  height?: number;
}

// Brazilian states with regions for better organization
const brazilianRegions = {
  'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
  'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
  'Sul': ['PR', 'RS', 'SC']
};

const regionColors = {
  'Norte': '#4ade80',
  'Nordeste': '#f59e0b',
  'Centro-Oeste': '#ef4444',
  'Sudeste': '#3b82f6',
  'Sul': '#8b5cf6'
};

export const BrazilMapChart: React.FC<BrazilMapChartProps> = ({
  data,
  isLoading = false,
  height = 400,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  if (isLoading || !data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted/20 rounded-md"
        style={{ height }}
      >
        <span className="text-muted-foreground">Carregando dados do mapa...</span>
      </div>
    );
  }

  // Organize data by regions
  const regionData = Object.entries(brazilianRegions).map(([region, states]) => {
    const regionStates = data.filter(item => states.includes(item.uf));
    const totalValue = regionStates.reduce((sum, item) => sum + item.value, 0);
    
    return {
      region,
      total: totalValue,
      states: regionStates.sort((a, b) => b.value - a.value),
      color: regionColors[region as keyof typeof regionColors]
    };
  }).sort((a, b) => b.total - a.total);

  // Prepare data for the main chart (top states)
  const topStatesData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 15)
    .map(item => {
      // Find which region this state belongs to
      const region = Object.entries(brazilianRegions).find(([, states]) => 
        states.includes(item.uf)
      )?.[0] || 'Outros';
      
      return {
        ...item,
        region,
        color: regionColors[region as keyof typeof regionColors] || '#6b7280'
      };
    });

  const formatValue = (value: number): string => {
    return value.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Regional Overview */}
      <div className="grid grid-cols-5 gap-2">
        {regionData.map(({ region, total, color }) => (
          <div
            key={region}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedRegion === region 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
            onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
          >
            <div className="text-sm font-semibold">{region}</div>
            <div className="text-lg font-bold">{formatValue(total)}</div>
            <div className="text-xs text-muted-foreground">salas</div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topStatesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="uf" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatValue(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number, name, props) => [
                formatValue(value),
                `${props.payload.name || props.payload.uf} (${props.payload.region})`
              ]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {topStatesData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  opacity={selectedRegion && selectedRegion !== entry.region ? 0.3 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Detail */}
      {selectedRegion && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <div 
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: regionColors[selectedRegion as keyof typeof regionColors] }}
            />
            Região {selectedRegion}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {regionData
              .find(r => r.region === selectedRegion)
              ?.states.map(state => (
                <div key={state.uf} className="text-center p-2 bg-muted/20 rounded">
                  <div className="font-semibold">{state.uf}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatValue(state.value)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrazilMapChart;