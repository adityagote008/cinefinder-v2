"use client";

import { Movie } from "@/types";
import Header from "./Header";
import MovieCard from "./MovieCard";

interface WatchlistScreenProps {
  watchlist: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onBack: () => void;
  onReset: () => void;
}

export default function WatchlistScreen({
  watchlist,
  onSelectMovie,
  onToggleWatchlist,
  onBack,
  onReset,
}: WatchlistScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showReset onReset={onReset} />

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[14px] text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 px-5 pb-10">
        <p className="mt-4 text-[12px] font-medium italic tracking-wide text-red-primary/80">
          Witness the Cinema
        </p>
        <h1 className="mt-1 text-[24px] font-extrabold text-ink-primary">Your Watchlist</h1>
        <p className="mt-1 text-[14px] text-ink-secondary">
          {watchlist.length === 0
            ? "Nothing saved yet"
            : `${watchlist.length} title${watchlist.length === 1 ? "" : "s"} saved for later`}
        </p>

        {watchlist.length === 0 ? (
          <div className="mt-10 text-center text-[14px] text-ink-muted">
            Tap the heart on any recommendation to save it here for later.
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {watchlist.map((movie, i) => (
              <MovieCard
                key={`${movie.title}-${i}`}
                movie={movie}
                index={i}
                onSelect={onSelectMovie}
                isSaved
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
