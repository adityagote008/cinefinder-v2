import { ChipOption, QuickPick } from "@/types";

export const QUICK_PICKS: QuickPick[] = [
  { id: "action-packed", emoji: "🔥", label: "Action Packed", tint: "action" },
  { id: "mind-blowing", emoji: "🧠", label: "Mind Blowing", tint: "mind" },
  { id: "comedy", emoji: "😂", label: "Comedy", tint: "comedy" },
  { id: "horror-night", emoji: "💀", label: "Horror Night", tint: "horror" },
  { id: "romantic", emoji: "❤️", label: "Romantic", tint: "romance" },
  { id: "sci-fi", emoji: "🌌", label: "Sci-Fi", tint: "scifi" },
];

// ---- Slide 2: streaming platforms the viewer has access to ----
export const PLATFORM_OPTIONS: ChipOption[] = [
  { id: "netflix", label: "Netflix", emoji: "🔴" },
  { id: "prime-video", label: "Prime Video", emoji: "🔵" },
  { id: "disney-hotstar", label: "Disney+ Hotstar", emoji: "⭐" },
  { id: "jiocinema", label: "JioCinema", emoji: "🎦" },
  { id: "zee5", label: "ZEE5", emoji: "🟣" },
  { id: "sonyliv", label: "SonyLIV", emoji: "📺" },
  { id: "apple-tv", label: "Apple TV+", emoji: "🍎" },
  { id: "mx-player", label: "MX Player", emoji: "▶️" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "any-platform", label: "Any Platform", emoji: "🌐" },
];

// ---- Slide 3: language/region and runtime length preferences ----
export const LANGUAGE_OPTIONS: ChipOption[] = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "korean", label: "Korean" },
  { id: "japanese", label: "Japanese" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "regional-indian", label: "Regional Indian" },
  { id: "any-language", label: "Any Language" },
];

export const RUNTIME_OPTIONS: ChipOption[] = [
  { id: "under-90", label: "Under 90 min" },
  { id: "90-150", label: "90–150 min" },
  { id: "150-plus", label: "150+ min" },
  { id: "binge-series", label: "Binge-worthy Series" },
  { id: "any-length", label: "Any Length" },
];

export const MOOD_OPTIONS: ChipOption[] = [
  { id: "happy", label: "Happy" },
  { id: "sad", label: "Sad" },
  { id: "emotional", label: "Emotional" },
  { id: "romantic", label: "Romantic" },
  { id: "motivational", label: "Motivational" },
  { id: "dark", label: "Dark" },
  { id: "mind-blowing", label: "Mind Blowing" },
  { id: "family", label: "Family" },
  { id: "horror-night", label: "Horror Night" },
  { id: "nostalgic", label: "Nostalgic" },
  { id: "intense", label: "Intense" },
  { id: "relaxing", label: "Relaxing" },
  { id: "thought-provoking", label: "Thought Provoking" },
  { id: "heartwarming", label: "Heartwarming" },
  { id: "suspenseful", label: "Suspenseful" },
  { id: "uplifting", label: "Uplifting" },
  { id: "bittersweet", label: "Bittersweet" },
  { id: "quirky", label: "Quirky" },
  { id: "chill", label: "Chill" },
  { id: "adrenaline-rush", label: "Adrenaline Rush" },
  { id: "tearjerker", label: "Tearjerker" },
  { id: "feel-good", label: "Feel Good" },
  { id: "eerie", label: "Eerie" },
  { id: "empowering", label: "Empowering" },
];

