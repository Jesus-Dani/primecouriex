# Prime Couriex Express — Website & Online Booking Platform

Next.js (App Router) + TypeScript application for Prime Couriex Express Ltd:
public marketing site, online booking flow with distance-based pricing,
optional Paystack payment, staff admin dashboard, and public booking
tracking. Built against `docs/PRD.md` and `docs/TRD.md` (locked
requirements) and `docs/UI_DESIGN_BRIEF.md` (visual direction).

## Architecture note — deviation from TRD §2/§3/§7

The TRD originally specified **Prisma + Postgres (Neon/Supabase) +
NextAuth/Lucia**. Partway through Phase 1, the client requested using the
**Supabase JS SDK** directly instead — this was flagged as a conflict with
the locked TRD and explicitly approved before proceeding. The actual stack:

- **Database**: Supabase Postgres, accessed entirely through
  `@supabase/supabase-js` (no Prisma). Schema lives as plain SQL migrations
  in `supabase/migrations/`, not a Prisma schema.
- **Auth**: Supabase Auth (`@supabase/ssr`) for staff login/session, not
  NextAuth/Lucia.
- **Authorization model**: every table has Row Level Security enabled with
  no policies for the `anon`/`authenticated` roles (default-deny). All real
  reads/writes — booking submission, admin dashboard, public tracking — go
  through Next.js Server Actions/Route Handlers using the Supabase
  **service role key**, which is never sent to the browser. This keeps the
  TRD §10.1 requirement ("no public API exposes PII beyond limited status")
  true regardless of the DB access library.
