"use client";

import { X } from "./icons";

interface HeaderProps {
  showReset?: boolean;
  onReset?: () => void;
}

export default function Header({ showReset, onReset }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-subtle">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-primary to-red-deep text-xl shadow-red-glow"
          aria-hidden="true"
        >
          🎬
        </div>
        <div className="leading-tight">
          <h1 className="text-[19px] font-bold tracking-tight">
            <span className="text-ink-primary">Cine</span>
            <span className="text-red-primary">Finder</span>
          </h1>
          <p className="text-[11px] font-semibold tracking-widest2 text-ink-muted">
            BY <span className="text-red-primary">ASG</span>
          </p>
        </div>
      </div>

      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full border border-border-chip bg-bg-chip px-4 py-2 text-sm text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary hover:border-ink-muted"
          aria-label="Reset all filters"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
    </header>
  );
}
