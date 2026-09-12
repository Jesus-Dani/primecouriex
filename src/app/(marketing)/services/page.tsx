import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Services | Prime Couriex Express",
  description:
    "Process serving, registry liaison, corporate courier, same-day delivery, and filing & compliance services across the FCT, Abuja.",
};

const SERVICES = [
  {
    slug: "process_serving",
    title: "Process Serving & Legal Document Services",
    detail:
      "Service of court processes, demand letters, statutory notices, and other legal documents. Court name, suit/case number, the process to be served, and any relevant landmark are captured at booking, so nothing your existing paper-based workflow needs is lost moving online. A return-copy add-on is available if you need a signed copy brought back to you.",
  },
  {
    slug: "registry_liaison",
    title: "Registry Liaison & Document Retrieval",
    detail:
      "Coordination and retrieval of documents from government and registry offices on your behalf, so you don't have to make the trip yourself.",
  },
  {
    slug: "corporate_courier",
    title: "Corporate & Institutional Courier",
    detail:
      "General courier services for corporate and institutional clients. Booked the same way as any other service, no account or portal required for this version of the site.",
  },
  {
    slug: "same_day_delivery",
    title: "Same-day Document Delivery",
    detail:
      "Standard courier delivery of documents and packages within the FCT, with same-day turnaround.",
  },
  {
    slug: "filing_compliance",
    title: "Filing & Compliance",
    detail: "Assistance with filing and compliance-related document delivery.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Five service lines, one booking flow"
        intro="Pick a service below and we'll take you straight into the booking form with the right fields for it."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="border-border divide-border divide-y border-t">
          {SERVICES.map((service) => (
            <div key={service.slug} className="py-8">
              <h2 className="text-foreground font-[family-name:var(--font-heading)] text-xl font-semibold">
                {service.title}
              </h2>
              <p className="text-muted-foreground mt-3">{service.detail}</p>
              <Link
                href={`/booking?service=${service.slug}`}
                className="text-brand-text mt-4 inline-block font-semibold hover:underline"
              >
                Book this service →
              </Link>
            </div>
          ))}
        </div>

        <div className="border-border bg-surface mt-12 border p-6">
          <h2 className="text-foreground font-semibold">Not sure which service you need?</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Check the price for your district on our{" "}
            <Link href="/service-areas" className="text-brand-text underline">
              Abuja Service Areas
            </Link>{" "}
            page, or contact us and we&apos;ll point you in the right direction.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/service-areas"
              className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-5 py-2.5 text-sm font-semibold"
            >
              Check Pricing
            </Link>
            <Link
              href="/contact"
              className="border-brand-text text-brand-text hover:bg-background rounded-[var(--radius-control)] border px-5 py-2.5 text-sm font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
