import { describe, expect, test } from 'bun:test';
import { isTestDate, localDecemberInstant, brusselsDay, brusselsTime, customerSchema, TIME_ZONE } from './rules';
describe('December 2026 booking rules',()=>{
 test('accepts only actual December 2026 days',()=>{expect(isTestDate('2026-12-01')).toBe(true);expect(isTestDate('2026-12-31')).toBe(true);for(const day of ['2026-11-30','2027-01-01','2025-12-01','2026-12-00','2026-12-32'])expect(isTestDate(day)).toBe(false);});
 test('10:00 Brussels is 09:00 UTC in December',()=>{expect(TIME_ZONE).toBe('Europe/Brussels');expect(localDecemberInstant('2026-12-01','10:00')).toBe('2026-12-01T09:00:00.000Z');expect(brusselsTime('2026-12-01T09:00:00Z')).toBe('10:00');});
 test('Belgian day boundary is independent of browser timezone',()=>{expect(brusselsDay('2026-11-30T23:00:00Z')).toBe('2026-12-01');expect(brusselsDay('2026-12-31T23:00:00Z')).toBe('2027-01-01');});
 test('rejects manual dates outside the test',()=>{expect(()=>localDecemberInstant('2027-01-01','10:00')).toThrow();});
 test('first and last name and phone are required, email optional',()=>{const valid={first:'Marie',last:'Martin',phone:'+32 470 12 34 56',email:''};expect(customerSchema.safeParse(valid).success).toBe(true);for(const key of ['first','last','phone'])expect(customerSchema.safeParse({...valid,[key]:''}).success).toBe(false);expect(customerSchema.safeParse({...valid,email:'invalid'}).success).toBe(false);});
});