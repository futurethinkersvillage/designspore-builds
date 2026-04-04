import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = "futurethinkerspodcast@gmail.com";

// "From" address — swap to hello@designspore.co once the domain is verified in Resend dashboard
// Until then, Resend's shared domain is used so emails actually deliver
const FROM =
  process.env.RESEND_FROM ?? "DesignSpore Portal <onboarding@resend.dev>";

export async function sendActivationEmail({
  clientName,
  clientEmail,
  businessName,
  moduleName,
  moduleId,
  tier,
  periodMonth,
}: {
  clientName: string;
  clientEmail: string;
  businessName: string;
  moduleName: string;
  moduleId: string;
  tier: 1 | 2 | 3;
  periodMonth: string;
}) {
  if (!resend) return;
  const tierLabel = tier === 1 ? "4 credits" : tier === 2 ? "2 credits" : "1 credit";
  await resend.emails.send({
    from: FROM,
    to: NOTIFY_EMAIL,
    subject: `🟡 Activation: ${moduleName} — ${businessName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 16px;font-size:18px;">New Module Activation</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Client</td><td>${clientName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td>${clientEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Business</td><td>${businessName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Module</td><td><strong>${moduleName}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#888;">Tier</td><td>${tierLabel}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Month</td><td>${periodMonth}</td></tr>
        </table>
        <p style="margin:20px 0 0;font-size:13px;color:#888;">
          Review and change status via the admin script or Coolify DB access.
        </p>
      </div>
    `,
  });
}

export async function sendSignupNotification({
  name,
  email,
  businessName,
  businessType,
}: {
  name: string;
  email: string;
  businessName: string;
  businessType: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_EMAIL,
    subject: `New portal signup: ${name} — ${businessName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 16px;font-size:18px;">New client signup</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Name</td><td style="padding:6px 0;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${email}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Business</td><td style="padding:6px 0;">${businessName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Type</td><td style="padding:6px 0;">${businessType}</td></tr>
        </table>
        <p style="margin:20px 0 0;font-size:13px;color:#888;">
          Account is inactive — activate it once their subscription is confirmed.
        </p>
      </div>
    `,
  });
}
