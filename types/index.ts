export type Screen = "home" | "platforms" | "preferences" | "filters" | "results";

export interface QuickPick {
  id: string;
  emoji: string;
  label: string;
  tint: "action" | "mind" | "comedy" | "horror" | "romance" | "scifi";
}

export interface ChipOption {
  id: string;
  label: string;
  emoji?: string;
}

export type FilterGroupKey = "mood" | "genre" | "category" | "style";

export interface FilterState {
  mood: string[];
  genre: string[];
  category: string[];
  style: string[];
  searchQuery: string;
}

// New: precision preferences captured on Slide 2 and Slide 3, used to
// narrow down recommendations further (which platforms, what language, how long).
export interface PrecisionPrefs {
  platforms: string[];
  languages: string[];
  runtimes: string[];
}

export interface Movie {
  title: string;
  year: string;
  genre: string;
  rating: string;
  reason: string;
  posterUrl?: string | null;
}

export interface RecommendResponse {
  movies: Movie[];
  error?: string;
}
