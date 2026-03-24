import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const secret = process.env.DEMO_SECRET;

  if (!secret || !token || token !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("ds_demo", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}
