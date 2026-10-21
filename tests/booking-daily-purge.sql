-- Rollback-only test of public.system_purge_expired_booking_data (daily pg_cron job 'booking-daily-purge').
-- Run as one statement; it always ends with RAISE EXCEPTION, so nothing persists.
-- Expected: not_validated_purged=0 customers=2 rate=1 log=0; validated_purged=1 customers=1 log_null_by=1
DO $$ DECLARE r text:=''; v_e uuid; v_n int; BEGIN
ALTER TABLE public.booking_events DISABLE TRIGGER USER;
ALTER TABLE public.booking_customers DISABLE TRIGGER USER;
INSERT INTO public.booking_rate_log(client_key,phone_key,created_at) VALUES('old','old',now()-interval '25 hours'),('new','new',now());
INSERT INTO public.booking_events(starts_at,ends_at,kind) VALUES(now()-interval '200 days',now()-interval '200 days'+interval '30 min','appointment') RETURNING id INTO v_e;
INSERT INTO public.booking_customers(event_id,first_name,last_name,phone,source) VALUES(v_e,'T','T','0470000000','manual');
INSERT INTO public.booking_events(starts_at,ends_at,kind) VALUES(now()-interval '10 days',now()-interval '10 days'+interval '30 min','appointment') RETURNING id INTO v_e;
INSERT INTO public.booking_customers(event_id,first_name,last_name,phone,source) VALUES(v_e,'R','R','0470000001','manual');
v_n:=public.system_purge_expired_booking_data();
r:=r||'not_validated_purged='||v_n||' customers='||(SELECT count(*) FROM booking_customers)||' rate='||(SELECT count(*) FROM booking_rate_log)||' log='||(SELECT count(*) FROM booking_purge_log)||'; ';
UPDATE public.booking_settings SET privacy_validated=true, retention_days=90 WHERE id;
v_n:=public.system_purge_expired_booking_data();
r:=r||'validated_purged='||v_n||' customers='||(SELECT count(*) FROM booking_customers)||' log_null_by='||(SELECT count(*) FROM booking_purge_log WHERE purged_by IS NULL);
RAISE EXCEPTION 'ROLLBACK_TEST %', r; END $$;
