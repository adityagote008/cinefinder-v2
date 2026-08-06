"use client";

import { FILTER_GROUPS } from "@/lib/constants";
import { FilterState } from "@/types";
import Header from "./Header";
import StepIndicator from "./StepIndicator";
import SearchInput from "./SearchInput";
import FilterSection from "./FilterSection";
import SelectedFilterPanel from "./SelectedFilterPanel";
import StickyCTA from "./StickyCTA";

interface FiltersScreenProps {
  filters: FilterState;
  totalCount: number;
  canSubmit: boolean;
  onToggle: (group: "mood" | "genre" | "category" | "style", id: string) => void;
  onSearchChange: (value: string) => void;
  onClearAll: () => void;
  onReset: () => void;
  onFindMovies: () => void;
}

export default function FiltersScreen({
  filters,
  totalCount,
  canSubmit,
  onToggle,
  onSearchChange,
  onClearAll,
  onReset,
  onFindMovies,
}: FiltersScreenProps) {
  const selectedLabels = FILTER_GROUPS.flatMap((group) =>
    group.options
      .filter((opt) => filters[group.key].includes(opt.id))
      .map((opt) => opt.label)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header showReset onReset={onReset} />
      <StepIndicator step={3} total={3} />
      <SearchInput value={filters.searchQuery} onChange={onSearchChange} />

      <div className="flex-1">
        {FILTER_GROUPS.map((group) => (
          <FilterSection
            key={group.key}
            label={group.label}
            emoji={group.emoji}
            options={group.options}
            selected={filters[group.key]}
            onToggle={(id) => onToggle(group.key, id)}
          />
        ))}

        <SelectedFilterPanel selectedLabels={selectedLabels} onClearAll={onClearAll} />
        <div className="h-4" />
      </div>

      <StickyCTA filterCount={totalCount} onClick={onFindMovies} disabled={!canSubmit} />
    </div>
  );
}
