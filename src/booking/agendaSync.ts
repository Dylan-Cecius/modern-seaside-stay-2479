import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SyncStatus = 'connecting' | 'live' | 'polling';
export const POLL_MS = 20000;

/** Pure: should the safety-net poll run now? */
export function shouldPoll(status: SyncStatus, visible: boolean): boolean {
  return visible && status !== 'live';
}

/** Pure: label shown to the admin; never claims live sync unless the channel is subscribed. */
export function syncLabel(status: SyncStatus): string {
  return status === 'live' ? 'Synchronisé en temps réel' : status === 'connecting' ? 'Connexion à la synchronisation…' : 'Actualisation différée (toutes les 20 s)';
}

/** Realtime on booking_events (no personal data; payload ignored, data re-read under RLS) + visible-tab polling fallback. Mount only after admin role is verified. */
export function useAgendaSync(refresh: () => void): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>('connecting');
  const ref = useRef(refresh); ref.current = refresh;
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const kick = () => { clearTimeout(timer); timer = setTimeout(() => ref.current(), 300); };
    const channel = supabase.channel('admin-agenda')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_events' }, kick)
      .subscribe(state => {
        if (state === 'SUBSCRIBED') { setStatus('live'); ref.current(); }
        else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT' || state === 'CLOSED') setStatus('polling');
      });
    return () => { clearTimeout(timer); void supabase.removeChannel(channel); };
  }, []);
  useEffect(() => {
    const visible = () => document.visibilityState === 'visible';
    const id = setInterval(() => { if (shouldPoll(status, visible())) ref.current(); }, POLL_MS);
    const onFocus = () => { if (visible()) ref.current(); };
    window.addEventListener('focus', onFocus); document.addEventListener('visibilitychange', onFocus);
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus); };
  }, [status]);
  return status;
}
