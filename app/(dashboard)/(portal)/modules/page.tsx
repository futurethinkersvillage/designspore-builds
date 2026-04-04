export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import {
  modules,
  categoryLabels,
  getRecommendedModules,
  type ModuleCategory,
} from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import { Suspense } from "react";
import ModuleCard, { DemoModuleCard } from "@/components/dashboard/ModuleCard";
import ModulesFilter from "@/components/dashboard/ModulesFilter";
import ModuleDrawer from "@/components/dashboard/ModuleDrawer";
import RequestCustomModuleButton from "@/components/dashboard/RequestCustomModuleButton";

export default async function ModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; detail?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let activatedIds: string[] = [];

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

      activatedIds = rows
        .filter((r) => r.status !== "cancelled" && r.status !== "completed")
        .map((r) => r.moduleId);
    }
  }

  const activatedSet = new Set(activatedIds);
  const catFilter = params.category as ModuleCategory | null;

  // Recommended: 3 modules not yet in queue, picked across different categories
  const recommendedModules = !catFilter ? getRecommendedModules(activatedIds, 3) : [];

  const categoryOrder: ModuleCategory[] = [
    "lead-generation",
    "sales-followup",
    "client-communication",
    "reputation",
    "automation",
    "operations",
    "website",
    "market-intelligence",
  ];

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: modules.filter(
        (m) => m.category === cat && (!catFilter || m.category === catFilter)
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Services</p>
          <h1 className="text-3xl font-bold text-white mb-1">Browse Services</h1>
          <p className="text-sm text-white/40">
            Click any service for details, or add it directly to your queue.
          </p>
        </div>
        {!isDemo && (
          <Suspense fallback={null}>
            <RequestCustomModuleButton />
          </Suspense>
        )}
      </div>

      {/* Recommended section — hidden when a category filter is active */}
      {recommendedModules.length > 0 && (
        <section>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-gold/70 font-semibold mb-1">Recommended for You</p>
            <p className="text-sm text-white/40">Highest-impact services based on what's not yet in your queue.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedModules.map((mod) =>
              isDemo ? (
                <DemoModuleCard
                  key={mod.id}
                  module={mod}
                  isActivated={activatedSet.has(mod.id)}
                />
              ) : (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  isActivated={activatedSet.has(mod.id)}
                />
              )
            )}
          </div>
        </section>
      )}

      {/* Category filters */}
      <ModulesFilter
        categories={Object.entries(categoryLabels) as [ModuleCategory, string][]}
        currentCategory={params.category ?? null}
      />

      {/* Grouped sections */}
      {grouped.map(({ category, label, items }) => (
        <section key={category}>
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">{label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((mod) =>
              isDemo ? (
                <DemoModuleCard
                  key={mod.id}
                  module={mod}
                  isActivated={activatedSet.has(mod.id)}
                />
              ) : (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  isActivated={activatedSet.has(mod.id)}
                />
              )
            )}
          </div>
        </section>
      ))}

      {grouped.length === 0 && (
        <div className="text-center py-16 border border-white/[0.06] rounded-2xl">
          <p className="text-white/40">No services match this filter.</p>
        </div>
      )}

      {/* Detail drawer (reads ?detail= from URL) */}
      <ModuleDrawer isDemo={isDemo} activatedIds={activatedIds} />
    </div>
  );
}
