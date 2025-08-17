import { Scenario } from '../state/types';

const KEY = 'cr_import_scenarios_v1';

export function loadScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Scenario[];
  } catch {
    return [];
  }
}

export function saveScenarioList(list: Scenario[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}
