"use client";

import { Search } from "./icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-3 rounded-2xl border border-border-chip bg-bg-chip px-4 py-3.5">
        <Search className="h-5 w-5 shrink-0 text-ink-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='e.g. "like Parasite but faster paced"'
          className="w-full bg-transparent text-[15px] text-ink-primary placeholder:text-ink-muted focus:outline-none"
          aria-label="Describe what you want to watch"
        />
      </div>
    </div>
  );
}
