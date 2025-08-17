import { z } from 'zod';
import { Scenario } from './types';

export const moneySchema = z.object({ amount: z.number().min(0), currency: z.enum(['CRC','USD']) });

export const scenarioSchema = z.object({
  id: z.string(),
  vehicle: z.object({ year: z.number().int().positive().optional(), age: z.number().int().nonnegative().optional(), make: z.string().optional(), model: z.string().optional() }),
  exchangeRate: z.number().positive(),
  purchase: moneySchema,
  shipping: moneySchema,
  customsBaseCRC: z.number().nonnegative(),
  fees: z.array(z.object({ label: z.string(), amountCRC: z.number().nonnegative(), enabled: z.boolean() })),
  marketPrice: z.union([
    z.object({ mode: z.literal('single'), single: moneySchema, min: z.undefined().optional(), max: z.undefined().optional() }),
    z.object({ mode: z.literal('range'), min: moneySchema, max: moneySchema, single: z.undefined().optional() })
  ]),
  settings: z.object({
    isc30: z.number().min(0), isc48: z.number().min(0), iva: z.number().min(0), dai: z.number().min(0), arancel: z.number().min(0),
    thresholdPct: z.number().min(0), tolerancePct: z.number().min(0), useInvoiceAsBase: z.boolean()
  }),
  results: z.any().optional()
});

export type ScenarioFormValues = z.infer<typeof scenarioSchema> & Scenario;
