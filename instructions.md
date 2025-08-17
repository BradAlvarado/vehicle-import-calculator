
# Project: Costa Rica Vehicle Import Profit Calculator (Web App)

## 1) Goal
Build a web app that lets users estimate **total investment** and **profitability** of importing a used vehicle to Costa Rica. The user can input values in **USD or CRC**, choose an **exchange rate**, toggle **circulation/trámites** costs on/off, and get a **profit %** with a **threshold indicator** (color/status).

---

## 2) Core Features (MVP)
1. **Currency handling**
   - Inputs accepted in **USD or CRC** (user-selectable per field or global toggle).
   - Exchange rate (CRC per 1 USD): user can **enter manually**; optionally allow auto-fetch (configurable; must be overridable by the user).

2. **Vehicle & tax inputs**
   - Year or “age in years” to determine ISC band.
   - **Customs base** (a.k.a. “Valor Hacienda” / “valor en aduana”) in CRC (user input; or invoice value if that mode is enabled)
   - **Purchase price** (USD or CRC).
   - **Shipping + Insurance** (CRC or USD).
   - Optional **other import costs** (free text label + amount).

3. **Tax rules (configurable)**
   - **ISC (Impuesto Selectivo de Consumo)**:
     - 30% if vehicle age ≤ 6 years
     - 48% if vehicle age ≥ 7 years
     - These percentages must be stored as **config** variables.
   - **DAI / Ley 6946**: 1% of base (config variable).
   - **IVA**: 13% applied to **(base + ISC + DAI)** (config variable).
   - **Arancel aduanero**: default 0% for livianos (keep as configurable, default 0).
   - Show a **formula breakdown** panel.

4. **Circulation/trámites toggles**
   - Toggle to include/exclude:
     - **DEKRA** (revisión técnica) – default amount configurable.
     - **Marchamo** – default amount configurable.
     - **Placas** – default amount configurable.
     - **Traspaso/abogado** – default amount configurable.
   - A “Custom fees” section for any additional local costs.

5. **Market price & profitability**
   - Market price: accept **single value** or **range** (CRC or USD).
   - Output:
     - **Total taxes** (breakdown of Base, ISC, DAI, IVA).
     - **Total investment**.
     - **Gross profit** (market − investment).
     - **Profit %** = profit / investment × 100.
     - **Threshold indicator**:
       - User-set threshold (e.g., 15%). Show **Green** if ≥ threshold, **Yellow** if within ±2pp of threshold, **Red** if below threshold.
     - If range provided, compute **min/max profit** and **min/max profit %**.

6. **Reports & UX**
   - “Copy summary” button.
   - “Export PDF” of the calculation with all inputs + breakdown.
   - “Save scenario” (local storage) with named presets.
   - “Share link” (URL with query params).

---

## 3) Calculation Details (exact formulas)

**Notation**
- All calculations ultimately in **CRC**. Convert USD inputs using the chosen **exchange rate**.
- Variables:
  - `purchase_crc` = purchase price (converted to CRC if necessary)
  - `shipping_crc` = shipping + insurance (converted if necessary)
  - `base_crc` = customs base used by Aduanas/Hacienda (user input; or invoice value if that mode is enabled)
  - `isc_rate` = 0.30 if age ≤ 6, else 0.48 (configurable)
  - `dai_rate` = 0.01 (configurable)
  - `iva_rate` = 0.13 (configurable)
  - `arancel_rate` = default 0.00 (configurable)
  - `fees_crc` = sum of toggled trámites + custom fees (CRC)

**Taxes**
```
ISC  = base_crc * isc_rate
DAI  = base_crc * dai_rate
ARANCEL = base_crc * arancel_rate          (default 0, keep in case policy changes)
IVA  = (base_crc + ISC + DAI + ARANCEL) * iva_rate
TOTAL_TAXES = ISC + DAI + ARANCEL + IVA
```

**Totals & Profit**
```
TOTAL_INVESTMENT = purchase_crc + shipping_crc + TOTAL_TAXES + fees_crc
PROFIT          = market_price_crc - TOTAL_INVESTMENT
PROFIT_PCT      = (PROFIT / TOTAL_INVESTMENT) * 100
```

**If user provides market range (min, max):**
- Compute profit/profit% for **both** ends and display range.

---

