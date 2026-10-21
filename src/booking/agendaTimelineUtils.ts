import type { Tables } from '@/integrations/supabase/types';

export type AgendaEvent = Tables<'booking_events'> & {
  booking_customers: Tables<'booking_customers'> | null;
};
export type AgendaView = 'day' | 'week';
export type PastelTone = 'blue' | 'lilac' | 'pink' | 'mint' | 'peach' | 'neutral';

export const START_DATE = '2026-12-01';
export const END_DATE = '2026-12-31';
export const HOUR_HEIGHT = 72;
export const TIME_ZONE = 'Europe/Brussels';

export const inTestPeriod = (date: string): boolean => date >= START_DATE && date <= END_DATE;

export function offsetDate(date: string, offsetDays: number): string {
  const d = new Date(date + 'T12:00:00Z');
  if (Number.isNaN(d.getTime())) return START_DATE;
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Tue–Sat columns, as in the approved design; Sunday/Monday remain closed. */
export function visibleAgendaDays(date: string, view: AgendaView): string[] {
  if (view === 'day') return [date];
  const d = new Date(date + 'T12:00:00Z');
  const mondayOffset = (d.getUTCDay() + 6) % 7;
  const monday = offsetDate(date, -mondayOffset);
  return [1, 2, 3, 4, 5].map((n) => offsetDate(monday, n));
}

export function moveAgendaDate(date: string, view: AgendaView, direction: -1 | 1): string {
  const next = offsetDate(date, direction * (view === 'week' ? 7 : 1));
  return inTestPeriod(next) ? next : date;
}

export function belgianDay(instant: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(instant));
  const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return get('year') + '-' + get('month') + '-' + get('day');
}

export function belgianMinutes(instant: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0');
  return get('hour') * 60 + get('minute');
}

export function belgianClock(instant: string): string {
  const mins = belgianMinutes(instant);
  return String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
}

export function dateLabel(date: string, compact = false): string {
  const dateObject = new Date(date + 'T12:00:00Z');
  return new Intl.DateTimeFormat('fr-BE', {
    timeZone: TIME_ZONE, weekday: 'short', day: 'numeric', month: 'short',
    year: compact ? undefined : 'numeric'
  }).format(dateObject);
}

export function eventTone(event: Pick<AgendaEvent, 'kind' | 'service_names'>): PastelTone {
  if (event.kind === 'block') return 'neutral';
  const service = (event.service_names || '').toLocaleLowerCase('fr-BE');
  if (service.includes('enfant')) return 'mint';
  if (service.includes('coupe') && service.includes('barbe')) return 'pink';
  if (service.includes('barbe') || service.includes('ancienne')) return 'lilac';
  if (service.includes('coupe')) return 'blue';
  return 'peach';
}

export function activeDayEvents(events: AgendaEvent[], day: string): AgendaEvent[] {
  if (!inTestPeriod(day)) return [];
  return events
    .filter((event) => event.status === 'confirmed' && belgianDay(event.starts_at) === day)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}

export function minuteRange(openClose: Array<{ opens: string; closes: string; enabled: boolean }>): { from: number; to: number } {
  const active = openClose.filter((hours) => hours.enabled);
  const startHours = active.map((h) => Math.floor(Number(h.opens.slice(0, 2))));
  const closeHours = active.map((h) => Math.ceil(Number(h.closes.slice(0, 2)) + Number(h.closes.slice(3, 5)) / 60));
  const from = Math.max(0, Math.min(10, ...startHours));
  const to = Math.min(24, Math.max(19, ...closeHours));
  return { from: from * 60, to: to * 60 };
}

export function eventPosition(
  startsAt: string,
  endsAt: string,
  fromMinutes: number,
  toMinutes: number
): { top: number; height: number; compact: boolean } | null {
  const start = belgianMinutes(startsAt);
  const end = belgianMinutes(endsAt);
  const clampedStart = Math.max(fromMinutes, start);
  const clampedEnd = Math.min(toMinutes, end);
  if (clampedEnd <= clampedStart) return null;
  const top = (clampedStart - fromMinutes) * HOUR_HEIGHT / 60;
  const height = Math.max(1, (clampedEnd - clampedStart) * HOUR_HEIGHT / 60 - 3);
  return { top, height, compact: height < 48 };
}


/** Uniform 15/30-minute grid, computed from the configured opening hours. */
export function clockMinutes(clock: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)/.exec(clock);
  return match ? Number(match[1]) * 60 + Number(match[2]) : NaN;
}
export function minuteClock(minutes: number): string {
  return String(Math.floor(minutes / 60)).padStart(2, '0') +
    ':' + String(minutes % 60).padStart(2, '0');
}

/** December 2026 in Brussels uses CET (UTC+01:00). */
export function brusselsInstant(day: string, minutes: number): number {
  return Date.parse(day + 'T' + minuteClock(minutes) + ':00+01:00');
}

type HoursWindow = { enabled: boolean; opens: string; closes: string };
type BusyWindow = Pick<AgendaEvent, 'starts_at' | 'ends_at' | 'status'>;

export function bookingOverlaps(
  startsAt: number, endsAt: number, events: readonly BusyWindow[]
): boolean {
  return events.some((event) =>
    event.status === 'confirmed' &&
    Date.parse(event.starts_at) < endsAt &&
    Date.parse(event.ends_at) > startsAt
  );
}

/** Display only empty half-hour/quarter-hour start cells. A longer service
 * is rechecked after it is chosen and again by the PostgreSQL exclusion constraint.
 */
export function availableGridStarts(
  day: string, hours: HoursWindow | undefined,
  events: readonly BusyWindow[], interval: number, nowMs = Date.now()
): number[] {
  if (!inTestPeriod(day) || !hours?.enabled || ![15, 30].includes(interval)) return [];
  const opens = clockMinutes(hours.opens);
  const closes = clockMinutes(hours.closes);
  if (!Number.isFinite(opens) || !Number.isFinite(closes) || closes <= opens) return [];
  const starts: number[] = [];
  for (let minute = Math.ceil(opens / interval) * interval; minute + interval <= closes; minute += interval) {
    const start = brusselsInstant(day, minute);
    const end = brusselsInstant(day, minute + interval);
    if (start > nowMs && !bookingOverlaps(start, end, events)) starts.push(minute);
  }
  return starts;
}

/** Validate the selected service against closing time and all confirmed bookings.
 * This is an early user-facing check; create_booking remains the authoritative guard.
 */
export function appointmentFits(
  day: string, minutes: number, duration: number,
  hours: HoursWindow | undefined, events: readonly BusyWindow[],
  nowMs = Date.now()
): boolean {
  if (!inTestPeriod(day) || !hours?.enabled || duration <= 0 ||
      !Number.isFinite(duration) || !Number.isInteger(minutes)) return false;
  const opens = clockMinutes(hours.opens);
  const closes = clockMinutes(hours.closes);
  if (!Number.isFinite(opens) || !Number.isFinite(closes) ||
      minutes < opens || minutes + duration > closes || minutes % 15 !== 0) return false;
  const start = brusselsInstant(day, minutes);
  const end = start + duration * 60_000;
  return start > nowMs && !bookingOverlaps(start, end, events);
}
