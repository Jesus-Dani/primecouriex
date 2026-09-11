-- Locked v1 pricing values — PRD §10.1-10.3, TRD §3.2. Kept seeded even
-- though district_rates (below) is the active pricing source "for now" —
-- see supabase/migrations/0002_district_rates.sql.
insert into pricing_config (key, value) values
  ('rate_per_km', 540),
  ('minimum_charge', 5000),
  ('urgent_surcharge', 5000),
  ('return_copy_addon_fee', 3500)
on conflict (key) do update set value = excluded.value;

-- District flat rates — docs/Internal_Rate_Sheet.docx. rider_rate is
-- internal cost only, never customer-facing. Zuba and Abaji have no
-- confirmed standard_fee/return_copy_addon_fee in the source document (the
-- doc's own note: Zuba's client fees "need to be set before this row can be
-- corrected"; Abaji is "Quotation" with no fixed rate) — left null here on
-- purpose, priced as "on request" rather than guessed.
insert into district_rates (district, rider_rate, standard_fee, return_copy_addon_fee) values
  ('Central Business District (CBD)', 3000, 5000, 3500),
  ('Garki', 3000, 5000, 3500),
  ('Wuse', 3000, 5000, 3500),
  ('Wuse II', 3000, 5000, 3500),
  ('Maitama', 3000, 5000, 3500),
  ('Asokoro', 3500, 5500, 4000),
  ('Guzape', 3500, 5500, 4000),
  ('Wuye', 3000, 5000, 3500),
  ('Jabi', 3000, 5000, 3500),
  ('Utako', 3000, 5000, 3500),
  ('Mabushi', 3000, 5000, 3500),
  ('Jahi', 3000, 5000, 3500),
  ('Kado', 3000, 5000, 3500),
  ('Katampe', 3500, 5500, 4000),
  ('Katampe Extension', 4000, 6000, 4500),
  ('Life Camp', 3500, 5500, 4000),
  ('Gwarinpa', 3500, 5500, 4000),
  ('Karsana', 4000, 6000, 4500),
  ('Dawaki', 4000, 6000, 4500),
  ('Idu Industrial Area', 3500, 5500, 4000),
  ('Idu / Karmo Axis', 3500, 5500, 4000),
  ('Karmo', 3500, 5500, 4000),
  ('Dei-Dei', 5000, 7000, 5500),
  ('Apo', 3500, 5500, 4000),
  ('Gudu', 3000, 5000, 3500),
  ('Durumi', 3500, 5500, 4000),
  ('Lokogoma', 3000, 5000, 3500),
  ('Dakibiyu', 3500, 5500, 4000),
  ('Dape', 4000, 6000, 4500),
  ('Kaura', 3000, 5000, 3500),
  ('Games Village', 3500, 5000, 3500),
  ('Galadimawa', 3000, 5000, 3500),
  ('Mbora', 3000, 5000, 3500),
  ('Wumba', 2500, 5000, 3500),
  ('Mpape', 3500, 5500, 4000),
  ('Lugbe', 4000, 7000, 5500),
  ('TradeMoore', 5000, 7000, 5500),
  ('Pyakasa', 5000, 7000, 5500),
  ('Gosa', 5000, 7000, 5500),
  ('Airport Road Axis', 5500, 7500, 6000),
  ('Nyanya', 5500, 7000, 5500),
  ('Karu (FCT)', 5000, 7000, 5500),
  ('Orozo', 5000, 7500, 5500),
  ('Karshi', 4000, 8500, 6500),
  ('Kubwa', 5000, 7000, 5500),
  ('Dutse', 5000, 7000, 5500),
  ('Zuba', 7000, null, null),
  ('Bwari', 8000, 10000, 8500),
  ('Gwagwalada', 9000, 12500, 12500),
  ('Kuje', 7000, 9000, 7500),
  ('Kwali', 10000, 12000, 10500),
  ('Abaji', null, null, null)
on conflict (district) do update set
  rider_rate = excluded.rider_rate,
  standard_fee = excluded.standard_fee,
  return_copy_addon_fee = excluded.return_copy_addon_fee;
