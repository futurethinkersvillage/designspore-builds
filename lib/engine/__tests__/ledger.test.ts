import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  LedgerError, assertBalanced, balanceOf, convertEntitlement,
  issue, planSpend, redeem, refund, type Account, type Entry,
} from '../ledger'

const credits: Account = {
  id: 'acc-credits', guestId: 'g1', accountType: 'credits_general',
  denomination: 'cents', membershipYear: 2027,
}
const nightsAcc: Account = {
  id: 'acc-nights', guestId: 'g1', accountType: 'entitlement_nights',
  denomination: 'nights', membershipYear: 2027,
}
const houseCents: Account = {
  id: 'house-cents', accountType: 'house_issuance', denomination: 'cents',
}
const houseNights: Account = {
  id: 'house-nights', accountType: 'house_issuance', denomination: 'nights',
}
const redemption: Account = {
  id: 'house-redeem', accountType: 'house_redemption', denomination: 'cents',
}
const ACCOUNTS = [credits, nightsAcc, houseCents, houseNights, redemption]

describe('balanceOf', () => {
  it('is always computed from entries', () => {
    const entries: Entry[] = [
      { accountId: 'acc-credits', amount: 50_000 },
      { accountId: 'acc-credits', amount: -12_000 },
      { accountId: 'other', amount: 999 },
    ]
    assert.equal(balanceOf('acc-credits', entries), 38_000)
  })

  it('is zero for an account with no entries', () => {
    assert.equal(balanceOf('acc-credits', []), 0)
  })
})

describe('assertBalanced', () => {
  it('accepts a balanced transaction', () => {
    const tx = issue({
      toAccount: credits, houseAccount: houseCents, amount: 25_000,
      description: 'Annual credits', idempotencyKey: 'k1',
    })
    assert.doesNotThrow(() => assertBalanced(tx, ACCOUNTS))
  })

  it('rejects a transaction that does not net to zero', () => {
    assert.throws(
      () => assertBalanced({
        description: 'bad', reason: 'issued', idempotencyKey: 'k',
        entries: [{ accountId: 'acc-credits', amount: 100 }],
      }, ACCOUNTS),
      /does not balance/,
    )
  })

  it('rejects a zero-amount entry as a bug', () => {
    assert.throws(
      () => assertBalanced({
        description: 'noop', reason: 'adjusted', idempotencyKey: 'k',
        entries: [{ accountId: 'acc-credits', amount: 0 }],
      }, ACCOUNTS),
      /zero-amount entry/,
    )
  })

  it('rejects an empty transaction', () => {
    assert.throws(
      () => assertBalanced({ description: '', reason: 'issued', idempotencyKey: 'k', entries: [] }, ACCOUNTS),
      /no entries/,
    )
  })

  it('balances each denomination independently', () => {
    // Cents balance, nights do not — must still fail.
    assert.throws(() => assertBalanced({
      description: 'mixed', reason: 'converted', idempotencyKey: 'k',
      entries: [
        { accountId: 'acc-credits', amount: 100 },
        { accountId: 'house-cents', amount: -100 },
        { accountId: 'acc-nights', amount: 5 },
      ],
    }, ACCOUNTS), /nights off by 5/)
  })
})

describe('issue / redeem / refund', () => {
  it('issues credits from a house account', () => {
    const tx = issue({
      toAccount: credits, houseAccount: houseCents, amount: 25_000,
      description: 'Annual membership credits', idempotencyKey: 'issue-2027-g1',
    })
    assertBalanced(tx, ACCOUNTS)
    assert.equal(balanceOf(credits.id, tx.entries), 25_000)
    assert.equal(balanceOf(houseCents.id, tx.entries), -25_000)
  })

  it('refuses to issue a non-positive amount', () => {
    assert.throws(() => issue({
      toAccount: credits, houseAccount: houseCents, amount: 0,
      description: 'x', idempotencyKey: 'k',
    }), LedgerError)
  })

  it('refuses to issue across denominations', () => {
    assert.throws(() => issue({
      toAccount: nightsAcc, houseAccount: houseCents, amount: 5,
      description: 'x', idempotencyKey: 'k',
    }), /across denominations/)
  })

  it('redeems against an available balance', () => {
    const tx = redeem({
      fromAccount: credits, houseAccount: redemption, amount: 4_000,
      currentBalance: 25_000, description: 'Firewood at the counter',
      idempotencyKey: 'clover-abc123', refType: 'pos_sale',
    })
    assertBalanced(tx, ACCOUNTS)
    assert.equal(balanceOf(credits.id, tx.entries), -4_000)
    assert.equal(tx.idempotencyKey, 'clover-abc123')
  })

  it('refuses to overdraw — the invariant that protects the guest and the books', () => {
    assert.throws(() => redeem({
      fromAccount: credits, houseAccount: redemption, amount: 30_000,
      currentBalance: 25_000, description: 'too much', idempotencyKey: 'k',
    }), /insufficient balance/)
  })

  it('refuses to redeem exactly one cent more than held', () => {
    assert.throws(() => redeem({
      fromAccount: credits, houseAccount: redemption, amount: 25_001,
      currentBalance: 25_000, description: 'off by one', idempotencyKey: 'k',
    }), /insufficient balance/)
  })

  it('allows redeeming the entire balance', () => {
    assert.doesNotThrow(() => redeem({
      fromAccount: credits, houseAccount: redemption, amount: 25_000,
      currentBalance: 25_000, description: 'all of it', idempotencyKey: 'k',
    }))
  })

  it('round-trips issue -> redeem -> refund back to the starting balance', () => {
    const entries: Entry[] = []
    entries.push(...issue({
      toAccount: credits, houseAccount: houseCents, amount: 10_000,
      description: 'issue', idempotencyKey: 'a',
    }).entries)
    entries.push(...redeem({
      fromAccount: credits, houseAccount: redemption, amount: 3_500,
      currentBalance: 10_000, description: 'spend', idempotencyKey: 'b',
    }).entries)
    assert.equal(balanceOf(credits.id, entries), 6_500)

    entries.push(...refund({
      toAccount: credits, houseAccount: redemption, amount: 3_500,
      description: 'cancelled', idempotencyKey: 'c',
    }).entries)
    assert.equal(balanceOf(credits.id, entries), 10_000)

    // And the whole system still nets to zero.
    const all = entries.reduce((t, e) => t + e.amount, 0)
    assert.equal(all, 0, 'every cent is accounted for')
  })
})

