"use client";

import { useCallback, useMemo, useState } from "react";
import { FILTER_GROUPS, LANGUAGE_OPTIONS, RUNTIME_OPTIONS, PLATFORM_OPTIONS } from "@/lib/constants";
import { Movie, QuickPick, Screen } from "@/types";
import { useFilters } from "@/hooks/useFilters";
import HomeScreen from "@/components/HomeScreen";
import PlatformsScreen from "@/components/PlatformsScreen";
import PreferencesScreen from "@/components/PreferencesScreen";
import FiltersScreen from "@/components/FiltersScreen";
import ResultsScreen from "@/components/ResultsScreen";

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

  // The button on the final (Mood/Genre/Category/Style) screen should only
  // be disabled if there is truly nothing to go on — no filters selected
  // AND no Quick Pick behind this flow.
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

  // Tapping a Quick Pick card no longer jumps straight to results — it now
  // enters the exact same slide sequence as Custom Filters: Platforms ->
  // Preferences -> Mood/Genre/Category/Style -> Results.
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

    // Merge the original Quick Pick theme (if any) into the title and the
    // free-text search query, so it still shapes the recommendations even
    // though the person may also have picked extra filters afterward.
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

  const handleReset = useCallback(() => {
    clearAll();
    setPlatforms([]);
    setLanguages([]);
    setRuntimes([]);
    setPendingQuickPick(null);
    setMovies([]);
    setResultsCtx(null);
    setError(null);
    setScreen("home");
  }, [clearAll]);

  if (screen === "home") {
    return <HomeScreen onQuickPick={handleQuickPick} onCustomFilters={handleCustomFilters} />;
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
    />
  );
}
