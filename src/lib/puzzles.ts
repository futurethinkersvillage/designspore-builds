// Server-only data layer for the "Moist" mushroom puzzle hunt.
// Source of truth is a private Google Sheet, served as JSON by a bound
// Apps Script web app (see docs/moist-puzzles.apps-script.gs). Riddle answers
// and coupon codes live only on the server and are NEVER sent to the browser.

const SHEET_URL = process.env.MOIST_SHEET_URL;
const SHARED_SECRET = process.env.MOIST_SHARED_SECRET;

// Full row as stored in the sheet. Includes secret fields (answer, couponCode)
// that must only ever be read on the server.
export type PuzzleRow = {
  word: string;
  active: boolean;
  title: string;
  riddle: string;
  hint: string;
  answer: string;
  acceptAlts: string[];
  couponCode: string;
  reward: string;
  sort: number;
};

// Safe to expose to the client — no answer, no coupon code.
export type PublicPuzzle = {
  word: string;
  title: string;
  riddle: string;
  hint: string;
  reward: string;
};

function toPublic(row: PuzzleRow): PublicPuzzle {
  return {
    word: row.word,
    title: row.title,
    riddle: row.riddle,
    hint: row.hint,
    reward: row.reward,
  };
}

// Normalize a slug or answer for comparison: lowercase, strip anything that
// isn't a letter or number. So "Fern!", " FERN ", and "fern" all match.
export function normalizeWord(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Looser normalization for free-text answers: keep word boundaries as single
// spaces so multi-word answers still compare cleanly.
function normalizeAnswer(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "y";
}

function asAlts(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  return String(v ?? "")
    .split(/[|,;]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

type RawRow = Record<string, unknown>;

function mapRow(r: RawRow): PuzzleRow {
  return {
    word: normalizeWord(String(r.word ?? "")),
    active: asBool(r.active),
    title: String(r.title ?? "").trim(),
    riddle: String(r.riddle ?? "").trim(),
    hint: String(r.hint ?? "").trim(),
    answer: String(r.answer ?? "").trim(),
    acceptAlts: asAlts(r.accept_alts),
    couponCode: String(r.coupon_code ?? "").trim(),
    reward: String(r.reward ?? "").trim(),
    sort: Number(r.sort ?? 0) || 0,
  };
}

// Fetch every row from the sheet. Cached for 60s (ISR), so edits to the sheet
// appear on the live site within about a minute with no redeploy.
async function fetchRows(): Promise<PuzzleRow[]> {
  if (!SHEET_URL || !SHARED_SECRET) {
    console.error("[moist] MOIST_SHEET_URL or MOIST_SHARED_SECRET not set");
    return [];
  }
  const url = `${SHEET_URL}?token=${encodeURIComponent(SHARED_SECRET)}&mode=full`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error("[moist] sheet fetch failed", res.status);
      return [];
    }
    const data = (await res.json()) as { ok?: boolean; rows?: RawRow[] };
    if (!data?.ok || !Array.isArray(data.rows)) return [];
    return data.rows.map(mapRow).filter((r) => r.word);
  } catch (err) {
    console.error("[moist] sheet fetch error", err);
    return [];
  }
}

export async function getAllPublicPuzzles(): Promise<PublicPuzzle[]> {
  const rows = await fetchRows();
  return rows
    .filter((r) => r.active)
    .sort((a, b) => a.sort - b.sort || a.word.localeCompare(b.word))
    .map(toPublic);
}

export async function getPublicPuzzle(
  word: string,
): Promise<PublicPuzzle | null> {
  const rows = await fetchRows();
  const row = rows.find(
    (r) => r.active && r.word === normalizeWord(word),
  );
  return row ? toPublic(row) : null;
}

// Server-only: full row including answer + coupon code. Used by the solve API.
export async function getPuzzleRow(word: string): Promise<PuzzleRow | null> {
  const rows = await fetchRows();
  return rows.find((r) => r.active && r.word === normalizeWord(word)) ?? null;
}

export function checkAnswer(row: PuzzleRow, guess: string): boolean {
  const g = normalizeAnswer(guess);
  if (!g) return false;
  const candidates = [row.answer, ...row.acceptAlts].map(normalizeAnswer);
  return candidates.includes(g);
}
