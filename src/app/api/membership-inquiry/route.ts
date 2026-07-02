import { NextRequest, NextResponse } from "next/server";

type Score = "GREEN" | "YELLOW" | "RED";

const TIER_LABELS: Record<string, string> = {
  cabin_max: "Founder Cabin Max",
  cabin: "Founder Cabin",
  rv: "Founder RV",
  public_waitlist: "Public membership (waitlist)",
  not_sure: "Not sure yet",
};

const HOW_KNOW_LABELS: Record<string, string> = {
  friend_family: "Friend of Mike & Euvie / the Gilliland family",
  family: "Family",
  business_associate: "Business associate or colleague",
  past_guest: "Past guest at Wells Gray Golf & RV Resort",
  podcast_listener: "Future Thinkers podcast listener",
  mailing_list: "Future Thinkers mailing list",
  group_online: "Saw it in a group or online community",
  referred: "Referred by a current member or a friend",
};

const COMMUNITY_FIT_LABELS: Record<string, string> = {
  yes: "Yes — that's exactly what appeals to me",
  mostly: "Mostly — I have a couple of questions",
  not_quite: "Not quite — I'm looking for something different",
};

const TIMELINE_LABELS: Record<string, string> = {
  yes: "Yes",
  probably: "Probably — I'd want to see the full details first",
  just_exploring: "Just exploring for now",
};

const SCORE_COLORS: Record<Score, string> = {
  GREEN: "#16a34a",
  YELLOW: "#ca8a04",
  RED: "#dc2626",
};

const SCORE_BG: Record<Score, string> = {
  GREEN: "#f0fdf4",
  YELLOW: "#fefce8",
  RED: "#fef2f2",
};

// GREEN: warm relationship + good fit + ready to move
// YELLOW: wider community + good fit → needs human review
// RED: values mismatch or just tire-kicking
function calcScore(how_know_us: string, community_fit: string, timeline: string): Score {
  if (community_fit === "not_quite") return "RED";

  const warm = ["friend_family", "family", "business_associate", "past_guest"].includes(how_know_us);
  const wider = ["podcast_listener", "mailing_list", "group_online", "referred"].includes(how_know_us);
  const goodFit = community_fit === "yes" || community_fit === "mostly";
  const ready = timeline === "yes" || timeline === "probably";

  if (warm && goodFit && ready) return "GREEN";
  if (wider && goodFit) return "YELLOW";
  return "RED";
}

function encodeToken(name: string, email: string, tier: string): string {
  const payload = JSON.stringify({ name, email, tier, ts: Date.now() });
  return Buffer.from(payload).toString("base64url");
}

