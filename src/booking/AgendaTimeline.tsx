import type { CSSProperties } from 'react';
import { Baby, Ban, CalendarDays, ChevronLeft, ChevronRight, Scissors, Sparkles, UsersRound } from 'lucide-react';
import type { Hours } from './useCatalog';
import {
  HOUR_HEIGHT, START_DATE, activeDayEvents, availableGridStarts, belgianClock, belgianDay, dateLabel, eventPosition, minuteClock,
  eventTone, inTestPeriod, minuteRange, moveAgendaDate, visibleAgendaDays
} from './agendaTimelineUtils';
import type { AgendaEvent, AgendaView, PastelTone } from './agendaTimelineUtils';
import styles from './AgendaTimeline.module.css';

type TimelineProps = {
  date: string;
  view: AgendaView;
  events: AgendaEvent[];
  hours: Hours[];
  onSelect: (event: AgendaEvent) => void;
  onDateChange: (date: string) => void;
  onCreateAtSlot: (day: string, minutes: number) => void;
  slotIntervalMinutes: number;
};

const tonalClasses: Record<PastelTone, string> = {
  blue: styles.blue, lilac: styles.lilac, pink: styles.pink,
  mint: styles.mint, peach: styles.peach, neutral: styles.neutral
};

function EventBadge({ tone }: { tone: PastelTone }) {
  const Icon = tone === 'blue' ? Scissors : tone === 'lilac' ? Sparkles :
    tone === 'pink' ? UsersRound : tone === 'mint' ? Baby : tone === 'neutral' ? Ban : CalendarDays;
  return <span className={styles.eventIcon} aria-hidden="true"><Icon size={15} strokeWidth={2} /></span>;
}

export function AgendaPeriodNavigation({
  date, view, onDateChange
}: Pick<TimelineProps, 'date' | 'view' | 'onDateChange'>) {
  const days = visibleAgendaDays(date, view);
  const previous = moveAgendaDate(date, view, -1);
  const next = moveAgendaDate(date, view, 1);
  const today = belgianDay(new Date().toISOString());
  const jumpTo = inTestPeriod(today) ? today : START_DATE;
  const period = view === 'day' ? dateLabel(date) :
    dateLabel(days[0], true) + ' — ' + dateLabel(days[days.length - 1]);
  return <div className={styles.navigation} aria-label="Navigation de l’agenda">
    <button type="button" className={styles.navArrow} aria-label="Période précédente"
      disabled={previous === date} onClick={() => onDateChange(previous)}><ChevronLeft size={18} /></button>
    <span className={styles.period} aria-live="polite">{period}</span>
    <button type="button" className={styles.navArrow} aria-label="Période suivante"
      disabled={next === date} onClick={() => onDateChange(next)}><ChevronRight size={18} /></button>
    <button type="button" className={styles.jump} onClick={() => onDateChange(jumpTo)}>
      {inTestPeriod(today) ? 'Aujourd’hui' : 'Début du test'}
    </button>
  </div>;
}

