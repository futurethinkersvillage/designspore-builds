import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { allocate, applyPercent, roundHalfUp, sum } from '../money'
import { eachNight, quote, type QuoteInput } from '../pricing'

const GST = { code: 'GST', name: 'GST', percent: 5 }
const PST = { code: 'PST', name: 'BC PST', percent: 8, exemptAfterNights: 30 }

function base(over: Partial<QuoteInput> = {}): QuoteInput {
  return {
    arrivesOn: '2026-08-14',
    departsOn: '2026-08-16',
    guests: 2,
    ratePlans: [{ name: 'Standard', baseCents: 6500 }],
    taxes: [GST],
    ...over,
  }
}

describe('money', () => {
  it('rounds half away from zero, symmetrically', () => {
    assert.equal(roundHalfUp(0.5), 1)
    assert.equal(roundHalfUp(1.5), 2)
    assert.equal(roundHalfUp(-0.5), -1)
    assert.equal(roundHalfUp(-1.5), -2)
  })

  it('allocates without losing or inventing a cent', () => {
    for (const [total, parts] of [[100, 3], [1, 3], [-100, 3], [0, 4], [9999, 7]] as const) {
      const split = allocate(total, parts)
      assert.equal(split.length, parts)
      assert.equal(sum(split), total, `${total} across ${parts} must sum back exactly`)
    }
  })

  it('applies percentages in integer cents', () => {
    assert.equal(applyPercent(13000, 5), 650)
    assert.equal(applyPercent(999, 5), 50)     // 49.95 -> 50
  })
})

describe('eachNight', () => {
  it('returns one entry per night, excluding the departure day', () => {
    assert.deepEqual(eachNight('2026-08-14', '2026-08-16'), ['2026-08-14', '2026-08-15'])
  })

  it('returns nothing for a zero or inverted range', () => {
    assert.deepEqual(eachNight('2026-08-14', '2026-08-14'), [])
    assert.deepEqual(eachNight('2026-08-16', '2026-08-14'), [])
  })

  it('crosses a month boundary correctly', () => {
    assert.deepEqual(eachNight('2026-07-31', '2026-08-02'), ['2026-07-31', '2026-08-01'])
  })
})

