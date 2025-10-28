import { useCallback } from 'react';
import { useToast } from './use-toast';
import { ApiError } from '@/lib/apiClient';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  onError?: (error: Error | ApiError) => void;
}

/**
 * Global error handler hook that provides consistent error handling across the application
 * Integrates with toast notifications and error reporting
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { toast } = useToast();
  const {
    showToast = true,
    logToConsole = true,
    onError
  } = options;

  const handleError = useCallback((error: Error | ApiError, context?: string) => {
    // Log error to console in development
    if (logToConsole && import.meta.env.DEV) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }

    // Call custom error handler if provided
    onError?.(error);

    // Show user-friendly toast notification
    if (showToast) {
      const isApiError = 'status' in error;
      
      let title = 'Erro';
      let description = 'Ocorreu um erro inesperado.';

      if (isApiError) {
        const apiError = error as ApiError;
        
        if (apiError.isNetworkError) {
          title = 'Erro de Conexão';
          description = 'Verifique sua conexão com a internet e tente novamente.';
        } else if (apiError.isTimeoutError) {
          title = 'Tempo Limite Excedido';
          description = 'A requisição demorou muito para responder. Tente novamente.';
        } else if (apiError.status >= 500) {
          title = 'Erro do Servidor';
          description = 'O servidor está temporariamente indisponível. Tente novamente em alguns minutos.';
        } else if (apiError.status === 404) {
          title = 'Dados Não Encontrados';
          description = 'Os dados solicitados não foram encontrados.';
        } else {
          title = 'Erro na Requisição';
          description = apiError.message;
        }
      } else {
        // Generic JavaScript error
        title = 'Erro da Aplicação';
        description = error.message || 'Ocorreu um erro inesperado na aplicação.';
      }

      toast({
        variant: 'destructive',
        title,
        description,
      });
    }

    // In production, you might want to send errors to a monitoring service
    // Example: Sentry.captureException(error, { extra: { context } });
  }, [toast, showToast, logToConsole, onError]);

  const handleApiError = useCallback((error: ApiError, context?: string) => {
    handleError(error, context);
  }, [handleError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error | ApiError, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleAsyncError,
  };
}

/**
 * Error handler specifically for React Query errors
 * Provides consistent error handling for data fetching operations
 */
export function useQueryErrorHandler() {
  const { handleApiError } = useErrorHandler();

  return useCallback((error: unknown) => {
    if (error) {
      handleApiError(error as ApiError, 'Data fetching');
    }
  }, [handleApiError]);
}

/**
 * Higher-order function to wrap async functions with error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Use a basic error handler since we can't use hooks here
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
      throw error; // Re-throw to let the calling code handle it
    }
  };
}