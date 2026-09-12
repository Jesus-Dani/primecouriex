-- Backs the public /track lookup's IP rate limit (TRD §9 — "rate-limit
-- this endpoint... to prevent brute-force enumeration of reference
-- numbers"). A plain table rather than an external rate-limiting service
-- since no such service is provisioned (TRD §11.1's env var list has none)
-- and Postgres is already the one piece of shared state every serverless
-- invocation can see — an in-memory counter wouldn't survive across them.
create table track_lookup_attempts (
  id          uuid primary key default gen_random_uuid(),
  ip_address  text not null,
  created_at  timestamptz not null default now()
);

create index track_lookup_attempts_ip_created_idx on track_lookup_attempts (ip_address, created_at);

alter table track_lookup_attempts enable row level security;
