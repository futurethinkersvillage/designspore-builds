import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users, activations, apiUsage } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { PLANS, type PlanKey } from "@/lib/subscription";
import { DEMO_USER } from "@/lib/demo";
import { MONTHLY_CREDITS } from "@/lib/modules";
import PauseButton from "@/components/dashboard/PauseButton";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo = !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let userData: {
    id: string; name: string | null; email: string | null; businessName: string | null;
    businessType: string | null; subscriptionTier: string | null; monthlyBudget: number;
    isActive: boolean; stripeCustomerId: string | null;
  };

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
  }

  const plan = PLANS[(userData.subscriptionTier as PlanKey) ?? "starter"];
  const periodMonth = new Date().toISOString().slice(0, 7);

  // API usage this month
  const usageRows = isDemo ? [] : await db.select({
    service: apiUsage.service,
    requestCount: apiUsage.requestCount,
    estimatedCredits: apiUsage.estimatedCredits,
  }).from(apiUsage).where(
    and(eq(apiUsage.userId, userData.id), eq(apiUsage.periodMonth, periodMonth))
  );

  const totalUsageCredits = usageRows.reduce((s, r) => s + (r.estimatedCredits ?? 0), 0);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Settings</p>
        <h1 className="text-3xl font-bold text-white">My Account</h1>
      </div>

      {/* Profile */}
      <section className="bg-raised border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest text-xs">Profile</h2>
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

      {/* Plan */}
      <section className="bg-raised border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Current Plan</h2>
            <p className="text-xl font-bold text-white">{plan.label}</p>
            <p className="text-sm text-white/40 mt-1">{plan.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-white/30 mb-0.5">Monthly credits</p>
            <p className="text-2xl font-bold text-gold">{plan.monthlyCredits}</p>
          </div>
        </div>

        {/* Credit bar */}
        <div>
          <div className="flex gap-1.5">
            {Array.from({ length: plan.monthlyCredits }).map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full bg-white/[0.08]" />
            ))}
          </div>
          <p className="text-xs text-white/25 mt-2">Resets each billing month</p>
        </div>

        {/* Billing link */}
        {userData.stripeCustomerId && !isDemo && (
          <a
            href={`https://billing.stripe.com/p/login/test_xxx?prefilled_email=${userData.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-gold hover:text-gold-light transition-colors"
          >
            Manage billing & invoices →
          </a>
        )}

        {/* Pause */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white mb-1">Keep the Lights On</p>
              <p className="text-xs text-white/40 max-w-xs">
                Pauses new builds for $299/mo. Keeps your site live, secure, and maintained.
                Unpause anytime — full credits resume next cycle.
              </p>
            </div>
            <PauseButton
              isPaused={userData.subscriptionTier === "paused"}
              isDemo={isDemo}
            />
          </div>
        </div>
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
    </div>
  );
}
