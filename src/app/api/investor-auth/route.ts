import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== process.env.INVESTOR_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = process.env.INVESTOR_AUTH_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("investor_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });

  return response;
}
