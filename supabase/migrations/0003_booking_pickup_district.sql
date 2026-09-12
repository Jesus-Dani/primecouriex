-- Records which district a booking was priced against (TRD §4 — price is
-- computed once and stored, never silently recalculated; staff and the
-- customer both need to see what actually determined the charge). A foreign
-- key to district_rates keeps this to real, priced districts rather than
-- free text — the pickup ADDRESS stays a separate free-text field for the
-- courier, distinct from the pricing district.
alter table bookings
  add column pickup_district text not null references district_rates (district);
