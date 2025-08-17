import { useFormContext } from 'react-hook-form';
import { ScenarioFormValues } from '../state/validation';

export default function MarketPriceInput() {
  const { watch, register } = useFormContext<ScenarioFormValues>();
  const mode = watch('marketPrice.mode');

  return (
    <section className="p-4 bg-white rounded shadow space-y-3">
      <h2 className="font-semibold">Market Price</h2>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1"><input type="radio" value="single" {...register('marketPrice.mode')} /> Single</label>
        <label className="flex items-center gap-1"><input type="radio" value="range" {...register('marketPrice.mode')} /> Range</label>
      </div>
      {mode === 'single' && (
        <MoneyField baseName="marketPrice.single" />
      )}
      {mode === 'range' && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <MoneyField baseName="marketPrice.min" label="Min" />
          <MoneyField baseName="marketPrice.max" label="Max" />
        </div>
      )}
    </section>
  );
}

function MoneyField({ baseName, label }: { baseName: string; label?: string }) {
  const { register } = useFormContext<ScenarioFormValues>();
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium flex items-center gap-2">{label || 'Value'}
        <select className="border rounded p-1 text-xs" {...register(`${baseName}.currency` as const)}>
          <option value="CRC">CRC</option>
          <option value="USD">USD</option>
        </select>
      </label>
      <input type="number" className="input w-full" {...register(`${baseName}.amount` as const, { valueAsNumber: true })} />
    </div>
  );
}
