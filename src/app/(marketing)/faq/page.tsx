import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "FAQ | Prime Couriex Express",
  description:
    "Answers to common questions about pricing, booking, payment, coverage, and confidentiality.",
};

const FAQS = [
  {
    q: "How is pricing calculated?",
    a: "Price is based on the district you're picking up from, plus a flat surcharge for urgent/express delivery and an optional return-copy add-on for legal bookings. Use the price calculator for an instant estimate before you book, with no obligation.",
  },
  {
    q: "How quickly will my booking be reviewed?",
    a: "Every booking is reviewed by a member of our team, typically within 1 hour. You'll see your booking reference immediately on submission, and we'll follow up directly by phone, WhatsApp, or email once it's reviewed.",
  },
  {
    q: "Do I need to pay upfront?",
    a: "No. Payment via card or bank transfer is optional at the point of booking. You can submit a booking without paying, and settle later.",
  },
  {
    q: "What areas do you cover?",
    a: "The Federal Capital Territory, Abuja, in full, from the Central Business District out to Kwali and Gwagwalada. See our Abuja Service Areas page for the full district list. We don't currently offer interstate delivery.",
  },
  {
    q: "How do you handle confidentiality?",
    a: "Legal and corporate documents are handled discreetly throughout, from pickup to delivery. Our Privacy Policy sets out how we collect, use, and protect personal data in line with the Nigeria Data Protection Regulation (NDPR).",
  },
  {
    q: "What if I entered the wrong address or contact details?",
    a: "Please double-check everything before submitting; by confirming your booking, you're confirming the details are accurate. We can't be held responsible for a failed delivery caused by incorrect information, so it's worth a second look before you book.",
  },
  {
    q: "Can I track my delivery?",
    a: "Yes. Every booking gets a unique reference number (format PCX-YYYY-NNNNNN) shown immediately on submission. Use it on our Track My Booking page to check current status at any time.",
  },
  {
    q: "What if my booking is rejected?",
    a: "We'll contact you directly to explain why and discuss next steps. If you'd already paid, refunds for rejected or cancelled bookings are processed manually by our team.",
  },
  {
    q: "Do you offer accounts or a corporate portal?",
    a: "Not yet in this version of the site. Corporate and institutional clients book the same way as any other customer; retainer or invoice billing arrangements remain an offline conversation with our team.",
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="Can't find what you're looking for? Contact us and we'll answer directly."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="border-border divide-border divide-y border-t">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="text-foreground flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="text-muted-foreground ml-4 shrink-0 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="text-muted-foreground mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
