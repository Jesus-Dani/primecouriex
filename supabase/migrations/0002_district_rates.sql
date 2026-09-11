-- District-based flat-rate pricing — client-directed override of PRD §10.1/
-- Appendix A, which had explicitly retired this exact rate sheet in favor of
-- distance-based Google Maps pricing. Kept "for now" per the client's own
-- wording: calculatePriceFromDistance (src/lib/pricing.ts) and its config
-- are left in place, untouched, so reverting is a config swap, not a rebuild.
--
-- total_client_fee is not stored: it is always standard_fee + return_copy_
-- addon_fee when the return-copy add-on is selected, so storing it would
-- just be a derived value that could drift out of sync.
--
-- rider_rate is the business's internal cost (source doc: "NOT FOR CLIENT
-- DISTRIBUTION") — never render it in customer-facing UI. It exists here for
-- potential internal/admin-dashboard use only.
--
-- standard_fee / return_copy_addon_fee are nullable: Zuba and Abaji have no
-- confirmed client-facing figures in the source document (see seed.sql for
-- specifics) and must price as "on request" rather than a guessed number.
create table district_rates (
  id                     uuid primary key default gen_random_uuid(),
  district               text not null unique,
  rider_rate             integer,
  standard_fee           integer,
  return_copy_addon_fee  integer,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create trigger district_rates_set_updated_at
before update on district_rates
for each row execute function set_updated_at();

-- Same authorization model as every other table (see 0001_init.sql): RLS on,
-- no anon/authenticated policies. The public price calculator and booking
-- form read this through a server-side Route Handler using the service-role
-- key, not direct client access.
alter table district_rates enable row level security;
