"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getModuleById,
  tierConfig,
  categoryLabels,
  creditsForModule,
  type ModuleTier,
} from "@/lib/modules";
import TierBadge from "./TierBadge";
import ActivateButton from "./ActivateButton";
import { useDemoQueue } from "./DemoQueueProvider";
interface ModuleDrawerProps {
  isDemo: boolean;
  activatedIds: string[];
}

function DrawerCTA({
  moduleId,
  moduleName,
  tier,
  creditsNeeded,
  isActivated,
  isDemo,
}: {
  moduleId: string;
  moduleName: string;
  tier: ModuleTier;
  creditsNeeded: number;
  isActivated: boolean;
  isDemo: boolean;
}) {
  if (isDemo) {
    // Use DemoQueue context directly
    const { addToQueue, removeFromQueue, isQueued } = useDemoQueue();
    return (
      <ActivateButton
        moduleId={moduleId}
        moduleName={moduleName}
        tier={tier}
        creditsNeeded={creditsNeeded}
        isActivated={false}
        isDemo
        isQueued={isQueued(moduleId)}
        onDemoAdd={() => addToQueue(moduleId)}
        onDemoRemove={() => removeFromQueue(moduleId)}
      />
    );
  }

  return (
    <ActivateButton
      moduleId={moduleId}
      moduleName={moduleName}
      tier={tier}
      creditsNeeded={creditsNeeded}
      isActivated={isActivated}
      isDemo={false}
    />
  );
}

export default function ModuleDrawer({ isDemo, activatedIds }: ModuleDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("detail");
  const mod = detailId ? getModuleById(detailId) : null;

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("detail");
    const qs = params.toString();
    router.replace(`/modules${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router, searchParams]);

  // Close on Escape
  useEffect(() => {
    if (!mod) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mod, close]);


  if (!mod) return null;

  const creditsNeeded = creditsForModule(mod);
  const isActivated = activatedIds.includes(mod.id);

  return (
    <>
      {/* Backdrop */}
      {/* Drawer panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-darker border-l border-white/[0.06] shadow-2xl overflow-y-auto transition-transform duration-300"
        role="dialog"
        aria-label={mod.name}
      >
        {/* Close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-darker/80 backdrop-blur-md border-b border-white/[0.06]">
          <div className="flex items-center gap-2 min-w-0">
            <TierBadge tier={mod.tier} creditOnly recurring={mod.recurring} />
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium truncate">
              {categoryLabels[mod.category]}
            </span>
          </div>
          <button
            onClick={close}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{mod.name}</h2>
            <p className="text-base text-white/50 leading-relaxed">{mod.problemHeadline}</p>
            {mod.recurring && (
              <p className="text-xs text-white/30 mt-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 inline-block">
                ↻ Renews each month · cancel anytime
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="bg-raised border border-white/[0.07] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Cost</p>
              <p className="text-sm font-semibold text-white">
                {creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""}
                {mod.monthlyFee != null && (
                  <span className="text-white/40 font-normal"> + ${mod.monthlyFee}/mo platform fee</span>
                )}
              </p>
            </div>
            <DrawerCTA
              moduleId={mod.id}
              moduleName={mod.name}
              tier={mod.tier}
              creditsNeeded={creditsNeeded}
              isActivated={isActivated}
              isDemo={isDemo}
            />
          </div>

          {/* The Problem */}
          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">The Problem</h3>
            <p className="text-sm text-white/60 leading-relaxed">{mod.problemDescription}</p>
          </section>

          {/* Why it matters */}
          <section className="space-y-2 border-l-2 border-gold/30 pl-5">
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-semibold">Why It Matters</h3>
            <p className="text-sm text-white/50 leading-relaxed">{mod.whyItMatters}</p>
          </section>

          {/* What we build */}
          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">What We Build</h3>
            <p className="text-sm text-white/60 leading-relaxed">{mod.serviceMechanism}</p>
          </section>

          {/* Outcome */}
          <section className="bg-gold/[0.04] border border-gold/10 rounded-xl p-5 space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">The Outcome</h3>
            <p className="text-sm text-white/70 leading-relaxed">{mod.businessOutcome}</p>
          </section>

          {/* Deliverables */}
          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">What's Included</h3>
            <ul className="space-y-2">
              {mod.includedDeliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-3 bg-raised border border-white/[0.06] rounded-lg px-4 py-2.5">
                  <span className="text-gold mt-0.5 shrink-0 text-sm">✓</span>
                  <span className="text-sm text-white/60">{d}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </>
  );
}
