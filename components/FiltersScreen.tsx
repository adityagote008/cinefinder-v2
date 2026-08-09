"use client";

import { FILTER_GROUPS } from "@/lib/constants";
import { FilterState } from "@/types";
import Header from "./Header";
import StepIndicator from "./StepIndicator";
import SearchInput from "./SearchInput";
import FilterSection from "./FilterSection";
import SelectedFilterPanel from "./SelectedFilterPanel";
import StickyCTA from "./StickyCTA";
import { ArrowLeft } from "./icons";

interface FiltersScreenProps {
  filters: FilterState;
  totalCount: number;
  canSubmit: boolean;
  onToggle: (group: "mood" | "genre" | "category" | "style", id: string) => void;
  onSearchChange: (value: string) => void;
  onClearAll: () => void;
  onReset: () => void;
  onFindMovies: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  onBack: () => void;
  onStepClick: (step: number) => void;
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
  onOpenWatchlist,
  watchlistCount,
  onBack,
  onStepClick,
}: FiltersScreenProps) {
  const selectedLabels = FILTER_GROUPS.flatMap((group) =>
    group.options
      .filter((opt) => filters[group.key].includes(opt.id))
      .map((opt) => opt.label)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        showReset
        onReset={onReset}
        onWatchlist={onOpenWatchlist}
        watchlistCount={watchlistCount}
      />
      <StepIndicator step={3} total={3} onStepClick={onStepClick} />
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[14px] text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
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
