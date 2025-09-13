import { describe, it, expect } from 'vitest';
import { isAlphaNumeric } from '../src/methods/alnum';

describe('isAlphaNumeric', () => {
  it('returns true for alphanumeric strings', () => {
    expect(isAlphaNumeric('abc123')).toBe(true);
    expect(isAlphaNumeric('A1B2C3')).toBe(true);
    expect(isAlphaNumeric('abc123_', ['_'])).toBe(true);
    expect(isAlphaNumeric('abc-123', ['-'])).toBe(true);
  });

  it('returns false for strings with invalid chars', () => {
    expect(isAlphaNumeric('abc 123')).toBe(false);
    expect(isAlphaNumeric('abc@123')).toBe(false);
    expect(isAlphaNumeric('')).toBe(false);
    expect(isAlphaNumeric(undefined)).toBe(false);
  });
});
