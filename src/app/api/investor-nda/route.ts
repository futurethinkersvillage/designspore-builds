import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email } = await request.json();

  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Send notification email via Resend
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portal.Place <noreply@portal.place>",
        to: ["contact@futurethinkers.org"],
        subject: `NDA Signed — ${name}`,
        text: `NDA signed by investor:\n\nName: ${name}\nEmail: ${email}\nTime: ${new Date().toISOString()}`,
      }),
    });
  } catch {
    // Email failure is non-fatal — still set the cookie
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("investor_nda", "1", {
    httpOnly: false, // readable by client JS for instant reveal
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  });

  return response;
}
