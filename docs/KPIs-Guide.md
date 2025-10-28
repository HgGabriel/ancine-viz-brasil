# Guia de KPIs - Dashboard ANCINE

Este documento explica como usar os hooks de KPIs configurados para atender aos endpoints da API ANCINE.

## 📊 Endpoints Disponíveis

### Estatísticas e KPIs
- **Market Share**: `/api/v1/estatisticas/market_share`
- **Ranking Distribuidoras**: `/api/v1/estatisticas/ranking_distribuidoras`
- **Salas por UF**: `/api/v1/estatisticas/salas_por_uf`
- **Bilheteria Anual**: `/api/v1/estatisticas/bilheteria_anual`
- **Performance por Gênero**: `/api/v1/estatisticas/desempenho_genero_br`

### Produção Nacional
- **Estatísticas de Produção**: `/api/v1/producao/estatisticas`
- **Obras Brasileiras**: `/api/v1/producao/obras`
- **Coproduções**: `/api/v1/producao/coproducoes`
- **Estatísticas de Coproduções**: `/api/v1/producao/coproducoes/estatisticas`

### Distribuição e Lançamentos
- **Busca Avançada**: `/api/v1/lancamentos/pesquisa`
- **Estatísticas de Lançamentos**: `/api/v1/lancamentos/estatisticas`
- **Lançamentos Recentes**: `/api/v1/lancamentos/recentes`

### Exibição
- **Busca de Salas**: `/api/v1/pesquisa-salas`
- **Dados de Complexos**: `/api/v1/data/complexos`

### Dados de Referência
- **Distribuidoras**: `/api/v1/data/distribuidoras`
- **Acesso Direto a Tabelas**: `/api/v1/data/{table_name}`

## 🎯 Hooks de KPIs Disponíveis

### 1. Estatísticas Gerais

#### `useMarketShareKPIs()`
Retorna dados de participação de mercado do cinema nacional vs estrangeiro.

```typescript
const { data, isLoading, error } = useMarketShareKPIs();

// Dados retornados:
{
  market_share_nacional_publico: number,
  market_share_nacional_renda: number,
  market_share_estrangeiro_publico: number,
  market_share_estrangeiro_renda: number,
  total_publico: number,
  total_renda: number
}
```

#### `useDistribuidorasRankingKPIs(limit?)`
Retorna ranking das principais distribuidoras.

```typescript
const { data, isLoading, error } = useDistribuidorasRankingKPIs(10);

// Dados retornados:
{
  top_distribuidor: string,
  top_distribuidor_publico: number,
  top_distribuidor_renda: number,
  ranking_completo: Array<{
    distribuidora_nome: string,
    total_publico: number,
    total_renda: number,
    total_filmes: number
  }>
}
```

#### `useSalasPorUFKPIs()`
Retorna estatísticas sobre salas de cinema por estado.

```typescript
const { data, isLoading, error } = useSalasPorUFKPIs();

// Dados retornados:
{
  total_salas: number,
  total_estados_com_salas: number,
  estado_com_mais_salas: string,
  maior_numero_salas: number,
  salas_por_uf: Array<{uf: string, total_salas: number}>
}
```

#### `useBilheteriaAnualKPIs(ano?)`
Retorna dados de bilheteria anual com comparações.

```typescript
const { data, isLoading, error } = useBilheteriaAnualKPIs(2024);

// Dados retornados:
{
  ano_atual: number,
  publico_total: number,
  renda_total: number,
  preco_medio_ingresso: number,
  publico_variacao_anual: number,
  renda_variacao_anual: number,
  historico_completo: Array<{ano: number, publico_total: number, renda_total: number}>
}
```

### 2. Produção Nacional

#### `useProducaoEstatisticasKPIs()`
Retorna estatísticas gerais da produção nacional.

```typescript
const { data, isLoading, error } = useProducaoEstatisticasKPIs();

// Dados retornados:
{
  total_obras: number,
  obras_por_tipo: Record<string, number>,
  ano_pico_producao: number,
  obras_ano_pico: number,
  crescimento_anual_medio: number
}
```

#### `useCoproducoesKPIs()`
Retorna dados sobre coproduções internacionais.

```typescript
const { data, isLoading, error } = useCoproducoesKPIs();

// Dados retornados:
{
  taxa_coproducao: number,
  total_coproducoes: number,
  top_pais_parceiro: string,
  coproducoes_top_pais: number,
  paises_parceiros: Array<[string, number]>,
  desempenho_comparativo: Record<string, any>
}
```

### 3. Distribuição e Lançamentos

#### `useLancamentosEstatisticasKPIs()`
Retorna estatísticas de lançamentos.

