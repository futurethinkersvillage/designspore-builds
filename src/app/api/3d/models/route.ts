import { getAllModels, isAuthorized, adminEnabled } from "@/lib/models.server";

// Admin-only: returns the full model list, including hidden ones, so the
// admin UI can render Hide/Show toggles. Never cached.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!adminEnabled()) {
    return Response.json({ error: "admin disabled" }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ models: getAllModels() });
}
