import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { activations, users } from "@/lib/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { getModuleById, creditsForModule } from "@/lib/modules";
import { DEMO_USER, DEMO_ACTIVATIONS } from "@/lib/demo";
import { getMonthKey, type QueueEntry } from "@/lib/queue";
import AllocationMeter from "@/components/dashboard/AllocationMeter";
import QueueVisual from "@/components/dashboard/QueueVisual";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import AutopilotToggle from "@/components/dashboard/AutopilotToggle";
import TierBadge from "@/components/dashboard/TierBadge";
import Link from "next/link";
import type { ModuleTier } from "@/lib/modules";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let userName: string | null | undefined;
  let businessName: string | undefined;
  let monthlyCredits: number;
  let showOnboarding = false;
  let autopilotEnabled = false;
  let currentMonthEntries: QueueEntry[] = [];
  let allQueueEntries: QueueEntry[] = [];
  let creditsUsedThisMonth = 0;

  type CompletedItem = { moduleId: string; periodMonth: string; completedAt: Date | null };
  let completedItems: CompletedItem[] = [];

  if (isDemo) {
    userName = DEMO_USER.name;
    businessName = DEMO_USER.businessName;
    monthlyCredits = Math.floor(DEMO_USER.monthlyBudget / 375);
    // Show a few demo completions
    completedItems = DEMO_ACTIVATIONS.slice(0, 3).map((a) => ({
      moduleId: a.moduleId,
      periodMonth: getMonthKey(-1),
      completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    }));
  } else {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const user = session.user as { id?: string; name?: string | null; businessName?: string };
    userName = user.name;
    businessName = user.businessName;

    const [dbUser] = await db
      .select({ monthlyBudget: users.monthlyBudget, hasCompletedOnboarding: users.hasCompletedOnboarding, autopilot: users.autopilot })
      .from(users)
      .where(eq(users.id, user.id!));

    monthlyCredits = Math.floor((dbUser?.monthlyBudget ?? 1500) / 375);
    showOnboarding = !(dbUser?.hasCompletedOnboarding ?? false);
    autopilotEnabled = dbUser?.autopilot ?? false;

    const currentMonth = getMonthKey(0);

    // All pending/active activations in future window
    const rows = await db
      .select({ moduleId: activations.moduleId, periodMonth: activations.periodMonth, status: activations.status, activatedAt: activations.activatedAt })
      .from(activations)
      .where(and(eq(activations.userId, user.id!), gte(activations.periodMonth, currentMonth)));

    allQueueEntries = rows
      .filter((r) => r.status !== "cancelled" && r.status !== "completed")
      .map((r) => ({ moduleId: r.moduleId, addedAt: r.activatedAt?.toISOString() ?? "" }));

    currentMonthEntries = rows
      .filter((r) => r.periodMonth === currentMonth && r.status !== "cancelled" && r.status !== "completed")
      .map((r) => ({ moduleId: r.moduleId, addedAt: r.activatedAt?.toISOString() ?? "" }));

    creditsUsedThisMonth = currentMonthEntries.reduce((sum, e) => {
      const m = getModuleById(e.moduleId);
      return sum + (m ? creditsForModule(m) : 0);
    }, 0);

    // Completed activations (most recent first, limit 10)
    const completedRows = await db
      .select({ moduleId: activations.moduleId, periodMonth: activations.periodMonth, activatedAt: activations.activatedAt })
      .from(activations)
      .where(and(eq(activations.userId, user.id!), eq(activations.status, "completed")))
      .orderBy(activations.periodMonth);

    completedItems = completedRows
      .reverse()
      .slice(0, 10)
      .map((r) => ({ moduleId: r.moduleId, periodMonth: r.periodMonth, completedAt: r.activatedAt }));
  }

  function formatMonth(ym: string) {
    const [y, m] = ym.split("-");
    return new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  return (
    <>
      {showOnboarding && <OnboardingModal userName={userName} />}

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">
            Client Portal
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}.
          </h1>
          {businessName && <p className="text-white/40 text-sm">{businessName}</p>}
        </div>

        {/* Autopilot — at the top so clients see it first */}
        <AutopilotToggle enabled={autopilotEnabled} isDemo={isDemo} />

        {/* Credit meter — this month only */}
        {!isDemo && (
          <section className="bg-raised border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-1">
                  This month
                </p>
                <p className="text-2xl font-bold text-white tabular-nums">
                  {monthlyCredits - creditsUsedThisMonth}{" "}
                  <span className="text-white/30 font-normal text-lg">
                    / {monthlyCredits} credits left
                  </span>
                </p>
              </div>
              <Link
                href="/modules"
                className="px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
              >
                Browse services
              </Link>
            </div>
            <AllocationMeter
              creditsUsed={creditsUsedThisMonth}
              creditsTotal={monthlyCredits}
            />
          </section>
        )}

        {/* Queue */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Your Queue</h2>
              <p className="text-sm text-white/40">
                {isDemo
                  ? "Add services from the browse page — see how they'd schedule."
                  : "Services auto-schedule into the earliest available month."}
              </p>
            </div>
            <Link
              href="/modules"
              className="text-xs text-gold hover:text-gold-light transition-colors"
            >
              + Add service
            </Link>
          </div>

          <QueueVisual
            creditsPerMonth={monthlyCredits}
            serverEntries={isDemo ? undefined : allQueueEntries}
            isDemo={isDemo}
          />
        </section>

        {/* Completed Modules */}
        {completedItems.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Completed</h2>
              <p className="text-sm text-white/40">Services we've delivered for your business.</p>
            </div>
            <div className="space-y-2">
              {completedItems.map((item, idx) => {
                const mod = getModuleById(item.moduleId);
                if (!mod) return null;
                return (
                  <div
                    key={`${item.moduleId}-${item.periodMonth}-${idx}`}
                    className="flex items-center justify-between gap-3 bg-raised border border-white/[0.04] rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TierBadge tier={mod.tier as ModuleTier} creditOnly recurring={mod.recurring} />
                      <span className="text-sm text-white/70 truncate">{mod.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-white/30">{formatMonth(item.periodMonth)}</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                        Done
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
