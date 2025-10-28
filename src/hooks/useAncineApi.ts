import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";

const API_BASE_URL = import.meta.env.DEV 
  ? "/api" 
  : "https://genuine-flight-472304-e1.rj.r.appspot.com/api/v1";

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Função auxiliar para fazer requisições com tratamento de erro
const fetchWithErrorHandling = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados de ${url}:`, error);
    throw error;
  }
};

export const useMarketShare = () => {
  return useQuery({
    queryKey: ["marketShare"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.MARKET_SHARE);
      
      // Processar os dados para o formato esperado pelos componentes
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
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDistribuidorasRanking = (limit = 10) => {
  return useQuery({
    queryKey: ["distribuidorasRanking", limit],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.RANKING_DISTRIBUIDORAS, { limit });
      
      // Agrupar por distribuidora e somar os valores
      const distribuidorasMap = new Map();
      
      data.forEach((item: any) => {
        const nome = item.distribuidora;
        if (distribuidorasMap.has(nome)) {
          const existing = distribuidorasMap.get(nome);
          existing.total_publico += item.publico_total;
          existing.total_renda += item.renda_total;
          existing.total_filmes += item.total_filmes;
        } else {
          distribuidorasMap.set(nome, {
            distribuidora_nome: nome,
            total_publico: item.publico_total,
            total_renda: item.renda_total,
            total_filmes: item.total_filmes
          });
        }
      });
      
      // Converter para array e ordenar por público
      const ranking = Array.from(distribuidorasMap.values())
        .sort((a, b) => b.total_publico - a.total_publico)
        .slice(0, limit);
      
      return {
        ranking,
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSalasPorUF = () => {
  return useQuery({
    queryKey: ["salasPorUF"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.SALAS_POR_UF);
      
      // Processar os dados para o formato esperado
      return {
        salas_por_uf: data.map((item: any) => ({
          uf: item.uf,
          total_salas: item.total_salas
        })),
        data_original: data
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useObrasPorTipo = () => {
  return useQuery({
    queryKey: ["obrasPorTipo"],
    queryFn: async () => {
      return await fetchWithErrorHandling(`${API_BASE_URL}/obras/estatisticas/por_tipo`);
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDesempenhoGenero = () => {
  return useQuery({
    queryKey: ["desempenhoGenero"],
    queryFn: async () => {
      return await fetchWithErrorHandling(`${API_BASE_URL}/estatisticas/desempenho_genero_br`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Distribution-specific hooks
export const useDistributionKPIs = () => {
  return useQuery({
    queryKey: ["distributionKPIs"],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const data = await apiClient.get(API_ENDPOINTS.BILHETERIA_ANUAL, { ano: currentYear });
      
      // Process data to get current year totals
      const currentYearData = data.find((item: any) => item.ano === currentYear) || {};
      
      return {
        total_publico: currentYearData.publico_total || 0,
        total_renda: currentYearData.renda_total || 0,
        ano: currentYear
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDistributionTrends = () => {
  return useQuery({
    queryKey: ["distributionTrends"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.BILHETERIA_ANUAL);
      
      // Sort by year and prepare data for charts
      const sortedData = data.sort((a: any, b: any) => a.ano - b.ano);
      
      return {
        public_evolution: sortedData.map((item: any) => ({
          ano: item.ano.toString(),
          publico_total: item.publico_total || 0
        })),
        revenue_evolution: sortedData.map((item: any) => ({
          ano: item.ano.toString(),
          renda_total: item.renda_total || 0
        }))
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useGenrePerformance = () => {
  return useQuery({
    queryKey: ["genrePerformance"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.DESEMPENHO_GENERO_BR);
      
      // Process data to calculate average performance by genre
      return data.map((item: any) => ({
        genero: item.genero || 'Não informado',
        publico_medio: item.publico_medio || 0,
        renda_media: item.renda_media || 0,
        total_filmes: item.total_filmes || 0
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useReleaseSearch = (filters: Record<string, any> = {}, page = 1) => {
  return useQuery({
    queryKey: ["releaseSearch", filters, page],
    queryFn: async () => {
      // Build query parameters
      const params = {
        page: page.toString(),
        limit: '20',
        ...filters
      };
      
      // Remove empty values
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key].toString().trim() === '') {
          delete params[key];
        }
      });
      
      const data = await apiClient.get(API_ENDPOINTS.LANCAMENTOS_PESQUISA, params);
      
      // Process the response to match expected format
      return {
        releases: data.data || data || [],
        pagination: data.pagination || {
          current_page: page,
          total_pages: Math.ceil((data.length || 0) / 20),
          total_items: data.length || 0,
          page_size: 20
        }
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: true, // Always enabled, will show all releases if no filters
  });
};

// 🎭 Novos hooks para Produção Nacional
export const useProducaoObras = (filters: Record<string, any> = {}, page = 1) => {
  return useQuery({
    queryKey: ["producaoObras", filters, page],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        limit: '20',
        ...filters
      };
      
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key].toString().trim() === '') {
          delete params[key];
        }
      });
      
      const data = await apiClient.get(API_ENDPOINTS.PRODUCAO_OBRAS, params);
      
      return {
        obras: data.data || data || [],
        pagination: data.pagination || {
          current_page: page,
          total_pages: Math.ceil((data.length || 0) / 20),
          total_items: data.length || 0,
          page_size: 20
        }
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCoproducoes = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["coproducoes", filters],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.PRODUCAO_COPRODUCOES, filters);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

// 🎬 Novos hooks para Distribuição e Lançamentos
export const useLancamentosRecentes = (limit = 10) => {
  return useQuery({
    queryKey: ["lancamentosRecentes", limit],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.LANCAMENTOS_RECENTES, { limit });
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for recent data
  });
};

export const useLancamentosEstatisticas = () => {
  return useQuery({
    queryKey: ["lancamentosEstatisticas"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.LANCAMENTOS_ESTATISTICAS);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// 🏛️ Novos hooks para Exibição
export const usePesquisaSalas = (filters: Record<string, any> = {}, page = 1) => {
  return useQuery({
    queryKey: ["pesquisaSalas", filters, page],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        limit: '20',
        ...filters
      };
      
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key].toString().trim() === '') {
          delete params[key];
        }
      });
      
      const data = await apiClient.get(API_ENDPOINTS.PESQUISA_SALAS, params);
      
      return {
        salas: data.data || data || [],
        pagination: data.pagination || {
          current_page: page,
          total_pages: Math.ceil((data.length || 0) / 20),
          total_items: data.length || 0,
          page_size: 20
        }
      };
    },
    staleTime: 1000 * 60 * 15,
  });
};

export const useComplexos = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["complexos", filters],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.DATA_COMPLEXOS, filters);
      return data;
    },
    staleTime: 1000 * 60 * 15,
  });
};

// 📋 Hook para Distribuidoras
export const useDistribuidoras = () => {
  return useQuery({
    queryKey: ["distribuidoras"],
    queryFn: async () => {
      const data = await apiClient.get(API_ENDPOINTS.DATA_DISTRIBUIDORAS);
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

// Hook genérico para acesso direto a tabelas
export const useDataTable = (tableName: string, filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["dataTable", tableName, filters],
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.DATA_TABLE.replace('{table_name}', tableName);
      const data = await apiClient.get(endpoint, filters);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!tableName,
  });
};