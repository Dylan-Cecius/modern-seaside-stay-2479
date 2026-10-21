-- Server-only pepper for rate-limit fingerprints (never readable by API roles).
CREATE TABLE public.booking_rate_secret (
 id boolean PRIMARY KEY DEFAULT true CHECK (id),
 pepper bytea NOT NULL DEFAULT extensions.gen_random_bytes(32)
);
REVOKE ALL ON public.booking_rate_secret FROM PUBLIC, anon, authenticated, service_role;
ALTER TABLE public.booking_rate_secret ENABLE ROW LEVEL SECURITY;
INSERT INTO public.booking_rate_secret DEFAULT VALUES ON CONFLICT (id) DO NOTHING;
COMMENT ON TABLE public.booking_rate_secret IS 'Private HMAC pepper for booking_rate_log fingerprints; read only by SECURITY DEFINER create_booking.';

-- Earlier unsalted fingerprints are incompatible with the new HMAC keys (table is short-lived anti-abuse data only).
DELETE FROM public.booking_rate_log WHERE created_at < now() + interval '1 second';
CREATE INDEX IF NOT EXISTS booking_rate_log_phone_idx ON public.booking_rate_log (phone_key, created_at);
CREATE INDEX IF NOT EXISTS booking_rate_log_client_idx ON public.booking_rate_log (client_key, created_at);
CREATE INDEX IF NOT EXISTS booking_rate_log_created_idx ON public.booking_rate_log (created_at);
COMMENT ON TABLE public.booking_rate_log IS 'Anti-abuse journal: HMAC-SHA256 fingerprints only (no raw IP or phone), purged after 24 hours.';

