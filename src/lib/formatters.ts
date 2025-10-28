// Utility functions for formatting data in the ANCINE Dashboard

/**
 * Format numbers with Brazilian locale
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('pt-BR', options).format(value);
}

/**
 * Format currency values in Brazilian Real
 */
export function formatCurrency(value: number): string {
  return formatNumber(value, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000, { maximumFractionDigits: 1 })}B`;
  }
  if (value >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, { maximumFractionDigits: 1 })}M`;
  }
  if (value >= 1_000) {
    return `${formatNumber(value / 1_000, { maximumFractionDigits: 1 })}K`;
  }
  return formatNumber(value);
}

/**
 * Format percentages
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format dates in Brazilian format
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Format dates for display in tables (shorter format)
 */
export function formatShortDate(date: string | Date): string {
  return formatDate(date, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format year from date string
 */
export function formatYear(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getFullYear().toString();
}

/**
 * Format duration in minutes to hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}min`;
  }
  
  return remainingMinutes === 0 
    ? `${hours}h` 
    : `${hours}h ${remainingMinutes}min`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format work type for display
 */
export function formatWorkType(type: string): string {
  const typeMap: Record<string, string> = {
    'longa_metragem': 'Longa-metragem',
    'curta_metragem': 'Curta-metragem',
    'documentario': 'Documentário',
    'animacao': 'Animação',
    'serie': 'Série',
  };
  
  return typeMap[type] || type;
}

/**
 * Format distributor type for display
 */
export function formatDistributorType(type: string): string {
  const typeMap: Record<string, string> = {
    'nacional': 'Nacional',
    'estrangeiro': 'Estrangeiro',
    'independente': 'Independente',
  };
  
  return typeMap[type] || type;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format percentage change with sign
 */
export function formatPercentageChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${formatPercentage(change / 100)}`;
}