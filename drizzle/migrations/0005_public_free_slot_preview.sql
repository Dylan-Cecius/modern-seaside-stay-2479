ALTER TABLE public.booking_settings ADD COLUMN IF NOT EXISTS slot_interval_minutes integer NOT NULL DEFAULT 30;
ALTER TABLE public.booking_settings ADD CONSTRAINT booking_settings_slot_interval_check CHECK (slot_interval_minutes IN (15,30));

CREATE OR REPLACE FUNCTION public.booking_free_starts(p_date date, p_opens time, p_closes time, p_duration integer, p_step integer, p_busy tstzrange[], p_now timestamptz)
RETURNS SETOF timestamptz LANGUAGE sql IMMUTABLE SET search_path=public AS $$
 SELECT g FROM generate_series((p_date+p_opens) AT TIME ZONE 'Europe/Brussels',((p_date+p_closes) AT TIME ZONE 'Europe/Brussels')-make_interval(mins=>p_duration),make_interval(mins=>p_step)) g
 WHERE p_duration>0 AND p_step IN (15,30) AND g>p_now
 AND NOT EXISTS(SELECT 1 FROM unnest(COALESCE(p_busy,'{}'::tstzrange[])) b WHERE b && tstzrange(g,g+make_interval(mins=>p_duration),'[)'))
 ORDER BY g $$;
REVOKE ALL ON FUNCTION public.booking_free_starts(date,time,time,integer,integer,tstzrange[],timestamptz) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.booking_free_starts(date,time,time,integer,integer,tstzrange[],timestamptz) TO service_role;

CREATE OR REPLACE FUNCTION public.booking_slots(p_date date, p_services uuid[])
RETURNS TABLE(starts_at timestamptz) LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE dur integer; h public.booking_hours; step integer; busy tstzrange[];
BEGIN
 IF p_date IS NULL OR p_date<DATE '2026-12-01' OR p_date>DATE '2026-12-31' OR p_services IS NULL OR cardinality(p_services) NOT BETWEEN 1 AND 8 THEN RAISE EXCEPTION 'DECEMBER_ONLY'; END IF;
 SELECT sum(duration_minutes) INTO dur FROM public.booking_services WHERE id=ANY(p_services) AND active;
 IF dur IS NULL OR (SELECT count(*) FROM public.booking_services WHERE id=ANY(p_services) AND active)<>cardinality(p_services) OR (SELECT count(*) FROM public.booking_services WHERE id=ANY(p_services) AND active AND NOT supplement)<>1 THEN RAISE EXCEPTION 'INVALID_SERVICES'; END IF;
 SELECT * INTO h FROM public.booking_hours WHERE weekday=extract(dow FROM p_date)::integer;
 IF NOT FOUND OR NOT h.enabled THEN RETURN; END IF;
 SELECT COALESCE(slot_interval_minutes,30) INTO step FROM public.booking_settings WHERE id;
 SELECT array_agg(tstzrange(e.starts_at,e.ends_at,'[)')) INTO busy FROM public.booking_events e WHERE e.status='confirmed' AND e.starts_at<((p_date+1)::timestamp AT TIME ZONE 'Europe/Brussels') AND e.ends_at>(p_date::timestamp AT TIME ZONE 'Europe/Brussels');
 RETURN QUERY SELECT f FROM public.booking_free_starts(p_date,h.opens,h.closes,dur,COALESCE(step,30),busy,now()) f;
END $$;
REVOKE ALL ON FUNCTION public.booking_slots(date,uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.booking_slots(date,uuid[]) TO anon,authenticated,service_role;
COMMENT ON FUNCTION public.booking_slots(date,uuid[]) IS 'Read-only: returns only free start instants (no event or customer data). Availability preview is public even while bookings are disabled; creation stays guarded by create_booking.';