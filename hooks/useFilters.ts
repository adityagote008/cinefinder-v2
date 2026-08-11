"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterGroupKey, FilterState } from "@/types";
import { loadSavedFilters, saveFilters } from "@/lib/preferences";

const EMPTY_STATE: FilterState = {
  mood: [],
  genre: [],
  category: [],
  style: [],
  searchQuery: "",
};

export function useFilters() {
  // Starts from whatever was saved last time (if anything), so a
  // returning visitor doesn't begin from a blank slate.
  const [filters, setFilters] = useState<FilterState>(
    () => loadSavedFilters() ?? EMPTY_STATE
  );

  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

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