describe('quote', () => {
  it('prices a simple two-night stay with GST', () => {
    const q = quote(base())
    assert.equal(q.nightCount, 2)
    assert.equal(q.accommodationCents, 13000)
    assert.equal(q.subtotalCents, 13000)
    assert.equal(q.taxCents, 650)
    assert.equal(q.totalCents, 13650)
    assert.deepEqual(q.warnings, [])
  })

  it('applies a season multiplier per night', () => {
    const q = quote(base({
      seasons: [{ name: 'Peak', startsOn: '2026-08-01', endsOn: '2026-08-31', rateMultiplier: 1.2 }],
    }))
    assert.equal(q.nights[0].cents, 7800)
    assert.equal(q.accommodationCents, 15600)
  })

  it('picks the highest-priority plan that covers the weekday', () => {
    // 2026-08-14 is a Friday (5), 2026-08-15 a Saturday (6).
    const q = quote(base({
      ratePlans: [
        { name: 'Standard', baseCents: 6500 },
        { name: 'Weekend', baseCents: 8000, weekdays: [5, 6], priority: 10 },
      ],
    }))
    assert.deepEqual(q.nights.map(n => n.planName), ['Weekend', 'Weekend'])
    assert.equal(q.accommodationCents, 16000)
  })

  it('warns rather than silently pricing a night with no rate', () => {
    const q = quote(base({
      ratePlans: [{ name: 'Winter', baseCents: 5000, startsOn: '2026-11-01' }],
    }))
    assert.equal(q.nightCount, 0)
    assert.equal(q.warnings.length, 2)
    assert.match(q.warnings[0], /No rate configured/)
  })

  it('discounts accommodation for members but not add-ons', () => {
    const q = quote(base({
      member: { rateDiscountPercent: 20 },
      addons: [{ slug: 'firewood', name: 'Firewood', priceCents: 1200, qty: 2, per: 'item' }],
    }))
    assert.equal(q.memberDiscountCents, 2600)         // 20% of 13000
    assert.equal(q.addonsCents, 2400)                 // untouched
    assert.equal(q.subtotalCents, 13000 - 2600 + 2400)
  })

  it('multiplies per-night and per-person add-ons correctly', () => {
    const q = quote(base({
      guests: 3,
      addons: [
        { slug: 'wood', name: 'Firewood', priceCents: 1000, qty: 1, per: 'night' },
        { slug: 'pass', name: 'Day pass', priceCents: 500, qty: 1, per: 'person' },
        { slug: 'ice', name: 'Ice', priceCents: 300, qty: 2, per: 'item' },
      ],
    }))
    assert.equal(q.addonsCents, 1000 * 2 + 500 * 3 + 300 * 2)
  })

  it('stacks a promo code after the member discount', () => {
    const q = quote(base({
      member: { rateDiscountPercent: 10 },
      discount: { code: 'SPRING', percentOff: 10 },
    }))
    assert.equal(q.memberDiscountCents, 1300)
    assert.equal(q.discountCents, applyPercent(13000 - 1300, 10))
  })

  it('refuses a promo code below its minimum nights, with a warning', () => {
    const q = quote(base({ discount: { code: 'WEEK', percentOff: 25, minNights: 7 } }))
    assert.equal(q.discountCents, 0)
    assert.match(q.warnings[0], /at least 7 nights/)
  })

  it('never discounts below zero on a fixed-amount code', () => {
    const q = quote(base({ discount: { code: 'BIG', amountOffCents: 999_999 } }))
    assert.equal(q.discountCents, 13000)
    assert.equal(q.subtotalCents, 0)
  })

  it('exempts PST once the stay reaches the long-stay threshold', () => {
    const short = quote(base({ taxes: [GST, PST] }))
    assert.equal(short.taxes.find(t => t.code === 'PST')?.exempt, false)

    const long = quote(base({
      arrivesOn: '2026-06-01', departsOn: '2026-07-05',   // 34 nights
      taxes: [GST, PST],
    }))
    const pst = long.taxes.find(t => t.code === 'PST')
    assert.equal(pst?.exempt, true)
    assert.equal(pst?.cents, 0)
    assert.ok(long.taxes.find(t => t.code === 'GST')!.cents > 0, 'GST still applies')
  })

  it('excludes non-taxable add-ons from the tax base', () => {
    const q = quote(base({
      addons: [{ slug: 'gc', name: 'Gift card', priceCents: 5000, qty: 1, per: 'item', taxable: false }],
    }))
    assert.equal(q.subtotalCents, 18000)
    assert.equal(q.taxCents, applyPercent(13000, 5), 'gift card is outside the tax base')
  })

  it('applies credits AFTER tax, as a tender rather than a discount', () => {
    const withoutCredits = quote(base())
    const withCredits = quote(base({ creditsAppliedCents: 5000 }))
    assert.equal(withCredits.taxCents, withoutCredits.taxCents, 'tax must not shrink')
    assert.equal(withCredits.totalCents, withoutCredits.totalCents)
    assert.equal(withCredits.balanceDueCents, withoutCredits.totalCents - 5000)
  })

  it('never applies more credit than the total owed', () => {
    const q = quote(base({ creditsAppliedCents: 999_999 }))
    assert.equal(q.creditsAppliedCents, q.totalCents)
    assert.equal(q.balanceDueCents, 0)
  })

  it('computes the deposit from the balance after credits', () => {
    const q = quote(base({ creditsAppliedCents: 3650, depositPercent: 50 }))
    assert.equal(q.balanceDueCents, 10000)
    assert.equal(q.depositDueCents, 5000)
  })

  it('waives the lock fee for members entitled to it', () => {
    assert.equal(quote(base({ lockFeeCents: 1500 })).lockFeeCents, 1500)
    assert.equal(quote(base({ lockFeeCents: 1500, member: { waiveLockFee: true } })).lockFeeCents, 0)
  })

  it('warns on a closed season and a short stay rather than blocking silently', () => {
    const q = quote(base({
      seasons: [{
        name: 'Winter', startsOn: '2026-01-01', endsOn: '2026-12-31',
        rateMultiplier: 1, isClosed: true, minNights: 5,
      }],
    }))
    assert.ok(q.warnings.some(w => /closed season/.test(w)))
    assert.ok(q.warnings.some(w => /5-night minimum/.test(w)))
  })

  it('always reconciles: subtotal + tax = total, and credits + balance = total', () => {
    const q = quote(base({
      member: { rateDiscountPercent: 15 },
      discount: { code: 'X', percentOff: 5 },
      addons: [{ slug: 'w', name: 'Wood', priceCents: 1200, qty: 3, per: 'night' }],
      lockFeeCents: 1500,
      taxes: [GST, PST],
      creditsAppliedCents: 2000,
      depositPercent: 50,
    }))
    assert.equal(q.subtotalCents + q.taxCents, q.totalCents)
    assert.equal(q.creditsAppliedCents + q.balanceDueCents, q.totalCents)
    assert.ok(q.depositDueCents <= q.balanceDueCents)
  })
})
