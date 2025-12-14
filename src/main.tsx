import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { LoadingProvider } from './providers/LoadingProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LoadingProvider>
          <App />
          <Toaster />
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
