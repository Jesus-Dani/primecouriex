import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Contact | Prime Couriex Express",
  description:
    "Get in touch with Prime Couriex Express Ltd for calls, WhatsApp, legal inquiries, and general support.",
};

const CHANNELS = [
  {
    label: "Calls",
    value: "+234 907 053 5182",
    href: "tel:+2349070535182",
    detail: "General enquiries and booking support.",
  },
  {
    label: "WhatsApp",
    value: "+234 813 700 3223",
    href: "https://wa.me/2348137003223",
    detail: "Message us directly for a quick response.",
  },
  {
    label: "Legal inquiries",
    value: "info.legalcouriex.ng@gmail.com",
    href: "mailto:info.legalcouriex.ng@gmail.com",
    detail: "Process serving and legal document services.",
  },
  {
    label: "General support",
    value: "support.primecouriex.ng@gmail.com",
    href: "mailto:support.primecouriex.ng@gmail.com",
    detail: "Courier, corporate, and booking support.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        intro="Whatever you need, one of these channels will get you a real person. Bookings are reviewed within 1 hour during business hours."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="border-border divide-border grid divide-y border-t sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {CHANNELS.map((c) => (
            <div key={c.label} className="py-6 sm:px-6">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                {c.label}
              </p>
              <a
                href={c.href}
                className="text-foreground mt-2 block font-[family-name:var(--font-heading)] text-lg font-semibold hover:underline"
              >
                {c.value}
              </a>
              <p className="text-muted-foreground mt-1 text-sm">{c.detail}</p>
            </div>
          ))}
        </div>

        <div className="border-border bg-surface mt-12 border p-6">
          <h2 className="text-foreground font-semibold">Social</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            X (Twitter):{" "}
            <a
              href="https://x.com/Prime_CourieX"
              className="text-brand-text underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Prime_CourieX
            </a>
            {" · "}
            Instagram:{" "}
            <a
              href="https://instagram.com/primecouriex_express"
              className="text-brand-text underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              primecouriex_express
            </a>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/booking"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
          >
            Book a Service
          </Link>
        </div>
      </section>
    </>
  );
}
