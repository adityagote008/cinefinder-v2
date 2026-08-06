"use client";

import { motion } from "framer-motion";
import { PLATFORM_OPTIONS } from "@/lib/constants";
import Header from "./Header";
import StepIndicator from "./StepIndicator";
import FilterChip from "./FilterChip";

interface PlatformsScreenProps {
  selected: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export default function PlatformsScreen({
  selected,
  onToggle,
  onContinue,
  onSkip,
  onReset,
}: PlatformsScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showReset onReset={onReset} />
      <StepIndicator step={1} total={3} />

      <div className="flex-1 px-5 pt-6">
        <h2 className="text-[22px] font-extrabold text-ink-primary">
          What can you watch on?
        </h2>
        <p className="mt-1.5 text-[14px] text-ink-secondary">
          Pick the platforms you have — we&rsquo;ll steer recommendations toward
          what you can actually stream. Skip if you don&rsquo;t mind either way.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {PLATFORM_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.id}
              label={opt.label}
              emoji={opt.emoji}
              active={selected.includes(opt.id)}
              onClick={() => onToggle(opt.id)}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 flex flex-col gap-2.5 border-t border-border-subtle bg-black/90 px-5 py-4 backdrop-blur">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-red-bright to-red-deep py-4 text-[16px] font-bold text-white shadow-red-glow-lg"
        >
          Continue
        </motion.button>
        <button
          type="button"
          onClick={onSkip}
          className="py-1 text-center text-[14px] text-ink-muted transition-colors duration-200 ease-out hover:text-ink-secondary"
        >
          Skip this step
        </button>
      </div>
    </div>
  );
}
