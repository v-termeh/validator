import { describe, it, expect } from 'vitest';
import { isAlphaNumericWithPersian } from '../src/methods/alnumFa';

describe('isAlphaNumericWithPersian', () => {
  it('returns true for English, Persian, and numbers', () => {
    expect(isAlphaNumericWithPersian('abc123')).toBe(true);
    expect(isAlphaNumericWithPersian('۱۲۳۴۵۶۷۸۹۰')).toBe(true); // Persian numbers
    expect(isAlphaNumericWithPersian('سلام123')).toBe(true); // Persian letters
    expect(isAlphaNumericWithPersian('abc_سلام', ['_'])).toBe(true);
  });

  it('returns false for invalid chars', () => {
    expect(isAlphaNumericWithPersian('abc 123')).toBe(false);
    expect(isAlphaNumericWithPersian('سلام!')).toBe(false);
    expect(isAlphaNumericWithPersian('')).toBe(false);
    expect(isAlphaNumericWithPersian(undefined)).toBe(false);
  });
});
