interface ResultsHeaderProps {
  title: string;
  count: number;
}

export default function ResultsHeader({ title, count }: ResultsHeaderProps) {
  return (
    <div className="px-5 pt-6">
      <p className="flex items-center gap-1.5 text-[12px] font-bold tracking-widest2 text-red-primary">
        <span aria-hidden="true">🎯</span> CURATED FOR YOU
      </p>
      <h2 className="mt-1 text-[26px] font-extrabold text-ink-primary">{title}</h2>
      <p className="mt-1 text-[14px] text-ink-secondary">
        {count} recommendation{count === 1 ? "" : "s"}
      </p>
    </div>
  );
}
