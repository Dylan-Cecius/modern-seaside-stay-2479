-- Admin-only atomic quick booking. No direct SELECT/UPDATE rights are added to clients.
-- Uses the existing create_booking transaction checks (role, time, service, overlap).
CREATE OR REPLACE FUNCTION public.admin_create_booking(
  p_services uuid[],
  p_start timestamptz,
  p_first text,
  p_last text,
  p_phone text,
  p_email text,
  p_note text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_event uuid;
BEGIN
  IF NOT COALESCE(public.has_role(auth.uid(), 'admin'), false) THEN
    RAISE EXCEPTION 'ADMIN_REQUIRED';
  END IF;
  IF length(COALESCE(p_note, '')) > 1000 THEN
    RAISE EXCEPTION 'INVALID_NOTE';
  END IF;
  -- The called function revalidates opening hours and performs an atomic insert
  -- protected by booking_events_tstzrange_excl. Any subsequent failure rolls back both inserts.
  SELECT public.create_booking(
    p_services => p_services, p_start => p_start,
    p_first => p_first, p_last => p_last, p_phone => p_phone,
    p_email => NULLIF(trim(COALESCE(p_email, '')), ''),
    p_consent => false, p_manual => true, p_client_key => ''
  ) INTO v_event;
  UPDATE public.booking_events
    SET note = trim(COALESCE(p_note, ''))
    WHERE id = v_event;
  IF NOT FOUND THEN RAISE EXCEPTION 'BOOKING_NOT_FOUND'; END IF;
  RETURN v_event;
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_create_booking(uuid[],timestamptz,text,text,text,text,text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_booking(uuid[],timestamptz,text,text,text,text,text)
  TO authenticated;