export default function AgendaTimeline({
  date, view, events, hours, onSelect, onCreateAtSlot, slotIntervalMinutes
}: Omit<TimelineProps, 'onDateChange'>) {
  const days = visibleAgendaDays(date, view);
  const dayHours = days.map((day) => {
    const weekday = new Date(day + 'T12:00:00Z').getUTCDay();
    return hours.find((h) => h.weekday === weekday);
  });
  const range = minuteRange(dayHours.filter((h): h is Hours => Boolean(h)));
  const gridHeight = (range.to - range.from) * HOUR_HEIGHT / 60;
  const dayCount = days.length;
  const gridVars = {
    '--agenda-days': dayCount,
    '--agenda-hour-height': HOUR_HEIGHT + 'px'
  } as CSSProperties;
  const steps = Array.from({ length: Math.floor((range.to - range.from) / 60) + 1 },
    (_, i) => range.from / 60 + i);

  return <section className={styles.root} aria-label={view === 'week' ? 'Agenda hebdomadaire' : 'Agenda journalier'}>
    <div className={styles.scrollArea} role="region" tabIndex={0}
      aria-label="Grille horaire du salon ; faites défiler horizontalement pour voir tous les jours">
      <div className={styles.grid + ' ' + (view === 'week' ? styles.week : styles.single)} style={gridVars}>
        <div className={styles.clockHeader} style={{ gridRow: 1, gridColumn: 1 }}>Heure</div>
        {days.map((day, index) => {
          const daily = activeDayEvents(events, day);
          const bookingCount = daily.filter((event) => event.kind === 'appointment').length;
          return <div key={'head-' + day}
            className={styles.dayHeader + (!inTestPeriod(day) ? ' ' + styles.outsidePeriod : '')}
            style={{ gridRow: 1, gridColumn: index + 2 }}>
            <strong>{dateLabel(day, true)}</strong>
            <span>{!inTestPeriod(day) ? 'Hors période test' :
              bookingCount + ' rendez-vous'}</span>
          </div>;
        })}
        <div className={styles.timeRail} style={{ gridRow: 2, gridColumn: 1, height: gridHeight }}>
          {steps.map((hour) => <span className={styles.hourMark} key={hour}
            style={{ top: ((hour * 60 - range.from) / 60) * HOUR_HEIGHT }}>
            {String(hour).padStart(2, '0') + ':00'}
          </span>)}
        </div>
        {days.map((day, index) => {
          const open = dayHours[index]?.enabled && inTestPeriod(day);
          const daily = activeDayEvents(events, day);
          return <div key={'lane-' + day}
            className={styles.dayLane + (!open ? ' ' + styles.closedLane : '')}
            style={{ gridRow: 2, gridColumn: index + 2, height: gridHeight }}>
            {open && availableGridStarts(day, dayHours[index], events, slotIntervalMinutes).map((minute) =>
              <button key={'slot-' + minute} type="button"
                className={styles.emptySlot}
                style={{
                  top: (minute - range.from) * HOUR_HEIGHT / 60,
                  height: slotIntervalMinutes * HOUR_HEIGHT / 60
                }}
                aria-label={'Ajouter un rendez-vous le ' + dateLabel(day) + ' à ' + minuteClock(minute)}
                title={'Ajouter à ' + minuteClock(minute)}
                onClick={() => onCreateAtSlot(day, minute)}
              />
            )}
            {inTestPeriod(day) && daily.map((event) => {
              const position = eventPosition(event.starts_at, event.ends_at, range.from, range.to);
              if (!position) return null;
              const tone = eventTone(event);
              const customerName = event.booking_customers ?
                event.booking_customers.first_name + ' ' + event.booking_customers.last_name :
                'Coordonnées non disponibles';
              const name = event.kind === 'block' ? 'Plage bloquée' : customerName;
              const service = event.kind === 'block' ? (event.note || 'Indisponible') :
                (event.service_names || 'Prestation');
              const fullTime = belgianClock(event.starts_at) + ' – ' + belgianClock(event.ends_at);
              return <button key={event.id} type="button"
                onClick={() => onSelect(event)}
                className={styles.event + ' ' + tonalClasses[tone] +
                  (position.compact ? ' ' + styles.compact : '')}
                style={{ top: position.top, height: position.height }}
                aria-label={fullTime + ' — ' + name + ' — ' + service + '. Voir le détail'}
                title={fullTime + ' — ' + name + ' — ' + service}>
                <span className={styles.eventContent}>
                  <span className={styles.eventTime}>{fullTime}</span>
                  <strong className={styles.eventName}>{name}</strong>
                  <span className={styles.eventService}>{service}</span>
                </span>
                {position.height >= 36 && <EventBadge tone={tone} />}
              </button>;
            })}
          </div>;
        })}
      </div>
    </div>
    <p className={styles.hint}>Agenda du salon · Heure de Bruxelles · Les cartes reflètent uniquement les rendez-vous enregistrés.</p>
  </section>;
}
