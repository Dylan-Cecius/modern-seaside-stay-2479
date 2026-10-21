import { z } from 'zod';
export const TEST_START = '2026-12-01';
export const TEST_END = '2026-12-31';
export const TIME_ZONE = 'Europe/Brussels';
export const isTestDate = (day: string) => /^2026-12-(0[1-9]|[12][0-9]|3[01])$/.test(day);
export const canSelectBookingDay = (day: string, service: string, open: boolean) => isTestDate(day) && Boolean(service) && open;
export const publicBookingEnabled = (settings: { public_enabled: boolean; durations_validated: boolean; privacy_validated: boolean } | null) => Boolean(settings?.public_enabled && settings.durations_validated && settings.privacy_validated);
export const shouldLoadSlots = (day: string, service: string) => isTestDate(day) && Boolean(service);
export const canConfirmBooking = (s: { enabled: boolean; busy: boolean; slot: string; slots: string[]; consent: boolean; manual: boolean }) => s.enabled && !s.busy && Boolean(s.slot) && s.slots.includes(s.slot) && (s.manual || s.consent);
export const brusselsDay = (instant: string) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(instant));
export const brusselsTime = (instant: string) => new Intl.DateTimeFormat('fr-BE', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' }).format(new Date(instant));
export const localDecemberInstant = (day: string, time: string) => {
  if (!isTestDate(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Date ou heure invalide.');
  // December 2026 in Brussels is CET (UTC+01:00), independent of browser timezone.
  return new Date(`${day}T${time}:00+01:00`).toISOString();
};
export const customerSchema = z.object({
  first: z.string().trim().min(1, 'Prénom requis.').max(80),
  last: z.string().trim().min(1, 'Nom requis.').max(80),
  phone: z.string().trim().regex(/^\+?[0-9 () .-]{7,30}$/, 'Téléphone invalide.'),
  email: z.union([z.literal(''), z.string().trim().email('Courriel invalide.').max(255)]),
});
export function bookingError(error: { message?: string; code?: string } | null) {
  if (!error) return '';
  const message = error.message || '';
  if (error.code === '23P01' || message.includes('exclusion') || message.includes('SLOT_TAKEN')) return 'Ce créneau vient d’être pris ou bloqué. Choisissez une autre heure.';
  if (message.includes('ADMIN_REQUIRED')) return 'Accès réservé à l’administrateur.';
  if (message.includes('DECEMBER_ONLY')) return 'Les rendez-vous sont limités à décembre 2026.';
  if (message.includes('BOOKING_DISABLED')) return 'Les réservations ne sont pas encore ouvertes.';
  if (message.includes('RATE_LIMITED')) return 'Trop de demandes rapprochées. Réessayez dans un moment ou passez directement au salon.';
  if (message.includes('CLOSED')) return 'Le salon est fermé à cette heure.';
  return 'L’opération n’a pas abouti. Vérifiez les informations et réessayez.';
}
