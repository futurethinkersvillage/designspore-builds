import "server-only";
import fs from "node:fs";
import path from "node:path";
import rawModels from "@/content/models.json";

export interface ModelEntry {
  slug: string;
  name: string;
  oneLiner: string;
  status: string;
  date: string;
  software: string;
  tags: string[];
  model: { src: string; format: "stl" | "glb" | "3mf" };
  downloads: { label: string; href: string }[];
  video: { youtubeId?: string; src?: string } | null;
  writeup: string[];
  hidden?: boolean;
}

// Runtime hide/show overrides live outside git so an admin can toggle
// visibility on the live site. Mount a persistent volume at this dir in
// production (Coolify) so the choices survive redeploys.
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const HIDDEN_FILE = path.join(DATA_DIR, "hidden.json");

/** slug -> hidden override (true = force hidden, false = force shown). */
function readOverrides(): Record<string, boolean> {
  try {
    return JSON.parse(fs.readFileSync(HIDDEN_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Record<string, boolean>): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(HIDDEN_FILE, JSON.stringify(overrides, null, 2));
}

/** Effective hidden state = runtime override if set, else the models.json flag. */
export function getAllModels(): ModelEntry[] {
  const overrides = readOverrides();
  return (rawModels as ModelEntry[]).map((m) => ({
    ...m,
    hidden: overrides[m.slug] ?? m.hidden ?? false,
  }));
}

export function getVisibleModels(): ModelEntry[] {
  return getAllModels().filter((m) => !m.hidden);
}

export function setHidden(slug: string, hidden: boolean): ModelEntry[] {
  const known = new Set((rawModels as ModelEntry[]).map((m) => m.slug));
  if (!known.has(slug)) throw new Error(`unknown model: ${slug}`);
  const overrides = readOverrides();
  overrides[slug] = hidden;
  writeOverrides(overrides);
  return getAllModels();
}

/** Admin key gate. Returns true only when a key is configured and matches. */
export function isAuthorized(req: Request): boolean {
  const key = process.env.ADMIN_KEY;
  if (!key) return false;
  const provided = req.headers.get("x-admin-key");
  return provided === key;
}

export function adminEnabled(): boolean {
  return !!process.env.ADMIN_KEY;
}
