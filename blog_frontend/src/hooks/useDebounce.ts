import { useEffect, useState, useRef } from "react";

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
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
 * Custom hook for debounced search functionality
 * @param onSearch - Function to call when search query changes
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns Object with search query, setSearchQuery function, and debouncedSearchQuery
 */
export function useDebouncedSearch(
  onSearch: (query: string) => void,
  delay: number = 300
) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, delay);
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    // Skip the first render with initial empty state
    // But allow empty strings that are set by user interaction
    if (!hasUserInteracted.current) {
      return;
    }

    onSearch(debouncedSearchQuery.trim());
  }, [debouncedSearchQuery, onSearch]);

  const handleSetSearchQuery = (query: string) => {
    hasUserInteracted.current = true;
    setSearchQuery(query);
  };

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    debouncedSearchQuery,
  };
}
