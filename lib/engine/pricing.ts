import { applyPercent, roundHalfUp, sum, type Cents } from './money'

/**
 * The quote engine. Pure: same inputs always produce the same quote, no I/O,
 * no clock. Everything the guest is charged is derived here and snapshotted
 * onto the reservation, so a dispute in 2029 can reproduce exactly what the
 * engine decided in 2027.
 */

export interface Season {
  name: string
  startsOn: string          // ISO date
  endsOn: string            // inclusive
  rateMultiplier: number
  isClosed?: boolean
  minNights?: number
}

export interface RatePlan {
  name: string
  baseCents: Cents
  /** Sunday=0 … Saturday=6. Omit for every day. */
  weekdays?: number[]
  startsOn?: string
  endsOn?: string
  priority?: number
}

export interface TaxRate {
  code: string
  name: string
  percent: number
  /** Exempt once the stay reaches this many nights (BC PST on long stays). */
  exemptAfterNights?: number
}

export interface AddonLine {
  slug: string
  name: string
  priceCents: Cents
  qty: number
  per: 'item' | 'night' | 'person'
  taxable?: boolean
}

export interface Discount {
  code: string
  percentOff?: number
  amountOffCents?: Cents
  minNights?: number
}

export interface MemberPerk {
  /** Percent off accommodation only — add-ons are handled separately. */
  rateDiscountPercent?: number
  waiveLockFee?: boolean
}

export interface QuoteInput {
  arrivesOn: string
  departsOn: string
  guests: number
  ratePlans: RatePlan[]
  seasons?: Season[]
  taxes?: TaxRate[]
  addons?: AddonLine[]
  discount?: Discount
  member?: MemberPerk
  lockFeeCents?: Cents
  /**
   * Credits applied as a TENDER, not a discount — taken off after tax, because
   * a credit is payment for a taxable supply, not a reduction of its price.
   * Getting this backwards misstates GST.
   */
  creditsAppliedCents?: Cents
  depositPercent?: number
}

export interface NightLine {
  date: string
  weekday: number
  planName: string
  baseCents: Cents
  seasonName?: string
  seasonMultiplier: number
  cents: Cents
}

export interface TaxLine {
  code: string
  name: string
  percent: number
  cents: Cents
  exempt: boolean
}

export interface Quote {
  nights: NightLine[]
  nightCount: number
  accommodationCents: Cents
  memberDiscountCents: Cents
  discountCents: Cents
  addonsCents: Cents
  lockFeeCents: Cents
  subtotalCents: Cents
  taxes: TaxLine[]
  taxCents: Cents
  totalCents: Cents
  creditsAppliedCents: Cents
  balanceDueCents: Cents
  depositDueCents: Cents
  warnings: string[]
}

const DAY_MS = 86_400_000

export function eachNight(arrivesOn: string, departsOn: string): string[] {
  const start = Date.parse(arrivesOn + 'T00:00:00Z')
  const end = Date.parse(departsOn + 'T00:00:00Z')
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return []
  const out: string[] = []
  for (let t = start; t < end; t += DAY_MS) {
    out.push(new Date(t).toISOString().slice(0, 10))
  }
  return out
}

function weekdayOf(iso: string): number {
  return new Date(iso + 'T00:00:00Z').getUTCDay()
}

function seasonFor(date: string, seasons: Season[]): Season | undefined {
  return seasons.find(s => date >= s.startsOn && date <= s.endsOn)
}

/** Highest-priority plan that is in date range and covers this weekday. */
function planFor(date: string, plans: RatePlan[]): RatePlan | undefined {
  const wd = weekdayOf(date)
  const eligible = plans.filter(p => {
    if (p.startsOn && date < p.startsOn) return false
    if (p.endsOn && date > p.endsOn) return false
    if (p.weekdays && !p.weekdays.includes(wd)) return false
    return true
  })
  if (eligible.length === 0) return undefined
  return eligible.reduce((best, p) =>
    (p.priority ?? 0) > (best.priority ?? 0) ? p : best,
  )
}