function buildApprovalEmailHtml(name: string, briefUrl: string, depositLink: string | undefined): string {
  const firstName = name.split(" ")[0];
  const depositSection = depositLink
    ? `<p style="font-size:15px;line-height:1.7">If you'd like to hold your spot while you read, you can place the fully refundable $2,000 deposit here:</p>
       <p style="text-align:center;margin:24px 0">
         <a href="${depositLink}" style="display:inline-block;background:#d97706;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:600">
           Hold my founding spot — $2,000 refundable →
         </a>
       </p>
       <p style="font-size:14px;line-height:1.6;color:#6b7280">It commits you to nothing. It holds your place in line and is applied to your membership if you proceed — or returned in full if you don't.</p>`
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

function buildAdminEmailHtml(
  data: Record<string, string>,
  scoreResult: Score,
  approveUrl: string
): string {
  const color = SCORE_COLORS[scoreResult];
  const bg = SCORE_BG[scoreResult];
  const emoji = scoreResult === "GREEN" ? "🟢" : scoreResult === "YELLOW" ? "🟡" : "🔴";

  const scoreNote =
    scoreResult === "GREEN"
      ? "Warm relationship + good fit + ready to move. Approval email auto-sent ✓"
      : scoreResult === "YELLOW"
      ? "Wider community lead — good fit but needs your one-click approval before the brief is sent."
      : "Values mismatch or low intent. No email sent to applicant.";

  const approveButton =
    scoreResult === "YELLOW"
      ? `<div style="margin:24px 0;padding:20px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb">
          <p style="margin:0 0 12px;font-size:13px;color:#374151;font-family:sans-serif"><strong>One-click approve:</strong> clicking this immediately sends the Founders brief + deposit instructions to <strong>${data.email}</strong>.</p>
          <a href="${approveUrl}" style="display:inline-block;background:#16a34a;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-family:sans-serif;font-weight:600;font-size:14px">
            ✅ Approve — send brief + deposit link
          </a>
        </div>`
      : "";

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Location", data.location],
    ["Joining as", data.joining_as],
    ["How they know us", HOW_KNOW_LABELS[data.how_know_us] || data.how_know_us],
    ["Connection detail", data.how_know_us_detail || "—"],
    ["Tier interest", TIER_LABELS[data.tier_interest] || data.tier_interest],
    ["What interests them", data.what_interests_you],
    ["Community fit", COMMUNITY_FIT_LABELS[data.community_fit] || data.community_fit],
    ["Timeline", TIMELINE_LABELS[data.timeline] || data.timeline],
    ["Anything else", data.anything_else || "—"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:160px;font-size:13px;font-family:sans-serif;vertical-align:top">${label}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;font-family:sans-serif">${value}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:680px">
      <div style="background:${bg};border:2px solid ${color};border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <div style="font-size:18px;font-weight:700;color:${color};margin-bottom:4px">${emoji} ${scoreResult} — Membership Inquiry: ${data.name}</div>
        <div style="font-size:13px;color:#374151">${scoreNote}</div>
      </div>
      ${approveButton}
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">${tableRows}</table>
      <p style="font-size:12px;color:#9ca3af;margin:0">Submitted via portal.place/membership</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const {
    name, email, phone, location, joining_as,
    how_know_us, how_know_us_detail, tier_interest,
    what_interests_you, community_fit, timeline,
    anything_else, consent,
  } = body;

  if (!name || !email || !location || !joining_as || !how_know_us || !tier_interest || !what_interests_you || !community_fit || !timeline || !consent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const scoreResult = calcScore(how_know_us, community_fit, timeline);
  const token = encodeToken(name, email, tier_interest);
  const approveUrl = `https://portal.place/api/membership-inquiry/approve?token=${token}`;

  const adminSubject =
    scoreResult === "GREEN"
      ? `🟢 [AUTO-APPROVED] Membership Inquiry — ${name}`
      : scoreResult === "YELLOW"
      ? `🟡 [NEEDS REVIEW] Membership Inquiry — ${name}`
      : `🔴 [HOLD] Membership Inquiry — ${name}`;

  const adminHtml = buildAdminEmailHtml(
    { name, email, phone: phone || "", location, joining_as, how_know_us, how_know_us_detail: how_know_us_detail || "", tier_interest, what_interests_you, community_fit, timeline, anything_else: anything_else || "" },
    scoreResult,
    approveUrl
  );

  const adminRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portal.Place <noreply@portal.place>",
      to: ["mike@futurethinkers.org"],
      reply_to: email,
      subject: adminSubject,
      html: adminHtml,
    }),
  });

  if (!adminRes.ok) {
    const err = await adminRes.text();
    console.error("Resend admin error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  // GREEN: auto-send the approval email immediately
  if (scoreResult === "GREEN") {
    const briefUrl = "https://docs.google.com/document/d/1uPdEus2R_-PeRY9ANU2a2bf7Qzwy8GPFFhh3lki_zLI/preview";
    const depositLink = process.env.MEMBERSHIP_DEPOSIT_LINK;
    const approvalHtml = buildApprovalEmailHtml(name, briefUrl, depositLink);

    await fetch("https://api.resend.com/emails", {
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
  }

  return NextResponse.json({ ok: true, score: scoreResult });
}
