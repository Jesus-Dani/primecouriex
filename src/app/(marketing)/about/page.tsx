import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "About Us | Prime Couriex Express",
  description:
    "Prime Couriex Express Ltd is a legal and corporate logistics provider serving the Federal Capital Territory, Abuja.",
};

const WHO_WE_SERVE = [
  {
    title: "Individual & legal clients",
    detail:
      "If you need a court process served, a demand letter delivered, or a legal document sent with proof it arrived, you can book directly, no law firm required. You'll see the full price before you commit, and we'll ask for the same details a professional process server would want: who's being served, the address, and any landmark that makes it easier to find. Confidentiality is the default, not an add-on, and our terms are clear about what we're liable for, so there's no ambiguity about what you're getting.",
  },
  {
    title: "Law firms & practitioners",
    detail:
      "When a filing deadline is bearing down, you don't have time to explain your workflow to someone new. Book through us with the court name, suit or case number, and the exact process to be served captured upfront, the same details you're already used to providing. Repeat bookings are quick because the form asks for what matters to your practice, and every booking is reviewed within an hour so you're not left wondering whether it's moving.",
  },
  {
    title: "Corporate & institutional clients",
    detail:
      "Your organisation doesn't need an account, a procurement process, or a login to get started. Book a courier run or a registry liaison job the same way anyone else does, just under your company's name. If you'd rather work on a retainer or invoice-based billing arrangement than pay per booking, that's a conversation we have directly with your team, outside the online flow.",
  },
];

const VALUES = [
  {
    title: "Confidential",
    detail:
      "Court documents, corporate records, and personal correspondence are handled discreetly, from pickup to delivery.",
  },
  {
    title: "Reliable",
    detail:
      "Every booking is reviewed within 1 hour, and every delivery is tracked by reference number.",
  },
  {
    title: "Accountable",
    detail:
      "We record every status change and keep a clear audit trail, because legal and corporate work demands it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Legal and corporate logistics, done properly"
        intro="Prime Couriex Express Ltd delivers documents and packages across the Federal Capital Territory, Abuja, with the discretion and accountability that legal and corporate work demands."
      />

      <section className="border-border bg-surface border-y">
        <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 sm:grid-cols-[280px_1fr] sm:gap-12 sm:px-6 sm:py-16">
          <div className="mx-auto w-48 sm:mx-0 sm:w-full">
            <Image
              src="/images/founder-osawaru-patrick-otasowie.jpeg"
              alt="Osawaru Patrick Otasowie, Founder and CEO of Prime Couriex Express Ltd"
              width={960}
              height={1280}
              priority
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-start text-center sm:text-left">
            <p className="text-brand-text text-xs font-semibold tracking-[0.2em] uppercase">
              Meet the founder
            </p>
            <p className="text-foreground mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
              Osawaru Patrick Otasowie
            </p>
            <p className="text-muted-foreground mt-1 text-sm font-semibold tracking-[0.1em] uppercase">
              Founder &amp; CEO
            </p>
            <p className="text-foreground mt-5 text-base sm:text-lg">
              Prime Couriex Express Ltd is built on the standard our founder set from day one: treat
              every court process, every corporate record, and every package with the same
              discretion and accountability we&apos;d want if it were ours. That standard is what
              shapes how the team reviews, handles, and confirms every booking, from the first one
              to the most recent.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-foreground space-y-4">
          <p>
            We started with a simple observation: process serving, registry liaison, and corporate
            courier work all carry a level of responsibility that general delivery apps aren&apos;t
            built for. A missed handoff isn&apos;t just a late package, it can be a missed court
            deadline. A misdelivered envelope isn&apos;t just an inconvenience, it can be a breach
            of confidence.
          </p>
          <p>
            Prime Couriex Express Ltd was built around that responsibility, and around three kinds
            of people who all need something slightly different from a courier: individuals and
            self-represented litigants, law firms and practitioners, and corporate and institutional
            clients.
          </p>
          <p>
            Every booking is reviewed by a member of our team, typically within an hour, and every
            price is calculated upfront and shown before you commit. There&apos;s no account to
            create and no app to download; you book, we confirm, and you can check status any time
            with your reference number.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-foreground font-[family-name:var(--font-heading)] text-xl font-semibold">
            Who we serve
          </h2>
          <div className="border-border divide-border mt-6 divide-y border-t">
            {WHO_WE_SERVE.map((item) => (
              <div key={item.title} className="py-6">
                <h3 className="text-foreground font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border divide-border mt-12 divide-y border-t">
          {VALUES.map((v) => (
            <div key={v.title} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
              <h2 className="text-foreground font-semibold">{v.title}</h2>
              <p className="text-muted-foreground sm:col-span-2">{v.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/services"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
          >
            View our services
          </Link>
          <Link
            href="/contact"
            className="border-brand-text text-brand-text hover:bg-surface rounded-[var(--radius-control)] border px-6 py-3 font-semibold"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
