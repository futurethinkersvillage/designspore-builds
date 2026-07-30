export interface AvailabilityIndex {
  generated_from: string
  from_date: string
  note: string
  /** site number -> merged booked ranges [startISO, endISO] */
  sites: Record<string, [string, string][]>
}

/**
 * Which numbered sites are unavailable for [from, to)?
 *
 * Checkout dates are exclusive: a stay ending on the 16th does not block a
 * booking that arrives on the 16th. Getting this wrong costs real revenue —
 * it silently hides a site that is in fact free on turnover days.
 */
export function occupiedFor(
  index: AvailabilityIndex,
  from: string | null,
  to: string | null,
): number[] {
  if (!from || !to || to <= from) return []
  const out: number[] = []
  for (const [site, spans] of Object.entries(index.sites)) {
    for (const [s, e] of spans) {
      if (s < to && e > from) {   // strict overlap — touching endpoints are fine
        out.push(Number(site))
        break
      }
    }
  }
  return out
}
