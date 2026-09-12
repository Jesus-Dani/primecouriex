-- Moves the /track rate-limit window entirely onto Postgres's own clock.
-- The original app-side approach (compute the window cutoff from the
-- Node process's Date.now(), compare against created_at) depends on the
-- application server and database agreeing on the current time — a real
-- pitfall for a security control, not just a hypothetical one: it was
-- caught in testing when a sandboxed dev environment's system clock
-- drifted several hours from Supabase's, which silently made every
-- attempt look "outside the window" and defeated the rate limit entirely.
-- This function does the delete/insert/count in one round trip, all
-- measured by now() inside Postgres itself, so app-server clock accuracy
-- is irrelevant.
create or replace function check_track_rate_limit(
  p_ip_address text,
  p_window_minutes integer,
  p_max_attempts integer
)
returns boolean -- true = allowed, false = rate limited
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  delete from track_lookup_attempts
  where ip_address = p_ip_address
    and created_at < now() - (p_window_minutes || ' minutes')::interval;

  insert into track_lookup_attempts (ip_address) values (p_ip_address);

  select count(*) into v_count
  from track_lookup_attempts
  where ip_address = p_ip_address
    and created_at >= now() - (p_window_minutes || ' minutes')::interval;

  return v_count <= p_max_attempts;
end;
$$;
