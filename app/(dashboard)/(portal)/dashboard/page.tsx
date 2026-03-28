import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { activations, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import {
  modules,
  tierConfig,
  creditsForModule,
  MONTHLY_CREDITS,
  type ModuleTier,
} from "@/lib/modules";
import { DEMO_USER, DEMO_ACTIVATIONS } from "@/lib/demo";
import TierBadge from "@/components/dashboard/TierBadge";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let userName: string | null | undefined;
  let businessName: string | undefined;
  let monthlyCredits: number;
  let showOnboarding = false;
  let userActivations: { moduleId: string; status: string | null; valueConsumed: number }[];

  if (isDemo) {
    userName = DEMO_USER.name;
    businessName = DEMO_USER.businessName;
    monthlyCredits = Math.floor(DEMO_USER.monthlyBudget / 375);
    userActivations = DEMO_ACTIVATIONS;
  } else {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const user = session.user as {
      id?: string; name?: string | null; monthlyBudget?: number; businessName?: string;
    };
    userName = user.name;
    businessName = user.businessName;
    monthlyCredits = Math.floor((user.monthlyBudget ?? 1500) / 375);

    if (user.id) {
      const [dbUser] = await db.select({ hasCompletedOnboarding: users.hasCompletedOnboarding })
        .from(users).where(eq(users.id, user.id));
      showOnboarding = !(dbUser?.hasCompletedOnboarding ?? false);
    }

    const periodMonth = new Date().toISOString().slice(0, 7);
    userActivations = [];
    if (user.id) {
      userActivations = await db
        .select({ moduleId: activations.moduleId, status: activations.status, valueConsumed: activations.valueConsumed })
        .from(activations)
        .where(and(eq(activations.userId, user.id), eq(activations.periodMonth, periodMonth)));
    }
  }

  const activatedIds = new Set(userActivations.map((a) => a.moduleId));
  const creditsUsed = userActivations.reduce((sum, a) => {
    const mod = modules.find((m) => m.id === a.moduleId);
    return sum + (mod ? creditsForModule(mod) : 0);
  }, 0);
  const creditsRemaining = monthlyCredits - creditsUsed;

  const recommended = modules
    .filter((m) => !activatedIds.has(m.id) && creditsForModule(m) <= creditsRemaining)
    .slice(0, 3);

  return (
    <>
    {showOnboarding && <OnboardingModal userName={userName} />}
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Welcome */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Client Portal</p>
        <h1 className="text-3xl font-bold text-white mb-1">
          Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}.
        </h1>
        {businessName && <p className="text-white/40 text-sm">{businessName}</p>}
      </div>

      {/* Credit meter */}
      <section className="bg-raised border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-1">This month</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {creditsRemaining} <span className="text-white/30 font-normal text-lg">/ {monthlyCredits} credits left</span>
            </p>
          </div>
          <Link
            href="/modules"
            className="px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
          >
            Browse services
          </Link>
        </div>

        {/* Credit dots */}
        <div className="flex gap-2 mt-2">
          {Array.from({ length: monthlyCredits }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i < creditsUsed ? "bg-gold" : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>

        {/* Tier equivalency hint */}
        <p className="text-xs text-white/25 mt-3">
          {creditsRemaining >= 4
            ? "You can activate 1 Flagship, 2 Core, or up to 4 Quick Win services this month."
            : creditsRemaining >= 2
            ? "You can activate 1 Core or up to 2 Quick Win services this month."
            : creditsRemaining === 1
            ? "You have 1 credit — enough for a Quick Win service."
            : "Your month is full. Credits reset next month."}
        </p>
      </section>

      {/* Active this month */}
      {userActivations.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Active this month</h2>
          <div className="space-y-2">
            {userActivations.map((a) => {
              const mod = modules.find((m) => m.id === a.moduleId);
              if (!mod) return null;
              return (
                <div
                  key={a.moduleId}
                  className="flex items-center justify-between bg-raised border border-white/[0.06] rounded-xl px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <TierBadge tier={mod.tier as ModuleTier} />
                    <p className="text-sm font-medium text-white">{mod.name}</p>
                  </div>
                  <span className="text-xs text-white/40 capitalize">
                    {a.status ?? "pending"}
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
          <h2 className="text-lg font-semibold text-white mb-1">Recommended for you</h2>
          <p className="text-sm text-white/40 mb-4">Fits within your remaining credits this month.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((mod) => (
              <Link
                key={mod.id}
                href={`/modules/${mod.id}`}
                className="group block bg-card border border-white/[0.06] rounded-xl p-5 hover:border-gold/30 transition-colors"
              >
                <div className="mb-2">
                  <TierBadge tier={mod.tier as ModuleTier} />
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold transition-colors">
                  {mod.name}
                </h3>
                <p className="text-sm text-white/50 line-clamp-2">{mod.problemHeadline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {userActivations.length === 0 && recommended.length === 0 && (
        <div className="text-center py-16 border border-white/[0.06] rounded-2xl">
          <p className="text-white/40 mb-4">No modules activated yet this month.</p>
          <Link
            href="/modules"
            className="inline-block px-6 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors"
          >
            Browse Modules
          </Link>
        </div>
      )}
    </div>
    </>
  );
}
