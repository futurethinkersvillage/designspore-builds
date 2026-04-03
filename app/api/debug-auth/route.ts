import { auth } from "@/auth";
import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieNames = cookieStore.getAll().map((c) => c.name);
  const hasSessionToken = cookieNames.some((n) => n.includes("session-token"));

  return Response.json({
    hasSession: !!session,
    user: session?.user?.email ?? null,
    cookies: cookieNames,
    hasSessionToken,
    host: headerStore.get("host"),
    forwardedProto: headerStore.get("x-forwarded-proto"),
    forwardedHost: headerStore.get("x-forwarded-host"),
  });
}
