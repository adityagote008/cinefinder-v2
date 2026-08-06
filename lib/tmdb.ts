import { CastMember, Movie, MovieDetails } from "@/types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w780";
const TMDB_PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

interface TmdbSearchResult {
  id: number;
  poster_path: string | null;
  media_type: string;
  popularity: number;
}

interface TmdbIdentity {
  tmdbId: number;
  mediaType: "movie" | "tv";
  posterUrl: string | null;
}

async function findTmdbIdentity(title: string): Promise<TmdbIdentity | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL(`${TMDB_BASE}/search/multi`);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("query", title);
    url.searchParams.set("include_adult", "false");

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[tmdb] search/multi failed (${res.status}) for "${title}": ${errText}`);
      return null;
    }

    const data = await res.json();
    const results: TmdbSearchResult[] = data?.results ?? [];

    // Prefer actual movies/tv shows with a poster, most popular first.
    const best = results
      .filter((r) => r.poster_path && (r.media_type === "movie" || r.media_type === "tv"))
      .sort((a, b) => b.popularity - a.popularity)[0];

    if (!best) return null;

    return {
      tmdbId: best.id,
      mediaType: best.media_type as "movie" | "tv",
      posterUrl: best.poster_path ? `${TMDB_IMAGE_BASE}${best.poster_path}` : null,
    };
  } catch (err) {
    console.warn(`[tmdb] search/multi threw for "${title}":`, err);
    return null;
  }
}

export async function enrichWithPosters(movies: Movie[]): Promise<Movie[]> {
  if (!process.env.TMDB_API_KEY) {
    return movies.map((m) => ({ ...m, posterUrl: null, tmdbId: null, mediaType: null }));
  }

  const enriched = await Promise.all(
    movies.map(async (movie) => {
      const identity = await findTmdbIdentity(movie.title);
      return {
        ...movie,
        posterUrl: identity?.posterUrl ?? null,
        tmdbId: identity?.tmdbId ?? null,
        mediaType: identity?.mediaType ?? null,
      };
    })
  );

  return enriched;
}

// Fetches trailer, cast, director/creator, synopsis, and a backdrop image
// for one specific title, shown on the "before you watch" details screen.
// Uses TMDB's append_to_response to get videos + credits in a single call.
export async function getMovieDetails(
  tmdbId: number,
  mediaType: "movie" | "tv"
): Promise<MovieDetails | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL(`${TMDB_BASE}/${mediaType}/${tmdbId}`);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("append_to_response", "videos,credits");

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[tmdb] details fetch failed (${res.status}) for id ${tmdbId}: ${errText}`);
      return null;
    }

    const data = await res.json();

    const videos: Array<{ key: string; site: string; type: string; official?: boolean }> =
      data?.videos?.results ?? [];
    const trailer =
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
      videos.find((v) => v.site === "YouTube");

    const castRaw: Array<{ name: string; character: string; profile_path: string | null }> =
      data?.credits?.cast ?? [];
    const cast: CastMember[] = castRaw.slice(0, 8).map((c) => ({
      name: c.name,
      character: c.character,
      photoUrl: c.profile_path ? `${TMDB_PROFILE_BASE}${c.profile_path}` : null,
    }));

    const crew: Array<{ name: string; job: string }> = data?.credits?.crew ?? [];
    const director =
      mediaType === "movie"
        ? crew.find((c) => c.job === "Director")?.name ?? null
        : (data?.created_by?.[0]?.name as string | undefined) ?? null;

    return {
      trailerKey: trailer?.key ?? null,
      cast,
      director,
      synopsis: data?.overview ?? "",
      backdropUrl: data?.backdrop_path ? `${TMDB_BACKDROP_BASE}${data.backdrop_path}` : null,
    };
  } catch {
    return null;
  }
}
