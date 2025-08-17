export function numberFmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n);
}
