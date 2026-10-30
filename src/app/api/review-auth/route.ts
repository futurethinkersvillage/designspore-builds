import { NextResponse } from "next/server";

// Separate from /api/investor-auth on purpose: holders of the investor password must not get in here.
export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== process.env.REVIEW_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = process.env.REVIEW_AUTH_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("review_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "strict",
  });

  return response;
}
