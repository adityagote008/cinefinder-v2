import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/tmdb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbId, mediaType } = body ?? {};

    if (!tmdbId || (mediaType !== "movie" && mediaType !== "tv")) {
      return NextResponse.json(
        { error: "A valid tmdbId and mediaType ('movie' or 'tv') are required." },
        { status: 400 }
      );
    }

    const details = await getMovieDetails(Number(tmdbId), mediaType);

    if (!details) {
      return NextResponse.json(
        { error: "Couldn't load details for this title right now." },
        { status: 502 }
      );
    }

    return NextResponse.json({ details });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error.";
    console.error("[/api/movie-details]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
