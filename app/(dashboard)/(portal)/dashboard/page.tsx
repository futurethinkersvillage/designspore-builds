import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { modules } from "@/lib/modules";
import { DEMO_USER, DEMO_ACTIVATIONS } from "@/lib/demo";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let userName: string | null | undefined;
  let businessName: string | undefined;
  let budget: number;
  let userActivations: { moduleId: string; status: string | null; valueConsumed: number }[];

  if (isDemo) {
    userName = DEMO_USER.name;
    businessName = DEMO_USER.businessName;
    budget = DEMO_USER.monthlyBudget;
    userActivations = DEMO_ACTIVATIONS;
  } else {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const user = session.user as {
      id?: string;
      name?: string | null;
      email?: string | null;
      monthlyBudget?: number;
      subscriptionTier?: string;
      businessName?: string;
    };

    userName = user.name;
    businessName = user.businessName;
    budget = user.monthlyBudget ?? 1500;

    const periodMonth = new Date().toISOString().slice(0, 7);
    userActivations = [];
    if (user.id) {
      userActivations = await db
        .select({
          moduleId: activations.moduleId,
          status: activations.status,
          valueConsumed: activations.valueConsumed,
        })
        .from(activations)
        .where(
          and(
            eq(activations.userId, user.id),
            eq(activations.periodMonth, periodMonth)
          )
        );
    }
  }

  const used = userActivations.reduce((s, r) => s + r.valueConsumed, 0);
  const remaining = budget - used;
  const activatedIds = new Set(userActivations.map((a) => a.moduleId));

  const recommended = modules
    .filter((m) => !activatedIds.has(m.id) && m.estimatedValue <= remaining)
    .slice(0, 3);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Welcome */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">
          Client Portal
        </p>
        <h1 className="text-3xl font-bold text-white mb-1">
          Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}.
        </h1>
        {businessName && (
          <p className="text-white/40 text-sm">{businessName}</p>
        )}
      </div>

      {/* Allocation summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Monthly budget" value={fmt(budget)} />
        <StatCard label="Used this month" value={fmt(used)} />
        <StatCard label="Available" value={fmt(remaining)} highlight={remaining > 0} />
      </div>

      {/* Active modules */}
      {userActivations.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Active this month
          </h2>
          <div className="space-y-2">
            {userActivations.map((a) => {
              const mod = modules.find((m) => m.id === a.moduleId);
              if (!mod) return null;
              return (
                <div
                  key={a.moduleId}
                  className="flex items-center justify-between bg-raised border border-white/[0.06] rounded-xl px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{mod.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {a.status
                        ? a.status.charAt(0).toUpperCase() + a.status.slice(1)
                        : "Pending"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gold tabular-nums">
                    {fmt(a.valueConsumed)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {recommended.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-1">
            Recommended for you
          </h2>
          <p className="text-sm text-white/40 mb-4">
            Modules that fit within your remaining {fmt(remaining)} allocation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((mod) => (
              <Link
                key={mod.id}
                href={`/modules/${mod.id}`}
                className="group block bg-card border border-white/[0.06] rounded-xl p-5 hover:border-gold/30 transition-colors"
              >
                <p className="text-[11px] uppercase tracking-widest text-gold/70 font-semibold mb-2">
                  {mod.category.replace(/-/g, " ")}
                </p>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold transition-colors">
                  {mod.name}
                </h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-3">
                  {mod.problemHeadline}
                </p>
                <span className="text-xs font-semibold text-gold/80 tabular-nums">
                  {fmt(mod.estimatedValue)} value
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {userActivations.length === 0 && recommended.length === 0 && (
        <div className="text-center py-16 border border-white/[0.06] rounded-2xl">
          <p className="text-white/40 mb-4">
            No modules activated yet this month.
          </p>
          <Link
            href="/modules"
            className="inline-block px-6 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors"
          >
            Browse Modules
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-raised border border-white/[0.06] rounded-xl px-5 py-4">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold tabular-nums ${
          highlight ? "text-gold" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
