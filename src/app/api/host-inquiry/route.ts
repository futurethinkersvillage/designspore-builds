import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, email, phone, company, website, event_type, event_name, dates, description, attendance, spaces, accommodation, collaboration, logistics } = body;

  if (!name || !email || !event_name || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const spaceList = Array.isArray(spaces) ? spaces.join(", ") : spaces || "—";

  const html = `
    <h2>Host Inquiry — Portal.Place</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;width:160px">Name</td><td style="padding:8px;border:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #eee">${phone || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Organization</td><td style="padding:8px;border:1px solid #eee">${company || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${website || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Event Type</td><td style="padding:8px;border:1px solid #eee">${event_type || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Event Name</td><td style="padding:8px;border:1px solid #eee">${event_name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Dates</td><td style="padding:8px;border:1px solid #eee">${dates || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Attendance</td><td style="padding:8px;border:1px solid #eee">${attendance || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Spaces</td><td style="padding:8px;border:1px solid #eee">${spaceList}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Description</td><td style="padding:8px;border:1px solid #eee">${description}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Accommodation</td><td style="padding:8px;border:1px solid #eee">${accommodation || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Collaboration</td><td style="padding:8px;border:1px solid #eee">${collaboration || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Logistics</td><td style="padding:8px;border:1px solid #eee">${logistics || "—"}</td></tr>
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
      subject: `Host Inquiry: ${event_name} — ${name}`,
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