export function quote(input: QuoteInput): Quote {
  const warnings: string[] = []
  const seasons = input.seasons ?? []
  const dates = eachNight(input.arrivesOn, input.departsOn)

  if (dates.length === 0) {
    warnings.push('Departure must be after arrival.')
  }

  // ---- per-night accommodation -------------------------------------------
  const nights: NightLine[] = []
  for (const date of dates) {
    const plan = planFor(date, input.ratePlans)
    if (!plan) {
      warnings.push(`No rate configured for ${date}.`)
      continue
    }
    const season = seasonFor(date, seasons)
    if (season?.isClosed) {
      warnings.push(`${date} falls in a closed season (${season.name}).`)
    }
    const multiplier = season?.rateMultiplier ?? 1
    nights.push({
      date,
      weekday: weekdayOf(date),
      planName: plan.name,
      baseCents: plan.baseCents,
      seasonName: season?.name,
      seasonMultiplier: multiplier,
      cents: roundHalfUp(plan.baseCents * multiplier),
    })
  }

  const nightCount = nights.length
  const accommodationCents = sum(nights.map(n => n.cents))

  // Minimum-stay rules come from the season covering the arrival night.
  const arrivalSeason = dates.length ? seasonFor(dates[0], seasons) : undefined
  if (arrivalSeason?.minNights && nightCount < arrivalSeason.minNights) {
    warnings.push(`${arrivalSeason.name} has a ${arrivalSeason.minNights}-night minimum.`)
  }

  // ---- member discount (accommodation only) ------------------------------
  const memberDiscountCents = input.member?.rateDiscountPercent
    ? applyPercent(accommodationCents, input.member.rateDiscountPercent)
    : 0

  // ---- promo code --------------------------------------------------------
  let discountCents = 0
  if (input.discount) {
    const d = input.discount
    if (d.minNights && nightCount < d.minNights) {
      warnings.push(`Code ${d.code} needs at least ${d.minNights} nights.`)
    } else {
      const base = accommodationCents - memberDiscountCents
      discountCents = d.percentOff
        ? applyPercent(base, d.percentOff)
        : Math.min(d.amountOffCents ?? 0, base)
    }
  }

  // ---- add-ons -----------------------------------------------------------
  const addonLines = (input.addons ?? []).map(a => {
    const multiplier =
      a.per === 'night' ? Math.max(nightCount, 1)
      : a.per === 'person' ? Math.max(input.guests, 1)
      : 1
    return { ...a, cents: a.priceCents * a.qty * multiplier }
  })
  const addonsCents = sum(addonLines.map(a => a.cents))

  const lockFeeCents = input.member?.waiveLockFee ? 0 : (input.lockFeeCents ?? 0)

  const subtotalCents =
    accommodationCents - memberDiscountCents - discountCents + addonsCents + lockFeeCents

  // ---- taxes -------------------------------------------------------------
  const taxableBase = subtotalCents - sum(
    addonLines.filter(a => a.taxable === false).map(a => a.cents),
  )

  const taxes: TaxLine[] = (input.taxes ?? []).map(t => {
    const exempt = t.exemptAfterNights != null && nightCount >= t.exemptAfterNights
    return {
      code: t.code,
      name: t.name,
      percent: t.percent,
      exempt,
      cents: exempt ? 0 : applyPercent(taxableBase, t.percent),
    }
  })
  const taxCents = sum(taxes.map(t => t.cents))

  const totalCents = subtotalCents + taxCents

  // ---- credits as tender, applied after tax ------------------------------
  const creditsAppliedCents = Math.min(
    Math.max(input.creditsAppliedCents ?? 0, 0),
    Math.max(totalCents, 0),
  )
  const balanceDueCents = totalCents - creditsAppliedCents

  const depositDueCents = input.depositPercent
    ? Math.min(applyPercent(balanceDueCents, input.depositPercent), balanceDueCents)
    : balanceDueCents

  return {
    nights,
    nightCount,
    accommodationCents,
    memberDiscountCents,
    discountCents,
    addonsCents,
    lockFeeCents,
    subtotalCents,
    taxes,
    taxCents,
    totalCents,
    creditsAppliedCents,
    balanceDueCents,
    depositDueCents,
    warnings,
  }
}
