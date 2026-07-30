'use client'

import Link from 'next/link'

/**
 * The one place the membership story appears in the booking path (Mike's call,
 * 2026-07-30): once, at payment, to someone already spending money. The
 * arithmetic does the selling — no Village content anywhere in browsing.
 *
 * PLACEHOLDER ECONOMICS — the standalone Annual Membership price and discount
 * are still open (see platform/01-booking-and-credits.md §9). Wire these to the
 * real numbers before this ships publicly.
 */
const ANNUAL_FEE = 249
const MEMBER_DISCOUNT = 0.2

export default function MembershipMoment({
  stayTotal, nights,
}: { stayTotal: number; nights: number }) {
  const savedOnThisStay = Math.round(stayTotal * MEMBER_DISCOUNT)
  const nightlySaving = savedOnThisStay / nights
  const breakEvenNights = Math.ceil(ANNUAL_FEE / Math.max(nightlySaving, 1))

  // Only worth showing if it's genuinely close to paying for itself.
  if (breakEvenNights > 30) return null

  return (
    <aside className="border border-creek/35 bg-creek/[0.07] rounded-lg p-5 md:p-6 mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-parchment text-lg">
          Members pay ${stayTotal - savedOnThisStay} for this stay
        </h2>
        <p className="font-body text-creek text-sm font-semibold">
          You'd save ${savedOnThisStay}
        </p>
      </div>

      <p className="font-body text-parchment/65 text-sm mt-2 leading-relaxed">
        An annual membership is ${ANNUAL_FEE} and takes {MEMBER_DISCOUNT * 100}% off every
        night you stay, plus credits to spend on firewood, golf and the sauna. At your rate
        it pays for itself in about{' '}
        <strong className="text-parchment font-semibold">
          {breakEvenNights} nights
        </strong>{' '}
        — roughly {breakEvenNights <= nights * 2 ? 'two stays like this one' : 'a few trips a year'}.
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
        <Link
          href="/seasonal-village"
          className="font-body text-sm text-creek hover:text-parchment transition-colors underline underline-offset-4"
        >
          See what's included
        </Link>
        <span className="font-body text-parchment/40 text-sm">
          Or continue as a guest — nothing changes.
        </span>
      </div>
    </aside>
  )
}
