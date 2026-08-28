"use client";

import { useState } from "react";

type Theme = "light" | "dark" | "system";

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage unavailable (e.g. private browsing) — fall back to system
  }
  return "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (theme !== "system") root.classList.add(theme);
  try {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {
    // localStorage unavailable (e.g. private browsing) — theme just won't persist
  }
}

export function ThemeToggle() {
  // Lazy initializer reads the real client-side preference on first client
  // render, avoiding an effect-driven extra render pass. The inline script
  // in layout.tsx already applies the class before paint, so this is purely
  // about keeping this button's own label in sync.
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  function cycle() {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="border-border text-foreground hover:bg-surface focus-visible:ring-focus-ring rounded-[var(--radius-control)] border px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
      aria-label="Toggle color theme"
    >
      {/* First client render may briefly differ from the server-rendered
          "system" default if a theme was previously stored — expected and
          harmless for this non-critical label. */}
      <span suppressHydrationWarning>Theme: {theme}</span>
    </button>
  );
}
