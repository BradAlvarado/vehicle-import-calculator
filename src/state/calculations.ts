import { Scenario, ScenarioResults, Money } from './types';

export function moneyToCRC(m: Money, rate: number): number {
  return m.currency === 'CRC' ? m.amount : m.amount * rate;
}

// ISC now 0% regardless of age per latest update
export function determineIscRate(_age?: number, _settings?: { isc30: number; isc48: number }): number { return 0; }

export function calculateScenario(base: Scenario): ScenarioResults {
  const { purchase, shipping, exchangeRate, customsBaseCRC, fees, marketPrice, settings, vehicle } = base;
  const purchase_crc = moneyToCRC(purchase, exchangeRate);
  const shipping_crc = moneyToCRC(shipping, exchangeRate);
  const base_crc = customsBaseCRC; // future: conditional useInvoiceAsBase
  const isc = 0; // ISC eliminated
  const dai = base_crc * settings.dai; // DAI now 40%
  const arancel = base_crc * settings.arancel; // Law 6946 1%
  const iva = base_crc * settings.iva; // IVA 13% over base only (non-cumulative)
  const taxesTotal = isc + dai + arancel + iva;
  const fees_crc = fees.filter(f => f.enabled).reduce((a, f) => a + f.amountCRC, 0);
  const totalInvestment = purchase_crc + shipping_crc + taxesTotal + fees_crc;

  const toCRC = (m?: Money) => (m ? moneyToCRC(m, exchangeRate) : 0);

  let profit = 0; let profitPct = 0; let profitRange: ScenarioResults['profitRange'] | undefined;
  if (marketPrice.mode === 'single' && marketPrice.single) {
    const market_crc = toCRC(marketPrice.single);
    profit = market_crc - totalInvestment;
    profitPct = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
  } else if (marketPrice.mode === 'range' && marketPrice.min && marketPrice.max) {
    const min_crc = toCRC(marketPrice.min);
    const max_crc = toCRC(marketPrice.max);
    const minProfit = min_crc - totalInvestment;
    const maxProfit = max_crc - totalInvestment;
    const minPct = totalInvestment > 0 ? (minProfit / totalInvestment) * 100 : 0;
    const maxPct = totalInvestment > 0 ? (maxProfit / totalInvestment) * 100 : 0;
    profit = maxProfit; // show optimistic as main
    profitPct = maxPct;
    profitRange = { minProfit, maxProfit, minPct, maxPct };
  }

  const status = computeStatus(profitPct, settings.thresholdPct, settings.tolerancePct);

  return {
    taxes: { isc, dai, arancel, iva, total: taxesTotal },
    totalInvestment,
    profit,
    profitPct,
    profitRange,
    status
  };
}

export function computeStatus(profitPct: number, threshold: number, tolerance: number): 'GREEN' | 'YELLOW' | 'RED' {
  if (profitPct >= threshold) return 'GREEN';
  if (profitPct >= threshold - tolerance) return 'YELLOW';
  return 'RED';
}
