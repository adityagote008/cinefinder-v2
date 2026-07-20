"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}

export default function FilterChip({ label, emoji, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 ease-out",
        active
          ? "border-red-primary bg-red-darker/40 text-red-primary font-bold"
          : "border-border-chip bg-bg-chip text-ink-secondary hover:border-ink-muted/60"
      )}
    >
      {emoji && (
        <span className="mr-1.5" aria-hidden="true">
          {emoji}
        </span>
      )}
      {label}
    </button>
  );
}

export function MoreChip({ count, onClick }: { count: number; onClick: () => void }) {
  if (count <= 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border border-dashed border-ink-muted/50 bg-transparent px-4 py-2.5 text-[14px] font-medium text-ink-muted transition-colors duration-200 ease-out hover:text-ink-secondary hover:border-ink-secondary"
    >
      +{count}
    </button>
  );
}
