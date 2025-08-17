import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scenarioSchema, ScenarioFormValues } from './state/validation';
import { useScenarioStore } from './state/store';
import VehicleInfo from './components/VehicleInfo';
import CurrencyInput from './components/CurrencyInput';
import MarketPriceInput from './components/MarketPriceInput';
import FeesSection from './components/FeesSection';
import TaxBreakdown from './components/TaxBreakdown';
import ResultsPanel from './components/ResultsPanel';
import ScenarioActions from './components/ScenarioActions';
import { calculateScenario } from './state/calculations';
import { useEffect, useRef } from 'react';

export default function App() {
  const scenario = useScenarioStore(s => s.scenario);
  const updateScenario = useScenarioStore(s => s.updateScenario);

  const methods = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: scenario
  });

  // Subscribe to form changes once to avoid infinite update loops.
  // Previous implementation used methods.watch() in the dependency array, creating a new object each render and causing cascading updates.
  const lastSerializedRef = useRef<string>('');
  useEffect(() => {
    const subscription = methods.watch((values: ScenarioFormValues) => {
      // Only update store if inputs actually changed (ignore results since recalculated)
      const { results: _omit, ...rest } = values;
      const serialized = JSON.stringify(rest);
      if (serialized === lastSerializedRef.current) return; // no meaningful change
      lastSerializedRef.current = serialized;
      const results = calculateScenario(values as any);
      updateScenario({ ...(values as any), results });
    });
    return () => { subscription && (subscription as any)(); };
  }, [methods, updateScenario]);

  return (
  <div className="max-w-7xl mx-auto p-4 space-y-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Costa Rica Vehicle Import Profit Calculator</h1>
        <p className="text-sm text-gray-600">All amounts internally in CRC. Configure exchange rate & toggle fees.</p>
      </header>
      <FormProvider {...methods}>
        <form className="grid gap-6 md:grid-cols-3">
          <section className="space-y-4 md:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <VehicleInfo />
              <div className="space-y-3 p-4 bg-white rounded shadow">
                <h2 className="font-semibold">Monetary Inputs</h2>
                <CurrencyInput name="purchase" label="Purchase Price" />
                <CurrencyInput name="shipping" label="Shipping + Insurance" />
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">Hacienda Value (CRC)
                    <span className="text-xs text-gray-500 dark:text-gray-400" title="Fiscal value from AutoHacienda used as the single base for all taxes.">?</span>
                  </label>
                  <input type="number" className="mt-1 w-full input" {...methods.register('customsBaseCRC', { valueAsNumber: true, min: 1 })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Exchange Rate (CRC/USD)</label>
                  <input type="number" step="0.01" className="mt-1 w-full input" {...methods.register('exchangeRate', { valueAsNumber: true })} />
                </div>
              </div>
            </div>
            <FeesSection />
            <MarketPriceInput />
            <ScenarioActions />
          </section>
          <aside className="space-y-4">
            <TaxBreakdown />
            <ResultsPanel />
          </aside>
        </form>
      </FormProvider>
    </div>
  );
}
