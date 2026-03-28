import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const secret = process.env.DEMO_SECRET;
  if (!secret) return new NextResponse("Demo not available", { status: 404 });

  const origin = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? `https://${request.headers.get("host") ?? "designspore.co"}`;
  const response = NextResponse.redirect(new URL("/dashboard", origin));
  response.cookies.set("ds_demo", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
