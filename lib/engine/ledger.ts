/**
 * Credit ledger arithmetic. Pure — builds balanced double-entry transactions
 * that the storage layer inserts verbatim.
 *
 * Invariants this module guarantees, and that the database also enforces:
 *   1. Every transaction sums to zero per denomination.
 *   2. Nothing is ever mutated; corrections are compensating entries.
 *   3. A spend can never exceed the available balance.
 *   4. Every transaction carries an idempotency key, so a replayed webhook or
 *      a double-tapped POS button cannot double-spend.
 */

export type Denomination = 'cents' | 'nights' | 'rounds' | 'sessions'

export type AccountType =
  | 'credits_general'
  | 'entitlement_nights' | 'entitlement_golf' | 'entitlement_sauna'
  | 'entitlement_guest_nights'
  | 'house_issuance' | 'house_redemption' | 'house_breakage' | 'house_expiry'

export type Reason =
  | 'issued' | 'redeemed' | 'refunded' | 'expired' | 'converted' | 'adjusted' | 'transferred'

export interface Account {
  id: string
  guestId?: string
  accountType: AccountType
  denomination: Denomination
  membershipYear?: number
  expiresAt?: string | null
}

export interface Entry {
  accountId: string
  amount: number      // signed, never zero
  note?: string
}

export interface Transaction {
  description: string
  reason: Reason
  refType?: 'reservation' | 'pos_sale' | 'service_order' | 'program_enrolment' | 'manual' | 'membership'
  refId?: string
  idempotencyKey: string
  entries: Entry[]
}

export class LedgerError extends Error {}

/** Balance is always computed from entries. Never read a stored balance. */
export function balanceOf(accountId: string, entries: Entry[]): number {
  return entries
    .filter(e => e.accountId === accountId)
    .reduce((total, e) => total + e.amount, 0)
}

/** Throws unless every denomination in the transaction nets to zero. */
export function assertBalanced(tx: Transaction, accounts: Account[]): void {
  if (tx.entries.length === 0) {
    throw new LedgerError('transaction has no entries')
  }
  const byDenomination = new Map<Denomination, number>()
  for (const entry of tx.entries) {
    if (entry.amount === 0) {
      throw new LedgerError('zero-amount entry — a no-op entry is always a bug')
    }
    const account = accounts.find(a => a.id === entry.accountId)
    if (!account) throw new LedgerError(`unknown account ${entry.accountId}`)
    byDenomination.set(
      account.denomination,
      (byDenomination.get(account.denomination) ?? 0) + entry.amount,
    )
  }
  for (const [denomination, total] of byDenomination) {
    if (total !== 0) {
      throw new LedgerError(`transaction does not balance: ${denomination} off by ${total}`)
    }
  }
}

/** Issue credits or entitlements into a guest account, from a house account. */
export function issue(opts: {
  toAccount: Account
  houseAccount: Account
  amount: number
  description: string
  idempotencyKey: string
  refType?: Transaction['refType']
  refId?: string
}): Transaction {
  if (opts.amount <= 0) throw new LedgerError('issue amount must be positive')
  if (opts.toAccount.denomination !== opts.houseAccount.denomination) {
    throw new LedgerError('cannot issue across denominations')
  }
  return {
    description: opts.description,
    reason: 'issued',
    refType: opts.refType,
    refId: opts.refId,
    idempotencyKey: opts.idempotencyKey,
    entries: [
      { accountId: opts.houseAccount.id, amount: -opts.amount },
      { accountId: opts.toAccount.id, amount: opts.amount },
    ],
  }
}

/**
 * Spend against a guest account. Refuses to overdraw — the balance is passed in
 * so the caller reads it inside the same transaction the write happens in,
 * which is what makes concurrent redemption safe.
 */
