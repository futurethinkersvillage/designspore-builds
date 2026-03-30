import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { eq, gte } from "drizzle-orm";
import { modules, creditsForModule, type ModuleTier } from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import { DEMO_ACTIVATIONS } from "@/lib/demo";
import TierBadge from "@/components/dashboard/TierBadge";
import CancelActivationButton from "@/components/dashboard/CancelActivationButton";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  active:    "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  completed: "bg-white/[0.06] text-white/40 border-white/[0.08]",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

type ActivationRow = {
  id: string;
  moduleId: string;
  status: string | null;
  valueConsumed: number;
  periodMonth: string;
  activatedAt: Date | null;
  progressUpdate?: string | null;
};

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default async function MyModulesPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo = !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let rows: ActivationRow[];

  if (isDemo) {
    const now = getMonthKey(0);
    rows = DEMO_ACTIVATIONS.map((a, i) => ({
      id: `demo-${i}`,
      ...a,
      periodMonth: now,
      activatedAt: new Date(),
    }));
  } else {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const user = session.user as { id?: string };
    if (!user.id) redirect("/login");

    rows = await db
      .select({
        id: activations.id,
        moduleId: activations.moduleId,
        status: activations.status,
        valueConsumed: activations.valueConsumed,
        periodMonth: activations.periodMonth,
        activatedAt: activations.activatedAt,
        progressUpdate: activations.progressUpdate,
      })
      .from(activations)
      .where(eq(activations.userId, user.id))
      .orderBy(activations.periodMonth, activations.activatedAt);
  }

  const currentMonth = getMonthKey(0);

  // Separate recurring active from the rest
  const recurringActive = rows.filter((r) => {
    const mod = modules.find((m) => m.id === r.moduleId);
    return mod?.recurring && (r.status === "active" || r.status === "pending") && r.periodMonth >= currentMonth;
  });

  const nonRecurring = rows.filter((r) => {
    const mod = modules.find((m) => m.id === r.moduleId);
    return !mod?.recurring;
  });

  // Group non-recurring by month descending
  const grouped = new Map<string, ActivationRow[]>();
  for (const row of nonRecurring) {
    if (!grouped.has(row.periodMonth)) grouped.set(row.periodMonth, []);
    grouped.get(row.periodMonth)!.push(row);
  }
  const sortedMonths = [...grouped.keys()].sort().reverse();

  function ActivationCard({ row, canCancel }: { row: ActivationRow; canCancel?: boolean }) {
    const mod = modules.find((m) => m.id === row.moduleId);
    const status = row.status ?? "pending";
    const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
    return (
      <div className="bg-raised border border-white/[0.06] rounded-xl px-5 py-4 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {mod && <TierBadge tier={mod.tier as ModuleTier} creditOnly recurring={mod.recurring} />}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{mod?.name ?? row.moduleId}</p>
              {row.activatedAt && (
                <p className="text-xs text-white/30 mt-0.5">
                  Queued {new Date(row.activatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {canCancel && !isDemo && status === "pending" && (
              <CancelActivationButton moduleId={row.moduleId} periodMonth={row.periodMonth} />
            )}
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle} capitalize`}>
              {status}
            </span>
          </div>
        </div>
        {row.progressUpdate && (
          <p className="text-xs text-emerald-300/70 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-lg px-3 py-2">
            📝 {row.progressUpdate}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Queue</p>
        <h1 className="text-3xl font-bold text-white mb-1">My Modules</h1>
        <p className="text-sm text-white/40">Your activated and queued services.</p>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 border border-white/[0.06] rounded-2xl">
          <p className="text-white/40 mb-4">No modules activated yet.</p>
          <Link href="/modules" className="inline-block px-6 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-10">

          {/* Recurring subscriptions */}
          {recurringActive.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Recurring</h2>
                <span className="text-xs text-white/30">Renews each month · cancel anytime</span>
              </div>
              <div className="space-y-2">
                {recurringActive.map((row) => (
                  <ActivationCard key={row.id} row={row} canCancel />
                ))}
              </div>
            </section>
          )}

          {/* One-time services by month */}
          {sortedMonths.length > 0 && (
            <section className="space-y-8">
              {sortedMonths.map((month) => {
                const monthRows = grouped.get(month)!;
                const creditTotal = monthRows.reduce((sum, r) => {
                  const mod = modules.find((m) => m.id === r.moduleId);
                  return sum + (mod ? creditsForModule(mod) : 0);
                }, 0);
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-base font-semibold text-white">{formatMonth(month)}</h2>
                      <span className="text-xs text-white/30">{creditTotal} credit{creditTotal !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-2">
                      {monthRows.map((row) => (
                        <ActivationCard key={row.id} row={row} canCancel />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-white/[0.06]">
        <p className="text-sm text-white/30">
          Want to add more?{" "}
          <Link href="/modules" className="text-gold hover:text-gold-light transition-colors">
            Browse all services →
          </Link>
        </p>
      </div>
    </div>
  );
}
