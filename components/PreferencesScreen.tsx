"use client";

import { motion } from "framer-motion";
import { LANGUAGE_OPTIONS, RUNTIME_OPTIONS } from "@/lib/constants";
import Header from "./Header";
import StepIndicator from "./StepIndicator";
import FilterChip from "./FilterChip";

interface PreferencesScreenProps {
  languages: string[];
  runtimes: string[];
  onToggleLanguage: (id: string) => void;
  onToggleRuntime: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export default function PreferencesScreen({
  languages,
  runtimes,
  onToggleLanguage,
  onToggleRuntime,
  onContinue,
  onSkip,
  onReset,
}: PreferencesScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showReset onReset={onReset} />
      <StepIndicator step={2} total={3} />

      <div className="flex-1 px-5 pt-6">
        <h2 className="text-[22px] font-extrabold text-ink-primary">
          Fine-tune the details
        </h2>
        <p className="mt-1.5 text-[14px] text-ink-secondary">
          Pick as many as apply — this helps us get even closer to your exact vibe.
        </p>

        <section className="mt-7">
          <h3 className="mb-3 text-[13px] font-bold tracking-widest2 text-ink-muted">
            🌐 LANGUAGE
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {LANGUAGE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.id}
                label={opt.label}
                active={languages.includes(opt.id)}
                onClick={() => onToggleLanguage(opt.id)}
              />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h3 className="mb-3 text-[13px] font-bold tracking-widest2 text-ink-muted">
            ⏱️ RUNTIME LENGTH
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {RUNTIME_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.id}
                label={opt.label}
                active={runtimes.includes(opt.id)}
                onClick={() => onToggleRuntime(opt.id)}
              />
            ))}
          </div>
        </section>
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
