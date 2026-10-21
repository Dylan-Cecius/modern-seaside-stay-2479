CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.system_purge_expired_booking_data()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_cfg public.booking_settings; v_n integer := 0;
BEGIN
  DELETE FROM public.booking_rate_log WHERE created_at < now() - interval '24 hours';
  SELECT * INTO v_cfg FROM public.booking_settings WHERE id;
  IF v_cfg.privacy_validated IS TRUE AND COALESCE(v_cfg.retention_days,0) > 0 THEN
    DELETE FROM public.booking_customers c USING public.booking_events e
     WHERE e.id = c.event_id AND e.ends_at < now() - make_interval(days => v_cfg.retention_days);
    GET DIAGNOSTICS v_n = ROW_COUNT;
    INSERT INTO public.booking_purge_log(purged_count, purged_by) VALUES (v_n, NULL);
  END IF;
  RETURN v_n;
END $function$;

REVOKE ALL ON FUNCTION public.system_purge_expired_booking_data() FROM PUBLIC, anon, authenticated, service_role;