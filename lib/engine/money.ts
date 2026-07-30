/**
 * Money is integer cents everywhere. Floats are never used for money — 0.1+0.2
 * problems become real dollars once you have thousands of reservations.
 */

export type Cents = number

export function cents(dollars: number): Cents {
  return Math.round(dollars * 100)
}

export function toDollars(c: Cents): number {
  return c / 100
}

export function formatCAD(c: Cents): string {
  return (c / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
}

/**
 * Half-up rounding, which is what a human doing the arithmetic expects and what
 * an invoice needs to reconcile to. JS `Math.round` already rounds .5 up for
 * positives but toward zero for negatives, so handle the sign explicitly.
 */
export function roundHalfUp(value: number): Cents {
  return value < 0 ? -Math.round(-value) : Math.round(value)
}

export function applyPercent(base: Cents, percent: number): Cents {
  return roundHalfUp((base * percent) / 100)
}

/**
 * Split a total across n parts without losing or inventing a cent. The
 * remainder is distributed one cent at a time to the earliest parts, so the
 * parts always sum exactly back to the total.
 */
export function allocate(total: Cents, parts: number): Cents[] {
  if (parts <= 0) return []
  const base = Math.trunc(total / parts)
  let remainder = total - base * parts
  const step = remainder < 0 ? -1 : 1
  remainder = Math.abs(remainder)
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? step : 0))
}

export function sum(values: Cents[]): Cents {
  return values.reduce((a, b) => a + b, 0)
}
