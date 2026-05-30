// Server-only data layer for the "Moist" mushroom puzzle hunt.
// Reads from a private Google Sheet (ID: MOIST_SHEET_ID) using OAuth token
// refresh. Answers and coupon codes live only on the server and are NEVER
// sent to the browser.

const SHEET_ID = process.env.MOIST_SHEET_ID;
const PUZZLES_TAB = "Moist Puzzles";
const SOLVES_TAB = "Solves";

// ---- Google OAuth token refresh ------------------------------------------

let _accessToken: string | null = null;
let _tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (_accessToken && now < _tokenExpiresAt) return _accessToken;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("[moist] Missing Google OAuth env vars");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[moist] Token refresh failed: ${err}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  _accessToken = data.access_token;
  // Expire 5 min early to be safe
  _tokenExpiresAt = now + (data.expires_in - 300) * 1000;
  return _accessToken;
}

// ---- Sheet read/write -------------------------------------------------------

async function sheetsGet(range: string): Promise<string[][]> {
  if (!SHEET_ID) return [];
  const token = await getAccessToken();
  const encoded = encodeURIComponent(range);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encoded}`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } },
  );
  if (!res.ok) {
    console.error("[moist] Sheets read error", res.status, await res.text());
    return [];
  }
  const data = (await res.json()) as { values?: string[][] };
  return data.values ?? [];
}

export async function sheetsAppend(tab: string, row: (string | number)[]): Promise<void> {
  if (!SHEET_ID) return;
  try {
    const token = await getAccessToken();
    const encoded = encodeURIComponent(tab);
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encoded}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
        cache: "no-store",
      },
    );
  } catch (err) {
    console.error("[moist] Sheets append error", err);
  }
}

// ---- Row mapping ------------------------------------------------------------

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

export type PublicPuzzle = {
  word: string;
  title: string;
  riddle: string;
  hint: string;
  reward: string;
};

function toPublic(row: PuzzleRow): PublicPuzzle {
  return { word: row.word, title: row.title, riddle: row.riddle, hint: row.hint, reward: row.reward };
}

export function normalizeWord(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeAnswer(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function asBool(v: string): boolean {
  return ["true", "yes", "1", "y"].includes((v ?? "").toString().trim().toLowerCase());
}

function asAlts(v: string): string[] {
  return (v ?? "").split(/[|,;]/).map((x) => x.trim()).filter(Boolean);
}

function mapRow(header: string[], cells: string[]): PuzzleRow {
  const get = (key: string) => cells[header.indexOf(key)] ?? "";
  return {
    word: normalizeWord(get("word")),
    active: asBool(get("active")),
    title: get("title").trim(),
    riddle: get("riddle").trim(),
    hint: get("hint").trim(),
    answer: get("answer").trim(),
    acceptAlts: asAlts(get("accept_alts")),
    couponCode: get("coupon_code").trim(),
    reward: get("reward").trim(),
    sort: Number(get("sort")) || 0,
  };
}

// ---- Public API -------------------------------------------------------------

async function fetchRows(): Promise<PuzzleRow[]> {
  if (!SHEET_ID) {
    console.error("[moist] MOIST_SHEET_ID not set");
    return [];
  }
  try {
    const values = await sheetsGet(`'${PUZZLES_TAB}'!A1:J1000`);
    if (values.length < 2) return [];
    const header = values[0].map((h) => h.trim().toLowerCase());
    return values
      .slice(1)
      .map((row) => mapRow(header, row))
      .filter((r) => r.word);
  } catch (err) {
    console.error("[moist] fetchRows error", err);
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

export async function getPublicPuzzle(word: string): Promise<PublicPuzzle | null> {
  const rows = await fetchRows();
  const row = rows.find((r) => r.active && r.word === normalizeWord(word));
  return row ? toPublic(row) : null;
}

// Server-only: includes answer + coupon code. Used only in the solve API route.
export async function getPuzzleRow(word: string): Promise<PuzzleRow | null> {
  const rows = await fetchRows();
  return rows.find((r) => r.active && r.word === normalizeWord(word)) ?? null;
}

export function checkAnswer(row: PuzzleRow, guess: string): boolean {
  const g = normalizeAnswer(guess);
  if (!g) return false;
  return [row.answer, ...row.acceptAlts].map(normalizeAnswer).includes(g);
}

// Log a correct solve to the Solves tab.
export async function logSolve(word: string, email: string, code: string): Promise<void> {
  await sheetsAppend(SOLVES_TAB, [new Date().toISOString(), word, email, code]);
}
