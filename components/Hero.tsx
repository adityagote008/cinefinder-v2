"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getGreeting(hour: number): string {
  if (hour < 5) return "Up late? 🌙";
  if (hour < 12) return "Good morning ☀️";
  if (hour < 17) return "Good afternoon 👋";
  if (hour < 21) return "Good evening 🌆";
  return "Movie night? 🍿";
}

export default function Hero() {
  // Computed client-side after mount (not during server render) so the
  // greeting reflects the viewer's own local time without a hydration
  // mismatch — it simply doesn't render until the browser confirms the hour.
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

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
        {greeting && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-2 text-[13px] font-semibold text-ink-muted"
          >
            {greeting}
          </motion.p>
        )}
        <div className="mb-4 text-5xl" aria-hidden="true">
          🎬
        </div>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-tight">
          <span className="text-ink-primary">Discover Your</span>
          <br />
          <span className="text-red-primary">Perfect Watch</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[260px] text-[15px] leading-snug text-ink-secondary">
          Picks that actually get your taste
        </p>
      </div>
    </motion.section>
  );
}
