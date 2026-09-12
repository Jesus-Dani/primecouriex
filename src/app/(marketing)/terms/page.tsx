import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Terms and Conditions | Prime Couriex Express",
  description:
    "Terms and conditions for booking Prime Couriex Express Ltd's courier and legal document services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms and Conditions" />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground space-y-8 [&_h2]:font-[family-name:var(--font-heading)] [&_h2]:text-lg [&_h2]:font-semibold [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <div>
            <h2>1. About these terms</h2>
            <p>
              These terms govern bookings made with Prime Couriex Express Ltd (&quot;we&quot;,
              &quot;us&quot;, &quot;Prime Couriex Express&quot;) through this website. By submitting
              a booking, you agree to these terms.
            </p>
          </div>

          <div>
            <h2>2. Coverage area</h2>
            <p>
              We currently operate exclusively within the Federal Capital Territory (FCT), Abuja. We
              do not offer interstate delivery on this site.
            </p>
          </div>

          <div>
            <h2>3. Booking and review</h2>
            <p>
              A booking reference number is generated immediately on submission. Every booking is
              reviewed by our team, with confirmation or rejection typically within 1 hour. If a
              booking is rejected, we will contact you directly to explain why.
            </p>
          </div>

          <div>
            <h2>4. Pricing</h2>
            <p>
              Pricing is calculated based on the district you are booking a pickup from, plus a flat
              surcharge for urgent/express delivery and an optional return-copy add-on for legal
              bookings. Package weight and item count do not affect price. Where we do not yet have
              a confirmed rate for a district, we will quote you directly before confirming the
              booking.
            </p>
            <p>
              The price shown and confirmed at booking is final and will not be silently changed
              afterward. Use the price calculator on this site for an instant, no-obligation
              estimate before booking.
            </p>
          </div>

          <div>
            <h2>5. Accuracy of information</h2>
            <p>
              You are responsible for the accuracy of the information you provide, including pickup
              and delivery addresses, contact details, and package descriptions. Prime Couriex
              Express is not liable for an unsuccessful or delayed delivery caused by incorrect or
              incomplete information supplied at booking.
            </p>
          </div>

          <div>
            <h2>6. Payment and refunds</h2>
            <p>
              Payment by card or bank transfer via Paystack is optional at the point of booking — a
              booking can be submitted and confirmed without upfront payment. If a paid booking is
              later rejected or cancelled, the refund is processed manually by our team. Contact us
              using the details on our Contact page to request a refund or check its status.
            </p>
          </div>

          <div>
            <h2>7. Confidentiality</h2>
            <p>
              Documents and packages entrusted to us, particularly legal and corporate materials,
              are handled discreetly throughout the delivery process.
            </p>
          </div>

          <div>
            <h2>8. No file uploads</h2>
            <p>
              This site does not accept document or file uploads. Describe what needs to be
              delivered in the text fields provided at booking.
            </p>
          </div>

          <div>
            <h2>9. Data protection</h2>
            <p>
              Personal data submitted at booking is handled in accordance with our{" "}
              <a href="/privacy" className="text-brand-text underline">
                Privacy Policy
              </a>{" "}
              and the Nigeria Data Protection Regulation (NDPR).
            </p>
          </div>

          <div>
            <h2>10. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. The version in effect at the time of your
              booking applies to that booking.
            </p>
          </div>

          <div>
            <h2>11. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a
                href="mailto:support.primecouriex.ng@gmail.com"
                className="text-brand-text underline"
              >
                support.primecouriex.ng@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
