import { useState } from "react";
import { PaginatedTable } from "@/components/ui/paginated-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReleaseSearch } from "@/hooks/useAncineApi";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { Search, Filter, Download } from "lucide-react";

interface ReleaseFilters {
  periodo_inicio?: string;
  periodo_fim?: string;
  tipo_obra?: string;
  pais_origem?: string;
  distribuidora?: string;
  titulo?: string;
}

export const ReleaseExplorerTab = () => {
  const [filters, setFilters] = useState<ReleaseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<ReleaseFilters>({});

  const { data, isLoading, error } = useReleaseSearch(appliedFilters, currentPage);

  const handleFilterChange = (key: keyof ReleaseFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const columns = [
    {
      id: "titulo",
      header: "Título",
      accessorKey: "titulo" as const,
      cell: (value: string) => (
        <div className="font-medium max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
      sortable: true,
    },
    {
      id: "data_lancamento",
      header: "Data de Lançamento",
      accessorKey: "data_lancamento" as const,
      cell: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      id: "distribuidora",
      header: "Distribuidora",
      accessorKey: "distribuidora" as const,
      cell: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
      sortable: true,
    },
    {
      id: "tipo_obra",
      header: "Tipo",
      accessorKey: "tipo_obra" as const,
      sortable: true,
    },
    {
      id: "pais_origem",
      header: "País",
      accessorKey: "pais_origem" as const,
      sortable: true,
    },
    {
      id: "publico_total",
      header: "Público",
      accessorKey: "publico_total" as const,
      cell: (value: number) => formatNumber(value),
      sortable: true,
    },
    {
      id: "renda_total",
      header: "Renda",
      accessorKey: "renda_total" as const,
      cell: (value: number) => formatCurrency(value),
      sortable: true,
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Erro ao carregar dados de lançamentos
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Buscar por título..."
                value={filters.titulo || ""}
                onChange={(e) => handleFilterChange("titulo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo_inicio">Data Início</Label>
              <Input
                id="periodo_inicio"
                type="date"
                value={filters.periodo_inicio || ""}
                onChange={(e) => handleFilterChange("periodo_inicio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo_fim">Data Fim</Label>
              <Input
                id="periodo_fim"
                type="date"
                value={filters.periodo_fim || ""}
                onChange={(e) => handleFilterChange("periodo_fim", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_obra">Tipo de Obra</Label>
              <Select
                value={filters.tipo_obra || ""}
                onValueChange={(value) => handleFilterChange("tipo_obra", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="Longa-metragem">Longa-metragem</SelectItem>
                  <SelectItem value="Documentário">Documentário</SelectItem>
                  <SelectItem value="Animação">Animação</SelectItem>
                  <SelectItem value="Curta-metragem">Curta-metragem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais_origem">País de Origem</Label>
              <Select
                value={filters.pais_origem || ""}
                onValueChange={(value) => handleFilterChange("pais_origem", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar país..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os países</SelectItem>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                  <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                  <SelectItem value="França">França</SelectItem>
                  <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distribuidora">Distribuidora</Label>
              <Input
                id="distribuidora"
                placeholder="Nome da distribuidora..."
                value={filters.distribuidora || ""}
                onChange={(e) => handleFilterChange("distribuidora", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={applyFilters} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resultados da Pesquisa</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PaginatedTable
            columns={columns}
            data={data?.releases || []}
            paginationInfo={{
              currentPage: data?.pagination?.current_page || 1,
              totalPages: data?.pagination?.total_pages || 1,
              totalItems: data?.pagination?.total_items || 0,
              pageSize: data?.pagination?.page_size || 20,
            }}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};