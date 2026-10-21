import { expect, test } from 'bun:test';
import { shouldPoll, syncLabel, POLL_MS } from '../src/booking/agendaSync';
test('polling only as fallback on a visible tab', () => {
  expect(shouldPoll('live', true)).toBe(false);
  expect(shouldPoll('polling', true)).toBe(true);
  expect(shouldPoll('connecting', true)).toBe(true);
  expect(shouldPoll('polling', false)).toBe(false);
});
test('poll interval between 15 and 30 s', () => { expect(POLL_MS).toBeGreaterThanOrEqual(15000); expect(POLL_MS).toBeLessThanOrEqual(30000); });
test('never claims live sync unless subscribed', () => {
  expect(syncLabel('polling')).not.toContain('temps réel');
  expect(syncLabel('connecting')).not.toContain('temps réel');
  expect(syncLabel('live')).toContain('temps réel');
});
