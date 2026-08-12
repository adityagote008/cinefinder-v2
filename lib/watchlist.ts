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

const SYNC_CODE_PREFIX = "CFW1:";

// Encodes the current watchlist as a compact, copy-pasteable code — this is
// how someone moves their list between two different browsers/devices
// without any account or backend, since browser storage can never be
// shared automatically between separate browser apps (a hard privacy
// boundary, not something any website can override).
export function encodeSyncCode(movies: Movie[]): string {
  const json = JSON.stringify(movies);
  const base64 =
    typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(json))) : "";
  return `${SYNC_CODE_PREFIX}${base64}`;
}

export function decodeSyncCode(code: string): Movie[] | null {
  const trimmed = code.trim();
  if (!trimmed.startsWith(SYNC_CODE_PREFIX)) return null;
  try {
    const base64 = trimmed.slice(SYNC_CODE_PREFIX.length);
    const json = decodeURIComponent(escape(window.atob(base64)));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    return parsed as Movie[];
  } catch {
    return null;
  }
}

// Adds any incoming titles not already saved — never removes anything
// already on this browser, so pasting a code is always a safe, additive
// action rather than a risky overwrite.
export function mergeWatchlist(current: Movie[], incoming: Movie[]): Movie[] {
  const toAdd = incoming.filter((m) => !isInWatchlist(current, m.title));
  const updated = [...toAdd, ...current];
  saveWatchlist(updated);
  return updated;
}
