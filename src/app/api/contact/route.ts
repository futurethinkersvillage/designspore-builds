import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const html = `
    <h2>Contact Form — Portal.Place</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;width:120px">Name</td><td style="padding:8px;border:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Subject</td><td style="padding:8px;border:1px solid #eee">${subject || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #eee" style="white-space:pre-wrap">${message}</td></tr>
    </table>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portal.Place <noreply@portal.place>",
      to: ["mike@futurethinkers.org"],
      reply_to: email,
      subject: `[portal.place] ${subject || "Contact Form"} — ${name}`,
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
