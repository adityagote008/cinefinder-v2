import { Movie } from "@/types";

const WATCHLIST_KEY = "cinefinder:watchlist";

export function getWatchlist(): Movie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    return raw ? (JSON.parse(raw) as Movie[]) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(movies: Movie[]) {
  try {
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(movies));
  } catch {
    // Storage can fail (private browsing, quota) — the toggle just won't persist.
  }
}

export function isInWatchlist(movies: Movie[], title: string): boolean {
  return movies.some((m) => m.title.toLowerCase() === title.toLowerCase());
}

// Returns the updated list after toggling, so callers can setState directly.
export function toggleWatchlist(current: Movie[], movie: Movie): Movie[] {
  const exists = isInWatchlist(current, movie.title);
  const updated = exists
    ? current.filter((m) => m.title.toLowerCase() !== movie.title.toLowerCase())
    : [movie, ...current];
  saveWatchlist(updated);
  return updated;
}
