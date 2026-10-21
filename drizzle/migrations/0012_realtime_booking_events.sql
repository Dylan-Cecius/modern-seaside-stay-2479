DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='booking_events') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_events;
  END IF;
END $$;