describe('convertEntitlement', () => {
  const convert = (over: Record<string, unknown> = {}) => convertEntitlement({
    fromAccount: nightsAcc,
    toCreditsAccount: credits,
    houseEntitlementAccount: houseNights,
    houseCreditsAccount: houseCents,
    unusedUnits: 4, unitValueCents: 6_500, conversionRate: 0.5,
    description: '2027 unused nights', idempotencyKey: 'conv-2027-g1',
    ...over,
  } as Parameters<typeof convertEntitlement>[0])

  it('converts unused nights to credits, balancing BOTH denominations', () => {
    const tx = convert()!
    assert.ok(tx)
    // 4 nights x $65 x 50% = $130
    assert.equal(balanceOf(credits.id, tx.entries), 13_000)
    assert.equal(balanceOf(nightsAcc.id, tx.entries), -4)
    // The real assertion: run it through the same validator the DB mirrors.
    assert.doesNotThrow(() => assertBalanced(tx, ACCOUNTS))
  })

  it('rejects a single house account that cannot absorb both denominations', () => {
    assert.throws(
      () => convert({ houseCreditsAccount: houseNights }),
      /credits house account must match/,
    )
    assert.throws(
      () => convert({ houseEntitlementAccount: houseCents }),
      /entitlement house account must match/,
    )
  })

  it('caps the conversion so exposure stays bounded', () => {
    const tx = convert({ unusedUnits: 14, capCents: 20_000 })!
    assert.equal(balanceOf(credits.id, tx.entries), 20_000)
    assert.doesNotThrow(() => assertBalanced(tx, ACCOUNTS))
  })

  it('returns null when nothing went unused', () => {
    assert.equal(convert({ unusedUnits: 0 }), null)
  })

  it('rejects a nonsensical conversion rate', () => {
    for (const conversionRate of [0, -0.5, 1.5]) {
      assert.throws(() => convert({ conversionRate }), /conversion rate/)
    }
  })
})

describe('planSpend', () => {
  it('spends perishable entitlements before general credits', () => {
    const plan = planSpend({
      amountCents: 10_000, entitlementCentsAvailable: 6_000, creditCentsAvailable: 20_000,
    })
    assert.deepEqual(plan, { fromEntitlements: 6_000, fromCredits: 4_000, shortfall: 0 })
  })

  it('reports a shortfall rather than silently underpaying', () => {
    const plan = planSpend({
      amountCents: 10_000, entitlementCentsAvailable: 1_000, creditCentsAvailable: 2_000,
    })
    assert.equal(plan.shortfall, 7_000)
  })

  it('handles a zero bill and negative balances safely', () => {
    assert.deepEqual(
      planSpend({ amountCents: 0, entitlementCentsAvailable: 500, creditCentsAvailable: 500 }),
      { fromEntitlements: 0, fromCredits: 0, shortfall: 0 },
    )
    const plan = planSpend({
      amountCents: 5_000, entitlementCentsAvailable: -100, creditCentsAvailable: -50,
    })
    assert.equal(plan.fromEntitlements, 0)
    assert.equal(plan.fromCredits, 0)
    assert.equal(plan.shortfall, 5_000)
  })

  it('never plans to spend more than the bill', () => {
    const plan = planSpend({
      amountCents: 1_000, entitlementCentsAvailable: 99_999, creditCentsAvailable: 99_999,
    })
    assert.equal(plan.fromEntitlements + plan.fromCredits, 1_000)
  })
})
