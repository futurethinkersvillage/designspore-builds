import { NextRequest, NextResponse } from "next/server";
import { getPuzzleRow, checkAnswer } from "@/lib/puzzles";

export const runtime = "nodejs";

// Light in-memory rate limit. Single container, festival scale — good enough to
// stop brute-forcing the answers without standing up a store.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function rewardEmailHtml(reward: string, code: string): string {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1720">
    <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#EA824E;margin:0 0 8px">Otherworld · moist</p>
    <h1 style="font-size:30px;font-weight:300;font-style:italic;margin:0 0 16px">You solved it.</h1>
    <p style="font-size:16px;line-height:1.6;color:#444">
      Nicely done. Here is your code for <strong>${reward}</strong> at Wells Gray Resort:
    </p>
    <div style="margin:24px 0;padding:20px;border:2px dashed #EA824E;border-radius:12px;text-align:center">
      <span style="font-family:monospace;font-size:26px;letter-spacing:4px;color:#1A1720">${code}</span>
    </div>
    <p style="font-size:15px;line-height:1.6;color:#444">
      <strong>To redeem:</strong> book your night at
      <a href="https://wellsgrayresort.ca" style="color:#AF695E">WellsGrayResort.ca</a>
      and give us this code. We&rsquo;ll take care of the rest.
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:28px 0" />
    <h2 style="font-size:20px;font-weight:300;margin:0 0 10px">Come make something</h2>
    <p style="font-size:15px;line-height:1.6;color:#444">
      This isn&rsquo;t just a free night — it&rsquo;s an invitation. We have a
      workshop with a 3D printer, a laser cutter, a full woodshop, and a CNC
      machine on the way. When you come to camp, make a piece of art for the
      land: a sculpture, a carving, a strange small creature for the forest
      floor. Something that stays.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#444">
      Every year we throw a party to tour the land and show off everything
      that&rsquo;s been made. Yours could be part of it.
    </p>
    <p style="font-size:14px;color:#888;margin-top:24px">
      With love from the forest floor,<br/>Portal.Place · Wells Gray, BC
    </p>
  </div>`;
}

async function logSolve(word: string, email: string, code: string) {
  const url = process.env.MOIST_SHEET_URL;
  const secret = process.env.MOIST_SHARED_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: secret, action: "log", word, email, code }),
    });
  } catch (err) {
    console.error("[moist] solve log failed", err);
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Slow down a moment." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const word = String(body.word ?? "").trim();
  const answer = String(body.answer ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!word || !answer || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const row = await getPuzzleRow(word);
  if (!row) {
    return NextResponse.json({ error: "No such puzzle" }, { status: 404 });
  }

  if (!checkAnswer(row, answer)) {
    // 422 = correct request, wrong answer. Never reveal the answer or code.
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[moist] RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portal.Place <noreply@portal.place>",
      to: [email],
      subject: `You solved "${row.title}" — here's your camping code`,
      html: rewardEmailHtml(row.reward || "a free night of camping", row.couponCode),
    }),
  });

  if (!res.ok) {
    console.error("[moist] resend error", await res.text());
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  await logSolve(row.word, email, row.couponCode);

  return NextResponse.json({ ok: true });
}
