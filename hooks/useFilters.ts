"use client";

import { useCallback, useMemo, useState } from "react";
import { FilterGroupKey, FilterState } from "@/types";

const EMPTY_STATE: FilterState = {
  mood: [],
  genre: [],
  category: [],
  style: [],
  searchQuery: "",
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_STATE);

  const toggle = useCallback((group: FilterGroupKey, id: string) => {
    setFilters((prev) => {
      const current = prev[group];
      const next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
      return { ...prev, [group]: next };
    });
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(EMPTY_STATE);
  }, []);

  const setSingle = useCallback((group: FilterGroupKey, id: string) => {
    setFilters({ ...EMPTY_STATE, [group]: [id] });
  }, []);

  const totalCount = useMemo(
    () =>
      filters.mood.length +
      filters.genre.length +
      filters.category.length +
      filters.style.length,
    [filters]
  );

  return { filters, toggle, setSearchQuery, clearAll, setSingle, totalCount };
}
