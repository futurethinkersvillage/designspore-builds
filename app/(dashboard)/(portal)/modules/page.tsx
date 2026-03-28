import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { activations, users } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import {
  modules,
  categoryLabels,
  tierConfig,
  type ModuleCategory,
  type ModuleTier,
} from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import ModuleCard from "@/components/dashboard/ModuleCard";
import ModulesFilter from "@/components/dashboard/ModulesFilter";

export default async function ModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; category?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  // Modules queued in any current or future month
  let activatedIds = new Set<string>();

  if (!isDemo) {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const user = session.user as { id?: string };

    if (user.id) {
      const currentMonth = getMonthKey(0);
      const rows = await db
        .select({ moduleId: activations.moduleId, status: activations.status })
        .from(activations)
        .where(and(eq(activations.userId, user.id), gte(activations.periodMonth, currentMonth)));

      activatedIds = new Set(
        rows
          .filter((r) => r.status !== "cancelled" && r.status !== "completed")
          .map((r) => r.moduleId)
      );
    }
  }
  // Demo: activatedIds stays empty — detail page DemoActivateWrapper handles queue state via localStorage

  const tierFilter = params.tier ? parseInt(params.tier) as ModuleTier : null;
  const catFilter = params.category as ModuleCategory | null;

  const filtered = modules.filter((m) => {
    if (tierFilter && m.tier !== tierFilter) return false;
    if (catFilter && m.category !== catFilter) return false;
    return true;
  });

  const tiers = [1, 2, 3] as ModuleTier[];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Services</p>
        <h1 className="text-3xl font-bold text-white mb-1">Browse Services</h1>
        <p className="text-sm text-white/40">
          Select a service to view details and add it to your queue.
        </p>
      </div>

      {/* Tier legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiers.map((t) => {
          const cfg = tierConfig[t];
          const count = modules.filter((m) => m.tier === t).length;
          const colorBorder = t === 1 ? "border-gold/20" : t === 2 ? "border-blue-500/20" : "border-emerald-500/20";
          const colorText = t === 1 ? "text-gold" : t === 2 ? "text-blue-300" : "text-emerald-300";
          return (
            <div key={t} className={`bg-card border ${colorBorder} rounded-xl px-4 py-3`}>
              <p className={`text-sm font-semibold ${colorText} mb-0.5`}>{cfg.label}</p>
              <p className="text-xs text-white/40">{cfg.description}</p>
              <p className="text-xs text-white/25 mt-1">{count} service{count !== 1 ? "s" : ""}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <ModulesFilter
        categories={Object.entries(categoryLabels) as [ModuleCategory, string][]}
        currentTier={params.tier ?? null}
        currentCategory={params.category ?? null}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-white/[0.06] rounded-2xl">
          <p className="text-white/40">No services match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              isActivated={activatedIds.has(mod.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
