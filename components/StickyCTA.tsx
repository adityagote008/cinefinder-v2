"use client";

import { motion } from "framer-motion";

interface StickyCTAProps {
  filterCount: number;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function StickyCTA({
  filterCount,
  onClick,
  disabled,
  loading,
}: StickyCTAProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-border-subtle bg-black/90 px-5 py-4 backdrop-blur">
      <motion.button
        type="button"
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={onClick}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-red-bright to-red-deep py-4 text-[16px] font-bold text-white shadow-red-glow-lg disabled:opacity-50"
      >
        <span aria-hidden="true">🎬</span>
        {loading ? "Finding movies…" : `Find My Movies (${filterCount} filters)`}
      </motion.button>
    </div>
  );
}
