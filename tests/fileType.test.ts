import { describe, it, expect } from 'vitest';
import { isValidFileType } from '../src/methods/fileType';

describe('isValidFileType', () => {
  function makeFile(type: string): File {
    return new File(['a'], 'test.txt', { type });
  }

  it('returns true for allowed MIME types', () => {
    expect(isValidFileType(makeFile('image/png'), ['image/png'])).toBe(true);
    expect(isValidFileType(makeFile('text/plain'), ['text/plain', 'image/png'])).toBe(true);
  });

  it('returns false for disallowed MIME types', () => {
    expect(isValidFileType(makeFile('image/jpeg'), ['image/png'])).toBe(false);
    expect(isValidFileType(undefined, ['image/png'])).toBe(false);
  });
});
