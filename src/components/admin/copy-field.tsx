"use client";

import { useState } from "react";

// One-click copy for the contact details/reference number staff use to
// message customers manually (PRD §12.2, TRD §8) — there is no messaging
// API integration in this build.
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing to do.
    }
  }

  return (
    <div>
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
        {label}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="text-foreground hover:bg-surface border-border mt-1 flex w-full items-center justify-between gap-2 rounded-[var(--radius-control)] border px-3 py-2 text-left text-sm font-medium"
      >
        <span className="truncate">{value}</span>
        <span className="text-brand-text shrink-0 text-xs font-semibold">
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
}
