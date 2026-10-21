-- 1) Atomic settings save now includes the 15/30 min start interval
CREATE OR REPLACE FUNCTION public.admin_save_booking_settings(p_settings jsonb, p_hours jsonb, p_services jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE h jsonb; s jsonb; cfg public.booking_settings; seen_hours integer[] := '{}'; seen_services uuid[] := '{}'; service_id uuid;
BEGIN
 IF NOT COALESCE(public.has_role(auth.uid(),'admin'),false) THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
 IF jsonb_typeof(p_settings) IS DISTINCT FROM 'object' OR jsonb_typeof(p_hours) IS DISTINCT FROM 'array' OR jsonb_typeof(p_services) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
 IF jsonb_array_length(p_hours)<>7 OR jsonb_array_length(p_services)<>(SELECT count(*) FROM public.booking_services) THEN RAISE EXCEPTION 'INCOMPLETE_SETTINGS'; END IF;
 SELECT * INTO cfg FROM public.booking_settings WHERE id FOR UPDATE;
 FOR h IN SELECT value FROM jsonb_array_elements(p_hours) LOOP
  IF (h->>'weekday')::integer=ANY(seen_hours) OR (h->>'weekday')::integer NOT BETWEEN 0 AND 6 OR NOT(h ?& ARRAY['weekday','enabled','opens','closes']) THEN RAISE EXCEPTION 'INVALID_HOURS'; END IF;
  seen_hours:=array_append(seen_hours,(h->>'weekday')::integer);
  UPDATE public.booking_hours SET enabled=(h->>'enabled')::boolean,opens=(h->>'opens')::time,closes=(h->>'closes')::time WHERE weekday=(h->>'weekday')::integer;
  IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_HOURS'; END IF;
 END LOOP;
 FOR s IN SELECT value FROM jsonb_array_elements(p_services) LOOP
  IF NOT(s ?& ARRAY['id','duration_minutes']) THEN RAISE EXCEPTION 'INVALID_SERVICES'; END IF;
  service_id:=(s->>'id')::uuid;
  IF service_id=ANY(seen_services) THEN RAISE EXCEPTION 'INVALID_SERVICES'; END IF;
  seen_services:=array_append(seen_services,service_id);
  UPDATE public.booking_services SET duration_minutes=(s->>'duration_minutes')::integer WHERE id=service_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_SERVICES'; END IF;
 END LOOP;
 IF NOT(p_settings ?& ARRAY['public_enabled','durations_validated','privacy_validated','privacy_contact','retention_days','slot_interval_minutes']) THEN RAISE EXCEPTION 'INCOMPLETE_SETTINGS'; END IF;
 IF (p_settings->>'slot_interval_minutes')::integer NOT IN (15,30) THEN RAISE EXCEPTION 'INVALID_INTERVAL'; END IF;
 UPDATE public.booking_settings SET public_enabled=(p_settings->>'public_enabled')::boolean,durations_validated=(p_settings->>'durations_validated')::boolean,privacy_validated=(p_settings->>'privacy_validated')::boolean,privacy_contact=trim(p_settings->>'privacy_contact'),retention_days=(p_settings->>'retention_days')::integer,slot_interval_minutes=(p_settings->>'slot_interval_minutes')::integer WHERE id;
END $function$;

-- 2) Public opening requires a real email contact and a positive retention
CREATE OR REPLACE FUNCTION public.booking_settings_validation()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$ BEGIN IF NEW.public_enabled AND (NOT NEW.durations_validated OR NOT NEW.privacy_validated OR NEW.privacy_contact !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR NEW.retention_days<1) THEN RAISE EXCEPTION 'VALIDATION_REQUIRED'; END IF; RETURN NEW; END $function$;

-- 3) Persistent anti-abuse log for public creation requests (no raw PII: hashed keys only)
CREATE TABLE public.booking_rate_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 client_key text NOT NULL DEFAULT '',
 phone_key text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.booking_rate_log TO service_role;
ALTER TABLE public.booking_rate_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX booking_rate_log_recent ON public.booking_rate_log (created_at);

-- 4) Purge journal (admin-visible record of manual purges)
CREATE TABLE public.booking_purge_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 purged_count integer NOT NULL,
 purged_by uuid,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.booking_purge_log TO authenticated;
GRANT ALL ON public.booking_purge_log TO service_role;
ALTER TABLE public.booking_purge_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_purge_log ON public.booking_purge_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 5) Expired-customer purge helpers (admin only, controlled and manual)
CREATE OR REPLACE FUNCTION public.admin_count_expired_customers()
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ DECLARE n integer; BEGIN IF NOT COALESCE(public.has_role(auth.uid(),'admin'),false) THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF; SELECT count(*) INTO n FROM public.booking_customers c JOIN public.booking_events e ON e.id=c.event_id WHERE e.ends_at < now() - make_interval(days => (SELECT retention_days FROM public.booking_settings WHERE id)); RETURN n; END $function$;

