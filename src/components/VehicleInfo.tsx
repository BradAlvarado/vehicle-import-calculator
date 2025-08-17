import { useFormContext } from 'react-hook-form';
import { ScenarioFormValues } from '../state/validation';
import { useEffect } from 'react';

export default function VehicleInfo() {
  const { register, watch, setValue } = useFormContext<ScenarioFormValues>();
  const year = watch('vehicle.year');
  const age = watch('vehicle.age');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (year && !age) setValue('vehicle.age', currentYear - year);
    if (age && !year) setValue('vehicle.year', new Date().getFullYear() - age);
  }, [year, age, setValue]);

  return (
  <div className="p-4 bg-white rounded shadow space-y-3">
      <h2 className="font-semibold">Vehicle</h2>
      <div>
        <label className="text-sm font-medium">Year</label>
        <input type="number" className="mt-1 w-full input" {...register('vehicle.year', { valueAsNumber: true })} />
      </div>
      <div>
        <label className="text-sm font-medium">Age (years)</label>
        <input type="number" className="mt-1 w-full input" {...register('vehicle.age', { valueAsNumber: true })} />
      </div>
      <div>
        <label className="text-sm font-medium">Make</label>
        <input type="text" className="mt-1 w-full input" {...register('vehicle.make')} />
      </div>
      <div>
        <label className="text-sm font-medium">Model</label>
        <input type="text" className="mt-1 w-full input" {...register('vehicle.model')} />
      </div>
      <IscBand age={age} />
    </div>
  );
}

function IscBand({ age }: { age?: number }) {
  if (age === undefined) return null;
  const rate = age <= 5 ? 52 : 73;
  return <div className="text-xs text-gray-600">ISC band: {rate}% (age {age})</div>;
}
