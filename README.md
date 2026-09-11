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
- Not yet built: the booking form and price calculator (Phase 4) will need
  a district picker once they're built, not free-text address entry for
  pricing purposes — addresses are still needed for the courier, just no
  longer for the price itself.

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

Apply the SQL in `supabase/migrations/`, in order (`0001_init.sql`, then
`0002_district_rates.sql`), and then `supabase/seed.sql`, via the Supabase
SQL Editor (or `supabase db push` / `psql` if you have the Supabase CLI
linked or a direct connection string). There's no Prisma migration step —
these are plain Postgres DDL/DML files.

## Staff accounts

There's no public staff sign-up (TRD §7 — a single, business-provisioned
role in v1). Create staff accounts with:

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