CREATE OR REPLACE FUNCTION public.admin_purge_expired_customers()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ DECLARE n integer; BEGIN IF NOT COALESCE(public.has_role(auth.uid(),'admin'),false) THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF; DELETE FROM public.booking_customers c USING public.booking_events e WHERE e.id=c.event_id AND e.ends_at < now() - make_interval(days => (SELECT retention_days FROM public.booking_settings WHERE id)); GET DIAGNOSTICS n = ROW_COUNT; INSERT INTO public.booking_purge_log(purged_count,purged_by) VALUES(n,auth.uid()); RETURN n; END $function$;

-- 6) create_booking: server-side rate limit for public creations (3 per hour per client or per phone); admin manual bookings bypass
CREATE OR REPLACE FUNCTION public.create_booking(p_services uuid[], p_start timestamp with time zone, p_first text, p_last text, p_phone text, p_email text, p_consent boolean, p_manual boolean DEFAULT false, p_client_key text DEFAULT '')
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ DECLARE cfg public.booking_settings; h public.booking_hours; dur integer; cost integer; names text; event uuid; local_start timestamp; local_end timestamp; phone_key text; BEGIN IF p_manual THEN IF NOT COALESCE(public.has_role(auth.uid(),'admin'),false) THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF; ELSE IF auth.role()<>'service_role' THEN RAISE EXCEPTION 'SERVER_REQUIRED'; END IF; END IF; SELECT * INTO cfg FROM public.booking_settings WHERE id FOR SHARE; IF NOT p_manual AND NOT (cfg.public_enabled AND cfg.durations_validated AND cfg.privacy_validated AND p_consent) THEN RAISE EXCEPTION 'BOOKING_DISABLED'; END IF; IF p_start<=now() OR cardinality(p_services) NOT BETWEEN 1 AND 8 OR p_services IS NULL THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF; IF length(trim(p_first)) NOT BETWEEN 1 AND 80 OR length(trim(p_last)) NOT BETWEEN 1 AND 80 OR p_phone !~ '^\+?[0-9 () .-]{7,30}$' OR (p_email IS NOT NULL AND (length(p_email)>255 OR p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')) THEN RAISE EXCEPTION 'INVALID_CONTACT'; END IF; SELECT sum(duration_minutes),sum(price_cents),string_agg(name,' + ' ORDER BY sort_order) INTO dur,cost,names FROM public.booking_services WHERE id=ANY(p_services) AND active; IF dur IS NULL OR (SELECT count(*) FROM public.booking_services WHERE id=ANY(p_services) AND active)<>cardinality(p_services) OR (SELECT count(*) FROM public.booking_services WHERE id=ANY(p_services) AND NOT supplement AND active)<>1 THEN RAISE EXCEPTION 'INVALID_SERVICES'; END IF; local_start:=p_start AT TIME ZONE 'Europe/Brussels'; local_end:=(p_start+make_interval(mins=>dur)) AT TIME ZONE 'Europe/Brussels'; IF local_start::date<DATE '2026-12-01' OR local_end::date>DATE '2026-12-31' OR local_start::date<>local_end::date OR extract(second FROM local_start)<>0 OR extract(minute FROM local_start)::integer%15<>0 THEN RAISE EXCEPTION 'DECEMBER_ONLY'; END IF; SELECT * INTO h FROM public.booking_hours WHERE weekday=extract(dow FROM local_start)::integer FOR SHARE; IF NOT h.enabled OR local_start::time<h.opens OR local_end::time>h.closes THEN RAISE EXCEPTION 'CLOSED'; END IF; IF NOT p_manual THEN phone_key:=md5(regexp_replace(p_phone,'[^0-9]','','g')); IF (SELECT count(*) FROM public.booking_rate_log WHERE created_at>now()-interval '1 hour' AND ((p_client_key<>'' AND client_key=p_client_key) OR phone_key=phone_key))>=3 THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF; END IF; INSERT INTO public.booking_events(starts_at,ends_at,kind,service_ids,service_names,price_cents) VALUES(p_start,p_start+make_interval(mins=>dur),'appointment',p_services,names,cost) RETURNING id INTO event; INSERT INTO public.booking_customers(event_id,first_name,last_name,phone,email,consented_at,source) VALUES(event,trim(p_first),trim(p_last),p_phone,p_email,CASE WHEN p_consent THEN now() ELSE NULL END,CASE WHEN p_manual THEN 'manual' ELSE 'public' END); IF NOT p_manual THEN INSERT INTO public.booking_rate_log(client_key,phone_key) VALUES(left(p_client_key,64),phone_key); END IF; RETURN event; END $function$;