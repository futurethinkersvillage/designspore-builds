import { NextRequest, NextResponse } from "next/server";

const TIER_LABELS: Record<string, string> = {
  cabin_max: "Founder Cabin Max",
  cabin: "Founder Cabin",
  rv: "Founder RV",
  public_waitlist: "Public membership (waitlist)",
  not_sure: "Not sure yet",
};

function buildApprovalEmailHtml(name: string, briefUrl: string, depositLink: string | undefined): string {
  const firstName = name.split(" ")[0];
  const depositSection = depositLink
    ? `<p style="font-size:15px;line-height:1.7">If you'd like to hold your spot while you read, you can place the fully refundable $2,000 deposit here:</p>
       <p style="text-align:center;margin:24px 0">
         <a href="${depositLink}" style="display:inline-block;background:#d97706;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:600">
           Hold my founding spot — $2,000 refundable →
         </a>
       </p>
       <p style="font-size:14px;line-height:1.6;color:#6b7280;font-family:sans-serif">It commits you to nothing. It holds your place in line and is applied to your membership if you proceed — or returned in full if you don't.</p>`
    : `<p style="font-size:15px;line-height:1.7">To hold your spot, reply to this email and we'll send you the link to place a fully refundable $2,000 deposit. It commits you to nothing — it holds your place in line and is applied to your membership if you proceed, or returned in full if you don't.</p>`;

  return `
    <div style="font-family:Georgia,serif;max-width:580px;color:#1a1a1a;line-height:1.6">
      <p style="font-size:15px">Hi ${firstName},</p>
      <p style="font-size:15px">Thanks for reaching out — from what you shared, this sounds like a real fit, and we'd love to have you in the founding circle.</p>
      <p style="font-size:15px">Here is the full Founders brief: the three ways to join, what's included, and how the founding round works.</p>
      <p style="text-align:center;margin:32px 0">
        <a href="${briefUrl}" style="display:inline-block;background:#1a1a1a;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:600">
          Read the Founders Brief →
        </a>
      </p>
      ${depositSection}
      <p style="font-size:15px">The round is capped at 50 — we break ground once 30 are committed. Spots are confirmed in the order deposits arrive.</p>
      <p style="font-size:15px">Any questions at all, just reply — you've got us directly.</p>
      <p style="font-size:15px">Mike &amp; Euvie<br>
        <a href="mailto:contact@futurethinkers.org" style="color:#d97706">contact@futurethinkers.org</a>
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0">
      <p style="font-size:11px;color:#9ca3af;line-height:1.6;font-family:sans-serif">
        This email is not an offer of securities. A Founding Membership includes non-voting shares in Portal.Place Inc., offered only under applicable private-placement exemptions. Full terms, pricing, and risk disclosures are in the formal subscription documents.
      </p>
    </div>
  `;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  let name: string, email: string, tier: string;
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString());
    name = decoded.name;
    email = decoded.email;
    tier = decoded.tier || "not_sure";
    if (!name || !email) throw new Error("missing fields");
  } catch {
    return new NextResponse("Invalid token", { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new NextResponse("Email service not configured", { status: 500 });
  }

  const briefUrl = "https://docs.google.com/document/d/1uPdEus2R_-PeRY9ANU2a2bf7Qzwy8GPFFhh3lki_zLI/preview";
  const depositLink = process.env.MEMBERSHIP_DEPOSIT_LINK;
  const approvalHtml = buildApprovalEmailHtml(name, briefUrl, depositLink);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Mike & Euvie at Wells Gray Village <noreply@portal.place>",
      to: [email],
      reply_to: "contact@futurethinkers.org",
      subject: "Your Wells Gray Village founding spot — the Founders brief",
      html: approvalHtml,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend approve error:", err);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;max-width:560px;margin:60px auto;padding:24px">
        <h2 style="color:#dc2626">Failed to send email</h2>
        <p>Resend returned an error. Check server logs.</p>
      </body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }

  const tierLabel = TIER_LABELS[tier] || tier;

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Approval Sent — Wells Gray Village</title></head>
    <body style="font-family:sans-serif;max-width:560px;margin:60px auto;padding:24px;color:#111">
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:24px 28px;margin-bottom:24px">
        <h2 style="margin:0 0 8px;color:#16a34a;font-size:20px">✅ Approval email sent!</h2>
        <p style="margin:0;color:#166534;font-size:15px">The Founders brief and deposit instructions have been sent to <strong>${email}</strong>.</p>
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Name</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${name}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Email</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${email}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Tier interest</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${tierLabel}</td></tr>
      </table>
      <p style="margin-top:24px;font-size:13px;color:#6b7280">You can close this tab.</p>
    </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
