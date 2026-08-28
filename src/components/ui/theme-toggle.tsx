"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

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
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") setTheme(stored);
    } catch {
      // ignore
    }
  }, []);

  function cycle() {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      aria-label="Toggle color theme"
    >
      Theme: {theme}
    </button>
  );
}
