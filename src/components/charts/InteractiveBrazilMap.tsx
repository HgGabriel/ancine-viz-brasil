import React, { useState, memo, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { formatNumber } from '@/lib/formatters';
import { Card, CardContent } from "@/components/ui/card";

// Ensure the path is correct relative to the component
const geoUrl = "/brazil-states.geojson";

export interface InteractiveBrazilMapData {
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
  '#f0fdf4', // 50
  '#dcfce7', // 100
  '#bbf7d0', // 200
  '#86efac', // 300
  '#4ade80', // 400
  '#22c55e', // 500
  '#16a34a', // 600
  '#15803d', // 700
  '#166534', // 800
  '#14532d', // 900
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

    const processedData = useMemo(() => {
      if (!data) return new Map();
      return new Map(data.map((item) => [item.uf, item]));
    }, [data]);

    // Calculate color scale
    const colorScale = useMemo(() => {
      if (!data || data.length === 0) return null;
      
      const values = data.map(d => d.value).filter(v => v > 0);
      
      if (values.length === 0) return null;

      return scaleQuantile<string>()
        .domain(values)
        .range(COLOR_RANGE);
    }, [data]);

    if (isLoading) {
      return (
        <div
          className="flex items-center justify-center bg-muted/20 rounded-md"
          style={{ height }}
        >
          <span className="text-muted-foreground">Carregando mapa do Brasil...</span>
        </div>
      );
    }

    return (
      <div className="relative w-full bg-slate-50/50 rounded-lg border border-border overflow-hidden" style={{ height }}>
        
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 750,
            center: [-54, -15],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Try to get the UF from different properties to be robust
                  const uf = geo.id || geo.properties.SIGLA || geo.properties.sigla;
                  const stateData = processedData.get(uf);
                  const value = stateData ? stateData.value : 0;
                  const fillColor = (stateData && colorScale) ? colorScale(value) : '#e2e8f0';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredState(uf)}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: '#64748b',
                          strokeWidth: 0.5,
                          outline: 'none',
                          transition: 'all 250ms',
                        },
                        hover: {
                          fill: '#f59e0b', // Amber-500 for hover
                          stroke: '#78350f',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: '#d97706',
                          stroke: '#000000ff',
                          strokeWidth: 1,
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

        {/* Tooltip */}
        {hoveredState && processedData.has(hoveredState) && (
          <Card className="absolute top-4 right-4 w-64 shadow-xl z-20 animate-in fade-in slide-in-from-top-2">
            <CardContent className="p-4 space-y-2">
              <div>
                <h4 className="font-bold text-lg text-primary">
                  {stateNames[hoveredState] || hoveredState}
                </h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {hoveredState}
                </p>
              </div>
              
              <div className="space-y-1 pt-2 border-t">
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Salas:</span>
                  <span>{formatNumber(processedData.get(hoveredState)?.value ?? 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold mb-2 text-center">Salas</div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-muted-foreground">Menos</span>
            <div className="flex">
              {COLOR_RANGE.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 first:rounded-l-sm last:rounded-r-sm"
                  style={{ backgroundColor: color }}
                  title={`Nível ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">Mais</span>
          </div>
        </div>
      </div>
    );
  }
);

export default InteractiveBrazilMap;
