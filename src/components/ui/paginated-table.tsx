import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { TableSkeleton } from "./loading-skeletons";
import { cn } from "@/lib/utils";
import { PaginatedTableProps, PaginationInfo } from "@/types/ui";

function PaginatedTable<T>({
  columns,
  data,
  paginationInfo,
  onPageChange,
  onSortChange,
  onFilterChange,
  filters,
  isLoading = false,
  emptyMessage = "Nenhum resultado encontrado.",
  showPagination = true,
  className,
  ...props
}: PaginatedTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Convert our column format to TanStack Table format
  const tableColumns: ColumnDef<T>[] = React.useMemo(
    () =>
      columns.map((col) => ({
        id: col.id,
        accessorKey: col.accessorKey as string,
        header: ({ column }) => {
          if (!col.sortable) {
            return <div className="text-left font-medium">{col.header}</div>;
          }
          
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-medium hover:bg-transparent"
            >
              {col.header}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ getValue, row }) => {
          const value = getValue();
          return col.cell ? col.cell(value, row.original) : value;
        },
        enableSorting: col.sortable,
      })),
    [columns]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo.totalPages,
  });

  // Handle sorting changes
  React.useEffect(() => {
    if (sorting.length > 0 && onSortChange) {
      const sort = sorting[0];
      onSortChange(sort.id, sort.desc ? 'desc' : 'asc');
    }
  }, [sorting, onSortChange]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {filters && (
          <div className="flex items-center justify-between">
            {filters}
          </div>
        )}
        <TableSkeleton rows={paginationInfo.pageSize || 10} columns={columns.length} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {filters && (
        <div className="flex items-center justify-between">
          {filters}
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.column.columnDef.meta?.width }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <PaginationControls
          paginationInfo={paginationInfo}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

interface PaginationControlsProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
}

function PaginationControls({ paginationInfo, onPageChange }: PaginationControlsProps) {
  const { currentPage, totalPages, totalItems, pageSize } = paginationInfo;
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Página</p>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">{currentPage}</span>
            <span className="text-sm text-muted-foreground">de {totalPages}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir para primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir para página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir para próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir para última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export both the main component and pagination controls
export { PaginatedTable, PaginationControls };