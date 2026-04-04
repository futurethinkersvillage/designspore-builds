export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users, activations, apiUsage } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { PLANS, type PlanKey } from "@/lib/subscription";
import { creditsForModule, getModuleById } from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import { DEMO_USER } from "@/lib/demo";
import PauseButton from "@/components/dashboard/PauseButton";
import BuyCreditsButton from "@/components/dashboard/BuyCreditsButton";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import AllocationMeter from "@/components/dashboard/AllocationMeter";

// All plans shown in the Available Plans section (including pause tier)
const ALL_PLANS: PlanKey[] = ["starter", "growth", "scale", "paused"];

const planColors: Record<string, string> = {
  starter: "border-gold/20 text-gold",
  growth:  "border-blue-500/20 text-blue-300",
  scale:   "border-purple-500/20 text-purple-300",
  paused:  "border-white/10 text-white/40",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo = !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let userData: {
    id: string; name: string | null; email: string | null; businessName: string | null;
    businessType: string | null; subscriptionTier: string | null; monthlyBudget: number;
    isActive: boolean; stripeCustomerId: string | null;
  };

  let creditsUsedThisMonth = 0;

  if (isDemo) {
    userData = { ...DEMO_USER, businessType: "home-services", stripeCustomerId: null, subscriptionTier: "growth" };
  } else {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const user = session.user as { id?: string };
    const [row] = await db.select({
      id: users.id, name: users.name, email: users.email,
      businessName: users.businessName, businessType: users.businessType,
      subscriptionTier: users.subscriptionTier, monthlyBudget: users.monthlyBudget,
      isActive: users.isActive, stripeCustomerId: users.stripeCustomerId,
    }).from(users).where(eq(users.id, user.id!));
    if (!row) redirect("/login");
    userData = { ...row, monthlyBudget: row.monthlyBudget ?? 1500, isActive: row.isActive ?? false };

    // Credits used this month
    const currentMonth = getMonthKey(0);
    const monthRows = await db
      .select({ moduleId: activations.moduleId, status: activations.status })
      .from(activations)
      .where(and(eq(activations.userId, user.id!), eq(activations.periodMonth, currentMonth)));
    creditsUsedThisMonth = monthRows
      .filter((r) => r.status !== "cancelled" && r.status !== "completed")
      .reduce((sum, r) => {
        const mod = getModuleById(r.moduleId);
        return sum + (mod ? creditsForModule(mod) : 0);
      }, 0);
  }

  const currentTierKey = (userData.subscriptionTier as PlanKey) ?? "starter";
  const plan = PLANS[currentTierKey];
  const periodMonth = new Date().toISOString().slice(0, 7);
  const monthlyCredits = Math.floor(userData.monthlyBudget / 375);

  const usageRows = isDemo ? [] : await db.select({
    service: apiUsage.service,
    requestCount: apiUsage.requestCount,
    estimatedCredits: apiUsage.estimatedCredits,
  }).from(apiUsage).where(
    and(eq(apiUsage.userId, userData.id), eq(apiUsage.periodMonth, periodMonth))
  );

  const totalUsageCredits = usageRows.reduce((s, r) => s + (r.estimatedCredits ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Settings</p>
        <h1 className="text-3xl font-bold text-white">My Account</h1>
      </div>

      {/* Profile */}
      <section className="bg-raised border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Name", value: userData.name },
            { label: "Email", value: userData.email },
            { label: "Business", value: userData.businessName },
            { label: "Industry", value: userData.businessType },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-white/30 mb-0.5">{label}</p>
              <p className="text-sm text-white">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current Plan */}
      <section className="bg-raised border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Current Plan</h2>
            <p className="text-xl font-bold text-white">{plan.label}</p>
            <p className="text-sm text-white/40 mt-1">{plan.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-white/30 mb-0.5">Credits this month</p>
            <p className="text-2xl font-bold text-gold tabular-nums">
              {monthlyCredits - creditsUsedThisMonth}
              <span className="text-white/30 font-normal text-base ml-1">/ {monthlyCredits} left</span>
            </p>
          </div>
        </div>

        {/* Credit bar */}
        <AllocationMeter creditsUsed={creditsUsedThisMonth} creditsTotal={monthlyCredits} />

        {/* Billing link */}
        {userData.stripeCustomerId && !isDemo && (
          <a
            href="/api/billing-portal"
            className="inline-block text-xs text-gold hover:text-gold-light transition-colors"
          >
            Manage billing & invoices →
          </a>
        )}
      </section>

      {/* Buy More Credits */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Top Up Credits</h2>
        <BuyCreditsButton isDemo={isDemo} />
      </section>

      {/* Available Plans */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Available Plans</h2>
        <div className="space-y-3">
          {ALL_PLANS.map((key) => {
            const p = PLANS[key];
            const isCurrent = key === currentTierKey;
            const isPaused = key === "paused";
            const colorClasses = planColors[key] ?? "border-white/10 text-white/50";
            const upgradeKeys: PlanKey[] = ["starter", "growth", "scale"];
            const currentIdx = upgradeKeys.indexOf(currentTierKey as PlanKey);
            const thisIdx = upgradeKeys.indexOf(key);

            return (
              <div
                key={key}
                className={`bg-raised border rounded-2xl p-5 flex items-start justify-between gap-4 transition-all ${
                  isCurrent ? "border-gold/30 ring-1 ring-gold/10" : "border-white/[0.06]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-white" : "text-white/70"}`}>
                      {p.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/30 rounded-full px-1.5 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">{p.description}</p>
                  {isPaused && "includes" in p && (
                    <ul className="mt-2 space-y-0.5">
                      {(p as typeof PLANS["paused"]).includes.map((item) => (
                        <li key={item} className="text-xs text-white/30 flex items-center gap-1.5">
                          <span className="text-white/20">·</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold tabular-nums ${isCurrent ? "text-gold" : "text-white/50"}`}>
                    ${p.monthlyBudget.toLocaleString()}
                    <span className="text-xs font-normal text-white/30">/mo</span>
                  </p>
                  {!isPaused && (
                    <p className="text-xs text-white/30 mt-0.5">
                      {(p as typeof PLANS["starter"]).monthlyCredits} credits/mo
                    </p>
                  )}
                  {!isCurrent && !isPaused && (
                    <a
                      href="mailto:hello@designspore.co?subject=Plan change request"
                      className="inline-block mt-1.5 px-3 py-1 bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {thisIdx > currentIdx ? "Upgrade" : "Downgrade"}
                    </a>
                  )}
                  {!isCurrent && isPaused && (
                    <PauseButton isPaused={false} isDemo={isDemo} />
                  )}
                  {isCurrent && isPaused && (
                    <PauseButton isPaused={true} isDemo={isDemo} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-white/25">
          Plan changes take effect at the start of your next billing cycle.{" "}
          <a href="mailto:hello@designspore.co" className="text-gold/50 hover:text-gold transition-colors">
            Contact us
          </a>{" "}
          to make changes.
        </p>
      </section>

      {/* API Usage */}
      <section className="bg-raised border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">API Usage — {periodMonth}</h2>
          {totalUsageCredits > 0 && (
            <span className="text-xs text-yellow-400 font-medium">{totalUsageCredits} credit{totalUsageCredits !== 1 ? "s" : ""} this month</span>
          )}
        </div>
        {usageRows.length === 0 ? (
          <p className="text-sm text-white/30">{isDemo ? "Usage tracked per service (chatbot, lead-gen, etc.)" : "No API usage recorded yet this month."}</p>
        ) : (
          <div className="space-y-2">
            {usageRows.map((row) => (
              <div key={row.service} className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                <p className="text-sm text-white capitalize">{row.service.replace(/-/g, " ")}</p>
                <div className="text-right">
                  <p className="text-xs text-white/40">{row.requestCount?.toLocaleString()} requests</p>
                  {(row.estimatedCredits ?? 0) > 0 && (
                    <p className="text-xs text-yellow-400">{row.estimatedCredits} credit{row.estimatedCredits !== 1 ? "s" : ""}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-white/20">
          Each active service includes a usage baseline. Overages are billed as Quick Win credits.
        </p>
      </section>

      {/* Danger Zone */}
      {!isDemo && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Danger Zone</h2>
          <DeleteAccountButton />
        </section>
      )}
    </div>
  );
}
