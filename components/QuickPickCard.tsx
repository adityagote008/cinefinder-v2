"use client";

import { motion } from "framer-motion";
import { QuickPick } from "@/types";
import { cn } from "@/lib/utils";

const TINTS: Record<QuickPick["tint"], string> = {
  action: "from-red-950/70 via-bg-chip to-black border-red-900/40",
  mind: "from-purple-950/60 via-bg-chip to-black border-purple-900/30",
  comedy: "from-yellow-950/50 via-bg-chip to-black border-yellow-900/30",
  horror: "from-emerald-950/50 via-bg-chip to-black border-emerald-900/25",
  romance: "from-rose-950/60 via-bg-chip to-black border-rose-900/35",
  scifi: "from-blue-950/60 via-bg-chip to-black border-blue-900/35",
};

interface QuickPickCardProps {
  pick: QuickPick;
  onSelect: (pick: QuickPick) => void;
}

export default function QuickPickCard({ pick, onSelect }: QuickPickCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onSelect(pick)}
      className={cn(
        "relative flex h-[108px] flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left",
        "transition-colors duration-200 ease-out hover:border-ink-muted/60",
        TINTS[pick.tint]
      )}
      aria-label={`Quick pick: ${pick.label}`}
    >
      {pick.tint === "scifi" && (
        <div
          className="pointer-events-none absolute right-3 top-3 h-6 w-6 rounded-full bg-gradient-to-br from-blue-400/40 via-indigo-500/30 to-transparent blur-[2px]"
          aria-hidden="true"
        />
      )}
      <span className="text-2xl" aria-hidden="true">
        {pick.emoji}
      </span>
      <span className="text-[15px] font-semibold text-ink-primary">{pick.label}</span>
    </motion.button>
  );
}
