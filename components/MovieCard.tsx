"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPoster = movie.posterUrl && !imageFailed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index * 0.03, 0.2) }}
      className="flex gap-3 rounded-2xl border border-border-subtle bg-bg-card p-3"
    >
      <div className="relative h-[126px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-bg-chip to-black">
        {showPoster ? (
          <Image
            src={movie.posterUrl as string}
            alt={`${movie.title} poster`}
            fill
            sizes="84px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 border border-border-chip text-center">
            <span className="text-2xl" aria-hidden="true">
              🎬
            </span>
            <span className="px-1.5 text-[10px] leading-tight text-ink-muted">
              No poster
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-ink-primary">
            {movie.title}
          </h3>
          <span className="shrink-0 rounded-full border border-red-900/40 bg-red-darker/30 px-2 py-0.5 text-[11px] font-bold text-red-primary">
            ★ {movie.rating}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-ink-secondary">
          {movie.year} · {movie.genre}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-ink-secondary">
          {movie.reason}
        </p>
      </div>
    </motion.div>
  );
}
