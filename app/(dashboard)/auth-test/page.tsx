export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { cookies, headers } from "next/headers";

export default async function AuthTestPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieNames = cookieStore.getAll().map(c => c.name);
  const hasSessionToken = cookieNames.some(n => n.includes("session-token"));

  let session = null;
  let authError = null;
  try {
    session = await auth();
  } catch (e: any) {
    authError = e.message;
  }

  return (
    <div style={{ padding: 40, color: "white", fontFamily: "monospace" }}>
      <h1>Auth Debug Page</h1>
      <pre>{JSON.stringify({
        hasSession: !!session,
        user: session?.user?.email ?? null,
        authError,
        cookies: cookieNames,
        hasSessionToken,
        host: headerStore.get("host"),
        forwardedProto: headerStore.get("x-forwarded-proto"),
        cookie: headerStore.get("cookie")?.substring(0, 100),
      }, null, 2)}</pre>
    </div>
  );
}
