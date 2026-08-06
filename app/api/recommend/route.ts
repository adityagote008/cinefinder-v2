import { NextRequest, NextResponse } from "next/server";
import { getMovieRecommendations } from "@/lib/gemini";
import { enrichWithPosters } from "@/lib/tmdb";

export const runtime = "nodejs";

// Best-effort in-memory rate limit. Resets whenever the serverless function
// cold-starts, so it is a courtesy guard, not a hard guarantee — it exists to
// stop a single burst of clicks from burning through the free daily quota.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      mood = [],
      genre = [],
      category = [],
      style = [],
      searchQuery = "",
      platforms = [],
      languages = [],
      runtimes = [],
      excludeTitles = [],
      count = 5,
    } = body ?? {};

    const movies = await getMovieRecommendations({
      filters: { mood, genre, category, style, searchQuery, platforms, languages, runtimes },
      excludeTitles,
      count: Math.min(Math.max(Number(count) || 5, 1), 10),
    });

    const moviesWithPosters = await enrichWithPosters(movies);

    return NextResponse.json({ movies: moviesWithPosters });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error.";
    console.error("[/api/recommend]", message);
    return NextResponse.json({ error: message, movies: [] }, { status: 500 });
  }
}
