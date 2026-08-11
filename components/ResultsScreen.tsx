"use client";

import { motion } from "framer-motion";
import { Movie } from "@/types";
import { isInWatchlist } from "@/lib/watchlist";
import Header from "./Header";
import ResultsHeader from "./ResultsHeader";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import { ArrowLeft } from "./icons";

interface ResultsScreenProps {
  title: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onShowMore: () => void;
  onAdjustFilters: () => void;
  onReset: () => void;
  onSelectMovie: (movie: Movie) => void;
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  onOpenWatchlist: () => void;
}

export default function ResultsScreen({
  title,
  movies,
  loading,
  error,
  onShowMore,
  onAdjustFilters,
  onReset,
  onSelectMovie,
  watchlist,
  onToggleWatchlist,
  onOpenWatchlist,
}: ResultsScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        showReset
        onReset={onReset}
        onWatchlist={onOpenWatchlist}
        watchlistCount={watchlist.length}
      />
      <ResultsHeader title={title} count={movies.length} />

      <div className="flex-1 px-5">
        {error && (
          <div className="mt-6 rounded-2xl border border-red-900/40 bg-red-darker/20 p-4 text-[14px] text-red-primary">
            Hmm, couldn&apos;t pull anything up: {error}
          </div>
        )}

        {!error && movies.length === 0 && !loading && (
          <div className="mt-10 text-center text-[14px] text-ink-muted">
            Nothing here yet — let&apos;s fix that.
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {loading && movies.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie, i) => (
                <MovieCard
                  key={`${movie.title}-${i}`}
                  movie={movie}
                  index={i}
                  onSelect={onSelectMovie}
                  isSaved={isInWatchlist(watchlist, movie.title)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onShowMore}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl border border-red-900/50 bg-red-darker/25 py-3.5 text-[15px] font-bold text-red-primary disabled:opacity-50"
          >
            <span aria-hidden="true">🍿</span>
            {loading ? "Digging up more…" : "Show 5 More"}
          </motion.button>

          <button
            type="button"
            onClick={onAdjustFilters}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border-chip bg-transparent py-3.5 text-[15px] text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Tweak My Picks
          </button>
        </div>
      </div>

      <footer className="px-5 py-6 text-center text-[12px] text-ink-faint">
        <span aria-hidden="true">🎬</span> CineFinder by{" "}
        <span className="font-semibold text-red-primary">ASG</span> · Aditya Gote
      </footer>
    </div>
  );
}
