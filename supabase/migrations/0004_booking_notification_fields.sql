-- TRD §8: "Mark as Notified" lets staff record which channel(s) they used
-- and an optional note, purely for internal tracking — no message is sent
-- by the system. The originally locked schema (TRD §3.1) had notified_at/
-- notified_by_staff_id but nowhere to put the channel/note themselves.
alter table bookings
  add column notified_channel text,
  add column notified_note text;
