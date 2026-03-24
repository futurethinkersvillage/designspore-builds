import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = "futurethinkerspodcast@gmail.com";

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
  if (!resend) return; // Silently skip if no API key configured

  await resend.emails.send({
    from: "DesignSpore Portal <portal@designspore.co>",
    to: NOTIFY_EMAIL,
    subject: `New portal signup: ${name} (${businessName})`,
    html: `
      <p>A new client has requested portal access.</p>
      <table>
        <tr><td><strong>Name</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Business</strong></td><td>${businessName}</td></tr>
        <tr><td><strong>Type</strong></td><td>${businessType}</td></tr>
      </table>
      <p>Log in to activate their account once their subscription is confirmed.</p>
    `,
  });
}
