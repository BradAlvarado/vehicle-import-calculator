import { useScenarioStore } from '../state/store';
import { numberFmt } from '../utils/currency';

export default function ResultsPanel() {
  const scenario = useScenarioStore(s => s.scenario);
  const r = scenario.results;
  if (!r) return null;
  return (
    <div className="p-4 bg-white rounded shadow text-sm space-y-2">
      <h2 className="font-semibold">Results</h2>
      <Row label="Total Investment" value={r.totalInvestment} bold />
      <Row label="Profit" value={r.profit} bold color={r.profit < 0 ? 'text-red-600' : ''} />
      <div className="flex justify-between">
        <span>Profit %</span>
        <span className="font-semibold">{r.profitPct.toFixed(2)}%</span>
      </div>
      {r.profitRange && (
        <div className="text-xs text-gray-600">Range Profit: {numberFmt(r.profitRange.minProfit)} – {numberFmt(r.profitRange.maxProfit)} ({r.profitRange.minPct.toFixed(1)}% – {r.profitRange.maxPct.toFixed(1)}%)</div>
      )}
      <StatusBadge status={r.status} />
    </div>
  );
}

function Row({ label, value, bold, color }: { label: string; value: number; bold?: boolean; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-semibold' : ''}>{label}</span>
      <span className={`${bold ? 'font-semibold' : ''} ${color || ''}`}>{numberFmt(value)}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: 'GREEN'|'YELLOW'|'RED' }) {
  const map = {
    GREEN: 'bg-profit-green/20 text-profit-green',
    YELLOW: 'bg-profit-yellow/30 text-profit-yellow',
    RED: 'bg-profit-red/20 text-profit-red'
  } as const;
  return <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${map[status]}`}>{status}</div>;
}
