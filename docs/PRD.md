# Prime Couriex Express Ltd
## Product Requirements Document (PRD)
### Website & Online Booking Platform

**Version 1.0 — Final**
**26 August 2026**

*Status: All requirements locked and confirmed prior to drafting.*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Source Reconciliation](#2-background--source-reconciliation)
3. [Goals & Success Criteria](#3-goals--success-criteria)
4. [Target Users](#4-target-users)
5. [Scope](#5-scope)
6. [Branding & Company Identity](#6-branding--company-identity)
7. [Services & Coverage](#7-services--coverage)
8. [Website Information Architecture](#8-website-information-architecture)
9. [Booking Flow — Field Specification](#9-booking-flow--field-specification)
10. [Pricing & Delivery Price Calculator](#10-pricing--delivery-price-calculator)
11. [Payments](#11-payments)
12. [Booking Review, Confirmation & Notification Workflow](#12-booking-review-confirmation--notification-workflow)
13. [Customer Self-Service Tracking](#13-customer-self-service-tracking)
14. [Admin / Staff Dashboard Requirements](#14-admin--staff-dashboard-requirements)
15. [Content Requirements](#15-content-requirements)
16. [Assumptions & Dependencies](#16-assumptions--dependencies)
17. [Future / Phase 2 Candidates](#17-future--phase-2-candidates)
18. [Open Items](#18-open-items)
19. [Appendix A: Reconciliation of the Internal Rate Sheet](#appendix-a-reconciliation-of-the-internal-rate-sheet)

---

## 1. Executive Summary

Prime Couriex Express Ltd requires a new public website with an integrated online booking system covering its four core service lines — process serving and legal document services, registry liaison and document retrieval, corporate and institutional courier services, and same-day document delivery — within the Federal Capital Territory (FCT), Abuja.

The platform replaces manual/offline booking intake with a self-service flow that calculates distance-based delivery pricing automatically, routes every booking through a staff review step (target: within one hour), and supports optional upfront payment via Paystack — while preserving the legal rigor (court/case metadata, liability disclaimers, confidentiality commitments) that the company's existing process-serving workflow requires.

This document defines **what** is being built and why. The companion Technical Requirements Document (TRD) defines **how** it will be built. Both are final: every open question and source-material conflict identified during discovery was resolved with the business owner before drafting began (see Section 2 and the project's Decisions Log).

---

## 2. Background & Source Reconciliation

This PRD was developed from four source materials that did not fully agree with one another: a client discovery questionnaire, the company's existing (paper/form-based) legal booking form, an Internal Rate Sheet, and the company's Terms and Conditions document. The material conflicts below were identified and resolved directly with the business owner before any requirement was finalized.

| Conflict identified | Resolution locked in |
|---|---|
| Pricing: questionnaire described ₦540/km distance pricing; Internal Rate Sheet showed a flat per-district fee table with different totals. | Distance-based pricing via Google Maps is the system of record. The Internal Rate Sheet's flat-fee model is retired and out of scope for this build. |
| Coverage: questionnaire said FCT-only; T&C document and old booking form both reference interstate service. | Interstate is explicitly out of scope for v1. The T&C document will be revised to remove the interstate reference so legal text matches the live site. |
| Branding: T&C header reads "Prime Couriex Express Ltd"; the old form's welcome text reads "Legal Couriex Express Limited." | "Prime Couriex Express Ltd" is the single official name used everywhere on the new site. |
| Document uploads: primary questionnaire answer said no uploads; a separate stray answer mentioned "Word documents." | No uploads anywhere in the booking flow. Customers describe documents/packages in text fields only. |
| Service taxonomy: questionnaire used Standard/Same-day/Urgent-Express; old form used Standard/Express/Interstate/Filing & Compliance. | Booking form separates "Service type" (what) from "Delivery speed" (how fast) as two independent fields — see Section 9. |
| Legal booking fields: questionnaire listed only Court name + Case details; the existing form collects a longer, more detailed field set. | The full existing field set is retained — nothing operationally useful is dropped. |

---

## 3. Goals & Success Criteria

### 3.1 Goals

- Enable all four core services to be booked online end-to-end, with zero staff data entry required to capture a request.
- Give customers an accurate, trustworthy price estimate before and during booking, using real driving-route distance rather than a rough estimate.
- Preserve the ~1 hour (or sooner) review-and-contact commitment as a visible, stated promise to customers, not just an internal target.
- Retain every field the current legal/process-serving paper process requires, so no operational or evidentiary detail is lost in the move online.
- Handle all customer personal data and legal case data in a way that is demonstrably NDPR-compliant.

### 3.2 Success Metrics (indicative — to be tracked post-launch)

- Booking completion rate (started vs. submitted bookings).
- Average time from submission to staff confirmation, measured against the 1-hour target.
- Percentage of bookings requiring staff to call the customer for missing/incorrect information.
- Delivery price calculator usage → booking conversion rate.
- Paystack payment completion rate for bookings that opt to pay upfront.

---

## 4. Target Users

| User type | Primary need |
|---|---|
| Individual / self-represented legal clients | Book process serving quickly, understand cost upfront, trust that confidentiality and liability terms are clear. |
| Law firms & legal practitioners | Fast repeat bookings ahead of court deadlines; accurate court/case metadata capture; a paper trail via service reports (existing offline process, unchanged by this site). |
| Corporate & institutional clients | Book courier and registry liaison services under the company name; understand this is a guest-flow booking in v1 (no account/portal yet). |
| Prime Couriex staff (reviewers) | See every incoming booking clearly, approve/reject with a reason, and have the customer's contact details and reference number on hand to notify them manually. |

---

## 5. Scope

### 5.1 In Scope (v1)

- Public website: Home, About, Services, Abuja Service Areas, Delivery Price Calculator, Online Booking, Contact, FAQ, Corporate Clients/Partners, Terms and Conditions, Privacy Policy, Track My Booking.
- Online booking flow for all four service types, with conditional legal/process-serving fields.
- Distance-based pricing engine (Google Maps) with a public standalone calculator and a live in-flow calculation.
- Optional payment at booking time via Paystack (card + bank transfer).
- Staff admin dashboard: booking queue, approve/reject with reason, mark-as-notified tracking, manual status updates.
- Manual (non-automated) email, WhatsApp, and SMS confirmation workflow, supported by the dashboard.
- Customer self-service booking status tracker (by reference number).
- NDPR-compliant data handling: consent capture, retention policy, and a Privacy Policy reflecting them.

### 5.2 Explicitly Out of Scope (v1)

- Interstate delivery booking (quote-only or unavailable — not on this site).
- Document/file uploads of any kind.
- Customer accounts, saved addresses, or a corporate billing portal (retainer/invoice billing remains an offline arrangement).
- Testimonials section (no real testimonials exist yet; not launching with placeholders).
- Automated SMS/WhatsApp/email sending via a messaging API (Termii/Twilio) — all customer notification is manual in v1.
- Automated Paystack refunds — refunds are processed manually by staff.
- Multi-language support (English only for v1).
- Role-based staff permissions (single staff role for v1).

---

## 6. Branding & Company Identity

- Official legal/brand name used everywhere on the site: **Prime Couriex Express Ltd**.
- Logo: existing client asset, supplied for this build.
- Brand colors: **white and navy blue**.

| Channel | Value | Role |
|---|---|---|
| Phone | +234 907 053 5182 | General calls |
| Phone / WhatsApp | +234 813 700 3223 | WhatsApp contact |
| Email | info.legalcouriex.ng@gmail.com | Legal / process-serving inquiries |
| Email | support.primecouriex.ng@gmail.com | General courier & booking support |
| X (Twitter) | @Prime_CourieX | Social |
| Instagram | primecouriex_express | Social |

---

## 7. Services & Coverage

### 7.1 Bookable Services

| Service type | Description |
|---|---|
| Process Serving & Legal Document Services | Service of court processes, demand letters, statutory notices, and other legal documents, with court/case metadata captured at booking. |
| Registry Liaison & Document Retrieval | Coordination and retrieval of documents from government/registry offices on the client's behalf. |
| Corporate & Institutional Courier | General courier services for corporate and institutional clients, booked the same way as any other service (no separate account required in v1). |
| Same-day Document Delivery | Standard courier delivery of documents/packages within FCT, same-day turnaround. |
| Filing & Compliance Service | Assistance with filing and compliance-related document delivery, retained from the existing service form. |

### 7.2 Delivery Speed Options

- **Standard** — base distance-based price, no surcharge.
- **Same-day** — base distance-based price, no surcharge (delivered same day, no separate speed premium).
- **Urgent / Express** — base distance-based price plus a flat ₦5,000 surcharge for expedited handling.

### 7.3 Coverage Area

All areas within the Federal Capital Territory (FCT), Abuja. No locations are excluded. Interstate delivery is not offered on this site (see Section 5.2). The "Abuja Service Areas" content page should list recognizable FCT districts (e.g. Central Business District, Garki, Wuse, Wuse II, Maitama, Asokoro, Guzape, Gwarinpa, Kubwa, Lugbe, and similar) as illustrative coverage — this is informational content only and does not drive pricing, since pricing is calculated live by distance for the specific addresses entered.

---

## 8. Website Information Architecture

| Page | Purpose / key content |
|---|---|
| Home | Value proposition, core services overview, coverage area, calls-to-action to Book Now and Get an Instant Quote. |
| About | Company background and positioning as a legal and corporate logistics provider emphasizing secure, confidential, professional handling. |
| Services | Detail on all five bookable service types (Section 7.1), each linking into the booking flow pre-selected. |
| Abuja Service Areas | Illustrative list of FCT districts covered; clarifies coverage without implying district-based pricing. |
| Delivery Price Calculator | Standalone instant-estimate tool (Section 10.4); no booking commitment required to use it. |
| Online Booking | The full booking form (Section 9). |
| Track My Booking | Reference-number lookup showing current booking status (Section 13). |
| Contact | All contact channels from Section 6, with roles labeled (calls / WhatsApp / legal inquiries / general support). |
| FAQ | Answers drafted from company materials and this requirements process — e.g. pricing, review timing, payment, coverage, confidentiality. |
| Corporate Clients / Partners | Drafted content introducing the corporate/institutional client offering (no real client names/logos at launch). |
| Terms and Conditions | Revised version of the existing T&C (interstate reference removed, see Section 2). |
| Privacy Policy | NDPR-compliant policy per Section 14.2. |

---

## 9. Booking Flow — Field Specification

### 9.1 Standard Fields (all bookings)

| Field | Required? |
|---|---|
| Service type (select) | Yes |
| Delivery speed: Standard / Same-day / Urgent-Express (select) | Yes |
| Customer full name | Yes |
| Company / organisation name | No |
| Phone number | Yes |
| WhatsApp number | Yes |
| Email address | Yes |
| Pickup address | Yes |
| Pickup contact name & phone | Yes |
| Delivery address | Yes |
| Recipient name & phone | Yes |
| Document / package description (text) | Yes |
| Weight | Yes (does not affect price) |
| Number of documents / packages | Yes |
| Delivery instructions | No |
| Preferred pickup date | Yes |
| Preferred delivery date | No |
| Additional / other relevant information | No |
| Return Copy Add-on (checkbox, legal bookings only, +₦3,500) | No — optional |

### 9.2 Additional Fields — Legal / Process-Serving Bookings Only

Shown conditionally when Service type = Process Serving & Legal Document Services. Retained in full from the existing legal booking form:

- Court name
- Suit / case number
- Process / document to be served (text description — no upload)
- Client address
- Company name (if applicable)
- Landmark (if applicable)

### 9.3 Submission Requirements

- No file/document uploads anywhere in the flow.
- Before submitting, the client must check a confirmation box affirming the supplied information is accurate and accepting that Prime Couriex Express is not liable for an unsuccessful service caused by incorrect address or other details — carried forward from the existing form.
- A required NDPR consent checkbox for processing personal data must also be presented and recorded with a timestamp (Section 14.2).
- On successful submission, a unique booking reference number is generated immediately and shown to the customer on-screen and by email.

---

## 10. Pricing & Delivery Price Calculator

### 10.1 Pricing Model

- Distance-based pricing calculated from the real driving route between the pickup and delivery addresses, via Google Maps.
- Base rate: **₦540 per kilometre**.
- Minimum charge: **₦5,000**, applied to the base distance fee only.
- Package weight and document/package count do not affect price.

### 10.2 Delivery Speed Pricing

- Standard: base distance fee, as calculated.
- Same-day: base distance fee, no surcharge.
- Urgent / Express: base distance fee + ₦5,000 flat surcharge.

### 10.3 Optional Add-on

- Return Copy Add-on (legal bookings only): flat ₦3,500, stacked on top of the base fee and any surcharge.

### 10.4 Worked Examples

| Scenario | Distance | Base fee | Surcharge | Add-on | Total |
|---|---|---|---|---|---|
| Standard delivery, Wuse to Garki (short trip) | 3 km | ₦5,000 (floor) | ₦0 | ₦0 | ₦5,000 |
| Urgent legal service, Maitama to Nyanya, with return copy | 22 km | ₦11,880 | ₦5,000 | ₦3,500 | ₦20,380 |

### 10.5 Standalone Delivery Price Calculator

A public tool, accessible without starting a booking, where a customer enters pickup and delivery addresses and delivery speed to see an instant estimated price. The same calculation logic is reused live inside the actual booking form once a customer proceeds to book.

---

## 11. Payments

- Payment methods: card and bank transfer, both via Paystack.
- Payment is optional at the point of booking — a booking can be submitted without payment.
- If a paid booking is later rejected or cancelled, refunds are processed manually by staff directly through the Paystack dashboard; no automated in-app refund flow exists in v1. The refund policy and expected timeframe are documented in the Terms and Conditions.

---

## 12. Booking Review, Confirmation & Notification Workflow

### 12.1 Status Lifecycle

1. **Submitted** — customer completes and submits the booking form; reference number is generated immediately.
2. **Pending Review** — booking appears in the staff admin dashboard, awaiting review (target: within 1 hour, displayed to the customer as a stated commitment).
3. **Confirmed or Rejected** — staff approve the booking, or reject it with a reason recorded in the dashboard.
4. **In Transit** — staff manually update status once the booking is being fulfilled.
5. **Delivered** — staff manually mark the booking complete.

### 12.2 Notification Approach

All customer notifications — email, WhatsApp, and SMS — are sent manually by staff, not through an automated messaging integration. The admin dashboard surfaces the customer's phone, WhatsApp number, and email, plus the booking reference number, so staff can message them directly and then mark the booking as "notified" for internal tracking.

The same manual approach applies to rejected bookings: staff record the rejection reason in the dashboard, then contact the customer directly to explain the outcome and next steps.

---

## 13. Customer Self-Service Tracking

A public "Track My Booking" page lets a customer enter their booking reference number to see current status (Pending Review / Confirmed / Rejected / In Transit / Delivered). No other booking details are exposed through this lookup, to protect customer privacy and prevent reference-number enumeration from revealing sensitive information.

---

## 14. Admin / Staff Dashboard Requirements

### 14.1 Functional Requirements

- Login-protected dashboard, single staff role for v1 (no differentiated permission levels yet).
- Booking queue with filtering by status, service type, and date.
- Booking detail view surfacing every field submitted, including conditional legal fields.
- Actions: Approve, Reject (with a required reason), Mark as Notified, and manual status updates through the lifecycle in Section 12.1.
- Clear, prominent display of the customer's contact channels and reference number to support the manual notification workflow.

### 14.2 NDPR & Privacy Requirements

- Explicit consent capture at booking submission, recorded with a timestamp.
- A defined data retention policy for booking records, including legal case details.
- A named Data Protection Officer contact point published in the Privacy Policy.
- A documented breach notification process, referenced from the Privacy Policy.
- Access to booking data restricted to authenticated staff only — no public API or page exposes customer PII beyond the limited status shown on the Track My Booking page.

---

## 15. Content Requirements

- About, Services, and FAQ copy is drafted directly from the company profile, service descriptions, the Terms and Conditions document, and every decision locked during this requirements process — no separate copywriting phase is needed.
- Corporate Clients/Partners section: drafted introductory content, not real client testimonials or logos (none exist yet).
- Testimonials section is excluded from v1 entirely — no placeholder or generic testimonials are used.
- Terms and Conditions: revised from the existing document to remove the interstate service reference and confirm the branding/name (Section 2).
- Privacy Policy: newly drafted, NDPR-compliant (Section 14.2).
- All content is in English only.

---

## 16. Assumptions & Dependencies

- The domain name is registered and managed by the client separately from this build; DNS will be pointed to the hosting provider (see TRD).
- The client supplies the existing logo and confirms the white/navy blue brand palette for design.
- A Google Maps Platform account and API key, and a Paystack merchant account, will be provisioned by the client (or on the client's behalf) before integration work begins.
- No hard launch date or budget ceiling has been set; the full locked scope in this document is being built without a phase-driven cut of features.

---

## 17. Future / Phase 2 Candidates

The following were explicitly deferred, not rejected, and can be scoped as follow-on work once v1 is live:

- Interstate delivery booking and pricing.
- Automated WhatsApp/SMS/email notifications via a messaging API (e.g. Termii or Twilio).
- Automated Paystack refunds.
- Corporate client accounts with saved details, booking history, and/or invoice-based billing.
- Testimonials section, once real client testimonials are collected.
- Role-based staff permissions, as the team grows beyond a single reviewing role.
- Multi-language support (e.g. Hausa).

---

## 18. Open Items

> **None.** All decisions required to build this PRD and its companion TRD were reviewed and locked with the business owner prior to drafting. The full decision record is maintained in the project's Decisions Log.

---

## Appendix A: Reconciliation of the Internal Rate Sheet

The Internal Rate Sheet ("NOT FOR CLIENT DISTRIBUTION") documented a flat per-district fee model that has been superseded by the distance-based pricing engine in this PRD (Section 10). It is retained here only for historical reference and is not used by the live pricing system:

- The sheet listed Rider Rate (internal cost), Standard Fee, Return Copy Add-on, and Total Client Fee per FCT district, with totals ranging from ₦8,500 (e.g. CBD, Garki, Wuse) up to ₦25,000 (Gwagwalada).
- Abaji was marked "Quotation" with no fixed rate.
- The source document listed "Dei-Dei" twice and appeared to be missing pricing for "Zuba." Since this table is out of scope for the new site, these data issues do not need to be corrected as part of this project.
