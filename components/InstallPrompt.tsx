"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "./icons";

const DISMISS_KEY = "cinefinder:install-dismissed-at";
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// Minimal shape of the event this needs — not in standard TS DOM types yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // iOS Safari never fires this event (Apple doesn't support it) — the
    // banner simply never appears there, which is the correct behavior
    // rather than showing a button that wouldn't work.
    function handler(e: Event) {
      e.preventDefault();
      if (recentlyDismissed()) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Non-fatal — banner may just reappear sooner than intended.
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-red-900/40 bg-bg-elevated p-4 shadow-red-glow-lg"
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-primary to-red-deep text-lg"
            aria-hidden="true"
          >
            🎬
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-ink-primary">Install CineFinder</p>
            <p className="text-[12px] text-ink-secondary">Quick access from your home screen</p>
          </div>
          <button
            type="button"
            onClick={handleInstall}
            className="shrink-0 rounded-full bg-gradient-to-b from-red-bright to-red-deep px-4 py-2 text-[13px] font-bold text-white"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 p-1 text-ink-muted transition-colors duration-200 ease-out hover:text-ink-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
