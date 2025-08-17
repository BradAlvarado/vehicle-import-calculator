import { useFormContext } from 'react-hook-form';
import { ScenarioFormValues } from '../state/validation';
import { useState } from 'react';

export default function FeesSection() {
  const { register, watch, setValue } = useFormContext<ScenarioFormValues>();
  const fees = watch('fees');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);

  const addCustom = () => {
    if (!label) return;
    setValue('fees', [...fees, { label, amountCRC: amount, enabled: true }]);
    setLabel(''); setAmount(0);
  };

  return (
    <section className="p-4 bg-white rounded shadow space-y-3">
      <h2 className="font-semibold">Circulation / Fees</h2>
      <div className="space-y-2">
        {fees.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register(`fees.${i}.enabled` as const)} />
            <span className="w-32">{f.label}</span>
            <input type="number" className="input w-32" {...register(`fees.${i}.amountCRC` as const, { valueAsNumber: true })} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 text-sm items-end">
        <div>
          <label className="text-xs font-medium">Label</label>
          <input value={label} onChange={e => setLabel(e.target.value)} className="input w-32" />
        </div>
        <div>
          <label className="text-xs font-medium">Amount CRC</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="input w-32" />
        </div>
        <button type="button" onClick={addCustom} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">+ Add</button>
      </div>
    </section>
  );
}