CREATE OR REPLACE FUNCTION public.create_booking(p_services uuid[], p_start timestamp with time zone, p_first text, p_last text, p_phone text, p_email text, p_consent boolean, p_manual boolean DEFAULT false, p_client_key text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
 v_cfg public.booking_settings; v_hours public.booking_hours; v_duration integer; v_cost integer; v_names text; v_event uuid;
 v_local_start timestamp; v_local_end timestamp;
 v_pepper bytea; v_digits text; v_phone_hash text; v_client_hash text; v_phone_count integer; v_client_count integer;
BEGIN
 IF p_manual THEN
  IF NOT COALESCE(public.has_role(auth.uid(),'admin'),false) THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
 ELSE
  IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'SERVER_REQUIRED'; END IF;
 END IF;
 SELECT * INTO v_cfg FROM public.booking_settings WHERE id FOR SHARE;
 IF NOT p_manual AND NOT (v_cfg.public_enabled AND v_cfg.durations_validated AND v_cfg.privacy_validated AND p_consent) THEN RAISE EXCEPTION 'BOOKING_DISABLED'; END IF;
 IF p_services IS NULL OR p_start IS NULL OR p_start<=now() OR cardinality(p_services) NOT BETWEEN 1 AND 8 THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
 IF length(trim(p_first)) NOT BETWEEN 1 AND 80 OR length(trim(p_last)) NOT BETWEEN 1 AND 80 OR p_phone IS NULL OR p_phone !~ '^\+?[0-9 () .-]{7,30}$' OR (p_email IS NOT NULL AND (length(p_email)>255 OR p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')) THEN RAISE EXCEPTION 'INVALID_CONTACT'; END IF;
 SELECT sum(svc.duration_minutes),sum(svc.price_cents),string_agg(svc.name,' + ' ORDER BY svc.sort_order) INTO v_duration,v_cost,v_names FROM public.booking_services svc WHERE svc.id=ANY(p_services) AND svc.active;
 IF v_duration IS NULL OR (SELECT count(*) FROM public.booking_services svc WHERE svc.id=ANY(p_services) AND svc.active)<>cardinality(p_services) OR (SELECT count(*) FROM public.booking_services svc WHERE svc.id=ANY(p_services) AND NOT svc.supplement AND svc.active)<>1 THEN RAISE EXCEPTION 'INVALID_SERVICES'; END IF;
 v_local_start:=p_start AT TIME ZONE 'Europe/Brussels';
 v_local_end:=(p_start+make_interval(mins=>v_duration)) AT TIME ZONE 'Europe/Brussels';
 IF v_local_start::date<DATE '2026-12-01' OR v_local_end::date>DATE '2026-12-31' OR v_local_start::date<>v_local_end::date OR extract(second FROM v_local_start)<>0 OR extract(minute FROM v_local_start)::integer%15<>0 THEN RAISE EXCEPTION 'DECEMBER_ONLY'; END IF;
 SELECT * INTO v_hours FROM public.booking_hours bh WHERE bh.weekday=extract(dow FROM v_local_start)::integer FOR SHARE;
 IF NOT FOUND OR NOT v_hours.enabled OR v_local_start::time<v_hours.opens OR v_local_end::time>v_hours.closes THEN RAISE EXCEPTION 'CLOSED'; END IF;

 IF NOT p_manual THEN
  SELECT sec.pepper INTO v_pepper FROM public.booking_rate_secret sec WHERE sec.id;
  IF v_pepper IS NULL THEN RAISE EXCEPTION 'RATE_CONFIG_MISSING'; END IF;
  -- Normalised phone: digits only, 00 international prefix dropped, Belgian national 0 mapped to 32.
  v_digits:=regexp_replace(p_phone,'[^0-9]','','g');
  IF v_digits LIKE '00%' THEN v_digits:=substr(v_digits,3); ELSIF v_digits LIKE '0%' THEN v_digits:='32'||substr(v_digits,2); END IF;
  v_phone_hash:=encode(extensions.hmac(convert_to('phone:'||v_digits,'UTF8'),v_pepper,'sha256'),'hex');
  v_client_hash:=CASE WHEN p_client_key ~ '^[0-9a-f]{64}$' THEN encode(extensions.hmac(convert_to('client:'||p_client_key,'UTF8'),v_pepper,'sha256'),'hex') END;
  -- Serialise quota checks per fingerprint (sorted lock order avoids deadlocks); locks last until commit/rollback.
  PERFORM pg_advisory_xact_lock(lk.k) FROM (SELECT hashtextextended(x,0) AS k FROM unnest(ARRAY['booking-rate:phone:'||v_phone_hash,'booking-rate:client:'||v_client_hash]) AS x WHERE x IS NOT NULL ORDER BY 1) lk;
  DELETE FROM public.booking_rate_log old_rate WHERE old_rate.created_at < now()-interval '24 hours';
  SELECT count(*) FILTER (WHERE rate.phone_key=v_phone_hash), count(*) FILTER (WHERE v_client_hash IS NOT NULL AND rate.client_key=v_client_hash)
   INTO v_phone_count, v_client_count
   FROM public.booking_rate_log rate WHERE rate.created_at > now()-interval '1 hour';
  IF v_phone_count>=3 OR v_client_count>=3 THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
 END IF;

 INSERT INTO public.booking_events(starts_at,ends_at,kind,service_ids,service_names,price_cents) VALUES(p_start,p_start+make_interval(mins=>v_duration),'appointment',p_services,v_names,v_cost) RETURNING id INTO v_event;
 INSERT INTO public.booking_customers(event_id,first_name,last_name,phone,email,consented_at,source) VALUES(v_event,trim(p_first),trim(p_last),p_phone,p_email,CASE WHEN p_consent THEN now() ELSE NULL END,CASE WHEN p_manual THEN 'manual' ELSE 'public' END);
 IF NOT p_manual THEN
  INSERT INTO public.booking_rate_log(client_key,phone_key) VALUES(COALESCE(v_client_hash,''),v_phone_hash);
 END IF;
 RETURN v_event;
END $function$;
REVOKE ALL ON FUNCTION public.create_booking(uuid[], timestamptz, text, text, text, text, boolean, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_booking(uuid[], timestamptz, text, text, text, text, boolean, boolean, text) TO authenticated, service_role;