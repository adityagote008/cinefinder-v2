interface CinemaTaglineProps {
  className?: string;
}

export default function CinemaTagline({ className }: CinemaTaglineProps) {
  return (
    <p
      className={
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] " +
        (className ?? "")
      }
    >
      <span className="text-red-primary/70" aria-hidden="true">
        ✦
      </span>
      <span className="bg-gradient-to-r from-amber-300 via-red-bright to-red-primary bg-clip-text text-transparent">
        Witness the Cinema
      </span>
      <span className="text-red-primary/70" aria-hidden="true">
        ✦
      </span>
    </p>
  );
}
