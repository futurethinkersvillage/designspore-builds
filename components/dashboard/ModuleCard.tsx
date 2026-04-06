"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { type Module, categoryLabels, creditsForModule } from "@/lib/modules";
import { activateModule } from "@/app/actions/modules";
import { useDemoQueue } from "./DemoQueueProvider";
import TierBadge from "./TierBadge";

interface ModuleCardProps {
  module: Module;
  isActivated?: boolean;
  isDemo?: boolean;
}

export default function ModuleCard({ module: mod, isActivated, isDemo }: ModuleCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSelected = searchParams.get("detail") === mod.id;
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function openDrawer(e: React.MouseEvent) {
    // Don't open drawer if clicking a button
    if ((e.target as HTMLElement).closest("button")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("detail", mod.id);
    router.push(`/modules?${params.toString()}`, { scroll: false });
  }

  function handleAddToQueue(e: React.MouseEvent) {
    e.stopPropagation();
    if (isActivated || added) return;

    if (isDemo) {
      // Will be handled by DemoCardButton wrapper
      return;
    }

    startTransition(async () => {
      const result = await activateModule(mod.id);
      if (result.success) {
        setAdded(true);
        router.refresh();
      }
    });
  }

  const queueButton = isActivated || added ? (
    <span className="shrink-0 px-3.5 py-1.5 bg-white/[0.05] text-white/40 text-xs font-semibold rounded-lg">
      In queue
    </span>
  ) : (
    <button
      onClick={handleAddToQueue}
      disabled={isPending}
      className="shrink-0 px-3.5 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? "Adding…" : "Add to queue →"}
    </button>
  );

  return (
    <div
      onClick={openDrawer}
      className={`group relative flex flex-col bg-card border rounded-2xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-gold/40 ring-1 ring-gold/20 bg-gold/[0.03]"
          : isActivated || added
          ? "border-gold/30 ring-1 ring-gold/10"
          : "border-white/[0.07] hover:border-white/[0.14]"
      }`}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <TierBadge tier={mod.tier} recurring={mod.recurring} />
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
              {categoryLabels[mod.category]}
            </span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold/90 transition-colors">
          {mod.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
          {mod.problemHeadline}
        </p>
      </div>

      <div className="px-5 pb-4 pt-3 border-t border-white/[0.05] mt-auto flex items-center justify-between gap-3">
        <span className="text-xs text-white/25">Click for details</span>
        {queueButton}
      </div>
    </div>
  );
}

/** Wrapper that hooks into DemoQueueProvider for demo mode cards */
export function DemoModuleCard({ module: mod, isActivated }: { module: Module; isActivated?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSelected = searchParams.get("detail") === mod.id;
  const { addToQueue, removeFromQueue, isQueued } = useDemoQueue();
  const queued = isQueued(mod.id);

  function openDrawer(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("detail", mod.id);
    router.push(`/modules?${params.toString()}`, { scroll: false });
  }

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (queued) {
      removeFromQueue(mod.id);
    } else {
      addToQueue(mod.id);
    }
  }

  return (
    <div
      onClick={openDrawer}
      className={`group relative flex flex-col bg-card border rounded-2xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-gold/40 ring-1 ring-gold/20 bg-gold/[0.03]"
          : queued || isActivated
          ? "border-gold/30 ring-1 ring-gold/10"
          : "border-white/[0.07] hover:border-white/[0.14]"
      }`}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <TierBadge tier={mod.tier} recurring={mod.recurring} />
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
              {categoryLabels[mod.category]}
            </span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold/90 transition-colors">
          {mod.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
          {mod.problemHeadline}
        </p>
      </div>

      <div className="px-5 pb-4 pt-3 border-t border-white/[0.05] mt-auto flex items-center justify-between gap-3">
        <span className="text-xs text-white/25">Click for details</span>
        {queued ? (
          <button
            onClick={handleToggle}
            className="shrink-0 px-3.5 py-1.5 bg-white/[0.05] hover:bg-red-500/10 text-white/40 hover:text-red-400 text-xs font-semibold rounded-lg transition-colors"
          >
            In queue ×
          </button>
        ) : (
          <button
            onClick={handleToggle}
            className="shrink-0 px-3.5 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold rounded-lg transition-colors"
          >
            Add to queue →
          </button>
        )}
      </div>
    </div>
  );
}
