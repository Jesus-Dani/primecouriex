"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDistrictRate } from "@/app/admin/(dashboard)/pricing/actions";
import type { DistrictRateRow } from "@/lib/supabase/types";

const inputClass =
  "border-border bg-background text-foreground focus-visible:ring-focus-ring w-28 rounded-[var(--radius-control)] border px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none";

export function DistrictRateRowForm({ rate }: { rate: DistrictRateRow }) {
  const [riderRate, setRiderRate] = useState(rate.rider_rate?.toString() ?? "");
  const [standardFee, setStandardFee] = useState(rate.standard_fee?.toString() ?? "");
  const [addonFee, setAddonFee] = useState(rate.return_copy_addon_fee?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData();
    formData.set("id", rate.id);
    formData.set("rider_rate", riderRate);
    formData.set("standard_fee", standardFee);
    formData.set("return_copy_addon_fee", addonFee);
    startTransition(async () => {
      const result = await updateDistrictRate(formData);
      if (result.status === "error") {
        setError(result.formError ?? "Something went wrong.");
      } else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <tr className="hover:bg-surface">
      <td className="text-foreground px-4 py-2 font-medium">{rate.district}</td>
      <td className="px-4 py-2">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min="0"
            step="1"
            value={riderRate}
            onChange={(e) => setRiderRate(e.target.value)}
            placeholder="On request"
            className={inputClass}
            aria-label={`Rider rate for ${rate.district}`}
          />
          <input
            type="number"
            min="0"
            step="1"
            value={standardFee}
            onChange={(e) => setStandardFee(e.target.value)}
            placeholder="On request"
            className={inputClass}
            aria-label={`Standard fee for ${rate.district}`}
          />
          <input
            type="number"
            min="0"
            step="1"
            value={addonFee}
            onChange={(e) => setAddonFee(e.target.value)}
            placeholder="On request"
            className={inputClass}
            aria-label={`Return-copy add-on fee for ${rate.district}`}
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          {saved && !isPending && <span className="text-success text-xs">Saved</span>}
          {error && <span className="text-error text-xs">{error}</span>}
        </form>
      </td>
    </tr>
  );
}
