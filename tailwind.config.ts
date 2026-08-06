import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        bg: {
          DEFAULT: "#000000",
          elevated: "#0c0c0d",
          card: "#0f0a0b",
          chip: "#131214",
        },
        // Red system — never orange
        red: {
          primary: "#e0202f",
          bright: "#ef2c3a",
          deep: "#7a0f1c",
          darker: "#4a0b12",
          glow: "rgba(224,32,47,0.35)",
        },
        // Text
        ink: {
          primary: "#f5f5f6",
          secondary: "#9a9aa0",
          muted: "#6a6a70",
          faint: "#4d4d52",
        },
        border: {
          subtle: "rgba(255,255,255,0.08)",
          chip: "rgba(255,255,255,0.10)",
          red: "rgba(224,32,47,0.45)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "SF Pro Display", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        card: "1.5rem",
      },
      boxShadow: {
        "red-glow": "0 8px 30px -6px rgba(224,32,47,0.45)",
        "red-glow-lg": "0 12px 40px -8px rgba(224,32,47,0.55)",
        "soft": "0 2px 12px rgba(0,0,0,0.4)",
      },
      letterSpacing: {
        widest2: "0.18em",
      },
      transitionTimingFunction: {
        "ease-out-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
