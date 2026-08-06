"use client";

import { motion } from "framer-motion";

interface CustomFilterButtonProps {
  onClick: () => void;
}

export default function CustomFilterButton({ onClick }: CustomFilterButtonProps) {
  return (
    <div className="mt-6 px-5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-red-bright to-red-deep py-4 text-[16px] font-bold text-white shadow-red-glow-lg transition-transform duration-200 ease-out"
      >
        <span aria-hidden="true">🎯</span>
        Custom Filters
      </motion.button>
    </div>
  );
}
