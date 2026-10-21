import { describe, expect, test } from 'bun:test';
import {
  START_DATE, END_DATE, HOUR_HEIGHT, activeDayEvents, belgianClock, belgianDay,
  dateLabel, eventPosition, eventTone, inTestPeriod, minuteRange, moveAgendaDate,
  offsetDate, visibleAgendaDays, availableGridStarts, appointmentFits,
  brusselsInstant, minuteClock, bookingOverlaps
} from '../src/booking/agendaTimelineUtils';
import type { AgendaEvent } from '../src/booking/agendaTimelineUtils';

const sample = (id: string, start: string, end: string, service: string,
  kind: 'appointment' | 'block' = 'appointment', status: 'confirmed' | 'cancelled' = 'confirmed') => ({
  id, starts_at: start, ends_at: end, kind, service_names: service, status,
  booking_customers: { first_name: 'Test', last_name: 'Fixture' }
}) as AgendaEvent;

describe('agenda de décembre — calendrier pastel', () => {
  test('le mois de test est strict', () => {
    expect(inTestPeriod(START_DATE)).toBe(true);
    expect(inTestPeriod(END_DATE)).toBe(true);
    expect(inTestPeriod('2026-11-30')).toBe(false);
    expect(inTestPeriod('2027-01-01')).toBe(false);
  });
  test('la semaine affiche mardi à samedi — jamais le dimanche ou lundi', () => {
    expect(visibleAgendaDays('2026-12-02', 'week')).toEqual([
      '2026-12-01', '2026-12-02', '2026-12-03', '2026-12-04', '2026-12-05'
    ]);
    expect(visibleAgendaDays('2026-12-31', 'week')).toEqual([
      '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02'
    ]);
    expect(visibleAgendaDays('2026-12-02', 'day')).toEqual(['2026-12-02']);
  });
  test('le changement de période reste limité à décembre 2026', () => {
    expect(moveAgendaDate('2026-12-01', 'week', -1)).toBe('2026-12-01');
    expect(moveAgendaDate('2026-12-01', 'week', 1)).toBe('2026-12-08');
    expect(moveAgendaDate('2026-12-31', 'day', 1)).toBe('2026-12-31');
    expect(offsetDate('2026-12-31', 1)).toBe('2027-01-01');
  });
  test('l’heure se calcule toujours en Belgique indépendamment du navigateur', () => {
    expect(belgianClock('2026-12-02T09:00:00.000Z')).toBe('10:00');
    expect(belgianDay('2026-12-02T09:00:00.000Z')).toBe('2026-12-02');
    expect(dateLabel('2026-12-02', true)).toContain('2');
  });
  test('position et hauteur suivent exactement la durée réservée', () => {
    const thirty = eventPosition('2026-12-02T09:00:00Z','2026-12-02T09:30:00Z',600,1140);
    expect(thirty).toMatchObject({top: 0, height: HOUR_HEIGHT / 2 - 3, compact: true});
    const fortyFive = eventPosition('2026-12-02T09:30:00Z','2026-12-02T10:15:00Z',600,1140);
    expect(fortyFive).toMatchObject({top: HOUR_HEIGHT / 2, height: HOUR_HEIGHT * .75 - 3, compact: false});
    expect(eventPosition('2026-12-02T07:00:00Z','2026-12-02T08:00:00Z',600,1140)).toBe(null);
  });
  test('le service choisit une couleur pastel lisible', () => {
    expect(eventTone(sample('a','2026-12-02T09:00:00Z','2026-12-02T09:30:00Z','Coupe homme'))).toBe('blue');
    expect(eventTone(sample('b','2026-12-02T09:00:00Z','2026-12-02T09:30:00Z','Taille de barbe classique'))).toBe('lilac');
    expect(eventTone(sample('c','2026-12-02T09:00:00Z','2026-12-02T09:30:00Z','Coupe + barbe'))).toBe('pink');
    expect(eventTone(sample('d','2026-12-02T09:00:00Z','2026-12-02T09:30:00Z','Coupe enfant'))).toBe('mint');
    expect(eventTone(sample('e','2026-12-02T09:00:00Z','2026-12-02T09:30:00Z','', 'block'))).toBe('neutral');
  });
  test('événements confirmés réels uniquement, aucun exemple dans la base', () => {
    const events: AgendaEvent[] = [
      sample('a','2026-12-02T09:00:00Z','2026-12-02T09:30:00Z','Coupe homme'),
      sample('b','2026-12-02T10:00:00Z','2026-12-02T10:30:00Z','Coupe homme','appointment','cancelled'),
      sample('c','2026-12-03T09:00:00Z','2026-12-03T09:30:00Z','Coupe enfant'),
      sample('d','2026-12-02T11:00:00Z','2026-12-02T11:45:00Z','', 'block')
    ];
    expect(activeDayEvents(events,'2026-12-02').map(x=>x.id)).toEqual(['a','d']);
    expect(activeDayEvents(events,'2026-12-03').map(x=>x.id)).toEqual(['c']);
    expect(activeDayEvents(events,'2027-01-01')).toHaveLength(0);
  });
  test('plages étendues pour horaires configurables', () => {
    expect(minuteRange([{enabled:true,opens:'09:30:00',closes:'20:30:00'}]))
      .toEqual({from:540,to:1260});
    expect(minuteRange([{enabled:true,opens:'10:00:00',closes:'19:00:00'}]))
      .toEqual({from:600,to:1140});
  });
  test('les grilles vides proposent des départs 10 h – 19 h, sans texte de rendez-vous fictifs', () => {
    const hours = { enabled: true, opens: '10:00:00', closes: '19:00:00' };
    const now = Date.parse('2026-10-21T12:00:00Z');
    const starts = availableGridStarts('2026-12-02', hours, [], 30, now);
    expect(starts).toHaveLength(18);
    expect(starts.slice(0, 4).map(minuteClock)).toEqual(['10:00','10:30','11:00','11:30']);
    expect(starts[starts.length - 1]).toBe(1110);
    expect(availableGridStarts('2026-12-02', hours, [], 15, now)).toHaveLength(36);
    expect(availableGridStarts('2026-12-06', { ...hours, enabled: false }, [], 30, now)).toHaveLength(0);
    expect(availableGridStarts('2026-12-02', hours, [], 30, Date.parse('2027-01-01T00:00:00Z'))).toHaveLength(0);
  });
  test('les créneaux bloqués et les rendez-vous pris ne sont pas cliquables', () => {
    const hours = { enabled: true, opens: '10:00:00', closes: '19:00:00' };
    const event = sample('booked', '2026-12-02T10:30:00Z', '2026-12-02T11:15:00Z', 'Coupe homme');
    const booked = availableGridStarts('2026-12-02', hours, [event], 30, Date.parse('2026-10-21T12:00:00Z'));
    expect(booked).toContain(600); // 10:00 Brussels
    expect(booked).not.toContain(690); // 11:30 Brussels
    expect(booked).not.toContain(720); // 12:00 overlaps until 12:15
    expect(booked).toContain(750); // 12:30
    expect(bookingOverlaps(Date.parse('2026-12-02T10:30:00Z'),Date.parse('2026-12-02T11:00:00Z'),[event])).toBe(true);
  });
  test('la durée choisie est vérifiée avant d’enregistrer et le serveur revérifie', () => {
    const h={ enabled: true, opens: '10:00:00', closes: '19:00:00' };
    const now=Date.parse('2026-10-21T00:00:00Z');
    expect(appointmentFits('2026-12-02',600,45,h,[],now)).toBe(true);
    expect(appointmentFits('2026-12-02',1110,45,h,[],now)).toBe(false); // ends 19:15
    expect(appointmentFits('2026-12-02',1080,60,h,[],now)).toBe(true);
    expect(appointmentFits('2026-12-02',630,30,h,
      [sample('b','2026-12-02T09:30:00Z','2026-12-02T10:30:00Z','Coupe homme')],now)).toBe(false);
    expect(minuteClock(600)).toBe('10:00');
    expect(new Date(brusselsInstant('2026-12-02',600)).toISOString()).toBe('2026-12-02T09:00:00.000Z');
  });

});
