"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Comment, Movie, MovieDetails } from "@/types";
import Header from "./Header";
import ShareModal from "./ShareModal";
import { ArrowLeft, Heart, Share } from "./icons";

interface MovieDetailsScreenProps {
  movie: Movie;
  onBack: () => void;
  onReset: () => void;
  isSaved: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  backLabel?: string;
}

// Comments are personal notes saved only on this device (localStorage) —
// there's no shared backend, so nothing here is visible to other visitors.
// Keeping that clearly labeled avoids the wrong impression.
function notesKey(movie: Movie): string {
  return `cinefinder:notes:${movie.title.toLowerCase().trim()}`;
}

function loadNotes(movie: Movie): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(notesKey(movie));
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function saveNotes(movie: Movie, notes: Comment[]) {
  try {
    window.localStorage.setItem(notesKey(movie), JSON.stringify(notes));
  } catch {
    // Storage can fail (private browsing, quota) — notes just won't persist.
  }
}

export default function MovieDetailsScreen({
  movie,
  onBack,
  onReset,
  isSaved,
  onToggleWatchlist,
  onOpenWatchlist,
  watchlistCount,
  backLabel = "Back to results",
}: MovieDetailsScreenProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notes, setNotes] = useState<Comment[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftRating, setDraftRating] = useState(0);
  const [draftText, setDraftText] = useState("");

  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    setNotes(loadNotes(movie));
  }, [movie]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDetails() {
      if (!movie.tmdbId || !movie.mediaType) {
        setLoading(false);
        setError("No extra details are available for this title.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/movie-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId: movie.tmdbId, mediaType: movie.mediaType }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
        if (!cancelled) setDetails(data.details as MovieDetails);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [movie.tmdbId, movie.mediaType]);

  function handlePostNote() {
    if (!draftText.trim()) return;
    const newNote: Comment = {
      id: `${Date.now()}`,
      name: draftName.trim() || "You",
      rating: draftRating,
      text: draftText.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(movie, updated);
    setDraftText("");
    setDraftRating(0);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        showReset
        onReset={onReset}
        onWatchlist={onOpenWatchlist}
        watchlistCount={watchlistCount}
      />

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[14px] text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      </div>

      {details?.backdropUrl && (
        <div className="relative mt-4 h-44 w-full overflow-hidden">
          <Image
            src={details.backdropUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
      )}

      <div className="flex-1 px-5 pb-10">
        <div className={details?.backdropUrl ? "-mt-10 relative" : "mt-5"}>
          <h1 className="text-[24px] font-extrabold leading-tight text-ink-primary">
            {movie.title}
          </h1>
          <p className="mt-1 text-[13px] text-ink-secondary">
            {movie.year} · {movie.genre}
            {details?.director ? ` · Directed by ${details.director}` : ""}
          </p>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-red-900/40 bg-red-darker/30 px-2.5 py-1 text-[12px] font-bold text-red-primary">
              ★ {movie.rating}
            </span>
            <button
              type="button"
              onClick={() => onToggleWatchlist(movie)}
              aria-pressed={isSaved}
              className="flex items-center gap-1.5 rounded-full border border-border-chip bg-bg-chip px-3 py-1 text-[12px] font-semibold text-ink-secondary transition-colors duration-200 ease-out hover:text-red-primary hover:border-red-900/50"
            >
              <Heart className="h-3.5 w-3.5" filled={isSaved} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-border-chip bg-bg-chip px-3 py-1 text-[12px] font-semibold text-ink-secondary transition-colors duration-200 ease-out hover:text-red-primary hover:border-red-900/50"
            >
              <Share className="h-3.5 w-3.5" />
              Share
            </button>
          </span>
        </div>

        {loading && (
          <p className="mt-8 text-[14px] text-ink-muted">Pulling up the trailer…</p>
        )}

        {error && !loading && (
          <div className="mt-8 rounded-2xl border border-red-900/40 bg-red-darker/20 p-4 text-[14px] text-red-primary">
            {error}
          </div>
        )}

        {!loading && !error && details && (
          <>
            <section className="mt-7">
              <h2 className="mb-3 text-[13px] font-bold tracking-widest2 text-ink-muted">
                🎬 TRAILER
              </h2>
              {details.trailerKey ? (
                <div className="relative w-full overflow-hidden rounded-2xl border border-border-subtle" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${details.trailerKey}`}
                    title={`${movie.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="rounded-2xl border border-border-subtle bg-bg-chip p-4 text-[14px] text-ink-muted">
                  No trailer available for this title yet.
                </p>
              )}
            </section>

            <section className="mt-7">
              <h2 className="mb-3 text-[13px] font-bold tracking-widest2 text-ink-muted">
                📝 SPOILER-FREE SYNOPSIS
              </h2>
              <p className="text-[14px] leading-relaxed text-ink-secondary">
                {details.synopsis || "No synopsis available for this title."}
              </p>
            </section>

            {details.cast.length > 0 && (
              <section className="mt-7">
                <h2 className="mb-3 text-[13px] font-bold tracking-widest2 text-ink-muted">
                  🎭 CAST
                </h2>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {details.cast.map((member) => (
                    <div key={member.name} className="w-20 shrink-0 text-center">
                      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-bg-chip">
                        {member.photoUrl ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={member.photoUrl}
                              alt={member.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🎭
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 truncate text-[12px] font-semibold text-ink-primary">
                        {member.name}
                      </p>
                      <p className="truncate text-[11px] text-ink-muted">{member.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Personal notes — device-only, not a shared public comment section */}
        <section className="mt-8 border-t border-border-subtle pt-6">
          <h2 className="mb-1 text-[13px] font-bold tracking-widest2 text-ink-muted">
            💬 WHAT DID YOU THINK?
          </h2>
          <p className="mb-4 text-[12px] text-ink-muted">
            Saved privately on this device only — not shared with other visitors.
          </p>

          <div className="rounded-2xl border border-border-subtle bg-bg-chip p-4">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-transparent text-[14px] text-ink-primary placeholder:text-ink-muted focus:outline-none"
            />
            <div className="mt-2 flex gap-1" aria-label="Rate this title">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setDraftRating(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className={
                    star <= draftRating
                      ? "text-lg text-red-primary"
                      : "text-lg text-ink-muted"
                  }
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="What did you think? (Please avoid spoilers for others who read this later.)"
              rows={3}
              className="mt-3 w-full resize-none rounded-xl border border-border-chip bg-black/30 p-3 text-[14px] text-ink-primary placeholder:text-ink-muted focus:outline-none"
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={handlePostNote}
              disabled={!draftText.trim()}
              className="mt-3 rounded-xl bg-gradient-to-b from-red-bright to-red-deep px-5 py-2.5 text-[14px] font-bold text-white disabled:opacity-50"
            >
              Save Note
            </motion.button>
          </div>

          {notes.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-border-subtle bg-bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-ink-primary">{note.name}</p>
                    {note.rating > 0 && (
                      <p className="text-[12px] text-red-primary">
                        {"★".repeat(note.rating)}
                        <span className="text-ink-muted">{"★".repeat(5 - note.rating)}</span>
                      </p>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-secondary">{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {shareModalOpen && (
        <ShareModal
          movie={movie}
          latestReview={notes[0] ?? null}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  );
}
