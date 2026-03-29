"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type Module, categoryLabels } from "@/lib/modules";
import TierBadge from "./TierBadge";

interface ModuleCardProps {
  module: Module;
  isActivated?: boolean;
}

export default function ModuleCard({ module: mod, isActivated }: ModuleCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function openDrawer(e: React.MouseEvent) {
    // Don't open drawer if clicking the "Add to queue" button
    if ((e.target as HTMLElement).closest("a")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("detail", mod.id);
    router.push(`/modules?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      onClick={openDrawer}
      className={`group relative flex flex-col bg-card border rounded-2xl transition-all duration-200 cursor-pointer ${
        isActivated
          ? "border-gold/30 ring-1 ring-gold/10"
          : "border-white/[0.07] hover:border-white/[0.14]"
      }`}
    >
      {/* Main card content */}
      <div className="p-5 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <TierBadge tier={mod.tier} creditOnly recurring={mod.recurring} />
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
              {categoryLabels[mod.category]}
            </span>
          </div>
          {isActivated && (
            <span className="shrink-0 text-[10px] uppercase tracking-widest text-gold font-semibold">
              In queue
            </span>
          )}
        </div>

        {/* Name + problem */}
        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold/90 transition-colors">
          {mod.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
          {mod.problemHeadline}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-3 border-t border-white/[0.05] mt-auto flex items-center justify-between gap-3">
        <span className="text-xs text-white/25">Click for details</span>
        <a
          href={`/modules/${mod.id}`}
          onClick={(e) => e.stopPropagation()}
          className={isActivated
            ? "shrink-0 px-3.5 py-1.5 bg-white/[0.05] text-white/40 text-xs font-semibold rounded-lg transition-colors"
            : "shrink-0 px-3.5 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold rounded-lg transition-colors"
          }
        >
          {isActivated ? "View →" : "Add to queue →"}
        </a>
      </div>
    </div>
  );
}
