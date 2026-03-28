import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, activations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getModuleById, tierConfig, type ModuleTier } from "@/lib/modules";
import { PLANS, type PlanKey } from "@/lib/subscription";
import AdminActivationRow from "@/components/dashboard/AdminActivationRow";
import AdminUserRow from "@/components/dashboard/AdminUserRow";

const ADMIN_EMAILS = ["mike@designspore.co", "futurethinkerspodcast@gmail.com", "mikenoises@gmail.com"];

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { email?: string | null };
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) redirect("/dashboard");

  const allUsers = await db.select({
    id: users.id, name: users.name, email: users.email,
    businessName: users.businessName, businessType: users.businessType,
    subscriptionTier: users.subscriptionTier, monthlyBudget: users.monthlyBudget,
    isActive: users.isActive, createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt));

  const allActivations = await db.select({
    id: activations.id, userId: activations.userId, moduleId: activations.moduleId,
    status: activations.status, periodMonth: activations.periodMonth,
    progressUpdate: activations.progressUpdate, activatedAt: activations.activatedAt,
  }).from(activations).orderBy(desc(activations.activatedAt));

  const pendingActivations = allActivations.filter((a) => a.status === "pending");
  const activeActivations = allActivations.filter((a) => a.status === "active");

  function userName(userId: string) {
    const u = allUsers.find((u) => u.id === userId);
    return u?.name ?? u?.email ?? userId;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-400 font-semibold mb-1">Admin</p>
          <h1 className="text-3xl font-bold text-white">Client Management</h1>
        </div>
        <span className="text-xs text-white/30 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
          Mike only
        </span>
      </div>

      {/* Pending activations — need action */}
      {pendingActivations.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest text-xs mb-4">
            ⏳ Pending ({pendingActivations.length})
          </h2>
          <div className="space-y-2">
            {pendingActivations.map((a) => {
              const mod = getModuleById(a.moduleId);
              return (
                <AdminActivationRow
                  key={a.id}
                  activation={a}
                  moduleName={mod?.name ?? a.moduleId}
                  tier={mod?.tier as ModuleTier}
                  clientName={userName(a.userId)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Active activations */}
      {activeActivations.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest text-xs mb-4">
            ✓ In Progress ({activeActivations.length})
          </h2>
          <div className="space-y-2">
            {activeActivations.map((a) => {
              const mod = getModuleById(a.moduleId);
              return (
                <AdminActivationRow
                  key={a.id}
                  activation={a}
                  moduleName={mod?.name ?? a.moduleId}
                  tier={mod?.tier as ModuleTier}
                  clientName={userName(a.userId)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* All clients */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">All Clients ({allUsers.length})</h2>
        <div className="space-y-2">
          {allUsers.map((u) => (
            <AdminUserRow key={u.id} user={u} plans={PLANS} />
          ))}
        </div>
      </section>
    </div>
  );
}
