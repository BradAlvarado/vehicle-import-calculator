import { describe, it, expect } from 'vitest';
import { calculateScenario, computeStatus } from '../src/state/calculations';
import { Scenario } from '../src/state/types';

function baseScenario(age: number): Scenario {
  return {
    id: '1',
    vehicle: { age },
    exchangeRate: 500,
    purchase: { amount: 10000, currency: 'USD' },
    shipping: { amount: 1000, currency: 'USD' },
    customsBaseCRC: 4000000,
    fees: [ { label: 'Test', amountCRC: 100000, enabled: true } ],
    marketPrice: { mode: 'single', single: { amount: 15000000, currency: 'CRC' } },
  settings: { isc30: 0.52, isc48: 0.73, iva: 0.13, dai: 0, arancel: 0.01, thresholdPct: 15, tolerancePct: 2, useInvoiceAsBase: false }
  };
}

describe('calculations', () => {
  it('applies ISC 52% when age <= 5', () => {
    const s = baseScenario(5);
    const r = calculateScenario(s);
    expect(r.taxes.isc).toBeCloseTo(4000000 * 0.52, -1);
  });
  it('applies ISC 73% when age >= 6', () => {
    const s = baseScenario(6);
    const r = calculateScenario(s);
    expect(r.taxes.isc).toBeCloseTo(4000000 * 0.73, -1);
  });
  it('DAI always 0 and Law 6946 1% of base', () => {
    const s = baseScenario(4);
    const r = calculateScenario(s);
    expect(r.taxes.dai).toBe(0);
    expect(r.taxes.arancel).toBeCloseTo(4000000 * 0.01, -1);
  });
  it('IVA applied to (base + ISC + Law6946)', () => {
    const s = baseScenario(4);
    const r = calculateScenario(s);
    const expectedIsc = 4000000 * 0.52;
    const expectedLey = 4000000 * 0.01;
    const ivaBase = 4000000 + expectedIsc + expectedLey + 0; // DAI 0
    expect(r.taxes.iva).toBeCloseTo(ivaBase * 0.13, -1);
  });
  it('handles range market prices', () => {
    const s = baseScenario(5);
    s.marketPrice = { mode: 'range', min: { amount: 14000000, currency: 'CRC' }, max: { amount: 16000000, currency: 'CRC' } };
    const r = calculateScenario(s);
    expect(r.profitRange).toBeTruthy();
    expect(r.profitRange?.maxProfit).toBeGreaterThan(r.profitRange!.minProfit);
  });
  it('status logic works', () => {
    expect(computeStatus(20, 15, 2)).toBe('GREEN');
    expect(computeStatus(14, 15, 2)).toBe('YELLOW');
    expect(computeStatus(10, 15, 2)).toBe('RED');
  });
});
