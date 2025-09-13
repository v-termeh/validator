import { describe, it, expect } from 'vitest';
import { isValidIranianPostalCode } from '../src/methods/irPostalCode';

describe('isValidIranianPostalCode', () => {
  it('returns true for valid postal codes', () => {
    expect(isValidIranianPostalCode('1234567890')).toBe(true);
    expect(isValidIranianPostalCode('9876543210')).toBe(true);
  });
  it('returns false for invalid or malformed codes', () => {
    expect(isValidIranianPostalCode('123456789')).toBe(false);
    expect(isValidIranianPostalCode('abcdefghij')).toBe(false);
    expect(isValidIranianPostalCode('')).toBe(false);
    expect(isValidIranianPostalCode(undefined)).toBe(false);
  });
});
