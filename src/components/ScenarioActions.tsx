import { useScenarioStore } from '../state/store';
import { useState } from 'react';

export default function ScenarioActions() {
  const saveCurrent = useScenarioStore(s => s.saveCurrent);
  const scenario = useScenarioStore(s => s.scenario);
  const results = scenario.results;
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const copySummary = () => {
    if (!results) return;
    const { vehicle } = scenario;
    const txt = `Make: ${vehicle.make || ''}\nModel: ${vehicle.model || ''}\nInvestment: ${results.totalInvestment}\nProfit: ${results.profit}\nProfit %: ${results.profitPct.toFixed(2)}%\nStatus: ${results.status}`;
    navigator.clipboard.writeText(txt).catch(() => {});
  };

  const exportTxt = () => {
    if (!results) return;
    const { vehicle } = scenario;
    const dateStr = new Date().toISOString();
    const lines = [
      `Date: ${dateStr}`,
      `Make: ${vehicle.make || ''}`,
      `Model: ${vehicle.model || ''}`,
      `Year: ${vehicle.year || ''}`,
      `Age: ${vehicle.age || ''}`,
      `Exchange Rate: ${scenario.exchangeRate}`,
      `Purchase (${scenario.purchase.currency}): ${scenario.purchase.amount}`,
      `Shipping (${scenario.shipping.currency}): ${scenario.shipping.amount}`,
      `Customs Base (CRC): ${scenario.customsBaseCRC}`,
      `Taxes: ISC=${results.taxes.isc} DAI=${results.taxes.dai} Ley6946=${results.taxes.arancel} IVA=${results.taxes.iva} Total=${results.taxes.total}`,
      `Total Investment: ${results.totalInvestment}`,
      results.profitRange ? `Profit Range: ${results.profitRange.minProfit} - ${results.profitRange.maxProfit}` : `Profit: ${results.profit}`,
      results.profitRange ? `Profit % Range: ${results.profitRange.minPct.toFixed(2)} - ${results.profitRange.maxPct.toFixed(2)}` : `Profit %: ${results.profitPct.toFixed(2)}`,
      `Status: ${results.status}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario_${vehicle.make || 'vehicle'}_${vehicle.model || ''}_${dateStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle('dark');
    const isDark = el.classList.contains('dark');
    setDark(isDark);
    try { localStorage.setItem('cr_dark_mode', isDark ? 'dark' : 'light'); } catch {}
  };

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <button type="button" onClick={() => { saveCurrent(); exportTxt(); }} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Save Scenario (.txt)</button>
      <button type="button" onClick={copySummary} className="px-3 py-1 bg-gray-700 text-white rounded text-xs">Copy Summary</button>
      <button type="button" onClick={toggleDark} className="px-3 py-1 rounded text-xs border border-gray-400 dark:border-gray-600 dark:text-white">{dark ? 'Light Mode' : 'Dark Mode'}</button>
    </div>
  );
}
