import { NextResponse } from "next/server";
import { getWatchProviders } from "@/lib/tmdb";
import { PLATFORM_TMDB_MATCH } from "@/lib/constants";

// Provider logos change rarely — cache for a day so every visitor isn't
// triggering a fresh TMDB call.
export const revalidate = 86400;

function normalize(name: string): string {
  return name.toLowerCase().replace(/[+\-.]/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET() {
  try {
    const providers = await getWatchProviders();
    const normalizedProviders = providers.map((p) => ({
      ...p,
      normalizedName: normalize(p.providerName),
    }));

    const logos: Record<string, string> = {};

    for (const [platformId, keywords] of Object.entries(PLATFORM_TMDB_MATCH)) {
      const match = normalizedProviders.find((p) =>
        keywords.some((kw) => p.normalizedName.includes(normalize(kw)))
      );
      if (match) {
        logos[platformId] = match.logoUrl;
      }
    }

    return NextResponse.json({ logos });
  } catch (err) {
    console.warn("[watch-providers]", err);
    return NextResponse.json({ logos: {} });
  }
}
