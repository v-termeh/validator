import { describe, it, expect } from 'vitest';
import { isValidIranianIdNumber } from '../src/methods/irIdNumber';

describe('isValidIranianIdNumber', () => {
  it('returns true for valid ID numbers', () => {
    expect(isValidIranianIdNumber('1234567890')).toBe(true);
    expect(isValidIranianIdNumber('1')).toBe(true);
  });
  it('returns false for invalid or malformed numbers', () => {
    expect(isValidIranianIdNumber('12345678901')).toBe(false);
    expect(isValidIranianIdNumber('abc')).toBe(false);
    expect(isValidIranianIdNumber('')).toBe(false);
    expect(isValidIranianIdNumber(undefined)).toBe(false);
  });
});
