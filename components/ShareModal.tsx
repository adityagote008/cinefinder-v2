"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment, Movie } from "@/types";
import { generateMovieCard, generateReviewCard } from "@/lib/shareCard";
import { X, Share } from "./icons";

type CardTab = "movie" | "review";

interface ShareModalProps {
  movie: Movie;
  latestReview: Comment | null;
  onClose: () => void;
}

export default function ShareModal({ movie, latestReview, onClose }: ShareModalProps) {
  const [tab, setTab] = useState<CardTab>("movie");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStatus(null);

    const task =
      tab === "review" && latestReview
        ? generateReviewCard(movie, latestReview)
        : generateMovieCard(movie);

    task.then((result) => {
      if (cancelled) return;
      setBlob(result);
      setImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return result ? URL.createObjectURL(result) : null;
      });
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [tab, movie, latestReview]);

  // Clean up the object URL when the modal closes for good.
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSave() {
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const suffix = tab === "review" ? "review" : "pick";
    link.download = `${movie.title.toLowerCase().replace(/\s+/g, "-")}-cinefinder-${suffix}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function handleNativeShare() {
    if (!blob) return;
    setStatus(null);
    try {
      const file = new File([blob], "cinefinder-card.png", { type: "image/png" });
      if (typeof navigator !== "undefined" && "canShare" in navigator && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${movie.title} — CineFinder`,
        });
      } else {
        handleSave();
        setStatus("Your browser can't share images directly — saved it instead!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setStatus("Couldn't share right now — try Save Image instead.");
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-3xl border border-border-subtle bg-bg-elevated sm:rounded-3xl"
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-ink-primary">
              <Share className="h-4 w-4 text-red-primary" />
              Share Your Pick
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-ink-muted transition-colors duration-200 ease-out hover:text-ink-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {latestReview && (
            <div className="flex gap-2 px-5 pt-4">
              <button
                type="button"
                onClick={() => setTab("movie")}
                className={
                  tab === "movie"
                    ? "flex-1 rounded-full bg-red-primary py-2 text-[13px] font-bold text-white"
                    : "flex-1 rounded-full border border-border-chip bg-bg-chip py-2 text-[13px] font-semibold text-ink-secondary"
                }
              >
                Movie Card
              </button>
              <button
                type="button"
                onClick={() => setTab("review")}
                className={
                  tab === "review"
                    ? "flex-1 rounded-full bg-red-primary py-2 text-[13px] font-bold text-white"
                    : "flex-1 rounded-full border border-border-chip bg-bg-chip py-2 text-[13px] font-semibold text-ink-secondary"
                }
              >
                Review Card
              </button>
            </div>
          )}

          <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-5">
            {loading ? (
              <p className="text-[14px] text-ink-muted">Creating your card…</p>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Share card preview"
                className="w-full max-w-[320px] rounded-2xl border border-border-subtle shadow-red-glow-lg"
              />
            ) : (
              <p className="text-[14px] text-red-primary">
                Couldn&rsquo;t generate the card — try again in a moment.
              </p>
            )}
          </div>

          {status && (
            <p className="px-5 pb-1 text-center text-[12px] font-medium text-red-primary">
              {status}
            </p>
          )}

          <div className="flex gap-3 border-t border-border-subtle p-5">
            <button
              type="button"
              onClick={handleSave}
              disabled={!blob}
              className="flex-1 rounded-2xl border border-border-chip bg-bg-chip py-3.5 text-[15px] font-bold text-ink-primary disabled:opacity-50"
            >
              Save Image
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={!blob}
              className="flex-1 rounded-2xl bg-gradient-to-b from-red-bright to-red-deep py-3.5 text-[15px] font-bold text-white disabled:opacity-50"
            >
              Share
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
