import { useEffect, useState } from 'react';
import { CalendarPlus, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { customerSchema, bookingError } from './rules';
import {
  appointmentFits, brusselsInstant, dateLabel, minuteClock
} from './agendaTimelineUtils';
import type { AgendaEvent } from './agendaTimelineUtils';
import type { Hours, Service } from './useCatalog';
import styles from './QuickBookingDialog.module.css';

export type QuickBookingSlot = { day: string; minute: number };

type Props = {
  slot: QuickBookingSlot | null;
  services: Service[];
  hours: Hours[];
  events: AgendaEvent[];
  onClose: () => void;
  onCreated: () => void;
};

export default function QuickBookingDialog({
  slot, services, hours, events, onClose, onCreated
}: Props) {
  const [serviceId, setServiceId] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slot) return;
    setServiceId(''); setFirst(''); setLast(''); setPhone('');
    setEmail(''); setNote(''); setError(''); setSaving(false);
  }, [slot?.day, slot?.minute]);

  const available = services.filter((s) => s.active && !s.supplement);
  const chosen = available.find((s) => s.id === serviceId);
  const day = slot?.day || '';
  const minute = slot?.minute ?? 0;
  const weekday = slot ? new Date(day + 'T12:00:00Z').getUTCDay() : -1;
  const opening = hours.find((h) => h.weekday === weekday);
  const fits = !!slot && !!chosen &&
    appointmentFits(day, minute, chosen.duration_minutes, opening, events);
  const end = chosen ? minuteClock(minute + chosen.duration_minutes) : '—';
  const price = chosen ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(chosen.price_cents / 100) : '';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!slot || !chosen) { setError('Choisissez une prestation.'); return; }
    if (!appointmentFits(slot.day, slot.minute, chosen.duration_minutes, opening, events)) {
      setError('Cette prestation ne tient pas dans le créneau sélectionné ou chevauche un rendez-vous. Choisissez une autre heure.');
      return;
    }
    const parsed = customerSchema.safeParse({ first, last, phone, email });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Coordonnées invalides.'); return; }
    if (note.trim().length > 1000) { setError('La note ne peut pas dépasser 1 000 caractères.'); return; }
    setSaving(true);
    const { error: saveError } = await supabase.rpc('admin_create_booking', {
      p_services: [chosen.id],
      p_start: new Date(brusselsInstant(slot.day, slot.minute)).toISOString(),
      p_first: parsed.data.first,
      p_last: parsed.data.last,
      p_phone: parsed.data.phone,
      p_email: parsed.data.email || '',
      p_note: note.trim()
    });
    setSaving(false);
    if (saveError) {
      setError(bookingError(saveError) || 'Impossible d’enregistrer le rendez-vous.');
      return;
    }
    onCreated();
  }

  return <Dialog open={Boolean(slot)} onOpenChange={(open) => { if (!open && !saving) onClose(); }}>
    <DialogContent className={styles.dialog} aria-describedby="quick-booking-description">
      <DialogHeader>
        <div className={styles.eyebrow}><CalendarPlus size={17} /> AJOUT RAPIDE</div>
        <DialogTitle className={styles.title}>Nouveau rendez-vous</DialogTitle>
        <DialogDescription className={styles.description} id="quick-booking-description">
          {slot ? dateLabel(day) + ' · ' + minuteClock(minute) + ' · Heure de Bruxelles' : ''}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={submit} className={styles.form}>
        <label className={styles.field}>
          <span>Prestation <span aria-hidden="true">*</span></span>
          <select required value={serviceId} onChange={(e) => { setServiceId(e.target.value); setError(''); }}>
            <option value="">Choisir une prestation</option>
            {available.map((s) => <option key={s.id} value={s.id}>
              {s.name} — {s.duration_minutes} min — {(s.price_cents / 100).toFixed(2).replace('.', ',')} €
            </option>)}
          </select>
        </label>
        <div className={styles.recap} aria-live="polite">
          <div><span>Début</span><strong>{minuteClock(minute)}</strong></div>
          <div><span>Fin calculée</span><strong>{end}</strong></div>
          <div><span>Tarif</span><strong>{price || '—'}</strong></div>
        </div>
        {chosen && !fits && <p className={styles.warning} role="status">
          La durée de cette prestation dépasse l’horaire libre ou le salon est fermé. Choisissez un autre créneau.
        </p>}
        <div className={styles.twoColumns}>
          <label className={styles.field}><span>Prénom *</span>
            <input required autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} maxLength={80} />
          </label>
          <label className={styles.field}><span>Nom *</span>
            <input required autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} maxLength={80} />
          </label>
          <label className={styles.field}><span>Téléphone *</span>
            <input required type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
          </label>
          <label className={styles.field}><span>Courriel (facultatif)</span>
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
          </label>
        </div>
        <label className={styles.field}><span>Note interne (facultative)</span>
          <textarea rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Précision utile pour le rendez-vous…" />
        </label>
        <p className={styles.privacy}>Coordonnées accessibles uniquement à l’administrateur. Aucun courriel ni SMS automatique n’est envoyé.</p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.footer}>
          <button className={styles.secondary} type="button" disabled={saving} onClick={onClose}>Annuler</button>
          <button className={styles.primary} type="submit" disabled={!chosen || !fits || saving}>
            <Save size={17} aria-hidden="true" /> {saving ? 'Enregistrement…' : 'Créer le rendez-vous'}
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
}
