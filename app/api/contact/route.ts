import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM ?? "DesignSpore <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  const { name, email, company, services, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!resend) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  await resend.emails.send({
    from: FROM,
    to: "futurethinkerspodcast@gmail.com",
    replyTo: email,
    subject: `New contact: ${name}${company ? ` — ${company}` : ""}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 20px;font-size:18px;">New contact form submission</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:100px;">Name</td><td style="padding:6px 0;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          ${company ? `<tr><td style="padding:6px 0;color:#888;">Company</td><td style="padding:6px 0;">${company}</td></tr>` : ""}
          ${services?.length ? `<tr><td style="padding:6px 0;color:#888;">Services</td><td style="padding:6px 0;">${services.join(", ")}</td></tr>` : ""}
        </table>
        <div style="margin:20px 0;padding:16px;background:#f9f9f9;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</div>
        <p style="font-size:12px;color:#aaa;">Reply to this email to respond directly to ${name}.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
