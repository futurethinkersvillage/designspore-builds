export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { activations, changeRequests } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { getModuleById } from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import ChangeRequestForm from "@/components/dashboard/ChangeRequestForm";

const STATUS_STYLES: Record<string, string> = {
  new:          "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  "in-review":  "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "in-progress":"bg-purple-500/10 text-purple-300 border-purple-500/20",
  resolved:     "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  closed:       "bg-white/[0.06] text-white/30 border-white/[0.08]",
};

const TYPE_LABELS: Record<string, string> = {
  "content-change": "Content Change",
  "design-tweak":   "Design Tweak",
  "bug-issue":      "Bug / Issue",
  "new-feature":    "New Feature",
};

const PRIORITY_STYLES: Record<string, string> = {
  low:    "text-white/40",
  medium: "text-yellow-300",
  high:   "text-red-300",
};

export default async function RequestsPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo = !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  if (isDemo) {
    return (
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Support</p>
          <h1 className="text-3xl font-bold text-white mb-1">Change Requests</h1>
          <p className="text-sm text-white/40">Submit requests to update or improve any of your active services.</p>
        </div>
        <div className="rounded-xl border border-gold/20 bg-gold/[0.04] px-5 py-3 text-sm text-gold/70">
          Demo mode — form is live but submissions are disabled. Active clients can submit requests directly from this page.
        </div>
        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-6">New Request</h2>
          <ChangeRequestForm activeModules={[]} isDemo />
        </section>
      </div>
    );
  }

  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { id?: string };
  if (!user.id) redirect("/login");

  // Active modules for the dropdown
  const currentMonth = getMonthKey(0);
  const activeRows = await db
    .select({ moduleId: activations.moduleId })
    .from(activations)
    .where(and(
      eq(activations.userId, user.id),
      eq(activations.status, "active"),
      gte(activations.periodMonth, currentMonth)
    ));

  const activeModules = activeRows
    .map((r) => getModuleById(r.moduleId))
    .filter(Boolean)
    .map((m) => ({ id: m!.id, name: m!.name }));

  // Past requests
  const pastRequests = await db
    .select()
    .from(changeRequests)
    .where(eq(changeRequests.userId, user.id))
    .orderBy(desc(changeRequests.createdAt))
    .limit(20);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Support</p>
        <h1 className="text-3xl font-bold text-white mb-1">Change Requests</h1>
        <p className="text-sm text-white/40">
          Submit a request to update, fix, or improve any part of your site or services.
        </p>
      </div>

      {/* New request form */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-6">New Request</h2>
        <ChangeRequestForm activeModules={activeModules} />
      </section>

      {/* Request history */}
      {pastRequests.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">Your Requests</h2>
          <div className="space-y-3">
            {pastRequests.map((req) => (
              <div key={req.id} className="bg-raised border border-white/[0.06] rounded-xl p-5 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold ${PRIORITY_STYLES[req.priority ?? "medium"]}`}>
                        {(req.priority ?? "medium").toUpperCase()}
                      </span>
                      <span className="text-xs text-white/30">{TYPE_LABELS[req.type] ?? req.type}</span>
                    </div>
                    <p className="text-sm font-medium text-white">{req.title}</p>
                    {req.pageUrl && (
                      <p className="text-xs text-white/30 mt-0.5 truncate">{req.pageUrl}</p>
                    )}
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${STATUS_STYLES[req.status ?? "new"]}`}>
                    {(req.status ?? "new").replace("-", " ")}
                  </span>
                </div>
                {req.clientUpdate && (
                  <div className="text-xs text-emerald-300/70 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-lg px-3 py-2">
                    {req.clientUpdate}
                  </div>
                )}
                <p className="text-xs text-white/25">
                  {new Date(req.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
