import { FilterState } from "@/types";

const FILTERS_KEY = "cinefinder:last-filters";
const PREFS_KEY = "cinefinder:last-prefs";

export interface SavedPrefs {
  platforms: string[];
  languages: string[];
  runtimes: string[];
}

export function loadSavedFilters(): FilterState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(FILTERS_KEY);
    return raw ? (JSON.parse(raw) as FilterState) : null;
  } catch {
    return null;
  }
}

export function saveFilters(filters: FilterState) {
  try {
    window.localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch {
    // Non-fatal — the app just won't remember this session's filters.
  }
}

export function loadSavedPrefs(): SavedPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? (JSON.parse(raw) as SavedPrefs) : null;
  } catch {
    return null;
  }
}

export function savePrefs(prefs: SavedPrefs) {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Non-fatal.
  }
}
