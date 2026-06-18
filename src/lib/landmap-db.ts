import { Pool } from "pg";

// Singleton pg pool for the Land Map PostGIS database (source of truth).
// Reachable on the shared Coolify Docker network via LANDMAP_DATABASE_URL.
const g = globalThis as unknown as { __landmapPool?: Pool };

export const pool: Pool =
  g.__landmapPool ??
  (g.__landmapPool = new Pool({
    connectionString: process.env.LANDMAP_DATABASE_URL,
    max: 4,
  }));

/** True if the request carries the editor admin secret. */
export function isEditor(req: Request): boolean {
  const secret = process.env.LANDMAP_EDITOR_SECRET;
  if (!secret) return false;
  const hdr = req.headers.get("x-editor-secret");
  return !!hdr && hdr === secret;
}
