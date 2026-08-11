export default function SkeletonCard() {
  return (
    <div className="flex w-full gap-3 rounded-2xl border border-border-subtle bg-bg-card p-3">
      <div className="h-[126px] w-[84px] shrink-0 animate-pulse rounded-xl bg-bg-chip" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-chip" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-bg-chip" />
        <div className="h-3 w-full animate-pulse rounded bg-bg-chip" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-bg-chip" />
      </div>
    </div>
  );
}
