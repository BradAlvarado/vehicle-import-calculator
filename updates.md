I want to make some changes:

Calculator Update – Tax Logic (Costa Rica Vehicle Import)

Main changes:

1. ISC (Selective Consumption Tax)
- If the car is 5 years old or less → 52% of the Hacienda Value (Fiscal Value).
- If the car is 6 years old or more → 73% of the Hacienda Value.
- Antigüedad = Current Year – Vehicle Year.

2. DAI (Import Duty)

- Always 0%.
- Law 6946
- Always 1% of the Hacienda Value.

3. VAT (IVA)
- 13%, calculated over: Hacienda Value + ISC + Law 6946.

UI adjustments:
- Change the label “Customs Base (CRC)” → “Hacienda Value (CRC) – Fiscal Value from AutoHacienda”.
- Add a tooltip clarifying this is the only base used for all taxes.
- Show ISC band depending on vehicle age: “52% (≤5 years)” or “73% (≥6 years)”.
- In the taxes breakdown, display: Hacienda Value, ISC, DAI (0%), Law 6946, VAT (13%), and Total Taxes.

Validation rules:
- Hacienda Value must be > 0.
- Vehicle year must be in a valid range.
- Exchange rate required if any value is in USD.

Fix some little bugs in the inputs:

## A) In the input text of the ammount of money, I am able to type letters and that mess up the Results with a "NaN". Please make sure that every money input, both CRC or USD, I am able to type only numbers (number input only)

## B) Include an auto separators for every money input both CRC and USD inputs. If I put 1000 of USD or CRC it should add a "." point after "1", like this: 1.000. Or if a have to type 1000000, it should parse it like this: 1.000.000.

## C) The "Save Scenario" and "Export.txt" buttons actually do the same thing, so remove the "Export.txt" button, is unecessary.

## D) The "Dark Mode" doesn't work, I should work to update the whole page format to dark.