import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { getDistrictRates } from "@/lib/get-district-rates";

export const metadata: Metadata = {
  title: "Abuja Service Areas | Prime Couriex Express",
  description: "Every district we cover across the Federal Capital Territory, Abuja.",
};

// See calculator/page.tsx — same reasoning: prices must never go stale
// between deploys, since the database is the whole point of configurable
// pricing (TRD §3.2).
export const dynamic = "force-dynamic";

export default async function ServiceAreasPage() {
  const districts = await getDistrictRates();

  return (
    <>
      <PageHeader
        eyebrow="Coverage"
        title="Abuja Service Areas"
        intro="We operate across the Federal Capital Territory, from the Central Business District out to Kwali and Gwagwalada. Pricing is based on the pickup district — pick yours below or use the price calculator for an instant estimate."
      />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="border-border grid grid-cols-2 border-t sm:grid-cols-3">
          {districts.map((d) => (
            <div key={d.district} className="border-border border-r border-b p-4">
              <p className="text-foreground text-sm font-medium">{d.district}</p>
              {d.standard_fee === null ? (
                <p className="text-muted-foreground mt-1 text-xs">Price on request</p>
              ) : (
                <p className="text-muted-foreground mt-1 text-xs">
                  from ₦{d.standard_fee.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-8 text-sm">
          Don&apos;t see your exact street or estate listed? These are districts, not an exhaustive
          address list — if you&apos;re within the FCT, we almost certainly cover you.{" "}
          <Link href="/contact" className="text-brand-text underline">
            Contact us
          </Link>{" "}
          if you&apos;re unsure.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/calculator"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
          >
            Get an Instant Quote
          </Link>
          <Link
            href="/booking"
            className="border-brand-text text-brand-text hover:bg-surface rounded-[var(--radius-control)] border px-6 py-3 font-semibold"
          >
            Book a Service
          </Link>
        </div>
      </section>
    </>
  );
}
