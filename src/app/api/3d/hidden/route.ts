import { setHidden, isAuthorized, adminEnabled } from "@/lib/models.server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return Response.json({ error: "admin disabled" }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { slug?: string; hidden?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }
  if (typeof body.slug !== "string" || typeof body.hidden !== "boolean") {
    return Response.json(
      { error: "expected { slug: string, hidden: boolean }" },
      { status: 400 }
    );
  }

  try {
    const models = setHidden(body.slug, body.hidden);
    return Response.json({ models });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "failed" },
      { status: 400 }
    );
  }
}
