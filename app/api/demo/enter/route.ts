import { NextRequest, NextResponse } from "next/server";

function getPublicOrigin(request: NextRequest): string {
  // NEXTAUTH_URL is the canonical public origin — always prefer it over headers
  // which can contain internal Docker addresses (0.0.0.0:3000) behind a proxy
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (request.nextUrl.protocol.replace(":", "") || "https");
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "designspore.co";
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const secret = process.env.DEMO_SECRET;

  if (!secret || !token || token !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = NextResponse.redirect(
    new URL("/dashboard", getPublicOrigin(request))
  );
  response.cookies.set("ds_demo", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}