export function redeem(opts: {
  fromAccount: Account
  houseAccount: Account
  amount: number
  currentBalance: number
  description: string
  idempotencyKey: string
  refType?: Transaction['refType']
  refId?: string
}): Transaction {
  if (opts.amount <= 0) throw new LedgerError('redeem amount must be positive')
  if (opts.amount > opts.currentBalance) {
    throw new LedgerError(
      `insufficient balance: tried to spend ${opts.amount}, have ${opts.currentBalance}`,
    )
  }
  return {
    description: opts.description,
    reason: 'redeemed',
    refType: opts.refType,
    refId: opts.refId,
    idempotencyKey: opts.idempotencyKey,
    entries: [
      { accountId: opts.fromAccount.id, amount: -opts.amount },
      { accountId: opts.houseAccount.id, amount: opts.amount },
    ],
  }
}

/** Reverse a prior redemption — a cancellation or partial refund. */
export function refund(opts: {
  toAccount: Account
  houseAccount: Account
  amount: number
  description: string
  idempotencyKey: string
  refType?: Transaction['refType']
  refId?: string
}): Transaction {
  if (opts.amount <= 0) throw new LedgerError('refund amount must be positive')
  return {
    description: opts.description,
    reason: 'refunded',
    refType: opts.refType,
    refId: opts.refId,
    idempotencyKey: opts.idempotencyKey,
    entries: [
      { accountId: opts.houseAccount.id, amount: -opts.amount },
      { accountId: opts.toAccount.id, amount: opts.amount },
    ],
  }
}

/**
 * Year-end: unused entitlements convert to general credits at a set rate, with
 * a cap. This is what stops "use it or lose it" feeling punitive while keeping
 * the resort's exposure bounded — the rate and cap are the business's dials.
 */
export function convertEntitlement(opts: {
  fromAccount: Account
  toCreditsAccount: Account
  /** Denominated in the entitlement's units — receives the retired units. */
  houseEntitlementAccount: Account
  /** Denominated in cents — funds the issued credits. */
  houseCreditsAccount: Account
  unusedUnits: number
  unitValueCents: number
  conversionRate: number      // 0.5 = 50%
  capCents?: number
  description: string
  idempotencyKey: string
}): Transaction | null {
  if (opts.unusedUnits <= 0) return null
  if (opts.conversionRate <= 0 || opts.conversionRate > 1) {
    throw new LedgerError('conversion rate must be between 0 and 1')
  }
  // Two denominations move here, so each needs its own house account —
  // a single house account cannot absorb both units and cents.
  if (opts.fromAccount.denomination !== opts.houseEntitlementAccount.denomination) {
    throw new LedgerError('entitlement house account must match the entitlement denomination')
  }
  if (opts.toCreditsAccount.denomination !== opts.houseCreditsAccount.denomination) {
    throw new LedgerError('credits house account must match the credits denomination')
  }

  const raw = Math.round(opts.unusedUnits * opts.unitValueCents * opts.conversionRate)
  const creditCents = opts.capCents != null ? Math.min(raw, opts.capCents) : raw
  if (creditCents <= 0) return null

  return {
    description: opts.description,
    reason: 'converted',
    refType: 'membership',
    idempotencyKey: opts.idempotencyKey,
    entries: [
      { accountId: opts.fromAccount.id, amount: -opts.unusedUnits, note: 'unused entitlement retired' },
      { accountId: opts.houseEntitlementAccount.id, amount: opts.unusedUnits },
      { accountId: opts.toCreditsAccount.id, amount: creditCents, note: 'converted to credits' },
      { accountId: opts.houseCreditsAccount.id, amount: -creditCents },
    ],
  }
}

/**
 * How much credit can actually be applied to a bill. Entitlements are spent
 * before general credits — they expire and credits (mostly) don't, so spending
 * the perishable balance first is always in the guest's interest.
 */
export function planSpend(opts: {
  amountCents: number
  entitlementCentsAvailable: number
  creditCentsAvailable: number
}): { fromEntitlements: number; fromCredits: number; shortfall: number } {
  const target = Math.max(opts.amountCents, 0)
  const fromEntitlements = Math.min(target, Math.max(opts.entitlementCentsAvailable, 0))
  const remaining = target - fromEntitlements
  const fromCredits = Math.min(remaining, Math.max(opts.creditCentsAvailable, 0))
  return {
    fromEntitlements,
    fromCredits,
    shortfall: remaining - fromCredits,
  }
}
