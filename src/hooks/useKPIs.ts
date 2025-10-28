import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";

// 📊 KPIs de Estatísticas Gerais
export const useMarketShareKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "market-share"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.MARKET_SHARE);
      
      // Processar dados para KPIs
      const brasileiro = data.find((item: any) => item.tipo_filme === "Brasileiro");
      const estrangeiro = data.find((item: any) => item.tipo_filme === "Estrangeiro");
      
      if (!brasileiro || !estrangeiro) {
        throw new Error("Dados de market share incompletos");
      }
      
      const totalPublico = brasileiro.publico_total + estrangeiro.publico_total;
      const totalRenda = brasileiro.renda_total + estrangeiro.renda_total;
      
      return {
        market_share_nacional_publico: (brasileiro.publico_total / totalPublico) * 100,
        market_share_nacional_renda: (brasileiro.renda_total / totalRenda) * 100,
        market_share_estrangeiro_publico: (estrangeiro.publico_total / totalPublico) * 100,
        market_share_estrangeiro_renda: (estrangeiro.renda_total / totalRenda) * 100,
        total_publico: totalPublico,
        total_renda: totalRenda,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDistribuidorasRankingKPIs = (limit = 10) => {
  return useQuery({
    queryKey: ["kpis", "distribuidoras-ranking", limit],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.RANKING_DISTRIBUIDORAS, { limit });
      
      // Processar ranking de distribuidoras
      const distribuidorasMap = new Map();
      
      data.forEach((item: any) => {
        const nome = item.distribuidora;
        if (distribuidorasMap.has(nome)) {
          const existing = distribuidorasMap.get(nome);
          existing.total_publico += item.publico_total || 0;
          existing.total_renda += item.renda_total || 0;
          existing.total_filmes += item.total_filmes || 0;
        } else {
          distribuidorasMap.set(nome, {
            distribuidora_nome: nome,
            total_publico: item.publico_total || 0,
            total_renda: item.renda_total || 0,
            total_filmes: item.total_filmes || 0
          });
        }
      });
      
      const ranking = Array.from(distribuidorasMap.values())
        .sort((a, b) => b.total_publico - a.total_publico)
        .slice(0, limit);
      
      return {
        top_distribuidor: ranking[0]?.distribuidora_nome || "N/A",
        top_distribuidor_publico: ranking[0]?.total_publico || 0,
        top_distribuidor_renda: ranking[0]?.total_renda || 0,
        ranking_completo: ranking,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSalasPorUFKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "salas-por-uf"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.SALAS_POR_UF);
      
      const totalSalas = data.reduce((sum: number, item: any) => sum + (item.total_salas || 0), 0);
      const estadosComSalas = data.filter((item: any) => item.total_salas > 0).length;
      const estadoComMaisSalas = data.reduce((max: any, item: any) => 
        (item.total_salas || 0) > (max.total_salas || 0) ? item : max, data[0] || {});
      
      return {
        total_salas: totalSalas,
        total_estados_com_salas: estadosComMaisSalas,
        estado_com_mais_salas: estadoComMaisSalas?.uf || "N/A",
        maior_numero_salas: estadoComMaisSalas?.total_salas || 0,
        salas_por_uf: data,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useBilheteriaAnualKPIs = (ano?: number) => {
  return useQuery({
    queryKey: ["kpis", "bilheteria-anual", ano],
    queryFn: async () => {
      const params = ano ? { ano } : {};
      const data = await apiClient.get(API_ENDPOINTS.BILHETERIA_ANUAL, params);
      
      const currentYear = ano || new Date().getFullYear();
      const currentYearData = data.find((item: any) => item.ano === currentYear);
      const previousYearData = data.find((item: any) => item.ano === currentYear - 1);
      
      // Calcular variações
      const publicoVariacao = previousYearData 
        ? ((currentYearData?.publico_total || 0) - (previousYearData?.publico_total || 0)) / (previousYearData?.publico_total || 1) * 100
        : 0;
      
      const rendaVariacao = previousYearData
        ? ((currentYearData?.renda_total || 0) - (previousYearData?.renda_total || 0)) / (previousYearData?.renda_total || 1) * 100
        : 0;
      
      return {
        ano_atual: currentYear,
        publico_total: currentYearData?.publico_total || 0,
        renda_total: currentYearData?.renda_total || 0,
        preco_medio_ingresso: currentYearData?.publico_total > 0 
          ? (currentYearData?.renda_total || 0) / (currentYearData?.publico_total || 1)
          : 0,
        publico_variacao_anual: publicoVariacao,
        renda_variacao_anual: rendaVariacao,
        historico_completo: data.sort((a: any, b: any) => b.ano - a.ano),
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDesempenhoGeneroKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "desempenho-genero"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.DESEMPENHO_GENERO_BR);
      
      // Encontrar o gênero com melhor desempenho
      const melhorGenero = data.reduce((max: any, item: any) => 
        (item.publico_medio || 0) > (max.publico_medio || 0) ? item : max, data[0] || {});
      
      const totalFilmes = data.reduce((sum: number, item: any) => sum + (item.total_filmes || 0), 0);
      const publicoMedioGeral = data.reduce((sum: number, item: any) => 
        sum + (item.publico_medio || 0) * (item.total_filmes || 0), 0) / totalFilmes;
      
      return {
        melhor_genero: melhorGenero?.genero || "N/A",
        melhor_genero_publico_medio: melhorGenero?.publico_medio || 0,
        publico_medio_geral: publicoMedioGeral || 0,
        total_generos: data.length,
        total_filmes_analisados: totalFilmes,
        desempenho_por_genero: data,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

// 🎭 KPIs de Produção Nacional
export const useProducaoEstatisticasKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "producao-estatisticas"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.PRODUCAO_ESTATISTICAS);
      
      return {
        total_obras: data.total_obras || 0,
        obras_por_tipo: data.obras_por_tipo || {},
        ano_pico_producao: data.ano_pico_producao || new Date().getFullYear(),
        obras_ano_pico: data.obras_ano_pico || 0,
        crescimento_anual_medio: data.crescimento_anual_medio || 0,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCoproducoesKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "coproducoes"],
    queryFn: async () => {
      const [coproducoes, estatisticas] = await Promise.all([
        apiClient.get(API_ENDPOINTS.PRODUCAO_COPRODUCOES),
        apiClient.get(API_ENDPOINTS.PRODUCAO_COPRODUCOES_ESTATISTICAS)
      ]);
      
      // Processar países parceiros
      const paisesParceiros = new Map();
      coproducoes.forEach((item: any) => {
        const pais = item.pais_parceiro;
        if (pais && pais !== 'Brasil') {
          paisesParceiros.set(pais, (paisesParceiros.get(pais) || 0) + 1);
        }
      });
      
      const topPaisParceiro = Array.from(paisesParceiros.entries())
        .sort(([,a], [,b]) => (b as number) - (a as number))[0];
      
      return {
        taxa_coproducao: estatisticas.taxa_coproducao || 0,
        total_coproducoes: coproducoes.length,
        top_pais_parceiro: topPaisParceiro?.[0] || "N/A",
        coproducoes_top_pais: topPaisParceiro?.[1] || 0,
        paises_parceiros: Array.from(paisesParceiros.entries()),
        desempenho_comparativo: estatisticas.desempenho_comparativo || {},
        data_original: { coproducoes, estatisticas }
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

// 🎬 KPIs de Distribuição e Lançamentos
export const useLancamentosEstatisticasKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "lancamentos-estatisticas"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.LANCAMENTOS_ESTATISTICAS);
      
      return {
        total_lancamentos_ano: data.total_lancamentos_ano || 0,
        lancamentos_nacionais: data.lancamentos_nacionais || 0,
        lancamentos_estrangeiros: data.lancamentos_estrangeiros || 0,
        percentual_nacional: data.percentual_nacional || 0,
        media_lancamentos_mes: data.media_lancamentos_mes || 0,
        pico_lancamentos_mes: data.pico_lancamentos_mes || "N/A",
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useLancamentosRecentesKPIs = (limit = 10) => {
  return useQuery({
    queryKey: ["kpis", "lancamentos-recentes", limit],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.LANCAMENTOS_RECENTES, { limit });
      
      const nacionaisRecentes = data.filter((item: any) => item.origem === 'Nacional').length;
      const estrangeirosRecentes = data.filter((item: any) => item.origem === 'Estrangeiro').length;
      
      return {
        total_recentes: data.length,
        nacionais_recentes: nacionaisRecentes,
        estrangeiros_recentes: estrangeirosRecentes,
        ultimo_lancamento: data[0] || null,
        lancamentos_recentes: data,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for recent data
  });
};

// 🏛️ KPIs de Exibição
export const useExibicaoKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "exibicao"],
    queryFn: async () => {
      const [complexos, salas] = await Promise.all([
        apiClient.get(API_ENDPOINTS.DATA_COMPLEXOS),
        apiClient.get(API_ENDPOINTS.SALAS_POR_UF)
      ]);
      
      const totalComplexos = complexos.length;
      const totalSalas = salas.reduce((sum: number, item: any) => sum + (item.total_salas || 0), 0);
      const mediaSalasPorComplexo = totalComplexos > 0 ? totalSalas / totalComplexos : 0;
      
      // Agrupar por grupo exibidor
      const gruposExibidores = new Map();
      complexos.forEach((item: any) => {
        const grupo = item.grupo_exibidor || 'Independente';
        gruposExibidores.set(grupo, (gruposExibidores.get(grupo) || 0) + 1);
      });
      
      const topGrupoExibidor = Array.from(gruposExibidores.entries())
        .sort(([,a], [,b]) => (b as number) - (a as number))[0];
      
      return {
        total_complexos: totalComplexos,
        total_salas: totalSalas,
        media_salas_por_complexo: mediaSalasPorComplexo,
        top_grupo_exibidor: topGrupoExibidor?.[0] || "N/A",
        complexos_top_grupo: topGrupoExibidor?.[1] || 0,
        grupos_exibidores: Array.from(gruposExibidores.entries()),
        data_original: { complexos, salas }
      };
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// 📋 KPIs de Dados de Referência
export const useDistribuidorasKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "distribuidoras"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.DATA_DISTRIBUIDORAS);
      
      const nacionais = data.filter((item: any) => item.tipo === 'Nacional').length;
      const estrangeiras = data.filter((item: any) => item.tipo === 'Estrangeiro').length;
      const independentes = data.filter((item: any) => item.tipo === 'Independente').length;
      
      return {
        total_distribuidoras: data.length,
        distribuidoras_nacionais: nacionais,
        distribuidoras_estrangeiras: estrangeiras,
        distribuidoras_independentes: independentes,
        percentual_nacionais: data.length > 0 ? (nacionais / data.length) * 100 : 0,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Hook combinado para Overview Dashboard
export const useOverviewKPIs = () => {
  const marketShare = useMarketShareKPIs();
  const distribuidoras = useDistribuidorasRankingKPIs(1); // Top 1 para overview
  const salas = useSalasPorUFKPIs();
  const bilheteria = useBilheteriaAnualKPIs();
  
  return {
    marketShare,
    distribuidoras,
    salas,
    bilheteria,
    isLoading: marketShare.isLoading || distribuidoras.isLoading || salas.isLoading || bilheteria.isLoading,
    isError: marketShare.isError || distribuidoras.isError || salas.isError || bilheteria.isError,
    error: marketShare.error || distribuidoras.error || salas.error || bilheteria.error
  };
};