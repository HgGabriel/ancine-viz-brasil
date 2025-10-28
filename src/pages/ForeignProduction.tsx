import { useState } from "react";
import { AlertCircle, Film, Calendar, MapPin } from "lucide-react";
import { PaginatedTable } from "@/components/ui/paginated-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { Column } from "@/types/ui";

// Interface for foreign production data
interface ForeignProductionData {
  id: string;
  titulo: string;
  ano_producao: number;
  pais_origem: string;
  tipo_obra: string;
  status_filmagem: string;
  data_inicio?: string;
  data_fim?: string;
  locacoes?: string;
  empresa_produtora?: string;
}

const ForeignProduction = () => {
  // Try to fetch data from the foreign production endpoint
  const {
    data,
    paginationInfo,
    isLoading,
    isError,
    error,
    setPage,
    setSort,
    currentPage,
  } = usePaginatedData<ForeignProductionData>('/producao/filmagem-estrangeira', {
    pageSize: 10,
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Define table columns for foreign production data
  const columns: Column<ForeignProductionData>[] = [
    {
      id: 'titulo',
      header: 'Título',
      accessorKey: 'titulo',
      sortable: true,
    },
    {
      id: 'ano_producao',
      header: 'Ano',
      accessorKey: 'ano_producao',
      sortable: true,
      cell: (value) => value || '-',
    },
    {
      id: 'pais_origem',
      header: 'País de Origem',
      accessorKey: 'pais_origem',
      sortable: true,
      cell: (value) => value || '-',
    },
    {
      id: 'tipo_obra',
      header: 'Tipo de Obra',
      accessorKey: 'tipo_obra',
      sortable: true,
      cell: (value) => value || '-',
    },
    {
      id: 'status_filmagem',
      header: 'Status',
      accessorKey: 'status_filmagem',
      sortable: true,
      cell: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'concluida' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : value === 'em_andamento'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }`}>
          {value === 'concluida' ? 'Concluída' : 
           value === 'em_andamento' ? 'Em Andamento' : 
           value || 'Não informado'}
        </span>
      ),
    },
    {
      id: 'locacoes',
      header: 'Locações',
      accessorKey: 'locacoes',
      cell: (value) => value || '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Produção Estrangeira</h1>
        <p className="text-muted-foreground">
          Análise de produções estrangeiras filmadas no Brasil
        </p>
      </div>

      {/* Development Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Seção em desenvolvimento:</strong> Esta funcionalidade está sendo implementada. 
          Os dados apresentados podem ser limitados ou indisponíveis temporariamente.
        </AlertDescription>
      </Alert>

      {/* Placeholder KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produções
            </CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : paginationInfo.totalItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Produções estrangeiras registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ano Atual
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().getFullYear()}
            </div>
            <p className="text-xs text-muted-foreground">
              Dados em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Países Participantes
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Beta</div>
            <p className="text-xs text-muted-foreground">
              Funcionalidade em teste
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produções Estrangeiras</CardTitle>
          <CardDescription>
            Lista de produções estrangeiras filmadas no Brasil
            {isError && (
              <span className="text-destructive">
                {' '}(Dados temporariamente indisponíveis)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaginatedTable
            columns={columns}
            data={data}
            paginationInfo={paginationInfo}
            onPageChange={setPage}
            onSortChange={setSort}
            isLoading={isLoading}
            emptyMessage={
              isError 
                ? `Erro ao carregar dados: ${error?.message || 'Endpoint não disponível'}`
                : "Nenhuma produção estrangeira encontrada."
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForeignProduction;