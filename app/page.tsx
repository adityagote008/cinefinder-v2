"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FILTER_GROUPS, LANGUAGE_OPTIONS, RUNTIME_OPTIONS, PLATFORM_OPTIONS } from "@/lib/constants";
import { getWatchlist, toggleWatchlist } from "@/lib/watchlist";
import { Movie, QuickPick, Screen } from "@/types";
import { useFilters } from "@/hooks/useFilters";
import HomeScreen from "@/components/HomeScreen";
import PlatformsScreen from "@/components/PlatformsScreen";
import PreferencesScreen from "@/components/PreferencesScreen";
import FiltersScreen from "@/components/FiltersScreen";
import ResultsScreen from "@/components/ResultsScreen";
import MovieDetailsScreen from "@/components/MovieDetailsScreen";
import WatchlistScreen from "@/components/WatchlistScreen";

interface ResultsContext {
  title: string;
  mood: string[];
  genre: string[];
  category: string[];
  style: string[];
  searchQuery: string;
  platforms: string[];
  languages: string[];
  runtimes: string[];
}

function labelFor(options: { id: string; label: string }[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsCtx, setResultsCtx] = useState<ResultsContext | null>(null);

  const [pendingQuickPick, setPendingQuickPick] = useState<QuickPick | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Where to return to when the person taps "Back" from the Watchlist —
  // whichever screen they opened it from.
  const [screenBeforeWatchlist, setScreenBeforeWatchlist] = useState<Screen>("home");

  // Personal, device-only saved titles (no backend/database involved).
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  const handleToggleWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => toggleWatchlist(prev, movie));
  }, []);

  const handleOpenWatchlist = useCallback(() => {
    setScreenBeforeWatchlist(screen);
    setScreen("watchlist");
  }, [screen]);

  // Slide 2 + Slide 3 state — precision-narrowing preferences (all multi-select)
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [runtimes, setRuntimes] = useState<string[]>([]);

  const { filters, toggle, setSearchQuery, clearAll, totalCount } = useFilters();

  const togglePlatform = useCallback((id: string) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const toggleLanguage = useCallback((id: string) => {
    setLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  }, []);

  const toggleRuntime = useCallback((id: string) => {
    setRuntimes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  const labelsForGroup = useCallback(
    (groupKey: "mood" | "genre" | "category" | "style") => {
      const group = FILTER_GROUPS.find((g) => g.key === groupKey);
      if (!group) return [];
      return group.options
        .filter((opt) => filters[groupKey].includes(opt.id))
        .map((opt) => opt.label);
    },
    [filters]
  );

  const canSubmit = useMemo(
    () => totalCount > 0 || pendingQuickPick !== null,
    [totalCount, pendingQuickPick]
  );

  const fetchRecommendations = useCallback(
    async (ctx: ResultsContext, excludeTitles: string[], count: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mood: ctx.mood,
            genre: ctx.genre,
            category: ctx.category,
            style: ctx.style,
            searchQuery: ctx.searchQuery,
            platforms: ctx.platforms.map((id) => labelFor(PLATFORM_OPTIONS, id)),
            languages: ctx.languages.map((id) => labelFor(LANGUAGE_OPTIONS, id)),
            runtimes: ctx.runtimes.map((id) => labelFor(RUNTIME_OPTIONS, id)),
            excludeTitles,
            count,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "Something went wrong.");
        }
        return data.movies as Movie[];
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleQuickPick = useCallback((pick: QuickPick) => {
    setPendingQuickPick(pick);
    setScreen("platforms");
  }, []);

  const handleCustomFilters = useCallback(() => {
    setPendingQuickPick(null);
    setScreen("platforms");
  }, []);

  const handleFindMovies = useCallback(async () => {
    const filterLabels = {
      mood: labelsForGroup("mood"),
      genre: labelsForGroup("genre"),
      category: labelsForGroup("category"),
      style: labelsForGroup("style"),
    };

    const title = pendingQuickPick
      ? pendingQuickPick.label
      : filterLabels.mood[0] ?? filterLabels.genre[0] ?? filterLabels.category[0] ?? filterLabels.style[0] ?? "Your Picks";

    const searchQuery = pendingQuickPick
      ? [pendingQuickPick.label, filters.searchQuery].filter(Boolean).join(". ")
      : filters.searchQuery;

    const ctx: ResultsContext = {
      title,
      mood: filterLabels.mood,
      genre: filterLabels.genre,
      category: filterLabels.category,
      style: filterLabels.style,
      searchQuery,
      platforms,
      languages,
      runtimes,
    };
    setResultsCtx(ctx);
    setMovies([]);
    setScreen("results");
    const newMovies = await fetchRecommendations(ctx, [], 5);
    setMovies(newMovies);
  }, [
    filters.searchQuery,
    labelsForGroup,
    pendingQuickPick,
    fetchRecommendations,
    platforms,
    languages,
    runtimes,
  ]);

  const handleShowMore = useCallback(async () => {
    if (!resultsCtx) return;
    const existingTitles = movies.map((m) => m.title);
    const newMovies = await fetchRecommendations(resultsCtx, existingTitles, 5);
    setMovies((prev) => [...prev, ...newMovies]);
  }, [resultsCtx, movies, fetchRecommendations]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setScreen("details");
  }, []);

  const handleBackFromDetails = useCallback(() => {
    setSelectedMovie(null);
    setScreen("results");
  }, []);

  const handleReset = useCallback(() => {
    clearAll();
    setPlatforms([]);
    setLanguages([]);
    setRuntimes([]);
    setPendingQuickPick(null);
    setMovies([]);
    setResultsCtx(null);
    setError(null);
    setSelectedMovie(null);
    setScreen("home");
    // Note: the watchlist is intentionally NOT cleared on reset — it's
    // meant to persist across sessions, that's the whole point of it.
  }, [clearAll]);

  if (screen === "home") {
    return (
      <HomeScreen
        onQuickPick={handleQuickPick}
        onCustomFilters={handleCustomFilters}
        onOpenWatchlist={handleOpenWatchlist}
        watchlistCount={watchlist.length}
      />
    );
  }

  if (screen === "platforms") {
    return (
      <PlatformsScreen
        selected={platforms}
        onToggle={togglePlatform}
        onContinue={() => setScreen("preferences")}
        onSkip={() => setScreen("preferences")}
        onReset={handleReset}
      />
    );
  }

  if (screen === "preferences") {
    return (
      <PreferencesScreen
        languages={languages}
        runtimes={runtimes}
        onToggleLanguage={toggleLanguage}
        onToggleRuntime={toggleRuntime}
        onContinue={() => setScreen("filters")}
        onSkip={() => setScreen("filters")}
        onReset={handleReset}
      />
    );
  }

  if (screen === "filters") {
    return (
      <FiltersScreen
        filters={filters}
        totalCount={totalCount}
        canSubmit={canSubmit}
        onToggle={toggle}
        onSearchChange={setSearchQuery}
        onClearAll={clearAll}
        onReset={handleReset}
        onFindMovies={handleFindMovies}
        onOpenWatchlist={handleOpenWatchlist}
        watchlistCount={watchlist.length}
      />
    );
  }

  if (screen === "details" && selectedMovie) {
    return (
      <MovieDetailsScreen
        movie={selectedMovie}
        onBack={handleBackFromDetails}
        onReset={handleReset}
        isSaved={watchlist.some(
          (m) => m.title.toLowerCase() === selectedMovie.title.toLowerCase()
        )}
        onToggleWatchlist={handleToggleWatchlist}
        onOpenWatchlist={handleOpenWatchlist}
        watchlistCount={watchlist.length}
      />
    );
  }

  if (screen === "watchlist") {
    return (
      <WatchlistScreen
        watchlist={watchlist}
        onSelectMovie={handleSelectMovie}
        onToggleWatchlist={handleToggleWatchlist}
        onBack={() => setScreen(screenBeforeWatchlist)}
        onReset={handleReset}
      />
    );
  }

  return (
    <ResultsScreen
      title={resultsCtx?.title ?? "Your Picks"}
      movies={movies}
      loading={loading}
      error={error}
      onShowMore={handleShowMore}
      onAdjustFilters={() => setScreen("filters")}
      onReset={handleReset}
      onSelectMovie={handleSelectMovie}
      watchlist={watchlist}
      onToggleWatchlist={handleToggleWatchlist}
      onOpenWatchlist={handleOpenWatchlist}
    />
  );
}
