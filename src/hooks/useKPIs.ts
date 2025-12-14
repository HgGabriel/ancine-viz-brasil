import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { SalasData, SalasPorUfItem, BilheteriaData, HistoricoCompletoItem } from "@/types/ui";

// 📊 KPIs de Estatísticas Gerais
export const useMarketShareKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "market-share"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.MARKET_SHARE);

      console.log(response);

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Processar dados para KPIs
      const brasileiro = data.find(
        (item: any) => item.tipo_filme === "Brasileiro"
      );
      const estrangeiro = data.find(
        (item: any) => item.tipo_filme === "Estrangeiro"
      );

      console.log("Response: " + JSON.stringify(response));
      console.log("Response data: " + JSON.stringify(response?.data));
      console.log("Market Share Data: " + JSON.stringify(data));
      console.log("Brasileiro: " + JSON.stringify(brasileiro));
      console.log("Estrangeiro: " + JSON.stringify(estrangeiro));

      if (!brasileiro || !estrangeiro) {
        throw new Error("Dados de market share incompletos");
      }

      const totalPublico = brasileiro.publico_total + estrangeiro.publico_total;
      const totalRenda = brasileiro.renda_total + estrangeiro.renda_total;

      return {
        market_share_nacional_publico:
          (brasileiro.publico_total / totalPublico) * 100,
        market_share_nacional_renda:
          (brasileiro.renda_total / totalRenda) * 100,
        market_share_estrangeiro_publico:
          (estrangeiro.publico_total / totalPublico) * 100,
        market_share_estrangeiro_renda:
          (estrangeiro.renda_total / totalRenda) * 100,
        total_publico: totalPublico,
        total_renda: totalRenda,
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDistribuidorasRankingKPIs = (limit = 10) => {
  return useQuery({
    queryKey: ["kpis", "distribuidoras-ranking", limit],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.RANKING_DISTRIBUIDORAS,
        { limit }
      );
      
      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Processar ranking de distribuidoras
      const distribuidorasMap = new Map();

      data.forEach((item: any) => {
        const nome = item.distribuidora;
        if (distribuidorasMap.has(nome)) {
          const existing = distribuidorasMap.get(nome);
          existing.publico_total += item.publico_total || 0;
          existing.renda_total += item.renda_total || 0;
          existing.total_filmes += item.total_filmes || 0;
        } else {
          distribuidorasMap.set(nome, {
            distribuidora: item.distribuidora,
            publico_total: item.publico_total || 0,
            renda_total: item.renda_total || 0,
            total_filmes: item.total_filmes || 0,
          });
        }
      });

      const ranking = Array.from(distribuidorasMap.values())
        .sort((a, b) => b.publico_total - a.publico_total)
        .slice(0, limit);

      return {
        top_distribuidor: ranking[0]?.distribuidora || "N/A",
        top_distribuidor_publico: ranking[0]?.publico_total || 0,
        top_distribuidor_renda: ranking[0]?.renda_total || 0,
        ranking_completo: ranking,
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSalasPorUFKPIs = () => {
  return useQuery<SalasData>({
    queryKey: ["kpis", "salas-por-uf"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.SALAS_POR_UF);
      
      // API retorna: { data: [...], metadata: {...}, success: true }
      const data: SalasPorUfItem[] = Array.isArray(response?.data) ? response.data : [];

      console.log("Dados de salas por UF:", data);
      console.log(
        "Total de salas:",
        data.reduce(
          (sum: number, item: SalasPorUfItem) => sum + (item.total_salas || 0),
          0
        )
      );
      console.log(
        "Estados com salas:",
        data.filter((item: SalasPorUfItem) => item.total_salas > 0).length
      );

      const totalSalas = data.reduce(
        (sum: number, item: SalasPorUfItem) => sum + (item.total_salas || 0),
        0
      );
      const estadosComSalas = data.filter(
        (item: SalasPorUfItem) => item.total_salas > 0
      ).length;
      const estadoComMaisSalas = data.reduce(
        (max: SalasPorUfItem, item: SalasPorUfItem) =>
          (item.total_salas || 0) > (max.total_salas || 0) ? item : max,
        data[0] || { uf: "N/A", total_salas: 0, nome_uf: "N/A" }
      );

      return {
        total_salas: totalSalas,
        total_estados_com_salas: estadosComSalas,
        estado_com_mais_salas: estadoComMaisSalas?.uf || "N/A",
        maior_numero_salas: estadoComMaisSalas?.total_salas || 0,
        salas_por_uf: data,
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useBilheteriaAnualKPIs = () => {
  return useQuery<BilheteriaData>({
    queryKey: ["kpis", "bilheteria-anual"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.BILHETERIA_ANUAL);
      
      const data: HistoricoCompletoItem[] = Array.isArray(response?.data) ? response.data : [];

      if (data.length === 0) {
        return {
          ano_atual: new Date().getFullYear().toString(),
          publico_total: 0,
          renda_total: 0,
          publico_variacao_anual: 0,
          renda_variacao_anual: 0,
          historico_completo: [],
        };
      }

      const anoMaisRecente = data[0];
      const anoAnterior = data[1];

      let publicoVariacao = 0;
      let rendaVariacao = 0;

      if (anoAnterior && anoAnterior.publico_total > 0) {
        publicoVariacao = ((anoMaisRecente.publico_total - anoAnterior.publico_total) / anoAnterior.publico_total) * 100;
      }
      if (anoAnterior && anoAnterior.renda_total > 0) {
        rendaVariacao = ((anoMaisRecente.renda_total - anoAnterior.renda_total) / anoAnterior.renda_total) * 100;
      }

      return {
        ano_atual: anoMaisRecente.ano.toString(),
        publico_total: anoMaisRecente.publico_total,
        renda_total: anoMaisRecente.renda_total,
        publico_variacao_anual: publicoVariacao,
        renda_variacao_anual: rendaVariacao,
        historico_completo: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDesempenhoGeneroKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "desempenho-genero"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.DESEMPENHO_GENERO_BR);
      
      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Encontrar o gênero com melhor desempenho
      const melhorGenero = data.reduce(
        (max: any, item: any) =>
          (item.publico_medio || 0) > (max.publico_medio || 0) ? item : max,
        data[0] || {}
      );

      const totalFilmes = data.reduce(
        (sum: number, item: any) => sum + (item.total_filmes || 0),
        0
      );
      const publicoMedioGeral =
        data.reduce(
          (sum: number, item: any) =>
            sum + (item.publico_medio || 0) * (item.total_filmes || 0),
          0
        ) / totalFilmes;

      return {
        melhor_genero: melhorGenero?.genero || "N/A",
        melhor_genero_publico_medio: melhorGenero?.publico_medio || 0,
        publico_medio_geral: publicoMedioGeral || 0,
        total_generos: data.length,
        total_filmes_analisados: totalFilmes,
        desempenho_por_genero: data,
        data_original: data,
        metadata: response?.metadata,
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
      const response: any = await apiClient.get(API_ENDPOINTS.PRODUCAO_ESTATISTICAS);
      
      const data = response?.data && typeof response.data === "object" ? response.data : {};
      
      const obrasPorAno = Array.isArray(data.obras_por_ano) ? data.obras_por_ano : [];
      const anoPico = obrasPorAno.reduce((max, item) => item.total > max.total ? item : max, { ano: 0, total: 0 });

      return {
        total_obras: data.total_obras || 0,
        obras_por_tipo: Array.isArray(data.obras_por_tipo) ? data.obras_por_tipo : [],
        obras_por_ano: obrasPorAno,
        ano_pico_producao: anoPico.ano,
        obras_ano_pico: anoPico.total,
        crescimento_anual_medio: data.crescimento_anual_medio || 0,
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCoproducoesKPIs = () => {
  return useQuery({
    queryKey: ["kpis", "coproducoes"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.PRODUCAO_COPRODUCOES);

      const coproducoes = Array.isArray(response?.data) ? response.data : [];

      // Processar países parceiros
      const paisesParceiros = new Map();
      coproducoes.forEach((item: any) => {
        const pais = item.pais_parceiro;
        if (pais && pais !== "Brasil") {
          paisesParceiros.set(pais, (paisesParceiros.get(pais) || 0) + 1);
        }
      });

      const topPaisParceiro = Array.from(paisesParceiros.entries()).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0];

      return {
        total_coproducoes: coproducoes.length,
        top_pais_parceiro: topPaisParceiro?.[0] || "N/A",
        coproducoes_top_pais: topPaisParceiro?.[1] || 0,
        paises_parceiros: Array.from(paisesParceiros.entries()),
        data_original: { coproducoes },
        metadata: {
          coproducoes: response?.metadata,
        },
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
      const response: any = await apiClient.get(
        API_ENDPOINTS.LANCAMENTOS_ESTATISTICAS
      );
      
      const data = response?.data && typeof response.data === "object" ? response.data : {};
      const tendencias = Array.isArray(data.tendencias_anuais) ? data.tendencias_anuais : [];
      const anoMaisRecente = tendencias[0] || {};

      return {
        total_lancamentos_ano: anoMaisRecente.total_lancamentos || 0,
        lancamentos_nacionais: anoMaisRecente.lancamentos_nacionais || 0,
        lancamentos_estrangeiros: anoMaisRecente.lancamentos_estrangeiros || 0,
        percentual_nacional: anoMaisRecente.percentual_nacional || 0,
        crescimento_publico: anoMaisRecente.crescimento_publico || 0,
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useLancamentosRecentesKPIs = (limit = 10) => {
  return useQuery({
    queryKey: ["kpis", "lancamentos-recentes", limit],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.LANCAMENTOS_RECENTES, {
        limit,
      });
      
      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      const nacionaisRecentes = data.filter(
        (item: any) => item.tipo_lancamento === "NACIONAL"
      ).length;
      const estrangeirosRecentes = data.filter(
        (item: any) => item.tipo_lancamento !== "NACIONAL"
      ).length;

      return {
        total_recentes: data.length,
        nacionais_recentes: nacionaisRecentes,
        estrangeiros_recentes: estrangeirosRecentes,
        ultimo_lancamento: data[0] || null,
        lancamentos_recentes: data,
        data_original: data,
        metadata: response?.metadata,
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
      const [complexosResponse, salasResponse] = await Promise.all([
        apiClient.get(API_ENDPOINTS.DATA_COMPLEXOS),
        apiClient.get(API_ENDPOINTS.SALAS_POR_UF),
      ]);

      // API retorna: { data: [...], metadata: {...}, success: true }
      const complexos = Array.isArray((complexosResponse as any)?.data)
        ? (complexosResponse as any).data
        : [];
      const salas = Array.isArray((salasResponse as any)?.data) 
        ? (salasResponse as any).data 
        : [];

      const totalComplexos = complexos.length;
      const totalSalas = salas.reduce(
        (sum: number, item: any) => sum + (item.total_salas || 0),
        0
      );
      const mediaSalasPorComplexo =
        totalComplexos > 0 ? totalSalas / totalComplexos : 0;

      // Agrupar por grupo exibidor
      const gruposExibidores = new Map();
      complexos.forEach((item: any) => {
        const grupo = item.exibidor || "Independente";
        gruposExibidores.set(grupo, (gruposExibidores.get(grupo) || 0) + 1);
      });

      const topGrupoExibidor = Array.from(gruposExibidores.entries()).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0];

      return {
        total_complexos: totalComplexos,
        total_salas: totalSalas,
        media_salas_por_complexo: mediaSalasPorComplexo,
        top_grupo_exibidor: topGrupoExibidor?.[0] || "N/A",
        complexos_top_grupo: topGrupoExibidor?.[1] || 0,
        grupos_exibidores: Array.from(gruposExibidores.entries()),
        data_original: { complexos, salas },
        metadata: {
          complexos: (complexosResponse as any)?.metadata,
          salas: (salasResponse as any)?.metadata,
        },
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
      const response: any = await apiClient.get(API_ENDPOINTS.DATA_DISTRIBUIDORAS);
      
      const data = Array.isArray(response?.data) ? response.data : [];

      return {
        total_distribuidoras: data.length,
        data_original: data,
        metadata: response?.metadata,
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

  console.log("Overview KPIs - Market Share:", marketShare.data);
  console.log("Overview KPIs - Distribuidoras:", distribuidoras.data);
  console.log("Overview KPIs - Salas:", salas.data);
  console.log("Overview KPIs - Bilheteria:", bilheteria.data);

  return {
    marketShare,
    distribuidoras,
    salas,
    bilheteria,
    isLoading:
      marketShare.isLoading ||
      distribuidoras.isLoading ||
      salas.isLoading ||
      bilheteria.isLoading,
    isError:
      marketShare.isError ||
      distribuidoras.isError ||
      salas.isError ||
      bilheteria.isError,
    error:
      marketShare.error ||
      distribuidoras.error ||
      salas.error ||
      bilheteria.error,
  };
};
