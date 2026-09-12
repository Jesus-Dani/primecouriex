import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Corporate Clients | Prime Couriex Express",
  description:
    "Courier and registry liaison services for corporate and institutional clients across the FCT, Abuja.",
};

const REASONS = [
  {
    title: "No account needed",
    detail:
      "Book under your organisation's name the same way as any other service — no portal or sign-up required in this version of the site.",
  },
  {
    title: "Consistent turnaround",
    detail:
      "Every booking is reviewed within 1 hour as standard, so your team can plan around a reliable timeline.",
  },
  {
    title: "Confidential handling",
    detail:
      "Corporate records and correspondence are treated with the same discretion as our legal and process-serving work.",
  },
];

export default function CorporatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Corporate clients"
        title="Courier and registry liaison for your organisation"
        intro="Prime Couriex Express Ltd supports corporate and institutional clients across the FCT with reliable, confidential courier and registry liaison services."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-foreground">
          Whether you need routine courier runs, document retrieval from a government registry, or
          process-serving support for your legal team, we book and confirm the same way for
          corporate clients as we do for anyone else: fast, transparent, and without a lengthy
          onboarding process.
        </p>

        <div className="border-border divide-border mt-10 divide-y border-t">
          {REASONS.map((r) => (
            <div key={r.title} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
              <h2 className="text-foreground font-semibold">{r.title}</h2>
              <p className="text-muted-foreground sm:col-span-2">{r.detail}</p>
            </div>
          ))}
        </div>

        <div className="border-border bg-surface mt-12 border p-6">
          <h2 className="text-foreground font-semibold">Retainer and invoice billing</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            If your organisation needs a retainer or invoice-based billing arrangement, contact our
            team directly — this is handled as an offline conversation outside the standard booking
            flow.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/booking?service=corporate_courier"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
          >
            Book a Service
          </Link>
          <Link
            href="/contact"
            className="border-brand-text text-brand-text hover:bg-background rounded-[var(--radius-control)] border px-6 py-3 font-semibold"
          >
            Talk to Our Team
          </Link>
        </div>
      </section>
    </>
  );
}
