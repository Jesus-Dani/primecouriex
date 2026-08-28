-- Prime Couriex Express — initial schema (TRD §3), adapted for Supabase Postgres.
--
-- Deviation from TRD §3/§7 (client-approved): staff credentials live in
-- Supabase's built-in auth.users, not a hand-rolled password_hash column.
-- public.staff_users is a 1:1 profile table extending auth.users with the
-- app-specific `role` field the TRD asks to reserve for future RBAC.
--
-- Authorization model: every table has Row Level Security enabled with NO
-- policies for the anon/authenticated roles — i.e. default-deny. All
-- legitimate access (booking submission, admin dashboard, public tracking)
-- goes through Next.js Server Actions/Route Handlers using the Supabase
-- service_role key, which bypasses RLS by design. RLS here is a defense-in-
-- depth backstop against a misconfigured or leaked anon-key client, not the
-- primary authorization mechanism — the primary mechanism is that no secret
-- ever reaches the browser, matching TRD §10.1.

create type service_type as enum (
  'process_serving',
  'registry_liaison',
  'corporate_courier',
  'same_day_delivery',
  'filing_compliance'
);

create type delivery_speed as enum (
  'standard',
  'same_day',
  'urgent_express'
);

create type payment_status as enum (
  'unpaid',
  'paid',
  'refunded'
);

create type booking_status as enum (
  'pending_review',
  'confirmed',
  'rejected',
  'in_transit',
  'delivered',
  'cancelled'
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- staff_users — profile row for each staff member, keyed to auth.users.
-- Single role in v1 ('staff'); `role` reserved for future RBAC (TRD §7, §14).
-- ============================================================================
create table staff_users (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null unique,
  role       text not null default 'staff',
  created_at timestamptz not null default now()
);

alter table staff_users enable row level security;

-- ============================================================================
-- bookings — TRD §3.1
-- ============================================================================
create table bookings (
  id               uuid primary key default gen_random_uuid(),
  reference_number text not null unique, -- PCX-YYYY-NNNNNN, TRD Appendix A
  service_type     service_type not null,
  delivery_speed   delivery_speed not null,

  -- Contact & routing
  customer_name         text not null,
  company_name          text,
  phone                 text not null,
  whatsapp_number       text not null,
  email                 text not null,
  pickup_address        text not null,
  pickup_lat            double precision,
  pickup_lng            double precision,
  pickup_contact_name   text not null,
  pickup_contact_phone  text not null,
  delivery_address      text not null,
  delivery_lat          double precision,
  delivery_lng          double precision,
  recipient_name        text not null,
  recipient_phone       text not null,

  -- Package details
  package_description     text not null,
  weight_kg                double precision not null,
  package_count             integer not null,
  delivery_instructions    text,
  preferred_pickup_date    date not null,
  preferred_delivery_date  date,
  additional_notes         text,

  -- Legal / process-serving fields (populated only when service_type = process_serving)
  legal_court_name        text,
  legal_suit_case_number  text,
  legal_process_document  text,
  legal_client_address    text,
  legal_company_name      text,
  legal_landmark          text,
  return_copy_addon       boolean not null default false,

  -- Pricing — computed once at submission, never silently recalculated (TRD §4).
  -- distance_km / base_price / total_price are nullable to represent the
  -- Google Maps fallback path (TRD §5): an ungeocodable address still
  -- submits, with price left null ("to be confirmed") for staff to confirm.
  distance_km      double precision,
  base_price       integer,
  urgent_surcharge integer not null default 0,
  addon_total      integer not null default 0,
  total_price      integer,

  -- Payment
  payment_status     payment_status not null default 'unpaid',
  paystack_reference text,

  -- Review / workflow
  status                 booking_status not null default 'pending_review',
  rejection_reason       text,
  notified_at            timestamptz,
  notified_by_staff_id   uuid references staff_users (id),
  confirmed_by_staff_id  uuid references staff_users (id),

  -- Consent / NDPR (PRD §9.3, §14.2)
  client_confirmation_accepted boolean not null,
  data_consent_accepted        boolean not null,
  data_consent_timestamp       timestamptz not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_status_idx on bookings (status);
create index bookings_service_type_idx on bookings (service_type);
create index bookings_created_at_idx on bookings (created_at);
create index bookings_reference_number_idx on bookings (reference_number);

create trigger bookings_set_updated_at
before update on bookings
for each row execute function set_updated_at();

alter table bookings enable row level security;

-- ============================================================================
-- booking_status_history — audit trail for NDPR accountability (TRD §3.2, §10.2)
-- ============================================================================
create table booking_status_history (
  id                   uuid primary key default gen_random_uuid(),
  booking_id           uuid not null references bookings (id) on delete cascade,
  from_status          booking_status,
  to_status            booking_status not null,
  changed_by_staff_id  uuid not null references staff_users (id),
  note                 text,
  created_at           timestamptz not null default now()
);

create index booking_status_history_booking_id_idx on booking_status_history (booking_id);

alter table booking_status_history enable row level security;

-- ============================================================================
-- pricing_config — key/value settings so pricing can change without a
-- code deploy (TRD §3.2). Seeded with locked v1 values — see supabase/seed.sql.
-- ============================================================================
create table pricing_config (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      integer not null,
  updated_at timestamptz not null default now()
);

create trigger pricing_config_set_updated_at
before update on pricing_config
for each row execute function set_updated_at();

alter table pricing_config enable row level security;