- See `src/lib/supabase/{client,server,admin,middleware}.ts` for the four
  client variants and what each is for. Route protection and session
  refresh live in `src/proxy.ts` (Next.js 16 renamed the "middleware" file
  convention to "proxy" — note it must live under `src/`, not the project
  root, given this project's `src/` directory layout).

Everything else in the PRD/TRD (data model fields, booking flow, page list,
security/NDPR requirements) is unchanged.

## Architecture note — pricing model, "for now"

PRD §2/§10.1/Appendix A explicitly retired `docs/Internal_Rate_Sheet.docx`'s
flat per-district fee table in favor of distance-based Google Maps pricing.
The client has since asked to switch back to that rate sheet as the active
pricing source "for now" (Google Maps API keys aren't provisioned yet
either, so distance-based pricing can't run regardless). Both engines exist
side by side so switching back later is a config change, not a rebuild:

- `src/lib/pricing.ts` — the original distance-based engine (TRD §4),
  untouched, still fully tested.
- `src/lib/pricing-district.ts` — the active engine. Flat per-district
  `standard_fee` + `return_copy_addon_fee` (`supabase/migrations/
0002_district_rates.sql`, seeded from the rate sheet) instead of a
  distance formula. The flat ₦3,500 return-copy add-on from PRD §10.3 is
  superseded too — the rate sheet prices it per-district, from ₦3,500 up to
  ₦12,500. The urgent-express surcharge is untouched (still a flat ₦5,000
  on top, from `pricing_config` — the rate sheet doesn't address delivery
  speed).
- **Zuba and Abaji have no confirmed client-facing fee** in the source
  document (its own note: Zuba's fees "need to be set before this row can
  be corrected"; Abaji is "Quotation" with no fixed rate). Both are seeded
  with `standard_fee`/`return_copy_addon_fee` as `null` and price as
  "on request" (`priceOnRequest: true`) rather than a guessed number — the
  same pattern already used for the Google Maps fallback case.
- `rider_rate` on `district_rates` is the business's internal cost (source
  doc: "NOT FOR CLIENT DISTRIBUTION"). Never render it in customer-facing
  UI; it's there only for potential internal/admin-dashboard use.
- The booking form (Phase 4) uses a pickup-district dropdown for pricing,
  plus separate free-text pickup/delivery address fields for the courier —
  client confirmed pricing is based on the pickup district specifically,
  not delivery or an address-driven lookup.

## Architecture note — standalone price calculator removed

PRD §5.1/§10.5 specs a standalone Delivery Price Calculator page in
addition to the in-flow booking-form estimate. The client asked for it to
be removed as redundant: the Abuja Service Areas page already lists a
starting price per district, and the booking form shows the exact price
live before submission, so a third place calculating the same number
added a page without adding information. Removed `/calculator`
(`src/app/(marketing)/calculator/`) and its `PriceCalculatorForm`
component, and updated every page that linked to it (Services,
Service Areas, FAQ, Terms, nav) to point at Service Areas or the booking
form instead. The booking form's own live estimate is untouched.

## Architecture note — Supabase JS type-inference limits

`@supabase/supabase-js`'s automatic row-type inference for `.from(table)`
has a real, reproducible limit: once the `Database` type has enough tables
(and `bookings`, by far the widest Row type here, is consistently the one
that breaks), specific queries silently resolve to `never` instead of their
real row type — no type error points at the actual cause, just a confusing
"property does not exist on type never" at the call site. Worked around
case by case:

- `.select()` queries: `.returns<T>()` explicitly overrides the inferred
  type (the library's own documented escape hatch). See
  `src/lib/get-urgent-surcharge.ts` and the district/booking lookups in
  `src/app/booking/actions.ts` and `src/app/booking/confirmation/[ref]/page.tsx`.
- `.insert()` has no equivalent override for its input type. The insert
  payload is instead built as a variable explicitly typed against the real
  `BookingRow` interface (so field-name typos are still caught), then
  passed through a narrowly-scoped type assertion on the table accessor —
  see the comment in `src/app/booking/actions.ts`.

If you add more tables and hit this again elsewhere, the fix is the same
pattern, not a deeper investigation.

## Architecture note — public tracking page rate limiting

The `/track` page (PRD §13, TRD §9) looks up a booking's status by reference
number with no authentication, so it's rate-limited by IP to prevent
brute-force enumeration of reference numbers: 10 attempts per 15-minute
window, tracked in a `track_lookup_attempts` table
(`supabase/migrations/0005_track_lookup_attempts.sql`).

The check itself runs as a single Postgres function,
`check_track_rate_limit` (`supabase/migrations/0006_track_rate_limit_function.sql`),
called via `.rpc()` from `src/lib/track-booking.ts`, rather than as separate
delete/insert/count calls from the app server comparing against a
JS-computed timestamp. That's a deliberate fix for a real bug found in
development: the original implementation computed the window cutoff with
`new Date(Date.now() - WINDOW_MINUTES * 60_000)` in the app server and
compared it against `created_at` values written by Postgres. In this dev
sandbox those two clocks drifted by several hours, which silently made
every attempt look like it was outside the window — the cleanup step wiped
every row on every call, and the count check never matched anything, so
rate limiting never triggered, with no error anywhere. Doing the whole
prune/insert/count sequence inside a Postgres function, measured entirely
by the database's own `now()`, removes the app-server clock from the
equation. This isn't just a workaround for a quirky sandbox — a rate limit
that silently stops working under any clock drift is a real weakness for a
security control, so the fix is the correct design generally, not a local
patch.

`.rpc()` hits the same `@supabase/supabase-js` type-inference limit
described above (its `Args` generic collapses rather than picking up the
function's declared argument types), so it's called through the same
narrowly-typed intermediate-assertion pattern used for `.insert()`.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real Supabase/Maps/Paystack values
npm run dev                  # http://localhost:3000
npm run test                 # vitest
npm run lint
npm run build
```

`dev`/`build` run on webpack, not Turbopack. On some locked-down Windows
machines, an Application Control / antivirus policy blocks the native
`@next/swc-win32-x64-msvc` binary Turbopack requires (no WASM fallback
exists for Turbopack); webpack mode falls back to the WASM SWC compiler
automatically and just works. If your machine doesn't have that
restriction and you want the faster Turbopack dev server, use
`npm run dev:turbo` instead.

## Database setup

Apply the SQL in `supabase/migrations/`, in order (`0001_init.sql`,
`0002_district_rates.sql`, `0003_booking_pickup_district.sql`,
`0004_booking_notification_fields.sql`), and then `supabase/seed.sql`, via
the Supabase SQL Editor (or `supabase db push` / `psql` if you have the
Supabase CLI linked or a direct connection string). There's no Prisma
migration step — these are plain Postgres DDL/DML files.

If a query starts failing right after applying a migration with an error
like `Could not find the '<column>' column of '<table>' in the schema
cache`, that's PostgREST's schema cache being stale, not a real problem —
it refreshes automatically within a short while (or reload it immediately
from the Supabase dashboard, or via `NOTIFY pgrst, 'reload schema';` in the
SQL Editor if you have a moment to spare).

## Architecture note — admin dashboard

Built per TRD §7/§8: a filterable booking queue, a detail view with every
field (including conditional legal fields) and the computed pricing
breakdown, and the review actions (Approve, Reject-with-reason, manual
status transitions, Mark as Notified). Two things worth knowing:

- **No dark mode.** UI_DESIGN_BRIEF.md §5 called out the admin dashboard
  specifically as the priority dark-mode surface, but the client's earlier
  "stick to only one theme" instruction (which removed dark mode sitewide)
  supersedes that — the dashboard uses the same single light theme as the
  public site.
- **Every action is its own Server Action, and each one re-checks auth
  itself** (`requireStaffId()` in `.../orders/[id]/actions.ts`) rather
  than relying solely on the middleware/proxy redirect. Server Actions can
  be invoked directly, not only through the rendered page, so per this
  project's established model (see the Supabase architecture note above)
  the action itself is the real authorization boundary.
- `notified_channel`/`notified_note` aren't logged to
  `booking_status_history` — "notified" isn't one of the `status` enum
  values (TRD's history requirement is specifically about `status`
  transitions), so `bookings.notified_at`/`notified_by_staff_id`/
  `notified_channel`/`notified_note` are the audit record for that action.

### Multi-page layout (not in PRD/TRD)

Client asked for the dashboard to grow beyond the single booking queue: a
collapsible sidebar (persists collapsed/expanded via localStorage, off-canvas
drawer below the `xl` breakpoint — `src/components/admin/sidebar.tsx`), and
customer contact info surfaced more directly rather than only on the
booking detail page. Five pages now live under `src/app/admin/(dashboard)/`:

- **Dashboard** (`/admin`) — summary counts (pending review, booked
  today/this week, total) and a recent-bookings list. New landing page
  after login; the booking queue itself moved to...
- **All Orders** (`/admin/orders`, was the dashboard root) — same
  filterable queue as before, now also showing phone/email inline instead
  of only the customer's name. `/admin/orders/[id]` is the unchanged
  booking detail page (moved from `/admin/bookings/[id]`).
- **All Customers** (`/admin/customers`) — there's no customers table
  (PRD §5.2 puts customer accounts out of scope), so this derives one row
  per distinct email across all bookings, using the most recent booking's
  contact fields for display. Clicking a customer's booking count links to
  Orders pre-filtered by that email (`?customer=<email>`).
- **Staff** (`/admin/staff`) — lists `staff_users`, relevant now that
  sign-up is open (see "Staff accounts" below) so anyone with access can
  see who else has it.
- **Pricing** (`/admin/pricing`) — the district rate card and urgent
  surcharge, previously editable only through Supabase directly. Inline
  per-row Server Actions (`src/app/admin/(dashboard)/pricing/actions.ts`);
  blank fields save as `null` ("price on request"), matching the existing
  `district_rates` convention, rather than coercing to 0.

## Architecture note — installable PWA (not in PRD/TRD)

The client asked for the site to "feel like a progressive web app" —
installable to a phone/desktop home screen with its own icon and a
standalone window (no browser address bar), not something either locked
document specifies. Scoped deliberately to installability only, no
offline caching:

- `src/app/manifest.ts` (Next.js's native manifest file convention —
  served at `/manifest.webmanifest`), `viewport.themeColor` and
  `metadata.appleWebApp` in `src/app/layout.tsx`, plus `src/app/icon.png`
  / `src/app/apple-icon.png` / `favicon.ico` (all generated from the
  client's logo mark via `sharp`, including a maskable variant with
  safe-zone padding for Android's adaptive-icon masks).
- **No service worker, intentionally.** A caching service worker is what
  actually makes an app "feel" offline-capable, but this site's pricing
  and booking-status pages are `force-dynamic` by design specifically so
  they always reflect the live database (see the pricing and Supabase
  type-inference notes above) — caching them would reintroduce the exact
  staleness problem those `force-dynamic` exports exist to prevent. If
  offline support is wanted later, it needs to explicitly exclude every
  page that reads live pricing or booking status (`/booking`, `/track`,
  `/service-areas`) from any cache strategy, not be bolted on generically.

## Architecture note — Paystack: redirect checkout, not Inline

TRD §6 describes "Paystack Inline (popup) checkout." This uses Paystack's
redirect-based Standard Checkout instead — same card and bank transfer
support, same server-side-verification guarantee, different delivery
mechanism — for a concrete reason: Inline requires the customer's email
address in the browser to configure the popup, and the page it would run
on (`/booking/confirmation/[ref]`) is deliberately reachable by anyone who
has or guesses a reference number, with no PII shown, by design (see the
comment on that page — it already avoids re-displaying name, phone,
address, and legal case details for exactly this reason). Putting the
customer's email there for Inline would undo that.

How it works:

- `src/lib/paystack.ts` — thin fetch wrappers around Paystack's REST API
  (`/transaction/initialize`, `/transaction/verify`). No SDK dependency;
  two endpoints don't need one.
- `src/app/booking/confirmation/[ref]/actions.ts`'s `initiatePayment`
  generates a fresh Paystack reference per attempt (`<booking
reference>-<timestamp>`, since Paystack references must be unique and a
  customer might retry after abandoning a checkout), stores it on the
  booking, then redirects the browser straight to Paystack's hosted
  checkout page. The customer's email goes from the database to Paystack
  server-to-server — it's never rendered into the page.
- Paystack redirects back to the same confirmation page with a `reference`
  query param. The page verifies it server-side via `verifyTransaction()`
  before showing anything as paid (TRD §6's "never trust the client
  redirect alone").
- `src/app/api/webhooks/paystack/route.ts` is the second, asynchronous
  confirmation path — covers a customer closing the tab before the
  redirect back completes. Verifies the `x-paystack-signature` header
  (HMAC-SHA512 with the secret key) before trusting anything.
- Both paths call the same `src/lib/confirm-payment.ts`, which checks the
  transaction amount against `bookings.total_price` (not just the
  reference) before marking a booking paid, and is idempotent — whichever
  of the two paths arrives first wins, the second is a no-op.
- **`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` ends up unused.** It's only needed
  for client-side Paystack.js/Inline, which this design deliberately
  avoids. Left in `.env.example` since it's harmless and the client
  already provided it, but nothing reads it.
- No automated refunds (TRD §6) — unchanged, still a manual Paystack
  dashboard step. `paystack_reference` is shown on the admin booking
  detail page specifically so staff have what they need to find the
  transaction there.
- **Before going live**, the Paystack dashboard needs the webhook URL
  configured: `https://<production-domain>/api/webhooks/paystack`. Not
  needed for local testing — the callback-page verify path covers that on
  its own.

## Staff accounts

`/admin/login?mode=signup` lets anyone create a staff account with no
invitation or approval step — open self-service sign-up, added at the
client's explicit request.

**This is a deliberate reversal of TRD §7's "no public sign-up, single
business-provisioned role" control, made with full knowledge of the
consequence: anyone who finds `/admin/login` can grant themselves access
to the admin dashboard, which shows every customer's full contact details
and, for process-serving bookings, legal case information (court name,
suit number, parties involved).** That tradeoff was presented plainly and
chosen anyway — this isn't an oversight, and it isn't the recommended
posture for a system handling this kind of PII under NDPR. If that
changes, `src/app/admin/login/actions.ts`'s `signup` function and the
sign-up link on the login page are the two places to remove; the original
CLI-only path still works unchanged:

```bash
npm run create-staff-user -- "staff@example.com" "a-strong-password" "Full Name"
```

## Project structure

- `src/app/(marketing)/` — public content pages (Home, About, Services, …)
- `src/app/booking/` — the online booking flow
- `src/app/admin/` — staff dashboard (auth-protected)
- `src/app/track/` — public booking-status lookup
- `src/components/{ui,site,booking,admin}/` — shared UI, split by area
- `src/lib/supabase/` — Supabase client helpers (see architecture note above)
- `supabase/migrations/`, `supabase/seed.sql` — database schema and seed data
- `docs/` — PRD, TRD, UI Design Brief (source of truth for scope/requirements)
