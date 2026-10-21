-- Read-only checks of the pure slot calculator (no table writes). Run with the read-only database role.
-- Expected results (verified 2026-10-21):
--   appt_1030_1130    = 10:00,11:30,12:00,...,18:30   (30 min service, appointment 10:30–11:30 hidden)
--   sixty_block_12_14 = 10:00,10:30,11:00,14:00,...,18:00 (60 min service never overlaps a 12–14 block)
--   left_after_1110   = 15 (past hours unavailable)
--   step15            = 10:00,10:15,10:30 (optional 15 min rhythm)
--   utc_bounds        = 2026-12-02 09:00:00+00 / 2026-12-02 17:30:00+00 (Brussels CET, last 30 min start 18:30, ends 19:00)
SELECT
 (SELECT string_agg(to_char(f AT TIME ZONE 'Europe/Brussels','HH24:MI'),',') FROM booking_free_starts('2026-12-02','10:00','19:00',30,30,ARRAY[tstzrange('2026-12-02 10:30+01','2026-12-02 11:30+01','[)')],'2026-10-21 12:00+00') f) AS appt_1030_1130,
 (SELECT string_agg(to_char(f AT TIME ZONE 'Europe/Brussels','HH24:MI'),',') FROM booking_free_starts('2026-12-02','10:00','19:00',60,30,ARRAY[tstzrange('2026-12-02 12:00+01','2026-12-02 14:00+01','[)')],'2026-10-21 12:00+00') f) AS sixty_block_12_14,
 (SELECT count(*) FROM booking_free_starts('2026-12-02','10:00','19:00',30,30,NULL,'2026-12-02 11:10+01') f) AS left_after_1110,
 (SELECT string_agg(to_char(f AT TIME ZONE 'Europe/Brussels','HH24:MI'),',') FROM booking_free_starts('2026-12-02','10:00','11:00',30,15,NULL,'2026-10-21 12:00+00') f) AS step15,
 (SELECT min(f)::text||' / '||max(f)::text FROM booking_free_starts('2026-12-02','10:00','19:00',30,30,NULL,'2026-10-21 12:00+00') f) AS utc_bounds;
