export type Currency = 'CRC' | 'USD';

export type Money = { amount: number; currency: Currency };

export interface ScenarioSettings {
  isc30: number; isc48: number; iva: number; dai: number; arancel: number;
  thresholdPct: number; tolerancePct: number; useInvoiceAsBase: boolean;
}

export interface FeeItem { label: string; amountCRC: number; enabled: boolean; }

export interface ScenarioResults {
  taxes: { isc: number; dai: number; arancel: number; iva: number; total: number };
  totalInvestment: number;
  profit: number;
  profitPct: number;
  profitRange?: { minProfit: number; maxProfit: number; minPct: number; maxPct: number };
  status: 'GREEN' | 'YELLOW' | 'RED';
}

export interface Scenario {
  id: string;
  vehicle: { year?: number; age?: number; make?: string; model?: string };
  exchangeRate: number; // CRC per USD
  purchase: Money;
  shipping: Money;
  customsBaseCRC: number;
  fees: FeeItem[];
  marketPrice: { mode: 'single' | 'range'; single?: Money; min?: Money; max?: Money };
  settings: ScenarioSettings;
  results?: ScenarioResults;
}
