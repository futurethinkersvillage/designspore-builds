import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// Inbound mail for *@portal.place: MX points at Resend (receiving), Resend posts an
// `email.received` webhook here, and we forward the message to the central Gmail
// inbox. Reply-To is set to the original sender so replying from Gmail just works.
// (Namecheap's free forwarding can't be used: it requires dropping the MX records
// on send.portal.place that Resend sending needs.)

const FORWARD_TO = process.env.INBOUND_FORWARD_TO || "futurethinkerspodcast@gmail.com";

// Resend signs webhooks with Svix (svix-* or standard webhook-* headers): HMAC-SHA256 over `${id}.${timestamp}.${body}`
// keyed with the base64 part of the `whsec_...` secret.
function verifySignature(body: string, headers: Headers, secret: string): boolean {
  const id = headers.get("svix-id") || headers.get("webhook-id");
  const timestamp = headers.get("svix-timestamp") || headers.get("webhook-timestamp");
  const signatures = headers.get("svix-signature") || headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signatures.split(" ").some((s) => {
    const sig = Buffer.from(s.split(",")[1] || "", "base64");
    return sig.length === expected.length && timingSafeEqual(sig, expected);
  });
}

async function resend(path: string, apiKey: string, init?: RequestInit) {
  const res = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const secret = process.env.RESEND_INBOUND_SECRET;
  if (!apiKey || !secret) {
    console.error("inbound-email: RESEND_API_KEY or RESEND_INBOUND_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await req.text();
  if (!verifySignature(body, req.headers, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  if (event.type !== "email.received") return NextResponse.json({ ok: true, ignored: event.type });

  const emailId: string = event.data.email_id;
  try {
    const email = await resend(`/emails/receiving/${emailId}?html_format=cid`, apiKey);
    const attachments = email.attachments?.length
      ? (await resend(`/emails/receiving/${emailId}/attachments`, apiKey)).data
      : [];

    // "Jane Doe <jane@x.com>" -> show "Jane Doe via Portal.Place" in Gmail. `email.from` is the
    // bare address, so the display name comes from the raw From header.
    const fromHeader: string = email.headers?.from || email.headers?.From || email.from;
    const senderName = (fromHeader.match(/^\s*"?([^"<]+?)"?\s*</)?.[1] || email.from).trim();
    const receivedFor: string[] = email.received_for?.length ? email.received_for : email.to;

    await resend("/emails", apiKey, {
      method: "POST",
      // Resend retries webhooks; this stops a retry from forwarding twice.
      headers: { "Idempotency-Key": `inbound-fwd-${emailId}` },
      body: JSON.stringify({
        from: `${senderName.replace(/[<>"]/g, "")} via Portal.Place <inbox@portal.place>`,
        to: [FORWARD_TO],
        reply_to: email.reply_to?.length ? email.reply_to : [email.from],
        subject: email.subject || "(no subject)",
        html: email.html || undefined,
        text: email.text || (email.html ? undefined : "(empty message)"),
        headers: { "X-Original-To": receivedFor.join(", "), "X-Original-From": email.from },
        attachments: attachments.map((a: { filename?: string; download_url: string; content_type: string; content_id?: string }) => ({
          filename: a.filename || "attachment",
          path: a.download_url,
          content_type: a.content_type,
          content_id: a.content_id?.replace(/^<|>$/g, "") || undefined,
        })),
      }),
    });
  } catch (err) {
    console.error("inbound-email: forward failed", emailId, err);
    return NextResponse.json({ error: "Forward failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
