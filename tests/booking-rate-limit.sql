-- Rate-limit checks for create_booking. The WHOLE test is one DO block that always ends with
-- RAISE EXCEPTION, so PostgreSQL rolls back every write (settings toggle, bookings, fingerprints)
-- whatever client runs it. The error message carries the results.
-- Expected (verified 2026-10-21):
--   phone_a_1..3=ok ; phone_a_4_other_format=RATE_LIMITED ; phone_b_other_client=ok
--   client_k1_new_phone=RATE_LIMITED ; stale_fingerprint_purged=true ; raw_phone_absent=true
--   fingerprints_are_hmac_hex=true ; rate_rows=4 ; advisory_locks_held>=2
DO $$
DECLARE svc uuid[] := ARRAY['5e84ecb6-b222-45e9-86da-7ad402e9958d'::uuid];
 k1 text := repeat('a',64); k2 text := repeat('b',64);
 steps text[][] := ARRAY[
  ['phone_a_1','10:00','+32 470 11 22 33','a'],
  ['phone_a_2','10:30','+32 470 11 22 33','a'],
  ['phone_a_3','11:00','+32470112233','a'],
  ['phone_a_4_other_format','11:30','0470.11.22.33','b'],
  ['phone_b_other_client','12:00','0471 99 88 77','b'],
  ['client_k1_new_phone','12:30','0472 55 44 33','a']];
 i int; res text := '';
BEGIN
 PERFORM set_config('request.jwt.claims','{"role":"service_role"}',true);
 UPDATE public.booking_settings SET public_enabled=true,durations_validated=true,privacy_validated=true,privacy_contact='test@example.invalid',retention_days=30 WHERE id;
 INSERT INTO public.booking_rate_log(client_key,phone_key,created_at) VALUES('stale','stale',now()-interval '25 hours');
 FOR i IN 1..array_length(steps,1) LOOP
  BEGIN
   PERFORM public.create_booking(svc, ('2026-12-02 '||steps[i][2]||'+01')::timestamptz,'Test','Rollback',steps[i][3],NULL,true,false,CASE steps[i][4] WHEN 'a' THEN k1 ELSE k2 END);
   res := res||steps[i][1]||'=ok; ';
  EXCEPTION WHEN OTHERS THEN res := res||steps[i][1]||'='||SQLERRM||'; ';
  END;
 END LOOP;
 res := res||'stale_fingerprint_purged='||(NOT EXISTS(SELECT 1 FROM public.booking_rate_log WHERE phone_key='stale'))::text||'; ';
 res := res||'raw_phone_absent='||(NOT EXISTS(SELECT 1 FROM public.booking_rate_log WHERE phone_key LIKE '%47011%' OR client_key IN (k1,k2)))::text||'; ';
 res := res||'fingerprints_are_hmac_hex='||(SELECT bool_and(phone_key ~ '^[0-9a-f]{64}$' AND client_key ~ '^[0-9a-f]{64}$' AND phone_key<>encode(extensions.digest('32470112233','sha256'),'hex')) FROM public.booking_rate_log)::text||'; ';
 res := res||'rate_rows='||(SELECT count(*) FROM public.booking_rate_log)::text||'; ';
 res := res||'bookings_in_test='||(SELECT count(*) FROM public.booking_events)::text||'; ';
 res := res||'advisory_locks_held='||(SELECT count(*) FROM pg_locks WHERE locktype='advisory' AND pid=pg_backend_pid())::text;
 RAISE EXCEPTION 'TEST_ROLLBACK %', res;
END $$;
