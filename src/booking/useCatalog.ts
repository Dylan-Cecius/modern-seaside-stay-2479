import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
export type Service = Tables<'booking_services'>;
export type Settings = Tables<'booking_settings'>;
export type Hours = Tables<'booking_hours'>;
export function useCatalog() {
  const [services,setServices]=useState<Service[]>([]);
  const [settings,setSettings]=useState<Settings|null>(null);
  const [hours,setHours]=useState<Hours[]>([]);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  async function reload() {
    setLoading(true);
    const [a,b,c]=await Promise.all([supabase.from('booking_services').select('*').order('sort_order'),supabase.from('booking_settings').select('*').eq('id',true).single(),supabase.from('booking_hours').select('*').order('weekday')]);
    if(a.error||b.error||c.error) setError('Le calendrier est temporairement indisponible. Réessayez.');
    else {setServices(a.data||[]);setSettings(b.data);setHours(c.data||[]);setError('');}
    setLoading(false);
  }
  useEffect(()=>{void reload();},[]);
  return {services,settings,hours,error,loading,reload,setServices,setSettings,setHours};
}
