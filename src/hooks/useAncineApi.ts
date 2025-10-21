import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://genuine-flight-472304-e1.rj.r.appspot.com/api/v1";

interface ApiResponse<T> {
  data: T;
  status: number;
}

export const useMarketShare = () => {
  return useQuery({
    queryKey: ["marketShare"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/estatisticas/market_share`);
      if (!response.ok) throw new Error("Failed to fetch market share");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDistribuidorasRanking = (limit = 10) => {
  return useQuery({
    queryKey: ["distribuidorasRanking", limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/estatisticas/ranking_distribuidoras?limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch distributor ranking");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSalasPorUF = () => {
  return useQuery({
    queryKey: ["salasPorUF"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/estatisticas/salas_por_uf`);
      if (!response.ok) throw new Error("Failed to fetch screens by state");
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useObrasPorTipo = () => {
  return useQuery({
    queryKey: ["obrasPorTipo"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/obras/estatisticas/por_tipo`);
      if (!response.ok) throw new Error("Failed to fetch films by type");
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useDesempenhoGenero = () => {
  return useQuery({
    queryKey: ["desempenhoGenero"],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/estatisticas/desempenho_genero_br`
      );
      if (!response.ok) throw new Error("Failed to fetch genre performance");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
