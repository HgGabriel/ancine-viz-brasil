import React, { useState, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { formatNumber } from '@/lib/formatters';

// Ensure the path is correct relative to the component
const geoUrl = "/src/data/brazil-states.geojson";

interface InteractiveBrazilMapData {
  uf: string;
  value: number;
  name: string;
}

interface InteractiveBrazilMapProps {
  data: InteractiveBrazilMapData[];
  isLoading?: boolean;
  height?: number;
}

const COLOR_RANGE = [
  '#dcfce7', // Very light green
  '#bbf7d0', // Light green
  '#86efac', // Medium light green
  '#4ade80', // Medium green
  '#22c55e', // Green
  '#16a34a', // Dark green
  '#15803d', // Darker green
  '#166534', // Very dark green
];

const stateNames: Record<string, string> = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia',
  'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás',
  'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
  'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí',
  'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
  'SE': 'Sergipe', 'TO': 'Tocantins',
};

export const InteractiveBrazilMap: React.FC<InteractiveBrazilMapProps> = memo(
  ({ data, isLoading = false, height = 500 }) => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);

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

    const dataMap = new Map(data.map((item) => [item.uf, item]));

    // Calculate min and max values for color scaling
    const values = data.map((item) => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Create a color scale function
    const colorScale = scaleLinear()
      .domain([minValue, maxValue])
      .range([0, COLOR_RANGE.length - 1]);

    const getColorForValue = (value: number): string => {
      if (maxValue === minValue) return COLOR_RANGE[Math.floor(COLOR_RANGE.length / 2)]; // Default for no range
      const scaledIndex = colorScale(value);
      return COLOR_RANGE[Math.min(Math.floor(scaledIndex), COLOR_RANGE.length - 1)];
    };

    return (
      <div className="relative w-full bg-slate-50 rounded-lg border border-border" style={{ height }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 750, // Adjust scale for better fit
            center: [-55, -15], // Center of Brazil
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const uf = geo.properties.sigla;
                  const stateData = dataMap.get(uf);
                  const hasData = !!stateData;
                  const fillColor = hasData ? getColorForValue(stateData.value) : '#e2e8f0';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredState(uf)}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: '#475569',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        hover: {
                          fill: hasData ? '#34d399' : '#cbd5e1', // Slightly different hover color
                          stroke: '#1e293b',
                          strokeWidth: 1.5,
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#10b981', // Darker green on click
                          stroke: '#1e293b',
                          strokeWidth: 1.5,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Title */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-bold text-foreground">
          Distribuição de Salas de Cinema por Estado
        </div>

        {/* Tooltip */}
        {hoveredState && dataMap.has(hoveredState) && (
          <div className="absolute top-4 left-4 bg-background/95 border border-border rounded-lg p-3 shadow-lg z-10">
            <div className="font-semibold text-sm">{stateNames[hoveredState] || hoveredState}</div>
            <div className="text-xs text-muted-foreground">Estado: {hoveredState}</div>
            <div className="text-sm font-medium text-primary">
              {formatNumber(dataMap.get(hoveredState)?.value ?? 0)} salas
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/95 border border-border rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold mb-2">Número de Salas</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">{formatNumber(minValue)}</span>
            <div className="flex">
              {COLOR_RANGE.map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-4 border-r border-white"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs">{formatNumber(maxValue)}</span>
          </div>
        </div>

        {/* Top 5 States Info */}
        <div className="absolute top-4 right-4 bg-background/95 border border-border rounded-lg p-3 shadow-lg max-w-48">
          <div className="text-xs font-semibold mb-2">Top 5 Estados</div>
          {data
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((item, index) => (
              <div key={item.uf} className="flex justify-between text-xs mb-1">
                <span className="font-medium">{index + 1}. {item.uf}</span>
                <span className="text-muted-foreground">{formatNumber(item.value)}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
);

export default InteractiveBrazilMap;
