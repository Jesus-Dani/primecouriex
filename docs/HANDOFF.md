# Handoff — Prime Couriex Express

Status as of this document: Phases 1–4, 6, 7, and 8 (QA) are complete and
live against the current Supabase project. Phase 5 (Paystack payment) is
the one deliberately deferred piece — see "What's not done" below.

This is a launch-readiness summary. It does not replace `docs/PRD.md`,
`docs/TRD.md`, or `docs/UI_DESIGN_BRIEF.md` (the locked requirements), or
the "Architecture note" sections in `README.md` (the detailed technical
record of every deviation from those documents and why). Read this
alongside those, not instead of them.

## What's built

- **Public site**: Home, About, Services, Abuja Service Areas, Booking,
  Contact, FAQ, Corporate, Terms, Privacy, Track My Booking — 11 of the
  12 pages from PRD §5.1/§8. The 12th, a standalone Delivery Price
  Calculator, was removed per client instruction as redundant with the
  Abuja Service Areas page's per-district pricing and the booking form's
  own live estimate — see README's calculator architecture note.
- **Booking flow**: all 5 service types from PRD §7.1 (process serving,
  registry liaison, corporate courier, same-day delivery, filing &
  compliance — PRD §5.1's summary text says "four service types" but its
  own §7.1 table lists five; the build follows §7.1, and this discrepancy
  is in the client's locked PRD itself, not something introduced during
  the build), with conditional legal/case fields shown only for process
  serving, and NDPR consent capture (`client_confirmation_accepted`,
  `data_consent_accepted`, both required, timestamped at submission).
- **Pricing**: flat-rate by pickup district, not distance — see
  README's "pricing model, 'for now'" architecture note. This was an
  explicit client instruction mid-build, not a technical shortcut. The
  original distance-based engine (`src/lib/pricing.ts`) is untouched and
  still unit-tested, so reverting is a real option if the client
  reconsiders.
- **Staff admin dashboard**: authenticated (Supabase Auth), booking queue
  filterable by status/service type/date range, full booking detail view
  including conditional legal fields, Approve/Reject (reason required)/
  Mark In Transit/Mark Delivered/Cancel/Mark as Notified actions, each
  writing to `booking_status_history` as an audit trail.
- **Public tracking**: `/track?ref=...` returns only status (no other
  booking fields), rate-limited 10 lookups/15 minutes/IP via a Postgres
  function so the limit can't be defeated by app-server/database clock
  drift — see README's tracking architecture note.
- **Accessibility & performance QA** (this phase): automated axe-core
  audit (0 violations, WCAG 2.1/2.2 A+AA rules) across all 13 public/
  auth pages; manual keyboard-only navigation and form-completion pass
  on the booking form (full tab order reachable, native focus rings
  present, no keyboard traps); Lighthouse mobile audit on 6 key pages —
  100/100 accessibility, 100/100 best practices, 100/100 SEO, and
  93–99/100 performance (target was 90+) after fixing two real, minor
  issues found along the way (undersized footer links, a missing
  `<main>` landmark on the standalone staff login page).
- **NDPR**: consent capture (above), a 24-month retention statement and
  named-DPO section in the Privacy Policy (DPO contact is an explicit,
  clearly-marked placeholder — see "Open items" below), a documented
  breach-notification paragraph, and `booking_status_history` doubling
  as the access/change audit trail per TRD §10.2.

## What's not done

- **Paystack payment (PRD §11, TRD §6)** — deliberately deferred to
  last, per explicit client instruction during the build ("keep going
  and come back to Paystack at the end"). Every booking is currently
  created with `payment_status: "unpaid"` and no payment step; this is
  an honest incomplete state, not a broken one — nothing references
  Paystack in application code yet, and the env var placeholders in
  `.env.example` are unfilled. This is the next piece of work.
- **Google Maps distance pricing (PRD §10.1, TRD §5)** — dormant, not
  wired into the live booking flow, since pricing was switched to the
  district-rate model per client instruction. `GOOGLE_MAPS_SERVER_KEY`/
  `NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY` are unfilled placeholders. No
  action needed unless the client asks to revert pricing models.
- **Automated retention purge (TRD §10.2)** — the Privacy Policy commits
  to a 24-month retention period, but no scheduled job enforces it yet.
  TRD §10.2 explicitly frames this as "a business policy decision the
  client should confirm" that "does not block initial build," so this
  was left as a launch-readiness item rather than guessed at. Needs: the
  client's sign-off on the exact retention window, then a scheduled job
  (Vercel Cron → a Server Action or route handler calling a Postgres
  function, following the same pattern as `check_track_rate_limit`) that
  anonymizes or deletes bookings past that window.
- **DPO contact (PRD §14.2)** — placeholder text in the Privacy Policy
  pending the client naming an actual contact.

## Environment variables required at launch

See `.env.example` for the full list with descriptions. Everything
except the Google Maps and Paystack keys is already live and working
against the current Supabase project. Before going live, Vercel needs:

| Variable | Status |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Live |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Live |
| `SUPABASE_SERVICE_ROLE_KEY` | Live — server-only, never expose to the browser |
| `GOOGLE_MAPS_SERVER_KEY` / `NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY` | Not provisioned — only needed if pricing reverts to distance-based |
| `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Not provisioned — needed for Phase 5 |

## Database

Postgres via Supabase, no ORM (see README's Supabase-vs-Prisma
architecture note). Migrations live in `supabase/migrations/`, applied
manually through the Supabase SQL Editor in order — there's no CLI-linked
`supabase db push` in this workflow, so any new migration needs to be run
by hand against the live project the same way as `0001`–`0006`.

Every table has RLS enabled with no anon/authenticated policies
(default-deny); all real access goes through Server Actions/Route
Handlers using the service-role key. This is the actual authorization
boundary, not RLS — see README's Supabase architecture note for why.

## Staff accounts

No public sign-up. Provision staff with:

```bash
npm run create-staff-user -- "staff@example.com" "a-strong-password" "Full Name"
```

## Deployment

Vercel, using `--webpack` for both dev and build (this dev machine's
Application Control policy blocks the native Turbopack binary — see
README). `next build --webpack` and `next dev --webpack` are already set
in `package.json`; no changes needed for Vercel, which uses its own build
environment regardless.

## Before going live — remaining checklist

- [ ] Client decision + implementation on Phase 5 (Paystack).
- [ ] Client confirmation of the data retention window + purge job
      implementation (see "What's not done").
- [ ] Real DPO contact to replace the Privacy Policy placeholder.
- [ ] Domain DNS pointed at Vercel (external dependency, tracked in TRD
      §11.2 — not a build task).
- [ ] Manual QA pass once Paystack is live: TRD §13's sandbox
      success/failure/webhook checklist (not yet run, since Paystack
      isn't integrated yet).
- [ ] **Revisit before real customer data is in the system**: staff
      sign-up at `/admin/login?mode=signup` is open to anyone, no
      invitation needed — a deliberate client request that reverses
      TRD §7's original single-provisioned-role control. Worth
      reconfirming with the client before launch, since the dashboard
      exposes every customer's contact details and legal case
      information. See README's "Staff accounts" section for exactly
      what to change if it needs tightening.
