import React, { useState } from 'react';
import { PaginatedTable } from '@/components/ui/paginated-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useComplexosData } from '@/hooks/useExhibitionApi';
import { BRAZILIAN_STATES } from '@/lib/constants';

interface Filters {
  uf?: string;
  grupo_exibicao?: string;
  search?: string;
}

export const ExhibitionDataTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  
  const { data: complexosData, isLoading } = useComplexosData(filters, currentPage);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters };
    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange('search', value);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Get unique exhibition groups from the data for filter options
  const exhibitionGroups = [
    'Cinemark', 'UCI', 'Moviecom', 'Cinesystem', 'Kinoplex', 
    'Centerplex', 'GNC Cinemas', 'Cine Araújo', 'Independentes', 'Outros'
  ];

  const filterControls = (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar complexo..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* State Filter */}
        <Select
          value={filters.uf || 'all'}
          onValueChange={(value) => handleFilterChange('uf', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Todos os estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {BRAZILIAN_STATES.map((state) => (
              <SelectItem key={state.code} value={state.code}>
                {state.code} - {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Exhibition Group Filter */}
        <Select
          value={filters.grupo_exibicao || 'all'}
          onValueChange={(value) => handleFilterChange('grupo_exibicao', value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todos os grupos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os grupos</SelectItem>
            {exhibitionGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Complexos de Cinema</h3>
          <p className="text-sm text-muted-foreground">
            {complexosData?.pagination?.total_items || 0} complexos encontrados
          </p>
        </div>
      </div>

      <PaginatedTable
        data={complexosData?.complexos || []}
        columns={[
          {
            id: 'nome_complexo',
            header: 'Nome do Complexo',
            accessorKey: 'nome_complexo',
            sortable: true,
          },
          {
            id: 'municipio',
            header: 'Município',
            accessorKey: 'municipio',
            sortable: true,
          },
          {
            id: 'uf',
            header: 'UF',
            accessorKey: 'uf',
            sortable: true,
          },
          {
            id: 'grupo_exibicao',
            header: 'Grupo de Exibição',
            accessorKey: 'grupo_exibicao',
            sortable: true,
          },
          {
            id: 'total_salas',
            header: 'Salas',
            accessorKey: 'total_salas',
            sortable: true,
            cell: (value) => (
              <span className="font-medium">
                {value?.toLocaleString('pt-BR') || '0'}
              </span>
            ),
          },
        ]}
        paginationInfo={{
          currentPage: complexosData?.pagination?.current_page || 1,
          totalPages: complexosData?.pagination?.total_pages || 1,
          totalItems: complexosData?.pagination?.total_items || 0,
          pageSize: complexosData?.pagination?.page_size || 20,
        }}
        onPageChange={setCurrentPage}
        filters={filterControls}
        isLoading={isLoading}
        emptyMessage={
          hasActiveFilters 
            ? "Nenhum complexo encontrado com os filtros aplicados."
            : "Nenhum complexo encontrado."
        }
      />
    </div>
  );
};

export default ExhibitionDataTable;