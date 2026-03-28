import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activations, users } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import {
  getModuleById,
  modules,
  tierConfig,
  creditsForModule,
  categoryLabels,
  type ModuleTier,
} from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import { DEMO_USER } from "@/lib/demo";
import TierBadge from "@/components/dashboard/TierBadge";
import ActivateButton from "@/components/dashboard/ActivateButton";
import DemoActivateWrapper from "@/components/dashboard/DemoActivateWrapper";
import Link from "next/link";

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) notFound();

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  let creditsNeeded = creditsForModule(mod);
  let isActivated = false;

  if (!isDemo) {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const user = session.user as { id?: string };
    const currentMonth = getMonthKey(0);

    const [dbUser] = await db
      .select({ monthlyBudget: users.monthlyBudget })
      .from(users)
      .where(eq(users.id, user.id!));

    const rows = await db
      .select({ moduleId: activations.moduleId, status: activations.status })
      .from(activations)
      .where(
        and(
          eq(activations.userId, user.id!),
          gte(activations.periodMonth, currentMonth)
        )
      );

    isActivated = rows.some(
      (r) =>
        r.moduleId === moduleId &&
        r.status !== "cancelled" &&
        r.status !== "completed"
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Back */}
      <Link
        href="/modules"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All services
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <TierBadge tier={mod.tier as ModuleTier} showCredits />
          {mod.recurring && (
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium border border-white/[0.08] rounded-full px-2 py-0.5">
              ↻ Recurring monthly
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
            {categoryLabels[mod.category]}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white">{mod.name}</h1>
        <p className="text-xl text-white/50 leading-relaxed">{mod.problemHeadline}</p>
      </div>

      {/* CTA box */}
      <div className="bg-raised border border-white/[0.07] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">
              Cost
            </p>
            <p className="text-lg font-semibold text-white">
              {creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""}{" "}
              <span className="text-sm font-normal text-white/40">
                — {tierConfig[mod.tier as ModuleTier].description}
              </span>
            </p>
          </div>
          {mod.recurring && (
            <p className="text-xs text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
              Renews each month · cancel anytime
            </p>
          )}
        </div>

        {/* Demo wraps ActivateButton with queue context; live renders directly */}
        {isDemo ? (
          <DemoActivateWrapper
            moduleId={mod.id}
            moduleName={mod.name}
            tier={mod.tier as ModuleTier}
            creditsNeeded={creditsNeeded}
          />
        ) : (
          <ActivateButton
            moduleId={mod.id}
            moduleName={mod.name}
            tier={mod.tier as ModuleTier}
            creditsNeeded={creditsNeeded}
            isActivated={isActivated}
            isDemo={false}
          />
        )}
      </div>

      {/* Problem */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-gold font-semibold">The Problem</h2>
        <p className="text-white/70 text-lg leading-relaxed">{mod.problemDescription}</p>
      </section>

      {/* Why it matters */}
      <section className="space-y-3 border-l-2 border-gold/30 pl-6">
        <h2 className="text-xs uppercase tracking-widest text-white/40 font-semibold">Why It Matters</h2>
        <p className="text-white/60 leading-relaxed">{mod.whyItMatters}</p>
      </section>

      {/* What we build */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-gold font-semibold">What We Build</h2>
        <p className="text-white/70 leading-relaxed">{mod.serviceMechanism}</p>
      </section>

      {/* Outcome */}
      <section className="bg-gold/[0.04] border border-gold/10 rounded-2xl p-6 space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-gold font-semibold">The Outcome</h2>
        <p className="text-white/80 leading-relaxed">{mod.businessOutcome}</p>
      </section>

      {/* Deliverables */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-gold font-semibold">What's Included</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mod.includedDeliverables.map((d, i) => (
            <li key={i} className="flex items-start gap-3 bg-raised border border-white/[0.06] rounded-xl px-4 py-3">
              <span className="text-gold mt-0.5 shrink-0 text-sm">✓</span>
              <span className="text-sm text-white/70">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Dependencies */}
      {mod.dependencies.length > 0 && (
        <section className="space-y-3 bg-yellow-500/[0.04] border border-yellow-500/10 rounded-2xl p-6">
          <h2 className="text-xs uppercase tracking-widest text-yellow-400 font-semibold">Recommended First</h2>
          <p className="text-sm text-white/50">This service works best after:</p>
          <ul className="space-y-2">
            {mod.dependencies.map((depId) => {
              const dep = getModuleById(depId);
              return dep ? (
                <li key={depId}>
                  <Link
                    href={`/modules/${depId}`}
                    className="text-sm text-white/70 hover:text-gold transition-colors underline underline-offset-2"
                  >
                    {dep.name}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      {/* Requirements */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-gold font-semibold">What We Need From You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-3">To get started</p>
            <ul className="space-y-2">
              {mod.clientRequirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-white/20 shrink-0 mt-0.5">→</span>{r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-3">Access required</p>
            <ul className="space-y-2">
              {mod.accessRequirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-white/20 shrink-0 mt-0.5">→</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="space-y-4 bg-raised border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-xs uppercase tracking-widest text-gold font-semibold">The Process</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">Review</p>
            <p className="text-sm text-white/60">{mod.reviewProcess}</p>
          </div>
          <div>
            <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">Revisions</p>
            <p className="text-sm text-white/60">{mod.revisionExpectations}</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="pt-4">
        {isDemo ? (
          <DemoActivateWrapper
            moduleId={mod.id}
            moduleName={mod.name}
            tier={mod.tier as ModuleTier}
            creditsNeeded={creditsNeeded}
          />
        ) : (
          <ActivateButton
            moduleId={mod.id}
            moduleName={mod.name}
            tier={mod.tier as ModuleTier}
            creditsNeeded={creditsNeeded}
            isActivated={isActivated}
            isDemo={false}
          />
        )}
      </div>
    </div>
  );
}
