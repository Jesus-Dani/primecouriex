import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Corporate Clients | Prime Couriex Express",
  description:
    "Courier and registry liaison services for corporate and institutional clients across the FCT, Abuja.",
};

const USE_CASES = [
  {
    title: "Inter-office and vendor documents",
    detail:
      'Signed contracts, board resolutions, tender and procurement documents, or invoices that need to move between your offices, branches, or vendors, with a reference number your team can follow rather than a courier\'s word that it "should have arrived."',
  },
  {
    title: "Registry and government office retrieval",
    detail:
      "CAC filings, land registry documents, regulatory compliance paperwork, or anything else that requires standing in line at a government office on your behalf, so your staff don't have to make the trip.",
  },
  {
    title: "HR and internal correspondence",
    detail:
      "Employment letters, disciplinary or termination notices, and other HR correspondence that needs a documented, discreet hand-off, the same standard we hold for legal process serving.",
  },
];

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
          We book and confirm the same way for corporate clients as we do for anyone else: fast,
          transparent, and without a lengthy onboarding process. In practice, that covers a range of
          things a general delivery app isn&apos;t built to handle carefully:
        </p>

        <div className="border-border divide-border mt-8 divide-y border-t">
          {USE_CASES.map((u) => (
            <div key={u.title} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
              <h2 className="text-foreground font-semibold">{u.title}</h2>
              <p className="text-muted-foreground sm:col-span-2">{u.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="text-foreground mt-12 font-[family-name:var(--font-heading)] text-xl font-semibold">
          Why organisations book with us
        </h2>
        <div className="border-border divide-border mt-6 divide-y border-t">
          {REASONS.map((r) => (
            <div key={r.title} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
              <h3 className="text-foreground font-semibold">{r.title}</h3>
              <p className="text-muted-foreground sm:col-span-2">{r.detail}</p>
            </div>
          ))}
        </div>

        <div className="border-border bg-surface mt-12 border p-6">
          <h2 className="text-foreground font-semibold">Retainer and invoice billing</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Booking online is pay-per-delivery, same as any other client. If your organisation would
            rather run a monthly retainer or be invoiced instead of paying per booking, contact our
            team directly to set that up, it&apos;s handled as an offline arrangement outside the
            standard booking flow.
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
