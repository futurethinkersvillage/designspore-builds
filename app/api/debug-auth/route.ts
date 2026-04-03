import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET() {
  const h = await headers();
  const c = await cookies();

  let session = null;
  let sessionError = null;
  try {
    session = await auth();
  } catch (e: unknown) {
    sessionError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    authResult: session ? { user: session.user } : null,
    authError: sessionError,
    env: {
      AUTH_URL: process.env.AUTH_URL ?? "(not set)",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "(not set)",
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST ?? "(not set)",
      NODE_ENV: process.env.NODE_ENV,
    },
    headers: {
      host: h.get("host"),
      "x-forwarded-proto": h.get("x-forwarded-proto"),
      "x-forwarded-host": h.get("x-forwarded-host"),
      cookie: c.getAll().map((ck) => `${ck.name}=${ck.value.substring(0, 20)}...`),
    },
  });
}
