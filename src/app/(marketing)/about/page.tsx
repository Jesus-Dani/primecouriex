import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "About Us | Prime Couriex Express",
  description:
    "Prime Couriex Express Ltd is a legal and corporate logistics provider serving the Federal Capital Territory, Abuja.",
};

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
            Prime Couriex Express Ltd was built around that responsibility. We serve individuals and
            self-represented litigants who need a process served quickly and correctly, law firms
            and practitioners who need fast, repeat bookings ahead of court deadlines, and corporate
            and institutional clients who need their documents and packages moved securely under
            their own name.
          </p>
          <p>
            Every booking is reviewed by a member of our team, typically within an hour, and every
            price is calculated upfront and shown before you commit. There&apos;s no account to
            create and no app to download; you book, we confirm, and you can check status any time
            with your reference number.
          </p>
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
