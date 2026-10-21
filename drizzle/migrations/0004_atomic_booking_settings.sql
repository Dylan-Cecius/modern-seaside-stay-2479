CREATE FUNCTION public.admin_save_booking_settings(p_settings jsonb,p_hours jsonb,p_services jsonb) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
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
 IF NOT(p_settings ?& ARRAY['public_enabled','durations_validated','privacy_validated','privacy_contact','retention_days']) THEN RAISE EXCEPTION 'INCOMPLETE_SETTINGS'; END IF;
 UPDATE public.booking_settings SET public_enabled=(p_settings->>'public_enabled')::boolean,durations_validated=(p_settings->>'durations_validated')::boolean,privacy_validated=(p_settings->>'privacy_validated')::boolean,privacy_contact=trim(p_settings->>'privacy_contact'),retention_days=(p_settings->>'retention_days')::integer WHERE id;
END $$;
REVOKE ALL ON FUNCTION public.admin_save_booking_settings(jsonb,jsonb,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_save_booking_settings(jsonb,jsonb,jsonb) TO authenticated;