import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import {
  modules,
  categoryLabels,
  type ModuleCategory,
} from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import ModuleCard from "@/components/dashboard/ModuleCard";
import ModulesFilter from "@/components/dashboard/ModulesFilter";

export default async function ModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

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

  const catFilter = params.category as ModuleCategory | null;

  // Group modules by category
  const categoryOrder: ModuleCategory[] = [
    "lead-generation",
    "client-communication",
    "reputation",
    "automation",
    "operations",
    "website",
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
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Services</p>
        <h1 className="text-3xl font-bold text-white mb-1">Browse Services</h1>
        <p className="text-sm text-white/40">
          Select a service to view details and add it to your queue.
        </p>
      </div>

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
            {items.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                isActivated={activatedIds.has(mod.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {grouped.length === 0 && (
        <div className="text-center py-16 border border-white/[0.06] rounded-2xl">
          <p className="text-white/40">No services match this filter.</p>
        </div>
      )}
    </div>
  );
}
