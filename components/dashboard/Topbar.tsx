import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import AllocationMeter from "./AllocationMeter";

export default async function Topbar() {
  const session = await auth();
  if (!session?.user) return null;

  const user = session.user as {
    name?: string | null;
    email?: string | null;
    id?: string;
    monthlyBudget?: number;
    subscriptionTier?: string;
  };

  const budget = user.monthlyBudget ?? 1500;
  const periodMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  let used = 0;
  if (user.id) {
    const activeRows = await db
      .select({ valueConsumed: activations.valueConsumed })
      .from(activations)
      .where(
        and(
          eq(activations.userId, user.id),
          eq(activations.periodMonth, periodMonth)
        )
      );
    used = activeRows.reduce((sum, r) => sum + (r.valueConsumed ?? 0), 0);
  }

  return (
    <header className="flex items-center gap-6 px-6 py-4 border-b border-white/[0.06] bg-darker/60 backdrop-blur-sm">
      <div className="flex-1">
        <AllocationMeter used={used} total={budget} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium text-white">
          {user.name ?? user.email}
        </p>
        <p className="text-[11px] text-white/40 capitalize">
          {user.subscriptionTier ?? "starter"} plan
        </p>
      </div>
    </header>
  );
}
