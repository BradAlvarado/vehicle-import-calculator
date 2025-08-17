import { useFormContext } from 'react-hook-form';
import { ScenarioFormValues } from '../state/validation';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface Props { name: 'purchase' | 'shipping'; label: string }

export default function CurrencyInput({ name, label }: Props) {
  const { register, setValue, getValues } = useFormContext<ScenarioFormValues>();
  const pathAmount = `${name}.amount` as const;
  const [display, setDisplay] = useState<string>('');

  useEffect(() => {
    const current = getValues(pathAmount) as number | undefined;
    if (current !== undefined && !isNaN(current)) {
      setDisplay(formatNumber(current));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatNumber(n: number) {
    // Use period as thousands separator, no decimals
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function parseNumber(str: string): number {
    const cleaned = str.replace(/[^0-9]/g, '');
    return cleaned ? Number(cleaned) : 0;
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // block letters
    if (/[^0-9.]/.test(raw)) {
      const cleaned = raw.replace(/[^0-9.]/g, '');
      e.target.value = cleaned;
    }
    const num = parseNumber(raw);
    setValue(pathAmount, num, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setDisplay(raw.replace(/[^0-9]/g, ''));
  }
  function onBlur() {
    const num = parseNumber(display);
    setDisplay(formatNumber(num));
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium flex items-center gap-2">{label}
        <select className="border rounded p-1 text-xs" {...register(`${name}.currency` as const)}>
          <option value="CRC">CRC</option>
          <option value="USD">USD</option>
        </select>
      </label>
  <input inputMode="numeric" className={clsx('w-full input')} value={display} onChange={onChange} onBlur={onBlur} />
    </div>
  );
}
