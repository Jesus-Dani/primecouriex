"use client";

import { useMemo, useState } from "react";
import { calculatePriceForDistrict } from "@/lib/pricing-district";
import type { PublicDistrictRate } from "@/lib/get-district-rates";
import type { DeliverySpeed } from "@/lib/supabase/types";

const SPEED_OPTIONS: { value: DeliverySpeed; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "same_day", label: "Same-day" },
  { value: "urgent_express", label: "Urgent / Express (+₦5,000)" },
];

export function PriceCalculatorForm({
  districts,
  urgentSurcharge,
}: {
  districts: PublicDistrictRate[];
  urgentSurcharge: number;
}) {
  const [district, setDistrict] = useState(districts[0]?.district ?? "");
  const [speed, setSpeed] = useState<DeliverySpeed>("standard");
  const [returnCopy, setReturnCopy] = useState(false);

  const rate = useMemo(() => districts.find((d) => d.district === district), [districts, district]);

  const result = useMemo(() => {
    if (!rate) return null;
    return calculatePriceForDistrict(rate, speed, returnCopy, urgentSurcharge);
  }, [rate, speed, returnCopy, urgentSurcharge]);

  return (
    <div className="border-border bg-card grid gap-8 border p-6 sm:p-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label htmlFor="pickup-district" className="text-foreground block text-sm font-medium">
            Pickup district
          </label>
          <p className="text-muted-foreground mt-1 text-xs">
            Price is based on where we&apos;re picking up from, not the delivery destination.
          </p>
          <select
            id="pickup-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-2 w-full rounded-[var(--radius-control)] border px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {districts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="delivery-speed" className="text-foreground block text-sm font-medium">
            Delivery speed
          </label>
          <select
            id="delivery-speed"
            value={speed}
            onChange={(e) => setSpeed(e.target.value as DeliverySpeed)}
            className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-2 w-full rounded-[var(--radius-control)] border px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {SPEED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={returnCopy}
            onChange={(e) => setReturnCopy(e.target.checked)}
            className="border-border mt-0.5 rounded-[var(--radius-control)]"
          />
          <span>
            <span className="text-foreground font-medium">Return copy add-on</span>
            <span className="text-muted-foreground block text-xs">
              For legal/process-serving bookings that need a signed copy returned to you.
            </span>
          </span>
        </label>
      </div>

      <div className="bg-surface flex flex-col justify-center p-6">
        {!result || result.priceOnRequest ? (
          <>
            <p className="text-muted-foreground text-sm">Estimated price</p>
            <p className="text-foreground mt-2 text-2xl font-bold">Price on request</p>
            <p className="text-muted-foreground mt-2 text-sm">
              We don&apos;t have a confirmed rate for {district} yet. Contact us and we&apos;ll
              quote you directly.
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">Estimated price</p>
            <p className="text-foreground mt-2 text-3xl font-bold">
              ₦{result.total!.toLocaleString()}
            </p>
            <dl className="text-muted-foreground mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Base fee</dt>
                <dd>₦{result.basePrice!.toLocaleString()}</dd>
              </div>
              {result.surcharge > 0 && (
                <div className="flex justify-between">
                  <dt>Urgent surcharge</dt>
                  <dd>₦{result.surcharge.toLocaleString()}</dd>
                </div>
              )}
              {result.addon > 0 && (
                <div className="flex justify-between">
                  <dt>Return copy add-on</dt>
                  <dd>₦{result.addon.toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </>
        )}
        <p className="text-muted-foreground mt-6 text-xs">
          Estimate only — the final price is confirmed at booking.
        </p>
      </div>
    </div>
  );
}
