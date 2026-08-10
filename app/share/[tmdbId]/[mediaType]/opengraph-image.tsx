import { ImageResponse } from "next/og";
import { getMovieDetails } from "@/lib/tmdb";

export const runtime = "nodejs";
export const alt = "CineFinder movie pick";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function normalizeMediaType(value: string): "movie" | "tv" {
  return value === "tv" ? "tv" : "movie";
}

export default async function Image({
  params,
}: {
  params: Promise<{ tmdbId: string; mediaType: string }>;
}) {
  const { tmdbId, mediaType } = await params;
  const mt = normalizeMediaType(mediaType);
  const details = await getMovieDetails(Number(tmdbId), mt);

  const title = details?.title ?? "Discover Your Perfect Watch";
  const subtitle = details ? `${details.year} · ${details.genre}` : "Witness the Cinema";
  const rating = details?.rating;
  const synopsis = details?.synopsis
    ? details.synopsis.length > 180
      ? `${details.synopsis.slice(0, 177)}...`
      : details.synopsis
    : "AI-curated picks that actually get your taste.";
  const posterUrl = details?.posterUrl;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #000000 0%, #2a0509 55%, #000000 100%)",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        {posterUrl && (
          <div
            style={{
              display: "flex",
              width: "340px",
              height: "518px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(224,32,47,0.35)",
              border: "2px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt=""
              width={340}
              height={518}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: posterUrl ? "56px" : "0",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#f5f5f6" }}>Cine</span>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#e0202f" }}>Finder</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: 800,
              color: "#f5f5f6",
              lineHeight: 1.1,
              marginBottom: "16px",
              maxWidth: "700px",
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", fontSize: "26px", color: "#9a9aa0", marginBottom: "20px" }}>
            {subtitle}
          </div>

          {rating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(224,32,47,0.2)",
                border: "2px solid rgba(224,32,47,0.5)",
                color: "#e0202f",
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "24px",
                width: "fit-content",
              }}
            >
              ★ {rating}
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#c8c8cc",
              lineHeight: 1.5,
              maxWidth: "650px",
            }}
          >
            {synopsis}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
