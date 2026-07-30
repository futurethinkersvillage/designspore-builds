-- Wells Gray Resort platform — initial schema (WS1)
-- PostgreSQL 16. Money is stored in CENTS as BIGINT; never floats.
--
-- The organising idea: `inventory_unit` is a generic bookable thing in time —
-- an RV pad, a cabin, a sauna slot, a tee time, a Future School seat. Getting
-- that abstraction right here is what lets concierge, programs and golf reuse
-- this engine later without a second system.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";   -- needed for the no-double-booking constraint

-- ---------------------------------------------------------------- people ---

CREATE TABLE guests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT UNIQUE,
  phone           TEXT,
  first_name      TEXT,
  last_name       TEXT,
  -- A returning guest should never re-enter their rig.
  rig_type        TEXT,
  rig_length_ft   INTEGER,
  rig_slide_outs  TEXT NOT NULL DEFAULT 'none'
                  CHECK (rig_slide_outs IN ('none','driver','passenger','both')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staff (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      CITEXT UNIQUE NOT NULL,
  name       TEXT,
  role       TEXT NOT NULL DEFAULT 'front_desk'
             CHECK (role IN ('front_desk','manager','owner')),
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------- inventory ---

CREATE TABLE unit_categories (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  kind                TEXT NOT NULL
                      CHECK (kind IN ('rv','tent','lodging','activity','program','other')),
  blurb               TEXT,
  -- Guests pick an actual unit (numbered RV sites) vs we assign one (tenting field).
  picks_specific_unit BOOLEAN NOT NULL DEFAULT FALSE,
  check_in_time       TIME NOT NULL DEFAULT '14:00',
  check_out_time      TIME NOT NULL DEFAULT '11:00',
  min_nights          INTEGER NOT NULL DEFAULT 1,
  max_nights          INTEGER,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  active              BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE inventory_units (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID NOT NULL REFERENCES unit_categories(id),
  -- Human label: "107", "Dome", "Sauna". Unique within a category.
  label           TEXT NOT NULL,
  -- Physical constraints. These are why a rig "fitting" is more than a number.
  max_length_ft   NUMERIC(5,1),
  width_ft        NUMERIC(5,1),
  allows_slide_outs BOOLEAN NOT NULL DEFAULT TRUE,
  allowed_rig_types TEXT[],          -- NULL = all
  amenities       TEXT[] NOT NULL DEFAULT '{}',
  -- Map geometry in basemap pixel space, so the guest map needs no tile server.
  map_polygon     JSONB,
  map_centroid    JSONB,
  -- Capacity > 1 models pooled inventory (a tenting field, a 10-person sauna).
  capacity        INTEGER NOT NULL DEFAULT 1 CHECK (capacity > 0),
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, label)
);

CREATE INDEX inventory_units_category_idx ON inventory_units(category_id) WHERE active;

-- --------------------------------------------------------------- pricing ---

CREATE TABLE seasons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  starts_on     DATE NOT NULL,
  ends_on       DATE NOT NULL,
  rate_multiplier NUMERIC(6,4) NOT NULL DEFAULT 1.0,
  min_nights    INTEGER,
  is_closed     BOOLEAN NOT NULL DEFAULT FALSE,
  CHECK (ends_on >= starts_on)
);

CREATE TABLE rate_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES unit_categories(id),
  name          TEXT NOT NULL,
  base_cents    BIGINT NOT NULL CHECK (base_cents >= 0),
  unit          TEXT NOT NULL DEFAULT 'night' CHECK (unit IN ('night','hour','session','person')),
  -- Sunday=0 … Saturday=6. NULL = every day.
  weekday_mask  INTEGER,
  starts_on     DATE,
  ends_on       DATE,
  priority      INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX rate_plans_category_idx ON rate_plans(category_id) WHERE active;

CREATE TABLE tax_rates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT NOT NULL,               -- 'GST', 'PST', 'MRDT'
  name         TEXT NOT NULL,
  percent      NUMERIC(6,4) NOT NULL,
  -- Applied only to these category kinds; NULL = all.
  applies_to_kinds TEXT[],
  -- BC PST is exempt on long stays; NULL = no threshold.
  exempt_after_nights INTEGER,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE addons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  group_label  TEXT NOT NULL,
  price_cents  BIGINT NOT NULL CHECK (price_cents >= 0),
  taxable      BOOLEAN NOT NULL DEFAULT TRUE,
  per          TEXT NOT NULL DEFAULT 'item' CHECK (per IN ('item','night','person')),
  active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE discount_codes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           CITEXT UNIQUE NOT NULL,
  percent_off    NUMERIC(5,2),
  amount_off_cents BIGINT,
  min_nights     INTEGER,
  valid_from     DATE,
  valid_to       DATE,
  max_uses       INTEGER,
  uses           INTEGER NOT NULL DEFAULT 0,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (percent_off IS NOT NULL OR amount_off_cents IS NOT NULL)
);

