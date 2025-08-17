import { create } from 'zustand';
import { Scenario } from './types';
import { loadScenarios, saveScenarioList } from '../utils/persistence';
import { v4 as uuid } from 'uuid';

const defaultScenario = (): Scenario => ({
  id: uuid(),
  vehicle: { age: 6, make: 'Toyota', model: 'Corolla' },
  exchangeRate: 530,
  purchase: { amount: 10000, currency: 'USD' },
  shipping: { amount: 1200, currency: 'USD' },
  customsBaseCRC: 4000000,
  fees: [
    { label: 'DEKRA', amountCRC: 7000, enabled: true },
    { label: 'Marchamo', amountCRC: 120000, enabled: true },
    { label: 'Placas', amountCRC: 25000, enabled: true },
    { label: 'Traspaso', amountCRC: 100000, enabled: true }
  ],
  marketPrice: { mode: 'single', single: { amount: 16500000, currency: 'CRC' } },
  // Updated tax defaults per new spec: ISC 52% (<=5 yrs) / 73% (>=6 yrs), DAI 0%, Law 6946 1%, IVA 13%
  settings: { isc30: 0.52, isc48: 0.73, iva: 0.13, dai: 0, arancel: 0.01, thresholdPct: 15, tolerancePct: 2, useInvoiceAsBase: false },
});

interface ScenarioState {
  scenario: Scenario;
  saved: Scenario[];
  updateScenario: (s: Partial<Scenario>) => void;
  saveCurrent: (name?: string) => void;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenario: defaultScenario(),
  saved: loadScenarios(),
  updateScenario: (partial) => set(state => ({ scenario: { ...state.scenario, ...partial } })),
  saveCurrent: () => {
    const { scenario, saved } = get();
    const list = [...saved.filter(s => s.id !== scenario.id), scenario];
    saveScenarioList(list);
    set({ saved: list });
  },
  loadScenario: (id) => {
    const found = get().saved.find(s => s.id === id);
    if (found) set({ scenario: found });
  },
  deleteScenario: (id) => {
    const list = get().saved.filter(s => s.id !== id);
    saveScenarioList(list);
    set({ saved: list });
  }
}));
