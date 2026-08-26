# Wells Gray Resort — website & booking platform

Next.js app for wellsgrayresort.ca: the marketing site plus an in-house booking platform
replacing Checkfront.

**Staging:** https://wellsgrayresort.designspore.co
**Branch:** `demo-wellsgrayresort` · **Coolify app:** `g477ovp8ozo9dn2hk9wdl968`

> Full project context, plans and operational runbook live outside this repo, in
> `Wells Gray Resort/platform/HANDOFF.md`. Start there.

---

## Quick start

```bash
npm install
npm test          # engine unit tests
npm run verify    # booking invariants (fit, turnover days, catalogue/geometry)
npm run dev
```

The app runs without a database — `/api/availability` returns 503 and pages fall back to the
static snapshot in `public/booking/`. To run against real data, see §Database below.

---

## Layout

| Path | What |
|---|---|
| `app/book/**` | Booking journey: results → category → add-ons → checkout |
| `app/api/availability/` | Availability API (DB-backed) |
| `components/booking/**` | Search, sticky dates, site map, category picker, add-ons |
| `lib/engine/**` | **Pure** engine — pricing, availability, ledger, money. No I/O. |
| `lib/repo/inventory.ts` | Database read side |
| `lib/db.ts` | Connection pool + transaction helper |
| `db/migrations/*.sql` | Schema |
| `db/verify_constraints.sql` | Proves the database guarantees actually fire |
| `public/booking/` | Generated: catalogue, availability index, basemap, site polygons |

`public/booking/` is **generated**, not hand-edited. The Python tooling that produces it lives
in `platform/export/`.

---

## Design rules worth knowing before you change anything

**`lib/engine/` is pure.** No database, no clock, no network. All the business judgement lives
there so it can be tested exhaustively; the repo layer only fetches rows. Keep it that way.

**Money is integer cents.** Never floats.

**Date ranges are half-open `[arrives, departs)`.** A stay ending on the 16th does not block a
16th arrival. Turnover days are bookable. `npm run verify` guards this.

**Credits are a tender, not a discount** — applied after tax, because a credit pays for a
taxable supply rather than reducing its price.

**Two invariants are enforced by Postgres, not by application code:**
double-booking is rejected by a GiST exclusion constraint on a generated `DATERANGE`, and the
credit ledger is append-only with transactions that must net to zero per denomination. Don't
work around them — if something is fighting a constraint, the model is wrong.

**Everything in `public/` is served to the internet.** Never put per-guest data there.

---

## Database

Not internet-exposed. Local development needs an SSH tunnel to the container IP (the container
*name* does not resolve from the docker host) — see `platform/HANDOFF.md` §5 for the exact
commands. Then set `DATABASE_URL` in `.env.local` (gitignored).

Schema changes go in `db/migrations/` and are applied by piping to `psql`. Re-run
`db/verify_constraints.sql` afterwards.

---

## Deploying

```bash
npm run build     # always build locally first — a TS error kills the Coolify build quietly
git push origin demo-wellsgrayresort
curl "http://5.161.236.48:8000/api/v1/deploy?uuid=g477ovp8ozo9dn2hk9wdl968&force=true" \
  -H "Authorization: Bearer COOLIFY_TOKEN"
```

Do **not** run `next build` while `npm run dev` is running — they share `.next` and it breaks.

---

## Scripts

| Command | Does |
|---|---|
| `npm test` | Engine unit tests (pricing, availability, ledger) |
| `npm run verify` | Booking invariants against the generated data |
| `npm run replay` | Engine arithmetic vs every historical Checkfront line item (needs the export) |
