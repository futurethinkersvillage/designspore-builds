import { Pool } from 'pg'

/**
 * Postgres pool, one per process.
 *
 * In production the app sits on the Coolify network and reaches the database
 * by container name. The database is NOT internet-exposed, so local
 * development needs an SSH tunnel:
 *
 *   ssh -L 5433:m14o2j58f4tvf1nsp5qn1gnp:5432 root@5.161.236.48
 *   DATABASE_URL=postgres://wgr:PASSWORD@localhost:5433/wgr npm run dev
 */

declare global {
  // eslint-disable-next-line no-var
  var __wgrPool: Pool | undefined
}

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (!global.__wgrPool) {
    global.__wgrPool = new Pool({
      connectionString: url,
      max: 8,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
    })
  }
  return global.__wgrPool
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const pool = getPool()
  if (!pool) throw new DatabaseUnavailable()
  const result = await pool.query(text, params)
  return result.rows as T[]
}

/**
 * Run several statements in one transaction. Anything that touches the ledger
 * MUST go through here — the balance check is a deferred constraint trigger,
 * so it only fires at COMMIT.
 */
export async function transaction<T>(
  fn: (q: (text: string, params?: unknown[]) => Promise<Record<string, unknown>[]>) => Promise<T>,
): Promise<T> {
  const pool = getPool()
  if (!pool) throw new DatabaseUnavailable()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(async (text, params = []) => {
      const r = await client.query(text, params)
      return r.rows
    })
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

/**
 * Thrown when DATABASE_URL isn't set or the database can't be reached. Callers
 * fall back to the static JSON snapshot so the site keeps working — a booking
 * page that renders stale availability beats one that 500s.
 */
export class DatabaseUnavailable extends Error {
  constructor() {
    super('DATABASE_URL is not configured')
    this.name = 'DatabaseUnavailable'
  }
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}
