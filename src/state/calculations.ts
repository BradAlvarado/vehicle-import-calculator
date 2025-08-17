import { Scenario, ScenarioResults, Money } from './types';

export function moneyToCRC(m: Money, rate: number): number {
  return m.currency === 'CRC' ? m.amount : m.amount * rate;
}

// Updated bands: age <=5 -> lower band (now 52%), age >=6 -> higher band (now 73%)
export function determineIscRate(age?: number, settings?: { isc30: number; isc48: number }): number {
  if (age === undefined || !settings) return 0;
  return age <= 5 ? settings.isc30 : settings.isc48;
}

export function calculateScenario(base: Scenario): ScenarioResults {
  const { purchase, shipping, exchangeRate, customsBaseCRC, fees, marketPrice, settings, vehicle } = base;
  const purchase_crc = moneyToCRC(purchase, exchangeRate);
  const shipping_crc = moneyToCRC(shipping, exchangeRate);
  const base_crc = customsBaseCRC; // future: conditional useInvoiceAsBase
  const isc_rate = determineIscRate(vehicle.age, settings);
  const dai_rate = settings.dai; // now always 0%
  const ley6946_rate = settings.arancel; // repurposed field: always 1% of Hacienda value
  const iva_rate = settings.iva; // 13%
  const isc = base_crc * isc_rate;
  const dai = base_crc * dai_rate; // 0%
  const arancel = base_crc * ley6946_rate; // Law 6946 1%
  // IVA applied to (Hacienda Value + ISC + Law 6946 + DAI (0) )
  const ivaBase = base_crc + isc + dai + arancel;
  const iva = ivaBase * iva_rate;
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
