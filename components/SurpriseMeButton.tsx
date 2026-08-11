"use client";

import { motion } from "framer-motion";

interface SurpriseMeButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export default function SurpriseMeButton({ onClick, loading }: SurpriseMeButtonProps) {
  return (
    <div className="mt-3 px-5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={onClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-red-900/50 bg-transparent py-3.5 text-[15px] font-semibold text-ink-secondary transition-colors duration-200 ease-out hover:border-red-primary hover:text-red-primary disabled:opacity-50"
      >
        <span aria-hidden="true">🎲</span>
        {loading ? "Picking something…" : "Surprise Me"}
      </motion.button>
    </div>
  );
}
