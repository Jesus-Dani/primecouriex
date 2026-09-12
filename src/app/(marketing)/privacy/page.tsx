import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy | Prime Couriex Express",
  description:
    "How Prime Couriex Express Ltd collects, uses, and protects your personal data, in line with the NDPR.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground space-y-8 [&_h2]:font-[family-name:var(--font-heading)] [&_h2]:text-lg [&_h2]:font-semibold [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <p className="text-muted-foreground">
            Prime Couriex Express Ltd (&quot;we&quot;, &quot;us&quot;) is committed to protecting
            your personal data in accordance with the Nigeria Data Protection Regulation (NDPR).
            This policy explains what we collect when you use this site, why, and how it&apos;s
            protected.
          </p>

          <div>
            <h2>1. What we collect</h2>
            <p>When you submit a booking, we collect:</p>
            <ul>
              <li>Your name, company name (if applicable), phone, WhatsApp number, and email</li>
              <li>Pickup and delivery addresses and contact details for both ends</li>
              <li>Package/document description, weight, and item count</li>
              <li>
                For process-serving bookings: court name, suit/case number, the process to be
                served, and related case details
              </li>
              <li>
                Payment status and a Paystack transaction reference, if you choose to pay online
              </li>
            </ul>
            <p>We do not accept file or document uploads on this site.</p>
          </div>

          <div>
            <h2>2. Why we collect it</h2>
            <p>
              We use this information solely to review, confirm, and fulfil your booking, to contact
              you about its status, and to calculate and confirm the price. Legal case details are
              used only to support accurate process serving.
            </p>
          </div>

          <div>
            <h2>3. Consent</h2>
            <p>
              Before submitting a booking, you are asked to explicitly consent to this processing.
              That consent, along with the date and time it was given, is recorded against your
              booking.
            </p>
          </div>

          <div>
            <h2>4. Who we share it with</h2>
            <p>
              Your data is not sold or shared for marketing. It is processed by our staff to fulfil
              your booking, and by the third-party services this site runs on: Paystack (for payment
              processing, if you choose to pay online) and our database/hosting providers. These
              providers process data on our behalf and are not permitted to use it for their own
              purposes.
            </p>
          </div>

          <div>
            <h2>5. How long we keep it</h2>
            <p>
              Booking records, including legal case details, are retained for 24 months from the
              completion of the booking, after which they are anonymised or deleted. This period may
              be adjusted from time to time as our policies develop.
            </p>
          </div>

          <div>
            <h2>6. Your rights</h2>
            <p>
              Under the NDPR, you can ask us what personal data we hold about you, request a
              correction, or request deletion, subject to any legal or contractual reason we may
              need to retain it (for example, an active or recent booking). Contact us using the
              details below to exercise any of these rights.
            </p>
          </div>

          <div>
            <h2>7. Data breaches</h2>
            <p>
              If a data breach affecting your personal data occurs, we follow an internal incident
              response process and will notify affected individuals and the relevant regulator where
              required by the NDPR.
            </p>
          </div>

          <div>
            <h2>8. Data Protection Officer</h2>
            <p>
              Our Data Protection Officer can be reached at{" "}
              <span className="text-foreground font-medium">
                [DPO contact to be confirmed — placeholder]
              </span>
              . Until this contact is confirmed, direct any data protection queries to{" "}
              <a
                href="mailto:support.primecouriex.ng@gmail.com"
                className="text-brand-text underline"
              >
                support.primecouriex.ng@gmail.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2>9. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Changes take effect when posted here.
            </p>
          </div>

          <div>
            <h2>10. Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
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
