-- CREATE OR REPLACE with a changed signature creates a new overload with default PUBLIC execute; restore the original lock-down.
REVOKE ALL ON FUNCTION public.create_booking(uuid[], timestamptz, text, text, text, text, boolean, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_booking(uuid[], timestamptz, text, text, text, text, boolean, boolean, text) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.admin_count_expired_customers() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_count_expired_customers() TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.admin_purge_expired_customers() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_purge_expired_customers() TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.admin_save_booking_settings(jsonb, jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_save_booking_settings(jsonb, jsonb, jsonb) TO authenticated, service_role;