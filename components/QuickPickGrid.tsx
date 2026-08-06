"use client";

import { QUICK_PICKS } from "@/lib/constants";
import { QuickPick } from "@/types";
import QuickPickCard from "./QuickPickCard";

interface QuickPickGridProps {
  onSelect: (pick: QuickPick) => void;
}

export default function QuickPickGrid({ onSelect }: QuickPickGridProps) {
  return (
    <section className="mt-8 px-5">
      <h3 className="mb-3 text-[13px] font-bold tracking-widest2 text-ink-muted">
        QUICK PICK
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {QUICK_PICKS.map((pick) => (
          <QuickPickCard key={pick.id} pick={pick} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
