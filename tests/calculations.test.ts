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
  settings: { isc30: 0, isc48: 0, iva: 0.13, dai: 0.40, arancel: 0.01, thresholdPct: 15, tolerancePct: 2, useInvoiceAsBase: false }
  };
}

describe('calculations', () => {
  it('ISC now zero', () => {
    const s = baseScenario(4);
    const r = calculateScenario(s);
    expect(r.taxes.isc).toBe(0);
  });
  it('DAI 40% applied to base', () => {
    const s = baseScenario(3);
    const r = calculateScenario(s);
    expect(r.taxes.dai).toBeCloseTo(4000000 * 0.40, -1);
  });
  it('Law 6946 1% still applied', () => {
    const s = baseScenario(2);
    const r = calculateScenario(s);
    expect(r.taxes.arancel).toBeCloseTo(4000000 * 0.01, -1);
  });
  it('IVA 13% only on base now', () => {
    const s = baseScenario(5);
    const r = calculateScenario(s);
    expect(r.taxes.iva).toBeCloseTo(4000000 * 0.13, -1);
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
