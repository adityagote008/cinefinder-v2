"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative mx-5 mt-5 overflow-hidden rounded-card border border-border-subtle bg-gradient-to-b from-red-darker/40 via-bg-card to-black px-6 py-10 text-center"
    >
      {/* soft ambient red glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 rounded-full bg-red-glow blur-3xl opacity-40"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mb-4 text-5xl" aria-hidden="true">
          🎬
        </div>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-tight">
          <span className="text-ink-primary">Discover Your</span>
          <br />
          <span className="text-red-primary">Perfect Watch</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[260px] text-[15px] leading-snug text-ink-secondary">
          AI-powered recommendations tailored to your exact vibe
        </p>
      </div>
    </motion.section>
  );
}
