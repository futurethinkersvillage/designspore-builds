import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { DEMO_USER, DEMO_ACTIVATIONS } from "@/lib/demo";
import { modules, creditsForModule, getModuleById } from "@/lib/modules";
import AllocationMeter from "./AllocationMeter";

interface TopbarProps {
  isDemo?: boolean;
}

export default async function Topbar({ isDemo }: TopbarProps) {
  const periodMonth = new Date().toISOString().slice(0, 7);

  let userName: string | null | undefined;
  let subscriptionTier: string;
  let monthlyCredits: number;
  let creditsUsed: number;

  if (isDemo) {
    userName = DEMO_USER.name;
    subscriptionTier = DEMO_USER.subscriptionTier;
    monthlyCredits = Math.floor(DEMO_USER.monthlyBudget / 375);
    creditsUsed = DEMO_ACTIVATIONS.reduce((s, a) => {
      const mod = getModuleById(a.moduleId);
      return s + (mod ? creditsForModule(mod) : 0);
    }, 0);
  } else {
    const session = await auth();
    if (!session?.user) return null;

    const user = session.user as {
      name?: string | null;
      email?: string | null;
      id?: string;
      monthlyBudget?: number;
      subscriptionTier?: string;
    };

    userName = user.name ?? user.email;
    subscriptionTier = user.subscriptionTier ?? "starter";
    monthlyCredits = Math.floor((user.monthlyBudget ?? 1500) / 375);
    creditsUsed = 0;

    if (user.id) {
      const rows = await db
        .select({ moduleId: activations.moduleId })
        .from(activations)
        .where(and(eq(activations.userId, user.id), eq(activations.periodMonth, periodMonth)));
      creditsUsed = rows.reduce((s, r) => {
        const mod = getModuleById(r.moduleId);
        return s + (mod ? creditsForModule(mod) : 0);
      }, 0);
    }
  }

  return (
    <header className="flex items-center gap-6 px-6 py-3.5 border-b border-white/[0.06] bg-darker/60 backdrop-blur-sm">
      <div className="flex-1">
        <AllocationMeter creditsUsed={creditsUsed} creditsTotal={monthlyCredits} compact />
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium text-white">{userName}</p>
        <p className="text-[11px] text-white/40 capitalize">{subscriptionTier} plan</p>
      </div>
    </header>
  );
}
