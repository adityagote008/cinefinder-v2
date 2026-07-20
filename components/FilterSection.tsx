"use client";

import { useState } from "react";
import { ChipOption } from "@/types";
import FilterChip, { MoreChip } from "./FilterChip";

interface FilterSectionProps {
  label: string;
  emoji: string;
  options: ChipOption[];
  selected: string[];
  onToggle: (id: string) => void;
  initialVisible?: number;
}

export default function FilterSection({
  label,
  emoji,
  options,
  selected,
  onToggle,
  initialVisible = 9,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleOptions = expanded ? options : options.slice(0, initialVisible);
  const remaining = options.length - initialVisible;

  return (
    <section className="mt-7 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13px] font-bold tracking-widest2 text-ink-muted">
          <span aria-hidden="true">{emoji}</span>
          {label}
        </h3>
        {selected.length > 0 && (
          <span
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-primary px-1.5 text-[11px] font-bold text-white"
            aria-label={`${selected.length} selected in ${label}`}
          >
            {selected.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {visibleOptions.map((opt) => (
          <FilterChip
            key={opt.id}
            label={opt.label}
            emoji={opt.emoji}
            active={selected.includes(opt.id)}
            onClick={() => onToggle(opt.id)}
          />
        ))}
        {!expanded && remaining > 0 && (
          <MoreChip count={remaining} onClick={() => setExpanded(true)} />
        )}
      </div>
    </section>
  );
}
