import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';
import { useResponsive, useResponsiveTable } from '@/hooks/useResponsive';

interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  priority?: 'high' | 'medium' | 'low'; // For responsive hiding
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  title?: string;
  emptyMessage?: string;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  title,
  emptyMessage = 'Nenhum dado disponível',
  onSort,
  sortBy,
  sortDirection,
  className,
}: ResponsiveTableProps<T>) {
  const { isMobile, isTablet } = useResponsive();
  const { shouldStackColumns, getVisibleColumns } = useResponsiveTable();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filter columns based on screen size and priority
  const getVisibleColumnsForScreen = () => {
    if (!isMobile && !isTablet) return columns;

    const priorityOrder = ['high', 'medium', 'low'];
    const sortedColumns = [...columns].sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.priority || 'medium');
      const bPriority = priorityOrder.indexOf(b.priority || 'medium');
      return aPriority - bPriority;
    });

    const maxVisible = getVisibleColumns(columns.length);
    return sortedColumns.slice(0, maxVisible);
  };

  const visibleColumns = getVisibleColumnsForScreen();
  const hiddenColumns = columns.filter(col => !visibleColumns.includes(col));

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const newDirection = 
      sortBy === column.id && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.id, newDirection);
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const renderCellValue = (column: Column<T>, row: T) => {
    const value = row[column.accessorKey];
    if (column.cell) {
      return column.cell(value, row);
    }
    return value?.toString() || '-';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                {visibleColumns.map((_, j) => (
                  <Skeleton 
                    key={j} 
                    className={cn(
                      "h-4",
                      j === 0 ? "w-24" : "w-16"
                    )} 
                  />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile card layout
  if (shouldStackColumns) {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}
        {data.map((row, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              {visibleColumns.map((column) => (
                <div key={column.id} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground">
                    {column.header}:
                  </span>
                  <span className="text-sm text-right flex-1 ml-2">
                    {renderCellValue(column, row)}
                  </span>
                </div>
              ))}
              
              {hiddenColumns.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(index)}
                    className="w-full mt-2 text-xs"
                  >
                    {expandedRows.has(index) ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Menos detalhes
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Mais detalhes
                      </>
                    )}
                  </Button>
                  
                  {expandedRows.has(index) && (
                    <div className="pt-2 border-t space-y-2">
                      {hiddenColumns.map((column) => (
                        <div key={column.id} className="flex justify-between items-start">
                          <span className="text-xs font-medium text-muted-foreground">
                            {column.header}:
                          </span>
                          <span className="text-xs text-right flex-1 ml-2">
                            {renderCellValue(column, row)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table layout
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {visibleColumns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right",
                      column.sortable && "cursor-pointer hover:text-foreground"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && sortBy === column.id && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      )}
                    </div>
                  </th>
                ))}
                {hiddenColumns.length > 0 && (
                  <th className="px-4 py-3 w-12">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b hover:bg-muted/50 transition-colors">
                    {visibleColumns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          "px-4 py-3 text-sm",
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {renderCellValue(column, row)}
                      </td>
                    ))}
                    {hiddenColumns.length > 0 && (
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(index)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedRows.has(index) ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      </td>
                    )}
                  </tr>
                  
                  {expandedRows.has(index) && hiddenColumns.length > 0 && (
                    <tr className="border-b bg-muted/25">
                      <td colSpan={visibleColumns.length + 1} className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {hiddenColumns.map((column) => (
                            <div key={column.id}>
                              <span className="font-medium text-muted-foreground">
                                {column.header}:
                              </span>
                              <span className="ml-2">
                                {renderCellValue(column, row)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResponsiveTable;