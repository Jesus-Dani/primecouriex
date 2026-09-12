"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUrgentSurcharge } from "@/app/admin/(dashboard)/pricing/actions";

export function UrgentSurchargeForm({ value }: { value: number }) {
  const [amount, setAmount] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData();
    formData.set("value", amount);
    startTransition(async () => {
      const result = await updateUrgentSurcharge(formData);
      if (result.status === "error") {
        setError(result.formError ?? "Something went wrong.");
      } else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <span className="text-muted-foreground text-sm">₦</span>
      <input
        type="number"
        min="0"
        step="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border-border bg-background text-foreground focus-visible:ring-focus-ring w-32 rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-4 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save"}
      </button>
      {saved && !isPending && <span className="text-success text-sm">Saved</span>}
      {error && <span className="text-error text-sm">{error}</span>}
    </form>
  );
}
