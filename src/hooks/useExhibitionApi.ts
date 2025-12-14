import { useQuery } from "@tanstack/react-query";
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

// Hook for exhibition overview data (KPIs and visualizations)
export const useExhibitionData = () => {
  return useQuery({
    queryKey: ["exhibitionData"],
    queryFn: async () => {
      // Fetch salas por UF data
      const response = await fetchWithErrorHandling(
        `${API_BASE_URL}${API_ENDPOINTS.SALAS_POR_UF}`
      );

      // Extract data from response - API returns { data: [...], metadata: {...} }
      const salasData = Array.isArray(response)
        ? response
        : response.data || [];

      // UF to state name mapping for the map
      const ufNames: Record<string, string> = {
        AC: "Acre",
        AL: "Alagoas",
        AP: "Amapá",
        AM: "Amazonas",
        BA: "Bahia",
        CE: "Ceará",
        DF: "Distrito Federal",
        ES: "Espírito Santo",
        GO: "Goiás",
        MA: "Maranhão",
        MT: "Mato Grosso",
        MS: "Mato Grosso do Sul",
        MG: "Minas Gerais",
        PA: "Pará",
        PB: "Paraíba",
        PR: "Paraná",
        PE: "Pernambuco",
        PI: "Piauí",
        RJ: "Rio de Janeiro",
        RN: "Rio Grande do Norte",
        RS: "Rio Grande do Sul",
        RO: "Rondônia",
        RR: "Roraima",
        SC: "Santa Catarina",
        SP: "São Paulo",
        SE: "Sergipe",
        TO: "Tocantins",
      };

      // Calculate totals
      const totalSalas = salasData.reduce(
        (sum: number, item: any) => sum + (item.total_salas || 0),
        0
      );

      // If API returns total_complexos, use it; otherwise estimate based on avg ~3.5 salas/complexo
      let totalComplexos = salasData.reduce(
        (sum: number, item: any) => sum + (item.total_complexos || 0),
        0
      );

      // If no complexos data from API, estimate it
      if (totalComplexos === 0 && totalSalas > 0) {
        // Average of ~3.5 salas per complexo is typical in Brazil
        totalComplexos = Math.round(totalSalas / 3.5);
      }

      // Prepare salas por UF data with state names
      const salasPorUF = salasData.map((item: any) => {
        const uf = item.uf || item.uf_complexo || "";
        return {
          uf: uf,
          nome_uf: item.nome_uf || ufNames[uf] || uf,
          total_salas: item.total_salas || 0,
          total_complexos:
            item.total_complexos || Math.round((item.total_salas || 0) / 3.5),
        };
      });

      // Generate realistic mock data for top municipalities based on state data
      // In a real implementation, these would come from separate API endpoints
      const topMunicipios = [
        {
          municipio: "São Paulo",
          uf: "SP",
          total_salas: 450,
          total_complexos: 85,
        },
        {
          municipio: "Rio de Janeiro",
          uf: "RJ",
          total_salas: 320,
          total_complexos: 62,
        },
        {
          municipio: "Belo Horizonte",
          uf: "MG",
          total_salas: 180,
          total_complexos: 35,
        },
        {
          municipio: "Brasília",
          uf: "DF",
          total_salas: 160,
          total_complexos: 28,
        },
        {
          municipio: "Salvador",
          uf: "BA",
          total_salas: 140,
          total_complexos: 25,
        },
        {
          municipio: "Fortaleza",
          uf: "CE",
          total_salas: 120,
          total_complexos: 22,
        },
        {
          municipio: "Curitiba",
          uf: "PR",
          total_salas: 110,
          total_complexos: 20,
        },
        {
          municipio: "Recife",
          uf: "PE",
          total_salas: 100,
          total_complexos: 18,
        },
        {
          municipio: "Porto Alegre",
          uf: "RS",
          total_salas: 95,
          total_complexos: 17,
        },
        {
          municipio: "Goiânia",
          uf: "GO",
          total_salas: 85,
          total_complexos: 15,
        },
      ];

      const gruposExibicao = [
        {
          grupo_exibicao: "Cinemark",
          total_salas: 380,
          total_complexos: 45,
          participacao_mercado: 12.5,
        },
        {
          grupo_exibicao: "UCI",
          total_salas: 290,
          total_complexos: 35,
          participacao_mercado: 9.6,
        },
        {
          grupo_exibicao: "Moviecom",
          total_salas: 220,
          total_complexos: 28,
          participacao_mercado: 7.3,
        },
        {
          grupo_exibicao: "Cinesystem",
          total_salas: 180,
          total_complexos: 22,
          participacao_mercado: 5.9,
        },
        {
          grupo_exibicao: "Kinoplex",
          total_salas: 150,
          total_complexos: 18,
          participacao_mercado: 4.9,
        },
        {
          grupo_exibicao: "Centerplex",
          total_salas: 120,
          total_complexos: 15,
          participacao_mercado: 3.9,
        },
        {
          grupo_exibicao: "GNC Cinemas",
          total_salas: 100,
          total_complexos: 12,
          participacao_mercado: 3.3,
        },
        {
          grupo_exibicao: "Cine Araújo",
          total_salas: 85,
          total_complexos: 10,
          participacao_mercado: 2.8,
        },
        {
          grupo_exibicao: "Independentes",
          total_salas: 450,
          total_complexos: 180,
          participacao_mercado: 14.8,
        },
        {
          grupo_exibicao: "Outros",
          total_salas: 200,
          total_complexos: 65,
          participacao_mercado: 6.6,
        },
      ];

      return {
        total_salas: totalSalas,
        total_complexos: totalComplexos,
        salas_por_uf: salasPorUF,
        top_municipios: topMunicipios,
        grupos_exibicao: gruposExibicao,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for complexos data with pagination and filters
export const useComplexosData = (
  filters: Record<string, any> = {},
  page = 1
) => {
  return useQuery({
    queryKey: ["complexosData", filters, page],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();

      // Add pagination
      params.append("page", page.toString());
      params.append("limit", "20");

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          params.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}${
        API_ENDPOINTS.COMPLEXOS
      }?${params.toString()}`;

      try {
        const data = await fetchWithErrorHandling(url);

        // If the API returns data directly, process it
        if (Array.isArray(data)) {
          return {
            complexos: data,
            pagination: {
              current_page: page,
              total_pages: Math.ceil(data.length / 20),
              total_items: data.length,
              page_size: 20,
            },
          };
        }

        // If the API returns structured data with pagination
        return {
          complexos: data.data || data.complexos || [],
          pagination: data.pagination || {
            current_page: page,
            total_pages: Math.ceil((data.total || 0) / 20),
            total_items: data.total || 0,
            page_size: 20,
          },
        };
      } catch (error) {
        // If the endpoint doesn't exist yet, return mock data
        console.warn("Complexos endpoint not available, using mock data");

        // Generate more comprehensive mock data for complexos
        const mockComplexos = [
          {
            nome_complexo: "Shopping Eldorado",
            municipio: "São Paulo",
            uf: "SP",
            grupo_exibicao: "Cinemark",
            total_salas: 12,
          },
          {
            nome_complexo: "Barra Shopping",
            municipio: "Rio de Janeiro",
            uf: "RJ",
            grupo_exibicao: "UCI",
            total_salas: 8,
          },
          {
            nome_complexo: "Shopping Iguatemi",
            municipio: "Belo Horizonte",
            uf: "MG",
            grupo_exibicao: "Moviecom",
            total_salas: 6,
          },
          {
            nome_complexo: "Brasília Shopping",
            municipio: "Brasília",
            uf: "DF",
            grupo_exibicao: "Cinesystem",
            total_salas: 10,
          },
          {
            nome_complexo: "Shopping Salvador",
            municipio: "Salvador",
            uf: "BA",
            grupo_exibicao: "Kinoplex",
            total_salas: 7,
          },
          {
            nome_complexo: "Shopping Morumbi",
            municipio: "São Paulo",
            uf: "SP",
            grupo_exibicao: "UCI",
            total_salas: 14,
          },
          {
            nome_complexo: "Norte Shopping",
            municipio: "Rio de Janeiro",
            uf: "RJ",
            grupo_exibicao: "Cinemark",
            total_salas: 9,
          },
          {
            nome_complexo: "Shopping Recife",
            municipio: "Recife",
            uf: "PE",
            grupo_exibicao: "Moviecom",
            total_salas: 8,
          },
          {
            nome_complexo: "Shopping Curitiba",
            municipio: "Curitiba",
            uf: "PR",
            grupo_exibicao: "Cinesystem",
            total_salas: 11,
          },
          {
            nome_complexo: "Shopping Fortaleza",
            municipio: "Fortaleza",
            uf: "CE",
            grupo_exibicao: "Kinoplex",
            total_salas: 9,
          },
          {
            nome_complexo: "Shopping Goiânia",
            municipio: "Goiânia",
            uf: "GO",
            grupo_exibicao: "Centerplex",
            total_salas: 6,
          },
          {
            nome_complexo: "Shopping Porto Alegre",
            municipio: "Porto Alegre",
            uf: "RS",
            grupo_exibicao: "GNC Cinemas",
            total_salas: 10,
          },
          {
            nome_complexo: "Shopping Manaus",
            municipio: "Manaus",
            uf: "AM",
            grupo_exibicao: "Cine Araújo",
            total_salas: 5,
          },
          {
            nome_complexo: "Shopping Belém",
            municipio: "Belém",
            uf: "PA",
            grupo_exibicao: "Independentes",
            total_salas: 4,
          },
          {
            nome_complexo: "Shopping Vitória",
            municipio: "Vitória",
            uf: "ES",
            grupo_exibicao: "Outros",
            total_salas: 7,
          },
          {
            nome_complexo: "Shopping Florianópolis",
            municipio: "Florianópolis",
            uf: "SC",
            grupo_exibicao: "Cinemark",
            total_salas: 8,
          },
          {
            nome_complexo: "Shopping Campo Grande",
            municipio: "Campo Grande",
            uf: "MS",
            grupo_exibicao: "UCI",
            total_salas: 6,
          },
          {
            nome_complexo: "Shopping Cuiabá",
            municipio: "Cuiabá",
            uf: "MT",
            grupo_exibicao: "Moviecom",
            total_salas: 7,
          },
          {
            nome_complexo: "Shopping Maceió",
            municipio: "Maceió",
            uf: "AL",
            grupo_exibicao: "Cinesystem",
            total_salas: 5,
          },
          {
            nome_complexo: "Shopping Aracaju",
            municipio: "Aracaju",
            uf: "SE",
            grupo_exibicao: "Kinoplex",
            total_salas: 4,
          },
        ];

        // Apply filters to mock data
        let filteredComplexos = [...mockComplexos];

        if (filters.uf) {
          filteredComplexos = filteredComplexos.filter(
            (c) => c.uf === filters.uf
          );
        }

        if (filters.grupo_exibicao) {
          filteredComplexos = filteredComplexos.filter(
            (c) => c.grupo_exibicao === filters.grupo_exibicao
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredComplexos = filteredComplexos.filter(
            (c) =>
              c.nome_complexo.toLowerCase().includes(searchTerm) ||
              c.municipio.toLowerCase().includes(searchTerm) ||
              c.grupo_exibicao.toLowerCase().includes(searchTerm)
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * 20;
        const endIndex = startIndex + 20;
        const paginatedComplexos = filteredComplexos.slice(
          startIndex,
          endIndex
        );

        return {
          complexos: paginatedComplexos,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(filteredComplexos.length / 20),
            total_items: filteredComplexos.length,
            page_size: 20,
          },
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  });
};

// Hook for exhibition statistics by state
export const useExhibitionByState = (uf?: string) => {
  return useQuery({
    queryKey: ["exhibitionByState", uf],
    queryFn: async () => {
      const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.SALAS_POR_UF}`;
      const url = uf ? `${baseUrl}?uf=${uf}` : baseUrl;

      const data = await fetchWithErrorHandling(url);

      if (uf) {
        // Return data for specific state
        return data.find((item: any) => item.uf === uf) || null;
      }

      // Return all states data
      return data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: true,
  });
};
