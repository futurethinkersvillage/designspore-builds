const REF_KEY = "pp_ref";
const UTM_KEY = "pp_utm";
const SESSION_KEY = "pp_session";

const REF_TTL_DAYS = 90;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

type StoredRef = { id: string; ts: number };
type StoredUtm = { ts: number } & Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUrlParams(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);

  const ref = params.get("ref");
  if (ref) {
    const stored: StoredRef = { id: ref, ts: Date.now() };
    localStorage.setItem(REF_KEY, JSON.stringify(stored));
  }

  const utm: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
  let hasUtm = false;
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) { utm[k] = v; hasUtm = true; }
  }
  if (hasUtm) {
    const stored: StoredUtm = { ...utm, ts: Date.now() };
    localStorage.setItem(UTM_KEY, JSON.stringify(stored));
  }
}

export function getRefId(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REF_KEY);
  if (!raw) return null;
  try {
    const { id, ts } = JSON.parse(raw) as StoredRef;
    if (Date.now() - ts > REF_TTL_DAYS * 86400000) {
      localStorage.removeItem(REF_KEY);
      return null;
    }
    return id || null;
  } catch {
    return null;
  }
}

export function getUtm(): StoredUtm | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(UTM_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as StoredUtm; } catch { return null; }
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(
  type: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (typeof window === "undefined") return;
  const refId = getRefId();
  if (!refId) return; // Only tracked visits (with ?ref=) are logged for now.

  const payload = {
    refId,
    type,
    page: window.location.pathname,
    metadata,
    utm: getUtm(),
    sessionId: getSessionId(),
    referrer: document.referrer || null,
    title: document.title || null,
    ts: new Date().toISOString(),
  };

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silent — never break UX for analytics.
  }
}
