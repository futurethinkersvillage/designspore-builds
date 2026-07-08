import { NextRequest, NextResponse } from "next/server";

// Public Stripe Payment Link for the $2,000 cabin-fund reservation deposit.
// Not a secret (it's a hosted checkout URL); env var lets it be rotated without a redeploy.
// Wells Gray Resort Stripe account (acct_16d7ht…). NOT Design Spore.
const DEPOSIT_URL =
  process.env.CABIN_FUND_DEPOSIT_LINK || "https://buy.stripe.com/7sYaEY0gv9M3ewE3Xh0Jq03";

const AMOUNT_LABELS: Record<string, string> = {
  "100k": "$100K",
  "250k": "$250K",
  "500k": "$500K",
  "1m": "$1M+",
  undecided: "Undecided",
};

const YOUARE_LABELS: Record<string, string> = {
  accredited: "Accredited investor",
  friends_family: "Friends & family",
  past_guest: "Past guest of Wells Gray Resort",
  list_podcast: "Mailing list / podcast subscriber",
  other: "Other",
};

const REFERRAL_LABELS: Record<string, string> = {
  mailing_list: "Mailing list (Wells Gray / Future Thinkers)",
  founders_message: "Personal message from the founders",
  referred: "Referred by a friend",
  group: "Saw it in a group",
  other: "Other",
};

function buildAdminHtml(d: Record<string, string>): string {
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone || "—"],
    ["Amount considering", AMOUNT_LABELS[d.amount] || d.amount || "—"],
    ["You are", YOUARE_LABELS[d.youare] || d.youare || "—"],
    ["How they heard", REFERRAL_LABELS[d.referral] || d.referral || "—"],
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
        <div style="font-size:18px;font-weight:700;color:#c2410c">🏕️ Cabin Fund reservation — ${d.name}</div>
        <div style="font-size:13px;color:#374151;margin-top:4px">Submitted the reserve form and is being sent to the $2,000 deposit checkout.</div>
      </div>
      <table style="border-collapse:collapse;width:100%">${tableRows}</table>
      <p style="font-size:12px;color:#9ca3af;margin-top:14px">Submitted via portal.place/cabin-fund</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, email, phone, amount, youare, referral, consent } = body;
  if (!name || !email || !consent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Email is best-effort: a mail hiccup must never block the deposit.
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
          subject: `🏕️ Cabin Fund reservation — ${name}`,
          html: buildAdminHtml({
            name,
            email,
            phone: phone || "",
            amount: amount || "",
            youare: youare || "",
            referral: referral || "",
          }),
        }),
      });
    } catch (e) {
      console.error("cabin-fund reserve: resend error", e);
    }
  } else {
    console.error("cabin-fund reserve: RESEND_API_KEY not set");
  }

  return NextResponse.json({ ok: true, depositUrl: DEPOSIT_URL });
}
