import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  stage?: {
    current: number;
    total: number;
    message: string;
  };
  onCancel?: () => void;
  cancelText?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

/**
 * Full-screen loading overlay component
 * Provides visual feedback for long-running operations
 */
export function LoadingOverlay({
  isVisible,
  message = 'Carregando...',
  progress,
  stage,
  onCancel,
  cancelText = 'Cancelar',
  variant = 'default',
  className,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const overlayContent = (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div className="flex flex-col items-center space-y-4 p-8 bg-card rounded-lg shadow-lg border max-w-sm w-full mx-4">
        {/* Loading Spinner */}
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          {progress !== undefined && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Content based on variant */}
        {variant === 'minimal' ? (
          <p id="loading-title" className="text-sm font-medium text-center">
            {message}
          </p>
        ) : (
          <>
            {/* Title */}
            <h3 id="loading-title" className="text-lg font-semibold text-center">
              {stage ? `Etapa ${stage.current} de ${stage.total}` : 'Carregando'}
            </h3>

            {/* Message */}
            <p id="loading-description" className="text-sm text-muted-foreground text-center">
              {stage ? stage.message : message}
            </p>

            {/* Progress Bar */}
            {(progress !== undefined || stage) && (
              <div className="w-full space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${progress ?? (stage ? (stage.current / stage.total) * 100 : 0)}%` 
                    }}
                  />
                </div>
                {progress !== undefined && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Detailed info for detailed variant */}
            {variant === 'detailed' && stage && (
              <div className="w-full space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Etapa atual:</span>
                  <span>{stage.current}/{stage.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo estimado:</span>
                  <span>Calculando...</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Cancel Button */}
        {onCancel && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            className="mt-4"
          >
            {cancelText}
          </Button>
        )}
      </div>
    </div>
  );

  // Render to portal to ensure it's on top of everything
  return createPortal(overlayContent, document.body);
}

/**
 * Error overlay component for displaying errors with retry options
 */
interface ErrorOverlayProps {
  isVisible: boolean;
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryText?: string;
  dismissText?: string;
  className?: string;
}

export function ErrorOverlay({
  isVisible,
  title = 'Erro',
  message,
  onRetry,
  onDismiss,
  retryText = 'Tentar novamente',
  dismissText = 'Fechar',
  className,
}: ErrorOverlayProps) {
  if (!isVisible) return null;

  const overlayContent = (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <div className="flex flex-col items-center space-y-4 p-8 bg-card rounded-lg shadow-lg border max-w-md w-full mx-4">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        {/* Title */}
        <h3 id="error-title" className="text-lg font-semibold text-center">
          {title}
        </h3>

        {/* Message */}
        <p id="error-description" className="text-sm text-muted-foreground text-center">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          {onRetry && (
            <Button onClick={onRetry} size="sm">
              {retryText}
            </Button>
          )}
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss} size="sm">
              {dismissText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
}

/**
 * Hook for managing overlay states
 */
export function useOverlay() {
  const [loadingOverlay, setLoadingOverlay] = React.useState({
    isVisible: false,
    message: '',
    progress: undefined as number | undefined,
    stage: undefined as { current: number; total: number; message: string } | undefined,
  });

  const [errorOverlay, setErrorOverlay] = React.useState({
    isVisible: false,
    title: '',
    message: '',
  });

  const showLoading = React.useCallback((
    message: string, 
    options?: { 
      progress?: number; 
      stage?: { current: number; total: number; message: string };
    }
  ) => {
    setLoadingOverlay({
      isVisible: true,
      message,
      progress: options?.progress,
      stage: options?.stage,
    });
  }, []);

  const hideLoading = React.useCallback(() => {
    setLoadingOverlay(prev => ({ ...prev, isVisible: false }));
  }, []);

  const updateLoading = React.useCallback((
    updates: Partial<Pick<typeof loadingOverlay, 'message' | 'progress' | 'stage'>>
  ) => {
    setLoadingOverlay(prev => ({ ...prev, ...updates }));
  }, []);

  const showError = React.useCallback((message: string, title?: string) => {
    setErrorOverlay({
      isVisible: true,
      title: title || 'Erro',
      message,
    });
  }, []);

  const hideError = React.useCallback(() => {
    setErrorOverlay(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    loadingOverlay,
    errorOverlay,
    showLoading,
    hideLoading,
    updateLoading,
    showError,
    hideError,
  };
}