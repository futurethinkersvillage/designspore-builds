export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, changeRequests, clientInfoRequests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getModuleById } from "@/lib/modules";
import AdminRequestRow from "@/components/dashboard/AdminRequestRow";
import AdminInfoRequestForm from "@/components/dashboard/AdminInfoRequestForm";
import Link from "next/link";

const ADMIN_EMAILS = ["mike@designspore.co", "futurethinkerspodcast@gmail.com", "mikenoises@gmail.com"];

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { email?: string | null };
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) redirect("/dashboard");

  const allRequests = await db
    .select({
      id: changeRequests.id,
      userId: changeRequests.userId,
      moduleId: changeRequests.moduleId,
      type: changeRequests.type,
      priority: changeRequests.priority,
      status: changeRequests.status,
      title: changeRequests.title,
      description: changeRequests.description,
      pageUrl: changeRequests.pageUrl,
      adminNotes: changeRequests.adminNotes,
      clientUpdate: changeRequests.clientUpdate,
      taskFilePath: changeRequests.taskFilePath,
      createdAt: changeRequests.createdAt,
    })
    .from(changeRequests)
    .orderBy(desc(changeRequests.createdAt));

  const allInfoRequests = await db
    .select()
    .from(clientInfoRequests)
    .orderBy(desc(clientInfoRequests.createdAt));

  const allClients = await db
    .select({ id: users.id, name: users.name, email: users.email, businessName: users.businessName })
    .from(users)
    .where(eq(users.isActive, true));

  const clientMap = new Map(allClients.map((c) => [c.id, c]));

  // Group requests by status priority
  const open = allRequests.filter((r) => r.status !== "resolved" && r.status !== "closed");
  const resolved = allRequests.filter((r) => r.status === "resolved" || r.status === "closed");

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-400/70 font-semibold mb-2">Admin</p>
          <h1 className="text-3xl font-bold text-white mb-1">Change Requests</h1>
          <p className="text-sm text-white/40">{open.length} open · {resolved.length} resolved</p>
        </div>
        <Link href="/admin" className="text-xs text-white/30 hover:text-white transition-colors">← Back to admin</Link>
      </div>

      {/* Send info request to client */}
      <AdminInfoRequestForm clients={allClients} />

      {/* Pending info requests you've sent */}
      {allInfoRequests.filter((r) => !r.isResolved).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Awaiting Client Response</h2>
          {allInfoRequests.filter((r) => !r.isResolved).map((req) => {
            const client = clientMap.get(req.userId);
            return (
              <div key={req.id} className="bg-raised border border-yellow-500/20 rounded-xl px-5 py-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/30 mb-1">{client?.name ?? client?.email}</p>
                    <p className="text-sm text-white">{req.message}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-yellow-300 border border-yellow-500/30 rounded-full px-2 py-0.5 shrink-0">
                    Waiting
                  </span>
                </div>
                {req.responseText && (
                  <div className="text-xs text-emerald-300 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-lg px-3 py-2">
                    {req.responseText}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Open requests */}
      {open.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Open ({open.length})</h2>
          {open.map((req) => {
            const client = clientMap.get(req.userId);
            const mod = req.moduleId ? getModuleById(req.moduleId) : undefined;
            return (
              <AdminRequestRow
                key={req.id}
                request={req}
                clientName={client?.name ?? null}
                clientEmail={client?.email ?? null}
                moduleName={mod?.name}
              />
            );
          })}
        </section>
      )}

      {open.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/[0.06] rounded-2xl">
          <p className="text-white/30">No open requests.</p>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Resolved ({resolved.length})</h2>
          {resolved.map((req) => {
            const client = clientMap.get(req.userId);
            const mod = req.moduleId ? getModuleById(req.moduleId) : undefined;
            return (
              <AdminRequestRow
                key={req.id}
                request={req}
                clientName={client?.name ?? null}
                clientEmail={client?.email ?? null}
                moduleName={mod?.name}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
