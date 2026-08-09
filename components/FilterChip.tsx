"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  emoji?: string;
  logoUrl?: string;
  active: boolean;
  onClick: () => void;
}

export default function FilterChip({ label, emoji, logoUrl, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center rounded-full border font-medium transition-colors duration-200 ease-out",
        logoUrl ? "py-2 pl-2 pr-4 sm:py-2.5 sm:pl-2.5 sm:pr-5" : "px-4 py-2.5",
        "text-[14px]",
        active
          ? "border-red-primary bg-red-darker/40 text-red-primary font-bold"
          : "border-border-chip bg-bg-chip text-ink-secondary hover:border-ink-muted/60"
      )}
    >
      {logoUrl ? (
        <span className="relative mr-2.5 h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white/10 sm:h-9 sm:w-9">
          <Image src={logoUrl} alt="" fill sizes="36px" className="object-cover" />
        </span>
      ) : (
        emoji && (
          <span className="mr-1.5" aria-hidden="true">
            {emoji}
          </span>
        )
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
