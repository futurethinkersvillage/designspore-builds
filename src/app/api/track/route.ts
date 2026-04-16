import { NextRequest, NextResponse } from "next/server";

const MC_BASE = process.env.MC_BASE_URL || "https://mc.designspore.co";
const MC_TOKEN = process.env.MC_INTERNAL_API_TOKEN;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { refId, type, page, metadata, utm, sessionId, referrer, title, ts } = body;
  if (!refId || !type) {
    return NextResponse.json({ error: "refId and type are required" }, { status: 400 });
  }

  if (!MC_TOKEN) {
    console.error("[track] MC_INTERNAL_API_TOKEN not set");
    // Return 200 so client fetch never surfaces an error; event is dropped.
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const mcPayload = {
    type,
    page: page ?? null,
    title: title ?? null,
    metadata: metadata ?? {},
    utm: utm ?? null,
    sessionId: sessionId ?? null,
    referrer: referrer ?? null,
    occurredAt: ts ?? new Date().toISOString(),
    source: "portal.place",
    userAgent: req.headers.get("user-agent") ?? null,
    ip,
  };

  try {
    const mcRes = await fetch(
      `${MC_BASE}/api/internal/contacts/${encodeURIComponent(refId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MC_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mcPayload),
      },
    );

    if (!mcRes.ok) {
      const text = await mcRes.text().catch(() => "");
      console.error("[track] MC responded", mcRes.status, text.slice(0, 200));
      return NextResponse.json({ ok: false, status: mcRes.status });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[track] request failed:", e);
    return NextResponse.json({ ok: false, reason: "fetch_failed" });
  }
}
