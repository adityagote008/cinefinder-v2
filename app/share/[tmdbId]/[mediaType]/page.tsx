import type { Metadata } from "next";
import { getMovieDetails } from "@/lib/tmdb";
import ShareRedirect from "@/components/ShareRedirect";

interface PageProps {
  params: Promise<{ tmdbId: string; mediaType: string }>;
}

function normalizeMediaType(value: string): "movie" | "tv" {
  return value === "tv" ? "tv" : "movie";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tmdbId, mediaType } = await params;
  const mt = normalizeMediaType(mediaType);
  const details = await getMovieDetails(Number(tmdbId), mt);

  if (!details) {
    return { title: "CineFinder — Witness the Cinema" };
  }

  const title = `${details.title} — CineFinder`;
  const description = details.synopsis
    ? details.synopsis.length > 160
      ? `${details.synopsis.slice(0, 157)}...`
      : details.synopsis
    : `Check out ${details.title} on CineFinder.`;

  return {
    title,
    description,
    // The opengraph-image.tsx file in this same route folder supplies the
    // actual preview image automatically via Next.js's file convention —
    // no manual image URL needed here.
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { tmdbId, mediaType } = await params;
  const mt = normalizeMediaType(mediaType);
  return <ShareRedirect tmdbId={tmdbId} mediaType={mt} />;
}
