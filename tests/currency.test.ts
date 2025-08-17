import { describe, it, expect } from 'vitest';
import { moneyToCRC } from '../src/state/calculations';

describe('currency conversion', () => {
  it('converts USD to CRC', () => {
    expect(moneyToCRC({ amount: 10, currency: 'USD' }, 500)).toBe(5000);
  });
  it('passes through CRC', () => {
    expect(moneyToCRC({ amount: 10000, currency: 'CRC' }, 500)).toBe(10000);
  });
});
