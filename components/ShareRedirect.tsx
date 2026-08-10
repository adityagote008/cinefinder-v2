"use client";

import { useEffect } from "react";

interface ShareRedirectProps {
  tmdbId: string;
  mediaType: string;
}

export default function ShareRedirect({ tmdbId, mediaType }: ShareRedirectProps) {
  const destination = `/?movie=${tmdbId}&type=${mediaType}`;

  useEffect(() => {
    // A real browser executes this immediately. Link-preview crawlers
    // (WhatsApp, Telegram, iMessage, Discord, etc.) don't run JavaScript,
    // so they only ever see this page's metadata/OG image — never this
    // redirect — which is exactly what keeps the rich movie-card preview
    // intact when the link is shared.
    window.location.replace(destination);
  }, [destination]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-primary to-red-deep text-2xl shadow-red-glow"
        aria-hidden="true"
      >
        🎬
      </div>
      <p className="text-[15px] text-ink-secondary">Opening in CineFinder…</p>
      <a
        href={destination}
        className="mt-2 rounded-full bg-gradient-to-b from-red-bright to-red-deep px-5 py-2.5 text-[14px] font-bold text-white"
      >
        Tap here if it doesn&rsquo;t open automatically
      </a>
    </div>
  );
}
