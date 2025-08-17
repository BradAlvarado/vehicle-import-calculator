# Costa Rica Vehicle Import Profit Calculator

Client-side React + TypeScript web app to estimate total investment & profitability of importing a used vehicle into Costa Rica.

## Stack
- React + TypeScript + Vite
- TailwindCSS for styling
- Zustand for state
- React Hook Form + Zod for validation
- i18next for i18n (en/es skeleton)
- Vitest + Testing Library for unit tests

## Main Features (MVP Implemented)
- Currency conversion (USD -> CRC) using user supplied exchange rate
- Tax calculations (ISC, DAI, Arancel (config), IVA) with live breakdown
- Fee toggles & custom fee addition
- Market price single or range with profit & profit % calculations
- Threshold status (GREEN / YELLOW / RED) with tolerance
- Save scenario to localStorage & copy summary

## Pending / Future Enhancements
- PDF export (stub not yet implemented)
- Shareable links via query params
- Editable config UI for tax rates (use settings in store now)
- Auto-fetch exchange rate
- Multi-scenario comparison & CSV export

## Development

Install dependencies and run dev server:

```powershell
npm install
npm run dev
```

Run tests:

```powershell
npm test
```

Build production:

```powershell
npm run build
```

## Disclaimer
Estimates only; verify current regulations before financial decisions.