export const GENRE_OPTIONS: ChipOption[] = [
  { id: "action", label: "Action", emoji: "⚡" },
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "crime", label: "Crime", emoji: "🔍" },
  { id: "drama", label: "Drama", emoji: "🎭" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "history", label: "History", emoji: "📜" },
  { id: "horror", label: "Horror", emoji: "👻" },
  { id: "mystery", label: "Mystery", emoji: "🕵️" },
  { id: "thriller", label: "Thriller", emoji: "🔪" },
  { id: "romance", label: "Romance", emoji: "💕" },
  { id: "sci-fi", label: "Sci-Fi", emoji: "🚀" },
  { id: "musical", label: "Musical", emoji: "🎵" },
  { id: "war", label: "War", emoji: "⚔️" },
  { id: "western", label: "Western", emoji: "🤠" },
  { id: "biography", label: "Biography", emoji: "📖" },
  { id: "sport", label: "Sport", emoji: "🏆" },
  { id: "documentary", label: "Documentary", emoji: "🎥" },
  { id: "superhero", label: "Superhero", emoji: "🦸" },
  { id: "psychological-thriller", label: "Psychological Thriller", emoji: "🧠" },
  { id: "coming-of-age", label: "Coming of Age", emoji: "🌱" },
  { id: "heist", label: "Heist", emoji: "💰" },
  { id: "supernatural", label: "Supernatural", emoji: "👁️" },
  { id: "political", label: "Political", emoji: "🏛️" },
];

export const CATEGORY_OPTIONS: ChipOption[] = [
  { id: "movie", label: "Movie" },
  { id: "tv-series", label: "TV Series" },
  { id: "anime", label: "Anime" },
  { id: "mini-series", label: "Mini Series" },
  { id: "web-series", label: "Web Series" },
  { id: "classic", label: "Classic" },
  { id: "latest", label: "Latest" },
  { id: "underrated", label: "Underrated" },
  { id: "cult-classic", label: "Cult Classic" },
  { id: "award-winning", label: "Award Winning" },
  { id: "indie", label: "Indie" },
  { id: "blockbuster", label: "Blockbuster" },
  { id: "foreign", label: "Foreign" },
  { id: "documentary", label: "Documentary" },
  { id: "limited-series", label: "Limited Series" },
  { id: "reboot", label: "Reboot" },
  { id: "trilogy", label: "Trilogy" },
  { id: "based-on-true-story", label: "Based on True Story" },
  { id: "book-adaptation", label: "Book Adaptation" },
  { id: "anthology", label: "Anthology" },
  { id: "franchise", label: "Franchise" },
  { id: "festival-favorite", label: "Festival Favorite" },
];

export const STYLE_OPTIONS: ChipOption[] = [
  { id: "fast-paced", label: "Fast Paced" },
  { id: "slow-burn", label: "Slow Burn" },
  { id: "cinematic", label: "Cinematic" },
  { id: "visually-stunning", label: "Visually Stunning" },
  { id: "psychological", label: "Psychological" },
  { id: "twist-ending", label: "Twist Ending" },
  { id: "dark", label: "Dark" },
  { id: "wholesome", label: "Wholesome" },
  { id: "emotional", label: "Emotional" },
  { id: "gritty", label: "Gritty" },
  { id: "atmospheric", label: "Atmospheric" },
  { id: "character-driven", label: "Character Driven" },
  { id: "plot-driven", label: "Plot Driven" },
  { id: "experimental", label: "Experimental" },
  { id: "dialogue-heavy", label: "Dialogue Heavy" },
  { id: "minimalist", label: "Minimalist" },
  { id: "nonlinear", label: "Nonlinear" },
  { id: "ensemble-cast", label: "Ensemble Cast" },
  { id: "one-location", label: "One Location" },
  { id: "based-on-real-events", label: "Grounded & Realistic" },
];

export const FILTER_GROUPS = [
  { key: "mood" as const, label: "MOOD", emoji: "🎭", options: MOOD_OPTIONS },
  { key: "genre" as const, label: "GENRE", emoji: "🎬", options: GENRE_OPTIONS },
  { key: "category" as const, label: "CATEGORY", emoji: "📁", options: CATEGORY_OPTIONS },
  { key: "style" as const, label: "STYLE", emoji: "✨", options: STYLE_OPTIONS },
];