## 4) Input Validation Rules
- Required: vehicle **age or year**, **base_crc**, **purchase price**, **exchange rate** (if any USD fields present).
- Numeric fields: non-negative; show inline errors.
- If user selects USD for a field, **convert immediately** and display CRC equivalent (and vice versa if needed).
- Warn if:
  - Age contradicts year (if both provided).
  - Base < purchase_crc (not an error; just a hint).
  - Profit < 0 (show **loss** state in red).

---

## 5) UX Flow (suggested)
1. **Header**: title + quick explanation.
2. **Global Settings**:
   - Exchange rate (manual input, optional auto-fetch toggle).
   - Profit threshold % (default 15%).
3. **Vehicle Info**:
   - Year OR Age (auto-compute the other).
   - ISC band shown (30% or 48%) with tooltip.
4. **Monetary Inputs**:
   - Purchase price (USD/CRC selector).
   - Shipping + insurance (USD/CRC selector).
   - Customs base (CRC). Tooltip explaining what it is.
5. **Taxes Panel** (read-only output with live update): ISC, DAI, Arancel, IVA, Total taxes.
6. **Circulation/Local Fees**:
   - Toggles: DEKRA, Marchamo, Placas, Traspaso/abogado (configurable defaults).
   - “+ Add custom fee” (label + amount).
7. **Market Price**:
   - Single or range input (USD/CRC selector).
8. **Results**:
   - Total investment, Profit, Profit %, Threshold status (color with label).
   - If range provided: show min/max outcomes.
9. **Actions**:
   - Save scenario (local), Export PDF, Copy summary, Share link.

---

## 6) Tech Stack 
- **Frontend**: React + TypeScript, Vite, TailwindCSS.
- **State**: Zustand or Redux Toolkit (simple derived computations).
- **Forms**: React Hook Form + Zod for validation.
- **PDF**: `react-to-print` or `pdfmake` for a clean summary export.
- **i18n**: English/Spanish (react-i18next).

---

## 7) Config & Admin Settings
- Editable **tax rates** (ISC 30/48, IVA 13, DAI 1, arancel 0).
- Default amounts for DEKRA, Marchamo, Placas, Traspaso.
- Toggle “use invoice value as base” vs “use Hacienda base entered by user”.
- Exchange-rate provider (if auto-fetch is enabled) + manual override always allowed.

---

## 8) Data Model (client-side)
```ts
type Money = { amount: number; currency: 'CRC'|'USD' }

type Scenario = {
  id: string
  vehicle: { year?: number; age?: number }
  exchangeRate: number  // CRC per USD
  purchase: Money
  shipping: Money
  customsBaseCRC: number
  fees: { label: string; amountCRC: number; enabled: boolean }[]
  marketPrice: { mode: 'single'|'range'; single?: Money; min?: Money; max?: Money }
  settings: {
    isc30: number; isc48: number; iva: number; dai: number; arancel: number
    thresholdPct: number
    useInvoiceAsBase: boolean
  }
  results?: {
    taxes: { isc: number; dai: number; arancel: number; iva: number; total: number }
    totalInvestment: number
    profit: number
    profitPct: number
    profitRange?: { minProfit: number; maxProfit: number; minPct: number; maxPct: number }
    status: 'GREEN'|'YELLOW'|'RED'
  }
}
```

---

## 9) Testing (must cover)
- Unit tests for **all formulas** & currency conversions.
- Age/year boundary: exactly 6 vs 7 years (band switch).
- Exchange rate changes update all totals correctly.
- Toggles on/off for trámites affect totals.
- Negative profit scenarios.
- Range market prices.

---

## 10) Non-Functional
- **Performance**: instant recalculation on change (pure client-side).
- **Accessibility**: labels, ARIA, keyboard nav.
- **Persistence**: localStorage for saved scenarios; deep-link via query params.
- **Security**: no PII; if backend later, add rate-limit & input sanitation.

---

## 11) Future Enhancements (backlog)
- Fetch **official base** via API when available (requires integration or scraping with user confirmation).
- Presets for common models (populate year/typical base ranges).
- Multi-vehicle comparison table.
- CSV export of scenarios.

---

## 12) Example Threshold Logic
```
if (profitPct >= threshold) -> GREEN
else if (profitPct >= threshold - 2) -> YELLOW
else -> RED
```
*(“2” is configurable tolerance in pp.)*

---

## 13) Example Summary (for PDF/Copy)
- Inputs (currency shown) + exchange rate used.
- Tax breakdown: Base, ISC, DAI, Arancel, IVA.
- Totals: Investment, Market, Profit, Profit %, Status.
- Timestamp & disclaimer: “Estimations only; verify current regulations.”