-- ---------------------------------------------------------- reservations ---

CREATE TABLE reservations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code               TEXT UNIQUE NOT NULL,          -- WGR-2026-0001
  guest_id           UUID NOT NULL REFERENCES guests(id),
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','checked_in','checked_out','cancelled','no_show')),
  channel            TEXT NOT NULL DEFAULT 'direct',
  arrives_on         DATE NOT NULL,
  departs_on         DATE NOT NULL,
  adults             INTEGER NOT NULL DEFAULT 1,
  children           INTEGER NOT NULL DEFAULT 0,
  -- Rig details snapshotted at booking; the guest's profile may change later.
  rig_type           TEXT,
  rig_length_ft      INTEGER,
  rig_slide_outs     TEXT,
  -- Locked = the guest paid to pin this exact unit; the optimiser must not move it.
  site_locked        BOOLEAN NOT NULL DEFAULT FALSE,
  lock_fee_cents     BIGINT NOT NULL DEFAULT 0,
  -- Immutable snapshot of the quote and the cancellation policy at booking time,
  -- so a guest is never subject to a policy that changed after they booked.
  quote_snapshot     JSONB NOT NULL DEFAULT '{}',
  cancellation_policy JSONB NOT NULL DEFAULT '{}',
  subtotal_cents     BIGINT NOT NULL DEFAULT 0,
  tax_cents          BIGINT NOT NULL DEFAULT 0,
  total_cents        BIGINT NOT NULL DEFAULT 0,
  deposit_due_cents  BIGINT NOT NULL DEFAULT 0,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (departs_on > arrives_on)
);

CREATE INDEX reservations_dates_idx ON reservations(arrives_on, departs_on);
CREATE INDEX reservations_guest_idx  ON reservations(guest_id);

CREATE TABLE reservation_units (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  unit_id        UUID NOT NULL REFERENCES inventory_units(id),
  arrives_on     DATE NOT NULL,
  departs_on     DATE NOT NULL,
  -- Rate breakdown captured per stay, immutable once written.
  rate_snapshot  JSONB NOT NULL DEFAULT '{}',
  subtotal_cents BIGINT NOT NULL DEFAULT 0,
  -- Half-open [arrives, departs): a stay ending the 16th frees the 16th.
  stay           DATERANGE GENERATED ALWAYS AS (daterange(arrives_on, departs_on, '[)')) STORED,
  CHECK (departs_on > arrives_on)
);

-- Manual holds: maintenance, owner use, staff blocks.
CREATE TABLE unit_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES inventory_units(id) ON DELETE CASCADE,
  starts_on   DATE NOT NULL,
  ends_on     DATE NOT NULL,
  reason      TEXT NOT NULL DEFAULT 'maintenance',
  created_by  UUID REFERENCES staff(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  stay        DATERANGE GENERATED ALWAYS AS (daterange(starts_on, ends_on, '[)')) STORED,
  CHECK (ends_on > starts_on)
);

-- THE constraint that makes double-booking impossible at the database level,
-- rather than hoping application code always checks first. Capacity-1 units
-- only; pooled inventory is capacity-checked in the engine.
ALTER TABLE reservation_units
  ADD CONSTRAINT reservation_units_no_overlap
  EXCLUDE USING gist (unit_id WITH =, stay WITH &&);

ALTER TABLE unit_blocks
  ADD CONSTRAINT unit_blocks_no_overlap
  EXCLUDE USING gist (unit_id WITH =, stay WITH &&);

CREATE TABLE reservation_addons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  addon_id       UUID NOT NULL REFERENCES addons(id),
  qty            INTEGER NOT NULL CHECK (qty > 0),
  unit_price_cents BIGINT NOT NULL,
  subtotal_cents BIGINT NOT NULL
);

-- ---------------------------------------------------------------- money ----

CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id),
  guest_id       UUID REFERENCES guests(id),
  method         TEXT NOT NULL CHECK (method IN ('card','cash','credits','clover','transfer','refund')),
  amount_cents   BIGINT NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'CAD',
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','succeeded','failed','refunded')),
  stripe_payment_intent TEXT,
  clover_payment_id     TEXT,
  -- Same external event must never be applied twice.
  idempotency_key TEXT UNIQUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
