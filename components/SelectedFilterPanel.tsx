"use client";

interface SelectedFilterPanelProps {
  selectedLabels: string[];
  onClearAll: () => void;
}

export default function SelectedFilterPanel({
  selectedLabels,
  onClearAll,
}: SelectedFilterPanelProps) {
  if (selectedLabels.length === 0) return null;

  return (
    <div className="mx-5 mt-7 rounded-2xl border border-border-subtle bg-bg-card p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[13px] font-bold tracking-wide text-red-primary">
          SELECTED · {selectedLabels.length}
        </p>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[13px] text-ink-muted transition-colors duration-200 ease-out hover:text-ink-secondary"
        >
          Clear all
        </button>
      </div>
      <p className="text-[14px] text-ink-secondary">{selectedLabels.join(", ")}</p>
    </div>
  );
}
