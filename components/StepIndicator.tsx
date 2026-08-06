interface StepIndicatorProps {
  step: number;
  total: number;
}

export default function StepIndicator({ step, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 pt-5" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i + 1 === step
              ? "h-1.5 w-6 rounded-full bg-red-primary transition-all duration-200 ease-out"
              : i + 1 < step
              ? "h-1.5 w-1.5 rounded-full bg-red-deep transition-all duration-200 ease-out"
              : "h-1.5 w-1.5 rounded-full bg-bg-chip transition-all duration-200 ease-out"
          }
        />
      ))}
    </div>
  );
}
