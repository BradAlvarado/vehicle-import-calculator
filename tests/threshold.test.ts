import { describe, it, expect } from 'vitest';
import { computeStatus } from '../src/state/calculations';

describe('threshold status', () => {
  it('green at or above threshold', () => {
    expect(computeStatus(15, 15, 2)).toBe('GREEN');
  });
  it('yellow within tolerance', () => {
    expect(computeStatus(13.5, 15, 2)).toBe('YELLOW');
  });
  it('red below tolerance band', () => {
    expect(computeStatus(10, 15, 2)).toBe('RED');
  });
});
