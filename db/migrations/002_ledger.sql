-- Credit & membership ledger (WS1)
--
-- The single most consequential decision in the platform: this ledger is
-- APPEND-ONLY and DOUBLE-ENTRY. Balance is SUM(entries), never a stored
-- mutable column. Credits will eventually touch bookings, Clover sales,
-- concierge orders, refunds and partial redemptions across two brands — a
-- mutable balance WILL drift, and you will not be able to prove to a Founding
-- Member, or an auditor, why their balance is what it is.
--
-- Two account types, one ledger (Mike's call, 2026-07-30):
--   entitlement_*  typed buckets promised in the Founders brief. Capacity
--                  plannable, bounded peak-season exposure, no monetary
--                  liability.
--   credits_*      general-purpose wallet: annual membership, top-ups, POS,
--                  programs, and unused entitlement conversion.
-- Keeping them as separate account types is also what lets BC's prepaid-balance
-- expiry rules apply cleanly to one and not the other.

BEGIN;

CREATE TABLE memberships (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id      UUID NOT NULL REFERENCES guests(id),
  tier          TEXT NOT NULL
                CHECK (tier IN ('annual','founding_cabin_max','founding_cabin','founding_rv','staff')),
  -- HARD RULE: equity-linked tiers are admin-provisioned only. There is never a
  -- self-serve checkout path that sells them. Enforced in app + asserted here.
  equity_linked BOOLEAN NOT NULL DEFAULT FALSE,
  provisioned_by UUID REFERENCES staff(id),
  starts_on     DATE NOT NULL,
  ends_on       DATE,
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','lapsed','cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT equity_tiers_need_staff
    CHECK (NOT equity_linked OR provisioned_by IS NOT NULL)
);

CREATE INDEX memberships_guest_idx ON memberships(guest_id) WHERE status = 'active';

CREATE TABLE ledger_accounts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id       UUID REFERENCES guests(id),
  membership_id  UUID REFERENCES memberships(id),
  account_type   TEXT NOT NULL CHECK (account_type IN (
                   'credits_general',
                   'entitlement_nights','entitlement_golf','entitlement_sauna',
                   'entitlement_guest_nights',
                   -- House accounts, so every transaction balances to zero.
                   'house_issuance','house_redemption','house_breakage','house_expiry'
                 )),
  -- 'cents' for money-like credits; 'nights'/'rounds'/'sessions' for entitlements.
  denomination   TEXT NOT NULL CHECK (denomination IN ('cents','nights','rounds','sessions')),
  membership_year INTEGER,
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- A guest gets at most one account of each type per membership year.
  UNIQUE (guest_id, account_type, membership_year)
);

CREATE INDEX ledger_accounts_guest_idx ON ledger_accounts(guest_id);

CREATE TABLE ledger_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description  TEXT NOT NULL,
  reason       TEXT NOT NULL CHECK (reason IN (
                 'issued','redeemed','refunded','expired','converted','adjusted','transferred'
               )),
  ref_type     TEXT CHECK (ref_type IN (
                 'reservation','pos_sale','service_order','program_enrolment','manual','membership'
               )),
  ref_id       UUID,
  -- Replayed webhooks and double-tapped POS buttons must not double-spend.
  idempotency_key TEXT UNIQUE,
  created_by   UUID REFERENCES staff(id),
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
  account_id     UUID NOT NULL REFERENCES ledger_accounts(id),
  -- Signed. Debits negative, credits positive. Never zero — a no-op entry is a bug.
  amount         BIGINT NOT NULL CHECK (amount <> 0),
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ledger_entries_account_idx     ON ledger_entries(account_id, created_at DESC);
CREATE INDEX ledger_entries_transaction_idx ON ledger_entries(transaction_id);

-- Append-only, enforced by the database rather than by convention. A mistake is
-- corrected with a compensating entry, never an edit.
CREATE OR REPLACE FUNCTION ledger_is_append_only() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'ledger_entries is append-only: correct with a compensating entry, do not % it', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ledger_entries_no_update BEFORE UPDATE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION ledger_is_append_only();
CREATE TRIGGER ledger_entries_no_delete BEFORE DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION ledger_is_append_only();

-- Every transaction must balance to zero, per denomination. Deferred so a
-- transaction can be assembled across several inserts inside one commit.
CREATE OR REPLACE FUNCTION ledger_transaction_balances() RETURNS TRIGGER AS $$
DECLARE
  offending RECORD;
BEGIN
  SELECT a.denomination, SUM(e.amount) AS total
    INTO offending
    FROM ledger_entries e
    JOIN ledger_accounts a ON a.id = e.account_id
   WHERE e.transaction_id = NEW.transaction_id
   GROUP BY a.denomination
  HAVING SUM(e.amount) <> 0
   LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION 'ledger transaction % does not balance: % is off by %',
      NEW.transaction_id, offending.denomination, offending.total;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ledger_entries_balance
  AFTER INSERT ON ledger_entries
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION ledger_transaction_balances();

-- Balance is always computed. Cache it elsewhere if you must, but this view is
-- the truth and every cache must be rebuildable from it.
CREATE VIEW ledger_balances AS
  SELECT a.id AS account_id,
         a.guest_id,
         a.account_type,
         a.denomination,
         a.membership_year,
         a.expires_at,
         COALESCE(SUM(e.amount), 0) AS balance
    FROM ledger_accounts a
    LEFT JOIN ledger_entries e ON e.account_id = a.id
   GROUP BY a.id;

-- ------------------------------------------------------------ perks -------

CREATE TABLE perks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier          TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN (
                  'rate_discount','booking_window','long_weekend_priority',
                  'addon_discount','fee_waiver','guest_passes'
                )),
  -- Scope: NULL category = all.
  category_id   UUID REFERENCES unit_categories(id),
  percent_off   NUMERIC(5,2),
  days_early    INTEGER,          -- booking_window: how far ahead of public
  amount        INTEGER,          -- guest_passes count, waived fee cents, etc.
  -- Whether this stacks with promo codes. Decide once; encode it.
  stacks        BOOLEAN NOT NULL DEFAULT FALSE,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX perks_tier_idx ON perks(tier) WHERE active;

-- ------------------------------------------------------- events / audit ---

-- First-party server-side events (WS2). Built into the spine from day one
-- because retrofitting identity-stitching onto a live booking system is brutal.
CREATE TABLE events (
  id           BIGSERIAL PRIMARY KEY,
  anonymous_id UUID,
  guest_id     UUID REFERENCES guests(id),
  session_id   UUID,
  type         TEXT NOT NULL,
  path         TEXT,
  referrer     TEXT,
  utm          JSONB,
  properties   JSONB NOT NULL DEFAULT '{}',
  user_agent   TEXT,
  ip           INET,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX events_guest_idx     ON events(guest_id, occurred_at DESC);
CREATE INDEX events_anonymous_idx ON events(anonymous_id, occurred_at DESC);
CREATE INDEX events_type_idx      ON events(type, occurred_at DESC);

CREATE TABLE audit_log (
  id          BIGSERIAL PRIMARY KEY,
  actor_staff UUID REFERENCES staff(id),
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   UUID,
  before      JSONB,
  after       JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
