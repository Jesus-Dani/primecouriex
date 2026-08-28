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
  client variants and what each is for.

Everything else in the PRD/TRD (pricing rules, data model fields, booking
flow, page list, security/NDPR requirements) is unchanged.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real Supabase/Maps/Paystack values
npm run dev                  # http://localhost:3000
npm run test                 # vitest
npm run lint
npm run build
```

## Database setup

Apply the SQL in `supabase/migrations/0001_init.sql` and then
`supabase/seed.sql` via the Supabase SQL Editor (or `supabase db push` /
`psql` if you have the Supabase CLI linked or a direct connection string).
There's no Prisma migration step — these are plain Postgres DDL/DML files.

## Project structure

- `src/app/(marketing)/` — public content pages (Home, About, Services, …)
- `src/app/booking/` — the online booking flow
- `src/app/admin/` — staff dashboard (auth-protected)
- `src/app/track/` — public booking-status lookup
- `src/components/{ui,site,booking,admin}/` — shared UI, split by area
- `src/lib/supabase/` — Supabase client helpers (see architecture note above)
- `supabase/migrations/`, `supabase/seed.sql` — database schema and seed data
- `docs/` — PRD, TRD, UI Design Brief (source of truth for scope/requirements)
