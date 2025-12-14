import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://genuine-flight-472304-e1.rj.r.appspot.com/api/v1";

// Função auxiliar para fazer requisições com tratamento de erro
const fetchWithErrorHandling = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
      const response: any = await apiClient.get(API_ENDPOINTS.MARKET_SHARE);

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      const brasileiro = data.find(
        (item: any) => item.tipo_filme === "Brasileiro"
      );
      const estrangeiro = data.find(
        (item: any) => item.tipo_filme === "Estrangeiro"
      );

      console.log(brasileiro);

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
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDistribuidorasRanking = (limit = 10) => {
  return useQuery({
    queryKey: ["distribuidorasRanking", limit],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.RANKING_DISTRIBUIDORAS,
        { limit }
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Backend now returns data with consistent field names:
      // distribuidora, publico_total, renda_total, total_filmes, total_publico, total_renda
      const ranking = data.map((item: any) => ({
        distribuidora: item.distribuidora,
        total_publico: item.publico_total || item.total_publico || 0,
        total_renda: item.renda_total || item.total_renda || 0,
        total_filmes: item.total_filmes || 0,
        rank: item.rank || 0,
      }));

      return {
        ranking,
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSalasPorUF = () => {
  return useQuery({
    queryKey: ["salasPorUF"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.SALAS_POR_UF);

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      console.log("Dados de salas por UF:", data);
      console.log(
        "Total de salas:",
        data.reduce(
          (sum: number, item: any) => sum + (item.total_salas || 0),
          0
        )
      );
      console.log(
        "Estados com salas:",
        data.filter((item: any) => item.total_salas > 0).length
      );

      // Processar os dados para o formato esperado
      return {
        salas_por_uf: data.map((item: any) => ({
          uf: item.uf,
          total_salas: item.total_salas,
        })),
        data_original: data,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useObrasPorTipo = () => {
  return useQuery({
    queryKey: ["obrasPorTipo"],
    queryFn: async () => {
      return await fetchWithErrorHandling(
        `${API_BASE_URL}/obras/estatisticas/por_tipo`
      );
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDesempenhoGenero = () => {
  return useQuery({
    queryKey: ["desempenhoGenero"],
    queryFn: async () => {
      return await fetchWithErrorHandling(
        `${API_BASE_URL}/estatisticas/desempenho_genero_br`
      );
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
      const response: any = await apiClient.get(
        API_ENDPOINTS.BILHETERIA_ANUAL,
        { ano: currentYear }
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Process data to get current year totals
      const currentYearData =
        data.find((item: any) => item.ano === currentYear) || {};

      return {
        total_publico: currentYearData.publico_total || 0,
        total_renda: currentYearData.renda_total || 0,
        ano: currentYear,
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDistributionTrends = () => {
  return useQuery({
    queryKey: ["distributionTrends"],
    queryFn: async () => {
      const response: any = await apiClient.get(API_ENDPOINTS.BILHETERIA_ANUAL);

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Sort by year and prepare data for charts
      const sortedData = data.sort((a: any, b: any) => a.ano - b.ano);

      return {
        public_evolution: sortedData.map((item: any) => ({
          ano: item.ano.toString(),
          publico_total: item.publico_total || 0,
        })),
        revenue_evolution: sortedData.map((item: any) => ({
          ano: item.ano.toString(),
          renda_total: item.renda_total || 0,
        })),
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useGenrePerformance = () => {
  return useQuery({
    queryKey: ["genrePerformance"],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.DESEMPENHO_GENERO_BR
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      const data = Array.isArray(response?.data) ? response.data : [];

      // Process data to calculate average performance by genre
      return {
        genres: data.map((item: any) => ({
          genero: item.genero || "Não informado",
          publico_medio: item.publico_medio || 0,
          renda_media: item.renda_media || 0,
          total_filmes: item.total_filmes || 0,
        })),
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useReleaseSearch = (
  filters: Record<string, any> = {},
  page = 1
) => {
  return useQuery({
    queryKey: ["releaseSearch", filters, page],
    queryFn: async () => {
      // Build query parameters
      const params: Record<string, any> = {
        page: page.toString(),
        limit: "20",
        ...filters,
      };

      // Remove empty values
      Object.keys(params).forEach((key) => {
        if (!params[key] || params[key].toString().trim() === "") {
          delete params[key];
        }
      });

      const response: any = await apiClient.get(
        API_ENDPOINTS.LANCAMENTOS_PESQUISA,
        params
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      const dataArray = Array.isArray(response?.data) ? response.data : [];

      return {
        releases: dataArray,
        pagination: response?.pagination || {
          current_page: page,
          total_pages: Math.ceil(dataArray.length / 20),
          total_items: dataArray.length,
          page_size: 20,
        },
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: true, // Always enabled, will show all releases if no filters
  });
};

// 🎭 Novos hooks para Produção Nacional
export const useProducaoObras = (
  filters: Record<string, any> = {},
  page = 1
) => {
  return useQuery({
    queryKey: ["producaoObras", filters, page],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: page.toString(),
        limit: "20",
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key] || params[key].toString().trim() === "") {
          delete params[key];
        }
      });

      const response: any = await apiClient.get(
        API_ENDPOINTS.PRODUCAO_OBRAS,
        params
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      const dataArray = Array.isArray(response?.data) ? response.data : [];

      return {
        obras: dataArray,
        pagination: response?.pagination || {
          current_page: page,
          total_pages: Math.ceil(dataArray.length / 20),
          total_items: dataArray.length,
          page_size: 20,
        },
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCoproducoes = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["coproducoes", filters],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.PRODUCAO_COPRODUCOES,
        filters
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      return {
        data: Array.isArray(response?.data) ? response.data : [],
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

// 🎬 Novos hooks para Distribuição e Lançamentos
export const useLancamentosRecentes = (limit = 10) => {
  return useQuery({
    queryKey: ["lancamentosRecentes", limit],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.LANCAMENTOS_RECENTES,
        { limit }
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      return {
        data: Array.isArray(response?.data) ? response.data : [],
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for recent data
  });
};

export const useLancamentosEstatisticas = () => {
  return useQuery({
    queryKey: ["lancamentosEstatisticas"],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.LANCAMENTOS_ESTATISTICAS
      );

      // API retorna: { data: {...}, metadata: {...}, success: true }
      return {
        data: response?.data || {},
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

// 🏛️ Novos hooks para Exibição
export const usePesquisaSalas = (
  filters: Record<string, any> = {},
  page = 1
) => {
  return useQuery({
    queryKey: ["pesquisaSalas", filters, page],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: page.toString(),
        limit: "20",
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key] || params[key].toString().trim() === "") {
          delete params[key];
        }
      });

      const response: any = await apiClient.get(
        API_ENDPOINTS.PESQUISA_SALAS,
        params
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      const dataArray = Array.isArray(response?.data) ? response.data : [];

      return {
        salas: dataArray,
        pagination: response?.pagination || {
          current_page: page,
          total_pages: Math.ceil(dataArray.length / 20),
          total_items: dataArray.length,
          page_size: 20,
        },
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 15,
  });
};

export const useComplexos = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["complexos", filters],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.DATA_COMPLEXOS,
        filters
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      return {
        data: Array.isArray(response?.data) ? response.data : [],
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 15,
  });
};

// 📋 Hook para Distribuidoras
export const useDistribuidoras = () => {
  return useQuery({
    queryKey: ["distribuidoras"],
    queryFn: async () => {
      const response: any = await apiClient.get(
        API_ENDPOINTS.DATA_DISTRIBUIDORAS
      );

      // API retorna: { data: [...], metadata: {...}, success: true }
      return {
        data: Array.isArray(response?.data) ? response.data : [],
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 30,
  });
};

// Hook genérico para acesso direto a tabelas
export const useDataTable = (
  tableName: string,
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: ["dataTable", tableName, filters],
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.DATA_TABLE.replace(
        "{table_name}",
        tableName
      );
      const response: any = await apiClient.get(endpoint, filters);

      // API retorna: { data: [...], metadata: {...}, success: true }
      return {
        data: Array.isArray(response?.data) ? response.data : [],
        metadata: response?.metadata,
      };
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!tableName,
  });
};
