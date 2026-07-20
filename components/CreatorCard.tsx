export default function CreatorCard() {
  return (
    <div className="mx-5 mt-6 rounded-2xl border border-red-900/30 bg-gradient-to-br from-red-darker/50 via-bg-card to-black p-4">
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-widest2 text-red-primary">
        <span aria-hidden="true">✦</span> CREATED BY
      </p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-primary to-red-deep text-lg font-bold text-white"
            aria-hidden="true"
          >
            A
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-ink-primary">Aditya Gote</p>
            <p className="text-[13px] font-semibold text-red-primary">ASG</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-red-900/50 bg-red-darker/40 px-3 py-1.5 text-[12px] font-semibold text-red-primary">
          <span aria-hidden="true">🎬</span> Dev
        </span>
      </div>
    </div>
  );
}
