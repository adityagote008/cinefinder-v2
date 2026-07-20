import { Movie } from "@/types";

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiRequestParams {
  filters: {
    mood: string[];
    genre: string[];
    category: string[];
    style: string[];
    searchQuery: string;
    platforms: string[];
    languages: string[];
    runtimes: string[];
  };
  excludeTitles: string[];
  count: number;
}

function buildPrompt({ filters, excludeTitles, count }: GeminiRequestParams): string {
  const parts: string[] = [];
  if (filters.searchQuery) parts.push(`Free-text request: "${filters.searchQuery}"`);
  if (filters.mood.length) parts.push(`Mood: ${filters.mood.join(", ")}`);
  if (filters.genre.length) parts.push(`Genre: ${filters.genre.join(", ")}`);
  if (filters.category.length) parts.push(`Category: ${filters.category.join(", ")}`);
  if (filters.style.length) parts.push(`Style: ${filters.style.join(", ")}`);
  if (filters.platforms.length)
    parts.push(`Must be available on one of these platforms: ${filters.platforms.join(", ")}`);
  if (filters.languages.length)
    parts.push(`Preferred language(s): ${filters.languages.join(", ")}`);
  if (filters.runtimes.length)
    parts.push(`Preferred runtime(s): ${filters.runtimes.join(", ")}`);

  const criteria = parts.length ? parts.join("\n") : "Surprise me with well-regarded picks.";
  const exclusions = excludeTitles.length
    ? `\nDo not repeat any of these already-shown titles: ${excludeTitles.join(", ")}.`
    : "";

  return `You are a movie/TV recommendation engine. Based on the following criteria, recommend exactly ${count} titles.

${criteria}${exclusions}

Respond with ONLY a raw JSON array (no markdown, no code fences, no commentary) of objects shaped exactly like:
[{"title": string, "year": string, "genre": string, "rating": string, "reason": string}]

Rules:
- "rating" should be an approximate IMDb-style rating like "8.2/10".
- "reason" is a single enticing sentence (max 20 words) explaining why it fits the criteria — mention the platform, language, or runtime fit if those were specified.
- Only recommend real, existing titles.
- If a platform was specified, only recommend titles genuinely available there (to the best of your knowledge); if unsure, prefer widely-available titles instead of guessing.
- Return exactly ${count} items, no more, no fewer.`;
}

// Guards against a malformed Gemini response silently rendering "undefined"
// in the UI — every field is coerced to a safe string fallback.
function sanitizeMovie(raw: unknown): Movie | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const title = typeof m.title === "string" && m.title.trim() ? m.title.trim() : null;
  if (!title) return null;

  return {
    title,
    year: typeof m.year === "string" && m.year ? m.year : "—",
    genre: typeof m.genre === "string" && m.genre ? m.genre : "—",
    rating: typeof m.rating === "string" && m.rating ? m.rating : "N/A",
    reason:
      typeof m.reason === "string" && m.reason
        ? m.reason
        : "A great match for what you're looking for.",
  };
}

export async function getMovieRecommendations(
  params: GeminiRequestParams
): Promise<Movie[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const prompt = buildPrompt(params);

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Gemini response as JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response was not an array.");
  }

  const sanitized = parsed.map(sanitizeMovie).filter((m): m is Movie => m !== null);

  if (sanitized.length === 0) {
    throw new Error("Gemini did not return any usable recommendations.");
  }

  return sanitized;
}
