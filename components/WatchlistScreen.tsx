"use client";

import { useState } from "react";
import { Movie } from "@/types";
import { encodeSyncCode, decodeSyncCode } from "@/lib/watchlist";
import Header from "./Header";
import MovieCard from "./MovieCard";
import CinemaTagline from "./CinemaTagline";

interface WatchlistScreenProps {
  watchlist: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onImport: (movies: Movie[]) => number;
  onBack: () => void;
  onReset: () => void;
}

export default function WatchlistScreen({
  watchlist,
  onSelectMovie,
  onToggleWatchlist,
  onImport,
  onBack,
  onReset,
}: WatchlistScreenProps) {
  const [syncOpen, setSyncOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  async function handleCopyCode() {
    if (watchlist.length === 0) {
      setSyncStatus("Save something first — nothing to copy yet.");
      return;
    }
    const code = encodeSyncCode(watchlist);
    try {
      await navigator.clipboard.writeText(code);
      setSyncStatus("Code copied! Paste it in your other browser's Watchlist screen.");
    } catch {
      setSyncStatus("Couldn't copy automatically — long-press to copy the code below instead.");
    }
  }

  function handleImportCode() {
    const decoded = decodeSyncCode(pasteValue);
    if (!decoded) {
      setSyncStatus("That code didn't look right — check it was copied in full.");
      return;
    }
    const addedCount = onImport(decoded);
    setSyncStatus(
      addedCount > 0
        ? `Added ${addedCount} title${addedCount === 1 ? "" : "s"} from that code!`
        : "Already had everything from that code — nothing new to add."
    );
    setPasteValue("");
  }

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
        <CinemaTagline className="mt-4" />
        <h1 className="mt-1 text-[24px] font-extrabold text-ink-primary">Your Watchlist</h1>
        <p className="mt-1 text-[14px] text-ink-secondary">
          {watchlist.length === 0
            ? "Nothing saved yet"
            : `${watchlist.length} title${watchlist.length === 1 ? "" : "s"} saved for later`}
        </p>

        {/* Cross-browser sync — no login, since browsers can never share
            storage with each other automatically. */}
        <div className="mt-4 rounded-2xl border border-border-subtle bg-bg-chip p-4">
          <button
            type="button"
            onClick={() => setSyncOpen((prev) => !prev)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-[13px] font-bold text-ink-primary">
              🔄 Sync with another browser
            </span>
            <span className="text-[12px] text-ink-muted">{syncOpen ? "Hide" : "Show"}</span>
          </button>

          {syncOpen && (
            <div className="mt-4 flex flex-col gap-4">
              <p className="text-[12px] text-ink-muted">
                Chrome, Brave, Safari, etc. each keep your list separately — this
                copies it across in one paste, no account needed.
              </p>

              <div>
                <p className="mb-1.5 text-[12px] font-semibold text-ink-secondary">
                  On this browser (has the list you want to send):
                </p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full rounded-xl bg-gradient-to-b from-red-bright to-red-deep py-2.5 text-[13px] font-bold text-white"
                >
                  Copy Sync Code
                </button>
              </div>

              <div>
                <p className="mb-1.5 text-[12px] font-semibold text-ink-secondary">
                  On your other browser (open CineFinder there, come to this same
                  screen, and paste it here):
                </p>
                <textarea
                  value={pasteValue}
                  onChange={(e) => setPasteValue(e.target.value)}
                  placeholder="Paste your sync code here"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border-chip bg-black/30 p-3 text-[13px] text-ink-primary placeholder:text-ink-muted focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleImportCode}
                  disabled={!pasteValue.trim()}
                  className="mt-2 w-full rounded-xl border border-border-chip bg-bg-elevated py-2.5 text-[13px] font-bold text-ink-primary disabled:opacity-50"
                >
                  Import Code
                </button>
              </div>

              {syncStatus && (
                <p className="text-[12px] font-medium text-red-primary">{syncStatus}</p>
              )}
            </div>
          )}
        </div>

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
