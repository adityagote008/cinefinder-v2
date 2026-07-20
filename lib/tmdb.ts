import { Movie } from "@/types";

const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/multi";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

interface TmdbResult {
  poster_path: string | null;
  media_type: string;
  popularity: number;
}

async function fetchPosterFor(title: string): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL(TMDB_SEARCH_URL);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("query", title);
    url.searchParams.set("include_adult", "false");

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = await res.json();
    const results: TmdbResult[] = data?.results ?? [];

    // Prefer actual movies/tv shows with a poster, most popular first.
    const best = results
      .filter((r) => r.poster_path && (r.media_type === "movie" || r.media_type === "tv"))
      .sort((a, b) => b.popularity - a.popularity)[0];

    if (best?.poster_path) {
      return `${TMDB_IMAGE_BASE}${best.poster_path}`;
    }
    return null;
  } catch {
    // Poster lookup is a nice-to-have — never let it break recommendations.
    return null;
  }
}

export async function enrichWithPosters(movies: Movie[]): Promise<Movie[]> {
  if (!process.env.TMDB_API_KEY) {
    return movies.map((m) => ({ ...m, posterUrl: null }));
  }

  const enriched = await Promise.all(
    movies.map(async (movie) => {
      const posterUrl = await fetchPosterFor(movie.title);
      return { ...movie, posterUrl };
    })
  );

  return enriched;
}
