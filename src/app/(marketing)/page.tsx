import Link from "next/link";
import {
  Building2,
  Clock3,
  FileText,
  Gavel,
  MapPinned,
  PackageCheck,
  Search,
  ShieldCheck,
} from "lucide-react";
import { HeroGraphic } from "@/components/site/hero-graphic";

const TRUST_STRIP = [
  {
    icon: ShieldCheck,
    label: "Confidential",
    detail: "Legal and corporate documents handled discreetly, start to finish.",
  },
  {
    icon: Clock3,
    label: "Reviewed fast",
    detail: "Every booking is reviewed and confirmed within an hour.",
  },
  {
    icon: MapPinned,
    label: "FCT-wide",
    detail: "Every district across the Federal Capital Territory, Abuja.",
  },
];

const WHY_CHOOSE_US = [
  {
    icon: MapPinned,
    title: "FCT-wide coverage",
    detail: "Every district across the Federal Capital Territory, Abuja.",
  },
  {
    icon: Clock3,
    title: "Reviewed within 1 hour",
    detail: "A staff member confirms every booking fast — not next-day.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential handling",
    detail: "Court documents and corporate records handled discreetly.",
  },
  {
    icon: Search,
    title: "Upfront, transparent pricing",
    detail: "Real driving-distance pricing, shown before you book.",
  },
];

const SERVICES = [
  {
    icon: Gavel,
    title: "Process Serving & Legal Documents",
    detail:
      "Court processes, demand letters, and statutory notices, with court/case details captured at booking.",
  },
  {
    icon: Building2,
    title: "Registry Liaison & Document Retrieval",
    detail:
      "Coordination and retrieval of documents from government and registry offices on your behalf.",
  },
  {
    icon: PackageCheck,
    title: "Corporate & Institutional Courier",
    detail: "General courier services for corporate and institutional clients across Abuja.",
  },
  {
    icon: Clock3,
    title: "Same-day Document Delivery",
    detail:
      "Standard courier delivery of documents and packages within the FCT, same-day turnaround.",
  },
  {
    icon: FileText,
    title: "Filing & Compliance",
    detail: "Assistance with filing and compliance-related document delivery.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Book",
    detail: "Tell us what needs to move and where. See an instant price estimate as you go.",
  },
  {
    step: "2",
    title: "We review",
    detail: "Our team confirms your booking — within 1 hour, as standard.",
  },
  {
    step: "3",
    title: "Delivered",
    detail: "Check progress any time with your reference number, until it's done.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-brand-text font-semibold tracking-wide uppercase">
              Legal courier &amp; process serving — FCT, Abuja
            </p>
            <h1 className="text-foreground mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
              We deliver documents. You get results.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg">
              Reliable, discreet, time-sensitive delivery of legal and corporate documents across
              the Federal Capital Territory. Reviewed within 1 hour, priced by real driving
              distance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="bg-primary hover:bg-primary-hover text-primary-foreground focus-visible:ring-focus-ring rounded-[var(--radius-control)] px-6 py-3 font-semibold focus-visible:ring-2 focus-visible:outline-none"
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

            <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {TRUST_STRIP.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="text-brand-text mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-foreground font-semibold">{label}</dt>
                    <dd className="text-muted-foreground text-sm">{detail}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <HeroGraphic />
            <p className="text-placeholder-foreground mt-2 text-xs">
              Placeholder illustration — real Abuja courier photography to be sourced before launch
              (see UI_DESIGN_BRIEF.md §6).
            </p>

            <div className="border-border bg-card mt-6 rounded-[var(--radius-card)] border p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">
                Why clients choose us
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {WHY_CHOOSE_US.map(({ icon: Icon, title, detail }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="bg-surface flex size-9 shrink-0 items-center justify-center rounded-full">
                      <Icon className="text-brand-text size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{title}</p>
                      <p className="text-muted-foreground text-sm">{detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface border-border border-y">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:pt-24">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
            What we deliver
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Five service lines, one booking flow — pick a service and we&apos;ll show the right
            fields for it.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, detail }) => (
              <div
                key={title}
                className="border-border bg-card rounded-[var(--radius-card)] border p-6 shadow-[var(--shadow-card)]"
              >
                <span className="bg-surface flex size-11 items-center justify-center rounded-full">
                  <Icon className="text-brand-text size-5" aria-hidden="true" />
                </span>
                <h3 className="text-foreground mt-4 font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm">{detail}</p>
                <Link
                  href="/services"
                  className="text-brand-text mt-3 inline-block text-sm font-semibold hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-brand-text text-sm font-semibold tracking-wide uppercase">
              How it works
            </p>
            <h2 className="text-foreground mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
              Simple, secure, reliable.
            </h2>
            <ol className="mt-8 space-y-6">
              {HOW_IT_WORKS.map(({ step, title, detail }) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {step}
                  </span>
                  <div>
                    <p className="text-foreground font-semibold">{title}</p>
                    <p className="text-muted-foreground text-sm">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-primary text-primary-foreground rounded-[var(--radius-card)] p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">
              Track your delivery
            </h2>
            <p className="mt-2 text-sm opacity-90">
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
                className="placeholder:text-placeholder-foreground text-foreground focus-visible:ring-focus-ring w-full rounded-[var(--radius-control)] bg-white px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-50 text-primary shrink-0 rounded-[var(--radius-control)] px-5 py-3 text-sm font-semibold hover:bg-white"
              >
                Track Now
              </button>
            </form>
            <p className="mt-4 text-xs opacity-80">
              Need help instead?{" "}
              <Link href="/contact" className="underline">
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
