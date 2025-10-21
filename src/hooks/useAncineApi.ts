import { useQuery } from "@tanstack/react-query";

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
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/estatisticas/market_share`);
      
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
      const data = await fetchWithErrorHandling(
        `${API_BASE_URL}/estatisticas/ranking_distribuidoras?limit=${limit}`
      );
      
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
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/estatisticas/salas_por_uf`);
      
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
