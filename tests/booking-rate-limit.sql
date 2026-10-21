-- Rate-limit checks for create_booking, executed inside ONE transaction that is ROLLED BACK.
-- Nothing persists: settings are only enabled inside the transaction, every booking and fingerprint disappears at ROLLBACK.
-- Expected (verified 2026-10-21):
--   phone_a_1..3 = ok ; phone_a_4_other_format = RATE_LIMITED ; phone_b_other_client = ok
--   client_k1_new_phone = RATE_LIMITED ; stale_fingerprint_purged = true ; raw_phone_absent = true
--   fingerprints_are_hmac_hex = true ; advisory_locks_held = 2 (phone + client of the last success)
BEGIN;
SELECT set_config('request.jwt.claims','{"role":"service_role"}',true);
UPDATE public.booking_settings SET public_enabled=true,durations_validated=true,privacy_validated=true,privacy_contact='test@example.invalid',retention_days=30 WHERE id;
CREATE TEMP TABLE rl_result(step text, outcome text) ON COMMIT DROP;
INSERT INTO public.booking_rate_log(client_key,phone_key,created_at) VALUES('stale','stale',now()-interval '25 hours');
DO $$
DECLARE svc uuid[] := ARRAY['5e84ecb6-b222-45e9-86da-7ad402e9958d'::uuid];
 k1 text := repeat('a',64); k2 text := repeat('b',64);
 PROCEDURE_DUMMY int;
 PROCEDURE_STEPS text[][] := ARRAY[
  ['phone_a_1','10:00','+32 470 11 22 33','a'],
  ['phone_a_2','10:30','+32 470 11 22 33','a'],
  ['phone_a_3','11:00','+32470112233','a'],
  ['phone_a_4_other_format','11:30','0470/11.22.33','b'],
  ['phone_b_other_client','12:00','0471 99 88 77','b'],
  ['client_k1_new_phone','12:30','0472 55 44 33','a']];
 i int;
BEGIN
 FOR i IN 1..array_length(PROCEDURE_STEPS,1) LOOP
  BEGIN
   PERFORM public.create_booking(svc, ('2026-12-02 '||PROCEDURE_STEPS[i][2]||'+01')::timestamptz,'Test','Rollback',PROCEDURE_STEPS[i][3],NULL,true,false,CASE PROCEDURE_STEPS[i][4] WHEN 'a' THEN k1 ELSE k2 END);
   INSERT INTO rl_result VALUES(PROCEDURE_STEPS[i][1],'ok');
  EXCEPTION WHEN OTHERS THEN INSERT INTO rl_result VALUES(PROCEDURE_STEPS[i][1],SQLERRM);
  END;
 END LOOP;
END $$;
INSERT INTO rl_result SELECT 'stale_fingerprint_purged', (NOT EXISTS(SELECT 1 FROM public.booking_rate_log WHERE phone_key='stale'))::text;
INSERT INTO rl_result SELECT 'raw_phone_absent', (NOT EXISTS(SELECT 1 FROM public.booking_rate_log WHERE phone_key LIKE '%47011%' OR client_key LIKE '%aaaa%'))::text;
INSERT INTO rl_result SELECT 'fingerprints_are_hmac_hex', bool_and(phone_key ~ '^[0-9a-f]{64}$' AND phone_key<>encode(extensions.digest('32470112233','sha256'),'hex'))::text FROM public.booking_rate_log;
INSERT INTO rl_result SELECT 'rate_rows_in_txn', count(*)::text FROM public.booking_rate_log;
INSERT INTO rl_result SELECT 'advisory_locks_held', count(DISTINCT objid)::text FROM pg_locks WHERE locktype='advisory' AND pid=pg_backend_pid();
SELECT step, outcome FROM rl_result;
ROLLBACK;
