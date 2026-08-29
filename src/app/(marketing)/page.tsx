import Link from "next/link";
import { HeroGraphic } from "@/components/site/hero-graphic";
import { PlaceholderBlock } from "@/components/site/placeholder-block";

const FLAGSHIP_SERVICES = [
  {
    title: "Process Serving & Legal Documents",
    detail:
      "Service of court processes, demand letters, and statutory notices, with court name, suit number, and case details captured at booking — nothing operationally useful is lost moving online.",
    href: "/services",
  },
  {
    title: "Corporate & Institutional Courier",
    detail:
      "General courier services for corporate and institutional clients, booked the same way as any other service — no account or portal required in this version of the site.",
    href: "/services",
  },
];

const OTHER_SERVICES = [
  {
    title: "Registry Liaison & Document Retrieval",
    detail:
      "Coordination and retrieval of documents from government and registry offices on your behalf.",
  },
  {
    title: "Same-day Document Delivery",
    detail:
      "Standard courier delivery of documents and packages within the FCT, same-day turnaround.",
  },
  {
    title: "Filing & Compliance",
    detail: "Assistance with filing and compliance-related document delivery.",
  },
];

const WHO_WE_SERVE = [
  {
    title: "Individual & legal clients",
    detail:
      "Book process serving quickly, see the cost upfront, and know exactly what our confidentiality and liability terms cover.",
  },
  {
    title: "Law firms & practitioners",
    detail:
      "Fast, repeat bookings ahead of court deadlines, with the full court and case metadata your process requires.",
  },
  {
    title: "Corporate & institutional clients",
    detail:
      "Book courier and registry liaison services under your organisation's name, no account required.",
  },
];

const FACTS = [
  { value: "₦540/km", label: "Transparent, distance-based pricing" },
  { value: "1 hour", label: "Standard booking review time" },
  { value: "5", label: "Service lines, one booking flow" },
  { value: "FCT", label: "Full coverage across Abuja" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Book",
    detail: "Tell us what needs to move and where. See an instant price estimate as you go.",
  },
  {
    step: "02",
    title: "We review",
    detail: "Our team confirms your booking — within 1 hour, as standard.",
  },
  {
    step: "03",
    title: "Delivered",
    detail: "Check progress any time with your reference number, until it's done.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-foreground font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
              We deliver documents. <span className="text-brand-text">You get results.</span>
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg">
              Reliable, discreet, time-sensitive delivery of legal and corporate documents across
              the Federal Capital Territory — reviewed within 1 hour, priced by real driving
              distance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
              >
                Book a Service
              </Link>
              <Link
                href="/track"
                className="border-brand-text text-brand-text hover:bg-surface rounded-[var(--radius-control)] border px-6 py-3 font-semibold"
              >
                Track a Delivery
              </Link>
            </div>
            <p className="text-muted-foreground mt-8 text-sm">
              Confidential handling · Reviewed within 1 hour · FCT-wide coverage
            </p>
          </div>

          <HeroGraphic />
        </div>
      </section>

      <section className="border-border border-y">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <p className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
                {fact.value}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
          What we <span className="text-brand-text">deliver</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Five service lines, one booking flow — pick a service and we&apos;ll show the right fields
          for it.
        </p>

        <div className="mt-12 space-y-16">
          {FLAGSHIP_SERVICES.map((service, i) => (
            <div
              key={service.title}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <PlaceholderBlock />
              <div>
                <h3 className="text-foreground font-[family-name:var(--font-heading)] text-xl font-semibold">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mt-3">{service.detail}</p>
                <Link
                  href={service.href}
                  className="text-brand-text mt-4 inline-block font-semibold hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="border-border divide-border mt-16 divide-y border-t">
          {OTHER_SERVICES.map((service) => (
            <div key={service.title} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
              <h3 className="text-foreground font-semibold">{service.title}</h3>
              <p className="text-muted-foreground sm:col-span-2">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Built for law firms, individuals & corporate clients
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {WHO_WE_SERVE.map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm opacity-85">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
              How it <span className="text-brand-text">works</span>
            </h2>
            <div className="border-border divide-border mt-8 divide-y border-t">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="flex items-start gap-6 py-6">
                  <span className="text-brand-text font-[family-name:var(--font-heading)] text-2xl font-bold">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-foreground font-semibold">{item.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border bg-surface rounded-[var(--radius-card)] border p-8">
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-xl font-semibold">
              Track your delivery
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your booking reference to check its current status.
            </p>
            <form action="/track" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="home-track-ref" className="sr-only">
                Booking reference number
              </label>
              <input
                id="home-track-ref"
                name="ref"
                type="text"
                placeholder="e.g. PCX-2026-000123"
                className="border-border bg-background text-foreground placeholder:text-placeholder-foreground focus-visible:ring-focus-ring w-full rounded-[var(--radius-control)] border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-primary-foreground shrink-0 rounded-[var(--radius-control)] px-5 py-3 text-sm font-semibold"
              >
                Track Now
              </button>
            </form>
            <p className="text-muted-foreground mt-4 text-xs">
              Need help instead?{" "}
              <Link href="/contact" className="text-brand-text underline">
                Contact our team
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
