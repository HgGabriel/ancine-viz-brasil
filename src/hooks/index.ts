// Data fetching hooks
export { useApiData, useApiDataWithParams } from './useApiData';
export type { UseApiDataOptions, UseApiDataResult } from './useApiData';

export { usePaginatedData } from './usePaginatedData';
export type { 
  PaginationInfo, 
  UsePaginatedDataOptions, 
  UsePaginatedDataResult 
} from './usePaginatedData';

// Utility hooks
export { useDebounce } from './useDebounce';

// Error handling hooks
export { useErrorHandler, useQueryErrorHandler } from './useErrorHandler';
export type { ErrorHandlerOptions } from './useErrorHandler';

// Loading state hooks
export { 
  useLoadingState, 
  useSimpleLoading, 
  useMultipleLoadingStates,
  useDebouncedLoading 
} from './useLoadingState';
export type { LoadingState, LoadingStageConfig } from './useLoadingState';

// Existing hooks
export { useTheme } from './useTheme';
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';

// ANCINE API hooks
export {
  useMarketShare,
  useDistribuidorasRanking,
  useSalasPorUF,
  useObrasPorTipo,
  useDesempenhoGenero,
  useDistributionKPIs,
  useDistributionTrends,
  useGenrePerformance,
  useReleaseSearch,
  useProducaoObras,
  useCoproducoes,
  useLancamentosRecentes,
  useLancamentosEstatisticas,
  usePesquisaSalas,
  useComplexos,
  useDistribuidoras,
  useDataTable,
} from './useAncineApi';

// KPI hooks (organized by category)
export {
  // 📊 Estatísticas e KPIs
  useMarketShareKPIs,
  useDistribuidorasRankingKPIs,
  useSalasPorUFKPIs,
  useBilheteriaAnualKPIs,
  useDesempenhoGeneroKPIs,
  
  // 🎭 Produção Nacional
  useProducaoEstatisticasKPIs,
  useCoproducoesKPIs,
  
  // 🎬 Distribuição e Lançamentos
  useLancamentosEstatisticasKPIs,
  useLancamentosRecentesKPIs,
  
  // 🏛️ Exibição
  useExibicaoKPIs,
  
  // 📋 Dados de Referência
  useDistribuidorasKPIs,
  
  // Combined hooks
  useOverviewKPIs,
} from './useKPIs';