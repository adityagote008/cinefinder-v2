"use client";

interface StepIndicatorProps {
  step: number;
  total: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ step, total, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 pt-5" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const thisStep = i + 1;
        // Only completed/current steps are jumpable — no skipping ahead to
        // a step that hasn't been reached yet.
        const clickable = onStepClick && thisStep <= step;
        const dotClass =
          thisStep === step
            ? "h-1.5 w-6 rounded-full bg-red-primary transition-all duration-200 ease-out"
            : thisStep < step
            ? "h-1.5 w-1.5 rounded-full bg-red-deep transition-all duration-200 ease-out"
            : "h-1.5 w-1.5 rounded-full bg-bg-chip transition-all duration-200 ease-out";

        if (!clickable) {
          return <span key={i} className={dotClass} />;
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => onStepClick(thisStep)}
            aria-label={`Go to step ${thisStep}`}
            className="p-1.5 -m-1.5"
          >
            <span className={dotClass} />
          </button>
        );
      })}
    </div>
  );
}