```typescript
const { data, isLoading, error } = useLancamentosEstatisticasKPIs();

// Dados retornados:
{
  total_lancamentos_ano: number,
  lancamentos_nacionais: number,
  lancamentos_estrangeiros: number,
  percentual_nacional: number,
  media_lancamentos_mes: number,
  pico_lancamentos_mes: string
}
```

#### `useLancamentosRecentesKPIs(limit?)`
Retorna dados sobre lançamentos recentes.

```typescript
const { data, isLoading, error } = useLancamentosRecentesKPIs(10);

// Dados retornados:
{
  total_recentes: number,
  nacionais_recentes: number,
  estrangeiros_recentes: number,
  ultimo_lancamento: object | null,
  lancamentos_recentes: Array<any>
}
```

### 4. Exibição

#### `useExibicaoKPIs()`
Retorna estatísticas sobre complexos e salas de cinema.

```typescript
const { data, isLoading, error } = useExibicaoKPIs();

// Dados retornados:
{
  total_complexos: number,
  total_salas: number,
  media_salas_por_complexo: number,
  top_grupo_exibidor: string,
  complexos_top_grupo: number,
  grupos_exibidores: Array<[string, number]>
}
```

### 5. Hook Combinado para Overview

#### `useOverviewKPIs()`
Combina os principais KPIs para a página de visão geral.

```typescript
const { 
  marketShare, 
  distribuidoras, 
  salas, 
  bilheteria, 
  isLoading, 
  isError, 
  error 
} = useOverviewKPIs();

// Cada propriedade contém:
// - data: dados do KPI
// - isLoading: estado de carregamento
// - isError: estado de erro
// - error: objeto de erro se houver
```

## 🔧 Exemplo de Uso em Componente

```typescript
import React from 'react';
import { useMarketShareKPIs, useBilheteriaAnualKPIs } from '@/hooks/useKPIs';
import { KpiCardPercentage, KpiCardNumber } from '@/components/ui/kpi-card';
import { formatCompactNumber, formatPercentage } from '@/lib/formatters';

const MarketDashboard = () => {
  const { data: marketShare, isLoading: marketLoading } = useMarketShareKPIs();
  const { data: bilheteria, isLoading: bilheteriaLoading } = useBilheteriaAnualKPIs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCardPercentage
        title="Market Share Nacional (Público)"
        value={marketShare?.market_share_nacional_publico || 0}
        description="Participação do cinema brasileiro no público total"
        isLoading={marketLoading}
      />
      
      <KpiCardNumber
        title="Público Total"
        value={bilheteria?.publico_total || 0}
        description="Total de espectadores no ano"
        isLoading={bilheteriaLoading}
        formatter={formatCompactNumber}
      />
      
      <KpiCardNumber
        title="Preço Médio do Ingresso"
        value={bilheteria?.preco_medio_ingresso || 0}
        description="Valor médio pago por ingresso"
        isLoading={bilheteriaLoading}
        formatter={(value) => `R$ ${value.toFixed(2)}`}
      />
    </div>
  );
};
```

## 🎨 Formatadores Disponíveis

O projeto inclui formatadores para exibir os dados de forma consistente:

```typescript
import { 
  formatNumber,
  formatCurrency,
  formatCompactNumber,
  formatPercentage,
  formatDate
} from '@/lib/formatters';

// Exemplos:
formatNumber(1234567) // "1.234.567"
formatCurrency(1234567) // "R$ 1.234.567"
formatCompactNumber(1234567) // "1,2M"
formatPercentage(0.1234) // "12,3%"
formatDate(new Date()) // "28/10/2025"
```

## 🔄 Configuração de Cache

Os hooks estão configurados com diferentes tempos de cache baseados na natureza dos dados:

- **Dados em tempo real** (lançamentos recentes): 2 minutos
- **Estatísticas dinâmicas** (market share, bilheteria): 5 minutos
- **Dados estruturais** (salas, complexos): 10-15 minutos
- **Dados de referência** (distribuidoras): 30 minutos

## 🚨 Tratamento de Erros

Todos os hooks incluem tratamento de erro robusto:

```typescript
const { data, isLoading, isError, error } = useMarketShareKPIs();

if (isError) {
  console.error('Erro ao carregar market share:', error);
  // Exibir mensagem de erro para o usuário
}
```

## 📈 Próximos Passos

1. **Implementar hooks específicos** para cada seção do dashboard
2. **Adicionar filtros avançados** nos hooks de busca
3. **Criar hooks para dados históricos** e comparações temporais
4. **Implementar cache inteligente** com invalidação baseada em eventos
5. **Adicionar hooks para exportação** de dados em diferentes formatos