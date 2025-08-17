import { useScenarioStore } from '../state/store';
import { numberFmt } from '../utils/currency';

export default function TaxBreakdown() {
  const results = useScenarioStore(s => s.scenario.results);
  const base = useScenarioStore(s => s.scenario.customsBaseCRC);
  const settings = useScenarioStore(s => s.scenario.settings);
  const age = useScenarioStore(s => s.scenario.vehicle.age);
  const iscRate = age !== undefined ? (age <= 5 ? settings.isc30 : settings.isc48) : 0;
  if (!results) return null;
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow text-sm space-y-2">
      <h2 className="font-semibold">Taxes</h2>
      <Row label="Hacienda Value (CRC)" value={base} />
      <Row label={`ISC (${(iscRate*100).toFixed(0)}%) ${age !== undefined ? age <=5 ? '(≤5 yrs)' : '(≥6 yrs)' : ''}`} value={results.taxes.isc} />
      <Row label={`DAI (0%)`} value={results.taxes.dai} />
      <Row label={`Ley 6946 (1%)`} value={results.taxes.arancel} />
      <Row label={`IVA 13%`} value={results.taxes.iva} />
      <hr />
      <Row label="Total Taxes" value={results.taxes.total} bold />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-semibold' : ''}>{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{numberFmt(value)}</span>
    </div>
  );
}
