# Prime Couriex Express Ltd
## Technical Requirements Document (TRD)
### Website & Online Booking Platform

**Version 1.0 — Final**
**26 August 2026**

*Companion document to the Product Requirements Document (PRD), v1.0.*

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack](#2-tech-stack)
3. [Data Model](#3-data-model)
4. [Pricing Calculation Logic](#4-pricing-calculation-logic)
5. [Google Maps Integration](#5-google-maps-integration)
6. [Paystack Integration](#6-paystack-integration)
7. [Admin Dashboard — Technical Requirements](#7-admin-dashboard--technical-requirements)
8. [Notification Handling (Manual, No Messaging API)](#8-notification-handling-manual-no-messaging-api)
9. [Customer Tracking Page](#9-customer-tracking-page)
10. [Security & NDPR Compliance](#10-security--ndpr-compliance)
11. [Environment & Deployment](#11-environment--deployment)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Testing & QA](#13-testing--qa)
14. [Future / Phase 2 Technical Considerations](#14-future--phase-2-technical-considerations)
15. [Appendix A: Booking Reference Number Format](#appendix-a-booking-reference-number-format)

---

## 1. Architecture Overview

A custom-built, full-stack web application, chosen over a CMS or no-code builder because the booking engine, live distance-based pricing, staff review dashboard, and payment integration all require custom logic beyond what a page builder handles well.

### 1.1 High-Level Flow

```
Customer Browser
   │
   ├── Public site (Home, Services, FAQ, Track My Booking, Price Calculator)
   ├── Booking form  ──────────────►  Next.js API routes / Server Actions
   └── Paystack checkout (optional)         │        │
                                             │        ├──► Google Maps Routes API
                                             │        │      (server-side distance lookup)
                                             │        ├──► Paystack API
                                             │        │      (payment init + webhook verify)
                                             ▼        ▼
                                      Postgres Database (bookings, status, audit log)
                                             ▲
                                             │
                                  Staff Admin Dashboard (auth-protected)
                                  Approve / Reject / Mark Notified / Update Status
```

### 1.2 Deployment Topology

- Frontend + API routes: single Next.js app deployed on Vercel.
- Database: managed serverless Postgres (e.g. Neon or Supabase), reachable from Vercel's serverless/edge functions.
- All third-party API calls (Google Maps, Paystack) happen server-side only — no secret keys are ever sent to the browser.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (React), App Router | Single codebase for public site, booking flow, and admin dashboard; strong Vercel integration. |
| Language | TypeScript | Type safety for booking/pricing data models, reduces runtime errors in money calculations. |
| Styling | Tailwind CSS | Fast to implement the white/navy brand palette responsively; pairs naturally with Next.js. |
| Database | Postgres (managed, e.g. Neon or Supabase) | Relational integrity for bookings/status/audit data; serverless-friendly connection pooling for Vercel. |
| ORM | Prisma | Type-safe queries and migrations matching the TypeScript stack. |
| Auth (staff) | Lightweight credential/session auth (e.g. NextAuth or Lucia) | Single staff role in v1 — no need for a heavyweight identity system, but designed so roles can be added later. |
| Hosting | Vercel | Client preference; best-integrated hosting for Next.js; automatic preview deployments per branch. |
| Domain / DNS | Managed by the client, separately | Client registers/owns the domain; DNS is pointed to Vercel as a dependency, not part of this build. |
| Distance/pricing | Google Maps Platform (Routes API) | Real driving-route distance; 10,000 free monthly lookups covers expected launch volume. |
| Payments | Paystack | Card + bank transfer, standard choice for Nigerian businesses; webhook-based server-side verification. |

---

## 3. Data Model

### 3.1 Booking

```
Booking {
  id                        uuid, primary key
  reference_number          string, unique  // e.g. PCX-2026-000123
  service_type              enum  // process_serving | registry_liaison |
                                  //   corporate_courier | same_day_delivery |
                                  //   filing_compliance
  delivery_speed            enum  // standard | same_day | urgent_express

  // Contact & routing
  customer_name             string
  company_name              string?
  phone                     string
  whatsapp_number           string
  email                     string
  pickup_address            string
  pickup_lat / pickup_lng   float   // captured from Maps geocoding
  pickup_contact_name       string
  pickup_contact_phone      string
  delivery_address          string
  delivery_lat / delivery_lng float
  recipient_name            string
  recipient_phone           string

  // Package details
  package_description       text
  weight_kg                 float
  package_count              int
  delivery_instructions     text?
  preferred_pickup_date     date
  preferred_delivery_date   date?
  additional_notes          text?

  // Legal / process-serving fields (nullable unless service_type = process_serving)
  legal_court_name          string?
  legal_suit_case_number    string?
  legal_process_document    text?
  legal_client_address      string?
  legal_company_name        string?
  legal_landmark            string?
  return_copy_addon         boolean, default false

  // Pricing (all computed & stored at submission time — never recalculated later)
  distance_km               float
  base_price                integer  // NGN, kobo-free integer
  urgent_surcharge          integer, default 0
  addon_total                integer, default 0
  total_price                integer

  // Payment
  payment_status            enum  // unpaid | paid | refunded
  paystack_reference        string?

  // Review / workflow
  status                     enum  // pending_review | confirmed | rejected |
                                   //   in_transit | delivered | cancelled
  rejection_reason           text?
  notified_at                timestamp?
  notified_by_staff_id       uuid?
  confirmed_by_staff_id      uuid?

  // Consent / NDPR
  client_confirmation_accepted  boolean  // liability/accuracy checkbox
  data_consent_accepted         boolean
  data_consent_timestamp        timestamp

  created_at                 timestamp
  updated_at                 timestamp
}
```

### 3.2 Supporting Tables

- **StaffUser** — id, name, email, password_hash (or auth provider id), created_at. Single role in v1; add a `role` column now (default 'staff') so future role-based permissions don't require a schema migration.
- **BookingStatusHistory** — id, booking_id, from_status, to_status, changed_by_staff_id, note, created_at. Provides the audit trail needed for NDPR accountability and internal dispute resolution.
- **PricingConfig** — key/value settings (rate_per_km, minimum_charge, urgent_surcharge, return_copy_addon_fee), so the business can adjust pricing figures without a code deployment. Seed with the values locked in the PRD: ₦540/km, ₦5,000 minimum, ₦5,000 urgent surcharge, ₦3,500 return-copy add-on.

---

## 4. Pricing Calculation Logic

```
function calculatePrice(pickup, delivery, deliverySpeed, returnCopyAddon, config):
    distanceKm = googleMaps.getDrivingDistanceKm(pickup, delivery)

    basePrice = max(distanceKm * config.rate_per_km, config.minimum_charge)

    surcharge = 0
    if deliverySpeed == 'urgent_express':
        surcharge = config.urgent_surcharge   # flat ₦5,000

    addon = 0
    if returnCopyAddon:
        addon = config.return_copy_addon_fee  # flat ₦3,500

    total = basePrice + surcharge + addon

    return { distanceKm, basePrice, surcharge, addon, total }
```

- Pricing is computed once, at submission time, and stored on the booking record — it is never silently recalculated later, so a customer's price cannot drift after they've seen and accepted it.
- Weight and package count are captured but intentionally excluded from the pricing formula, per the PRD.
- All money values are stored as whole Naira integers (no floating-point currency math).

---

## 5. Google Maps Integration

- Address input uses Google Places Autocomplete, restricted to Nigeria (and ideally biased to an FCT bounding box) to improve match quality and reduce bad geocodes.
- Route distance is fetched server-side via the Routes API (Compute Routes / Route Matrix), never from the browser, so the API key used for billing-sensitive calls is never exposed client-side.
- A separate, HTTP-referrer-restricted browser key is used only for the Places Autocomplete widget.
- Fallback for addresses Google Maps cannot confidently geocode: the booking still submits, price is marked "to be confirmed," and staff calculate/confirm it manually during the review step — this prevents a bad address from blocking submission entirely.
- Usage against the 10,000 free monthly lookups should be monitored (e.g. a simple monthly counter or Google Cloud budget alert) so the business is notified before any paid usage is incurred.

---

## 6. Paystack Integration

- Paystack Inline (popup) checkout is triggered optionally at the end of the booking flow — payment is never required to submit.
- Payment confirmation must be verified server-side via Paystack's webhook (or a server-side verify-transaction call), not trusted from the client redirect alone, to prevent spoofed "payment successful" states.
- `paystack_reference` and `payment_status` are stored on the booking record.
- No automated refund flow in v1 — if a paid booking is rejected/cancelled, staff process the refund manually from the Paystack dashboard. Document this as an internal runbook step, referenced from the Terms and Conditions' refund policy language.

---

## 7. Admin Dashboard — Technical Requirements

- Route group protected by authentication middleware; unauthenticated requests redirect to a staff login page.
- Single staff role in v1 — the auth check only needs to confirm "is an authenticated staff user," but the StaffUser table includes a `role` column from day one to avoid a breaking migration when permissions are introduced later.
- Booking queue view: filterable by status, service type, and date range; each row shows reference number, customer name, service type, status, and submitted time.
- Booking detail view: every field submitted (including conditional legal fields), computed pricing breakdown, and payment status.
- Actions available from the detail view: Approve, Reject (reason required, free text), Mark as Notified (with channel/notes), and manual status transitions (In Transit, Delivered, Cancelled).
- Every status change writes a BookingStatusHistory row with the acting staff user and timestamp.
- Contact details (phone, WhatsApp, email) and the reference number are displayed prominently on the detail view, with one-click copy, to support the manual notification workflow.

---

## 8. Notification Handling (Manual, No Messaging API)

No SMS/WhatsApp/email sending integration (e.g. Termii, Twilio) is built in v1 — this is a deliberate scope decision, not a gap. All customer-facing notifications are sent by staff directly from their own phone/email/WhatsApp, using the contact details and reference number the dashboard surfaces.

- The dashboard's "Mark as Notified" action should let staff record which channel(s) they used and an optional note, purely for internal tracking — it does not trigger any outbound message itself.
- This keeps v1 scope smaller and avoids messaging-API costs and deliverability complexity; automated notification via Termii or Twilio is a defined Phase 2 candidate (see Section 14).

---

## 9. Customer Tracking Page

- Public, unauthenticated route (e.g. `/track`): accepts a booking reference number and returns only the current status (Pending Review / Confirmed / Rejected / In Transit / Delivered) — no other booking fields are exposed.
- Rate-limit this endpoint (e.g. by IP) to prevent brute-force enumeration of reference numbers.
- Consider requiring a second light factor (e.g. the phone number on the booking) alongside the reference number, to reduce the risk of a guessed reference number exposing even status-only information to the wrong person.

---

## 10. Security & NDPR Compliance

### 10.1 Technical Controls

- HTTPS enforced everywhere (default on Vercel).
- Database connections encrypted in transit; rely on the managed Postgres provider's encryption at rest.
- Admin dashboard fully authenticated; no public API route returns booking PII beyond the limited status exposed by the Track My Booking endpoint.
- Secrets (database URL, Google Maps server key, Paystack secret key, auth secret) stored as Vercel environment variables, never committed to source control.

### 10.2 NDPR Process Requirements

- Explicit, timestamped consent capture (`data_consent_accepted`, `data_consent_timestamp`) at booking submission — required for demonstrable NDPR compliance.
- A defined data retention period for booking records (including legal case details); recommend an initial default of 24 months from booking completion, configurable, with a scheduled job to anonymize or purge records past that window. The exact retention period is a business policy decision the client should confirm, but does not block initial build — it is implemented as a configurable value.
- A named Data Protection Officer contact published in the Privacy Policy page (content requirement, tracked in the PRD).
- A documented breach notification process (operational runbook, referenced from the Privacy Policy) — not a code deliverable, but the engineering team should be aware of it for incident response.
- BookingStatusHistory (Section 3.2) doubles as an access/change audit trail supporting NDPR accountability requirements.

---

## 11. Environment & Deployment

### 11.1 Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (pooled, for serverless). |
| `GOOGLE_MAPS_SERVER_KEY` | Server-side key for Routes API distance lookups. Never exposed to the browser. |
| `GOOGLE_MAPS_CLIENT_KEY` | Browser key for Places Autocomplete, restricted by HTTP referrer. |
| `PAYSTACK_SECRET_KEY` | Server-side key for payment initialization and webhook verification. |
| `PAYSTACK_PUBLIC_KEY` | Client-side key for the Paystack Inline checkout widget. |
| `AUTH_SECRET` | Session/JWT signing secret for staff authentication. |

### 11.2 Deployment Pipeline

- Vercel project connected to the project's git repository; pushes to the main branch auto-deploy to production.
- Every pull request gets an automatic Vercel preview deployment, serving as a staging environment for review before merge.
- Database migrations (Prisma) run as an explicit deploy step, not automatically on every request.
- Domain: the client manages DNS registration separately; once available, the domain is added in Vercel and pointed via the client's DNS provider — tracked as an external dependency, not a build task.

---

## 12. Non-Functional Requirements

- Mobile-first, fully responsive design — booking is expected to happen from phones as much as desktops.
- Baseline accessibility target: WCAG 2.1 AA for the public site and booking flow.
- Performance target: sub-3-second initial load on a typical mobile connection; Lighthouse performance score of 90+ as a guideline.
- Browser support: current versions of Chrome, Safari, Firefox, and Edge; no legacy IE support required.
- English-only interface (per PRD Section 15).
- Uptime relies on Vercel's platform SLA; no separate infrastructure redundancy is required for v1 given the current scale.

---

## 13. Testing & QA

- Unit tests for the pricing calculation function (Section 4) — this is money-handling logic and should be tested against the worked examples in the PRD (Section 10.4) plus edge cases: zero/negative distance, minimum-charge boundary, urgent + return-copy stacking.
- Integration tests covering booking submission → database write → admin dashboard visibility → status transitions → BookingStatusHistory logging.
- Manual QA checklist: Paystack sandbox end-to-end payment flow (success, failure, and webhook delivery), Google Maps fallback behavior for an ungeocodable address, and the Track My Booking flow with a valid and an invalid reference number.
- Accessibility pass against the WCAG 2.1 AA target before launch (automated tooling plus a manual keyboard-navigation check of the booking form).

---

## 14. Future / Phase 2 Technical Considerations

These correspond to the PRD's deferred-scope items (PRD Section 17) and are noted here so the v1 architecture doesn't have to be reworked to accommodate them later:

- Automated messaging integration (Termii recommended for Nigerian deliverability, or Twilio) to replace the manual notification workflow — the StaffUser/BookingStatusHistory model already supports adding a `notification_log` table without disruption.
- Automated Paystack refund triggering from the admin dashboard.
- Role-based permissions — the `role` column reserved on StaffUser (Section 7) is ready for this.
- Interstate delivery pricing and coverage logic, once scoped.
- A corporate client portal with saved addresses, booking history, and invoice-based billing.
- Internationalization (i18n) setup if a second language (e.g. Hausa) is added.

---

## Appendix A: Booking Reference Number Format

Format: `PCX-YYYY-NNNNNN` — e.g. `PCX-2026-000123`. `PCX` identifies the company, `YYYY` is the booking year, and `NNNNNN` is a zero-padded sequential (or randomly generated, collision-checked) six-digit number. Generated at submission time and guaranteed unique at the database level via a unique constraint.
