import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const {
    name,
    email,
    location,
    phone,
    portfolio,
    medium,
    project_description,
    length,
    timing,
    tools,
    accommodation,
    budget,
    why,
    extra,
  } = body;

  if (!name || !email || !location || !portfolio || !project_description || !why) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const row = (k: string, v: unknown) =>
    `<tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;width:200px;vertical-align:top">${k}</td><td style="padding:8px;border:1px solid #eee;white-space:pre-wrap">${v ?? "—"}</td></tr>`;

  const html = `
    <h2>Artist Residency Application — Portal.Place</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      ${row("Name", name)}
      ${row("Email", email)}
      ${row("Location", location)}
      ${row("Phone", phone || "—")}
      ${row("Portfolio", portfolio)}
      ${row("Primary medium", medium || "—")}
      ${row("Residency length", length || "—")}
      ${row("Preferred timing", timing || "—")}
      ${row("Project description", project_description)}
      ${row("Tools requested", tools || "—")}
      ${row("Accommodation notes", accommodation || "—")}
      ${row("Supplies budget", budget || "—")}
      ${row("Why this residency", why)}
      ${row("Anything else", extra || "—")}
    </table>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portal.Place <noreply@portal.place>",
      to: ["mike@futurethinkers.org"],
      reply_to: email,
      subject: `Artist Residency Application: ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
