import { NextRequest, NextResponse } from "next/server";

const ROLE_LABELS: Record<string, string> = {
  partner: "Potential partner (event/program/build)",
  investor: "Potential investor",
  guest: "Future guest / visitor",
  press: "Press or media",
  curious: "Just curious",
};

function buildAdminHtml(d: Record<string, string>): string {
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Reaching out as", ROLE_LABELS[d.role] || d.role || "—"],
    ["Message", d.message || "—"],
  ];
  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:170px;font-size:13px;font-family:sans-serif;vertical-align:top">${label}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;font-family:sans-serif">${value}</td>
      </tr>`
    )
    .join("");
  return `
    <div style="font-family:sans-serif;max-width:640px">
      <div style="background:#fff7ed;border:2px solid #ea824e;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <div style="font-size:18px;font-weight:700;color:#c2410c">🎪 Experience Park — new contact: ${d.name}</div>
        <div style="font-size:13px;color:#374151;margin-top:4px">Submitted the Get Involved form.</div>
      </div>
      <table style="border-collapse:collapse;width:100%">${tableRows}</table>
      <p style="font-size:12px;color:#9ca3af;margin-top:14px">Submitted via portal.place/experience-park</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, email, role, message } = body;
  if (!name || !email) {
    return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Portal.Place <noreply@portal.place>",
          to: ["mike@futurethinkers.org"],
          reply_to: email,
          subject: `🎪 Experience Park contact — ${name}`,
          html: buildAdminHtml({ name, email, role: role || "", message: message || "" }),
        }),
      });
    } catch (e) {
      console.error("experience-park contact: resend error", e);
    }
  } else {
    console.error("experience-park contact: RESEND_API_KEY not set");
  }

  return NextResponse.json({ ok: true });
}
