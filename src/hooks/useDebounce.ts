import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook that debounces a value, delaying updates until after a specified delay
 * Useful for preventing excessive API calls during user input
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that provides a debounced callback function
 * Useful for debouncing function calls like search handlers
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  return debouncedCallback;
}

/**
 * Hook for debounced search input handling
 * Provides both the current input value and debounced search value
 * 
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object with input value, search value, and setter function
 */
export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(inputValue, delay);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const clearSearch = useCallback(() => {
    setInputValue('');
  }, []);

  return {
    inputValue,
    searchValue: debouncedSearchValue,
    setInputValue: handleInputChange,
    clearSearch,
    isSearching: inputValue !== debouncedSearchValue,
  };
}