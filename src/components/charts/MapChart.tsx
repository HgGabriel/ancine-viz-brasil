import React from 'react';
import { Tooltip } from '@/components/ui/tooltip';

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

const defaultColorScale = ['#e8f5e8', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20'];

// Simplified Brazilian states with basic positioning for a grid-like layout
const brazilianStates = [
  { uf: 'AC', name: 'Acre', x: 10, y: 60 },
  { uf: 'AL', name: 'Alagoas', x: 80, y: 40 },
  { uf: 'AP', name: 'Amapá', x: 60, y: 10 },
  { uf: 'AM', name: 'Amazonas', x: 20, y: 30 },
  { uf: 'BA', name: 'Bahia', x: 70, y: 50 },
  { uf: 'CE', name: 'Ceará', x: 80, y: 20 },
  { uf: 'DF', name: 'Distrito Federal', x: 60, y: 60 },
  { uf: 'ES', name: 'Espírito Santo', x: 80, y: 70 },
  { uf: 'GO', name: 'Goiás', x: 60, y: 65 },
  { uf: 'MA', name: 'Maranhão', x: 70, y: 20 },
  { uf: 'MT', name: 'Mato Grosso', x: 40, y: 60 },
  { uf: 'MS', name: 'Mato Grosso do Sul', x: 40, y: 75 },
  { uf: 'MG', name: 'Minas Gerais', x: 70, y: 70 },
  { uf: 'PA', name: 'Pará', x: 50, y: 20 },
  { uf: 'PB', name: 'Paraíba', x: 85, y: 30 },
  { uf: 'PR', name: 'Paraná', x: 60, y: 85 },
  { uf: 'PE', name: 'Pernambuco', x: 80, y: 35 },
  { uf: 'PI', name: 'Piauí', x: 75, y: 25 },
  { uf: 'RJ', name: 'Rio de Janeiro', x: 75, y: 75 },
  { uf: 'RN', name: 'Rio Grande do Norte', x: 85, y: 25 },
  { uf: 'RS', name: 'Rio Grande do Sul', x: 55, y: 95 },
  { uf: 'RO', name: 'Rondônia', x: 25, y: 55 },
  { uf: 'RR', name: 'Roraima', x: 40, y: 5 },
  { uf: 'SC', name: 'Santa Catarina', x: 60, y: 90 },
  { uf: 'SP', name: 'São Paulo', x: 65, y: 80 },
  { uf: 'SE', name: 'Sergipe', x: 80, y: 45 },
  { uf: 'TO', name: 'Tocantins', x: 65, y: 40 },
];

export const MapChart: React.FC<MapChartProps> = ({
  data,
  isLoading = false,
  colorScale = defaultColorScale,
  height = 400,
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

  // Create a map for quick lookup of data by UF
  const dataMap = new Map(data.map(item => [item.uf, item]));
  
  // Calculate min and max values for color scaling
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  const getColorForValue = (value: number): string => {
    if (valueRange === 0) return colorScale[0];
    
    const normalizedValue = (value - minValue) / valueRange;
    const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));
    return colorScale[Math.min(colorIndex, colorScale.length - 1)];
  };

  const formatValue = (value: number): string => {
    return value.toLocaleString('pt-BR');
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="border border-border rounded-md"
      >
        {brazilianStates.map((state) => {
          const stateData = dataMap.get(state.uf);
          const hasData = !!stateData;
          const fillColor = hasData ? getColorForValue(stateData.value) : '#f5f5f5';
          
          return (
            <g key={state.uf}>
              <circle
                cx={state.x}
                cy={state.y}
                r="2.5"
                fill={fillColor}
                stroke="#666"
                strokeWidth="0.2"
                className="cursor-pointer hover:stroke-2 transition-all duration-200"
              />
              <text
                x={state.x}
                y={state.y + 0.5}
                textAnchor="middle"
                fontSize="1.5"
                fill="#333"
                className="pointer-events-none font-semibold"
              >
                {state.uf}
              </text>
              
              {/* Tooltip-like hover effect */}
              <title>
                {state.name}
                {hasData && ` - ${formatValue(stateData.value)}`}
              </title>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 border border-border rounded-md p-2">
        <div className="text-xs font-semibold mb-1">Valores</div>
        <div className="flex items-center space-x-1">
          <span className="text-xs">{formatValue(minValue)}</span>
          <div className="flex">
            {colorScale.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-xs">{formatValue(maxValue)}</span>
        </div>
      </div>
    </div>
  );
};

export default MapChart;