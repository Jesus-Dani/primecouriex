-- Locked v1 pricing values — PRD §10.1-10.3, TRD §3.2.
insert into pricing_config (key, value) values
  ('rate_per_km', 540),
  ('minimum_charge', 5000),
  ('urgent_surcharge', 5000),
  ('return_copy_addon_fee', 3500)
on conflict (key) do update set value = excluded.value;
