// API Client for ANCINE Dashboard
// Handles communication with the ANCINE RESTful API

export interface ApiResponse<T> {
  data: T[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
    last_id?: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: (attempt: number) => number;
  retryCondition: (error: ApiError) => boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultRetryConfig: RetryConfig;

  constructor() {
    // Use environment variable or default to a placeholder
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.ancine.gov.br/api/v1';

    // Default retry configuration
    this.defaultRetryConfig = {
      maxRetries: 3,
      retryDelay: (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 10000), // Exponential backoff
      retryCondition: (error: ApiError) => {
        // Retry on network errors, timeouts, and 5xx server errors
        return error.isNetworkError ||
          error.isTimeoutError ||
          (error.status >= 500 && error.status < 600);
      }
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      let message: string;

      // Provide user-friendly error messages in Portuguese
      switch (response.status) {
        case 400:
          message = 'Requisição inválida. Verifique os parâmetros enviados.';
          break;
        case 401:
          message = 'Acesso não autorizado. Verifique suas credenciais.';
          break;
        case 403:
          message = 'Acesso negado. Você não tem permissão para acessar este recurso.';
          break;
        case 404:
          message = 'Recurso não encontrado. O endpoint solicitado não existe.';
          break;
        case 429:
          message = 'Muitas requisições. Aguarde um momento antes de tentar novamente.';
          break;
        case 500:
          message = 'Erro interno do servidor. Tente novamente em alguns minutos.';
          break;
        case 502:
          message = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
          break;
        case 503:
          message = 'Serviço em manutenção. Tente novamente mais tarde.';
          break;
        default:
          message = errorData.message || `Erro HTTP ${response.status}: ${response.statusText}`;
      }

      const error: ApiError = {
        message,
        status: response.status,
        code: errorData.code,
        isNetworkError: false,
        isTimeoutError: false,
      };
      throw error;
    }

    return response.json();
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retryConfig: RetryConfig = this.defaultRetryConfig
  ): Promise<T> {
    let lastError: ApiError;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return this.handleResponse<T>(response);

      } catch (error) {
        // Handle different types of errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            lastError = {
              message: 'Tempo limite da requisição excedido. Tente novamente.',
              status: 0,
              isNetworkError: false,
              isTimeoutError: true,
            };
          } else if (error.name === 'TypeError') {
            lastError = {
              message: 'Erro de conexão. Verifique sua internet e tente novamente.',
              status: 0,
              isNetworkError: true,
              isTimeoutError: false,
            };
          } else {
            lastError = error as unknown as ApiError;
          }
        } else {
          lastError = error as unknown as ApiError;
        }

        // Check if we should retry
        if (attempt < retryConfig.maxRetries && retryConfig.retryCondition(lastError)) {
          const delay = retryConfig.retryDelay(attempt);
          console.warn(`API request failed (attempt ${attempt + 1}/${retryConfig.maxRetries + 1}). Retrying in ${delay}ms...`, lastError);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // No more retries or error is not retryable
        break;
      }
    }

    throw lastError;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, retryConfig?: Partial<RetryConfig>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const finalRetryConfig = { ...this.defaultRetryConfig, ...retryConfig };

    return this.fetchWithRetry<T>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }, finalRetryConfig);
  }

  // Paginated request helper
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.get<ApiResponse<T>>(endpoint, params);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type { ApiResponse as ApiClientResponse, ApiError as ApiClientError };