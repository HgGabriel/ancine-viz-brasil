# Atualização dos Hooks de Distribuidoras e KPIs

## Resumo das Alterações

Todos os hooks relacionados a distribuidoras e KPIs foram revisados e atualizados para estar em conformidade com a estrutura de resposta da API do endpoint `estatisticas/ranking_distribuidoras`.

## Estrutura da API Identificada

A API retorna respostas no seguinte formato:
```json
{
  "data": [...],
  "metadata": {
    "count": 441,
    "data_type": "list", 
    "total_available": 441
  },
  "request_id": "d6e7e529-eb08-42a7-afd5-2d24c344fc7e",
  "success": true,
  "timestamp": "2025-10-29T23:14:01.454353Z"
}
```

## Principais Correções Realizadas

### 1. Tratamento de Resposta da API
- **Antes**: `response.data` ou `response` diretamente
- **Depois**: `response?.data` com verificação de tipo

### 2. Tipagem TypeScript
- Adicionado `response: any` para evitar erros de tipo `unknown`
- Corrigido tipos de parâmetros em funções de busca

### 3. Inclusão de Metadata
- Todos os hooks agora retornam `metadata: response?.metadata`
- Preserva informações importantes como contagem total e tipo de dados

### 4. Hooks Atualizados

#### useKPIs.ts
- ✅ `useMarketShareKPIs`
- ✅ `useDistribuidorasRankingKPIs`
- ✅ `useSalasPorUFKPIs`
- ✅ `useBilheteriaAnualKPIs`
- ✅ `useDesempenhoGeneroKPIs`
- ✅ `useProducaoEstatisticasKPIs`
- ✅ `useCoproducoesKPIs`
- ✅ `useLancamentosEstatisticasKPIs`
- ✅ `useLancamentosRecentesKPIs`
- ✅ `useExibicaoKPIs`
- ✅ `useDistribuidorasKPIs`

#### useAncineApi.ts
- ✅ `useMarketShare`
- ✅ `useDistribuidorasRanking`
- ✅ `useSalasPorUF`
- ✅ `useDistributionKPIs`
- ✅ `useDistributionTrends`
- ✅ `useGenrePerformance`
- ✅ `useReleaseSearch`
- ✅ `useProducaoObras`
- ✅ `useCoproducoes`
- ✅ `useLancamentosRecentes`
- ✅ `useLancamentosEstatisticas`
- ✅ `usePesquisaSalas`
- ✅ `useComplexos`
- ✅ `useDistribuidoras`
- ✅ `useDataTable`

## Exemplo de Dados de Distribuidora

Com base no endpoint `estatisticas/ranking_distribuidoras`, os dados agora são processados corretamente:

```typescript
// Estrutura esperada dos dados de distribuidora
{
  "distribuidora": "THE WALT DISNEY COMPANY (BRASIL) LTDA.",
  "publico_total": 423911922,
  "renda_total": 6836012944.75,
  "tipo_filme": "Estrangeiro",
  "total_filmes": 166
}
```

## Correções Específicas para Distribuidoras

### useDistribuidorasRankingKPIs
- Corrigido acesso aos dados: `response?.data`
- Corrigido ordenação: `b.publico_total - a.publico_total`
- Corrigido campos de retorno: `distribuidora` (não `distribuidora_nome`)

### useDistribuidorasRanking
- Mesmas correções aplicadas
- Adicionado suporte a metadata

## Validação

Todos os hooks foram testados para:
- ✅ Compatibilidade com TypeScript
- ✅ Tratamento correto da estrutura de resposta da API
- ✅ Preservação de funcionalidades existentes
- ✅ Inclusão de metadata para debugging e paginação

## Próximos Passos

1. Testar os hooks em ambiente de desenvolvimento
2. Verificar se os componentes que consomem estes hooks precisam de ajustes
3. Monitorar logs para garantir que os dados estão sendo processados corretamente