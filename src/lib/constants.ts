// Constants and configuration for the ANCINE Dashboard

// API Endpoints
export const API_ENDPOINTS = {
  // 📊 Estatísticas e KPIs
  MARKET_SHARE: '/estatisticas/market_share',
  RANKING_DISTRIBUIDORAS: '/estatisticas/ranking_distribuidoras',
  SALAS_POR_UF: '/estatisticas/salas_por_uf',
  BILHETERIA_ANUAL: '/estatisticas/bilheteria_anual',
  DESEMPENHO_GENERO_BR: '/estatisticas/desempenho_genero_br',
  
  // 🎭 Produção Nacional
  PRODUCAO_ESTATISTICAS: '/producao/estatisticas',
  PRODUCAO_OBRAS: '/producao/obras',
  PRODUCAO_COPRODUCOES: '/producao/coproducoes',
  PRODUCAO_COPRODUCOES_ESTATISTICAS: '/producao/coproducoes/estatisticas',
  
  // 🎬 Distribuição e Lançamentos
  LANCAMENTOS_PESQUISA: '/lancamentos/pesquisa',
  LANCAMENTOS_ESTATISTICAS: '/lancamentos/estatisticas',
  LANCAMENTOS_RECENTES: '/lancamentos/recentes',
  
  // 🏛️ Exibição
  PESQUISA_SALAS: '/pesquisa-salas',
  DATA_COMPLEXOS: '/data/complexos',
  
  // 📋 Dados de Referência
  DATA_DISTRIBUIDORAS: '/data/distribuidoras',
  
  // Acesso direto a tabelas (template)
  DATA_TABLE: '/data/{table_name}',
  
  // Legacy endpoints (manter compatibilidade)
  OBRAS: '/data/obras',
  LANCAMENTOS: '/data/lancamentos',
  COMPLEXOS: '/data/complexos',
  DISTRIBUIDORAS: '/data/distribuidoras',
} as const;

// Brazilian color palette for theming
export const BRAZILIAN_COLORS = {
  green: '#009c3b',
  blue: '#002776', 
  yellow: '#ffdf00',
  white: '#ffffff',
  black: '#000000',
} as const;

// Chart color schemes
export const CHART_COLORS = {
  primary: [
    BRAZILIAN_COLORS.green,
    BRAZILIAN_COLORS.blue,
    BRAZILIAN_COLORS.yellow,
    '#28a745',
    '#007bff',
    '#ffc107',
    '#17a2b8',
    '#6f42c1',
  ],
  national: BRAZILIAN_COLORS.green,
  foreign: BRAZILIAN_COLORS.blue,
  neutral: '#6c757d',
} as const;

// Navigation items configuration
export const NAVIGATION_ITEMS = [
  {
    id: 'overview',
    label: 'Visão Geral',
    href: '/',
    icon: 'BarChart3',
  },
  {
    id: 'market',
    label: 'Mercado',
    href: '/mercado',
    icon: 'TrendingUp',
  },
  {
    id: 'national-production',
    label: 'Produção Nacional',
    href: '/producao-nacional',
    icon: 'Film',
  },
  {
    id: 'distribution',
    label: 'Distribuição',
    href: '/distribuicao',
    icon: 'Share2',
  },
  {
    id: 'exhibition',
    label: 'Exibição',
    href: '/exibicao',
    icon: 'MapPin',
  },
] as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Query configuration
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_ATTEMPTS: 3,
} as const;

// Work types
export const WORK_TYPES = {
  LONGA_METRAGEM: 'longa_metragem',
  CURTA_METRAGEM: 'curta_metragem',
  DOCUMENTARIO: 'documentario',
  ANIMACAO: 'animacao',
  SERIE: 'serie',
} as const;

// Distributor types
export const DISTRIBUTOR_TYPES = {
  NACIONAL: 'nacional',
  ESTRANGEIRO: 'estrangeiro',
  INDEPENDENTE: 'independente',
} as const;

// Brazilian states for filtering
export const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
] as const;