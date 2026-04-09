"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { type Module, type ModuleCategory, categoryLabels } from "@/lib/modules";

const categoryOrder: ModuleCategory[] = [
  "lead-generation",
  "sales-followup",
  "client-communication",
  "reputation",
  "automation",
  "operations",
  "website",
  "market-intelligence",
];

const categoryIcons: Record<ModuleCategory, string> = {
  "lead-generation":     "⚡",
  "sales-followup":      "📬",
  "client-communication":"💬",
  "reputation":          "⭐",
  "automation":          "🤖",
  "operations":          "📊",
  "website":             "🌐",
  "market-intelligence": "🔍",
};


export default function ServiceCatalogSection({ modules }: { modules: Module[] }) {
  const [active, setActive] = useState<ModuleCategory | "all">("all");

  const visibleModules = active === "all" ? modules : modules.filter(m => m.category === active);
  const grouped = categoryOrder
    .map(cat => ({ cat, items: visibleModules.filter(m => m.category === cat) }))
    .filter(g => g.items.length > 0);

  return (
    <section className="section-pad bg-raised">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
            The full catalog
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
          >
            {modules.length} services. Pick what you need.
          </h2>
          <p className="mt-4 text-white/40 text-lg">
            Every service is done-for-you. Activate what fits your month — swap anytime.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              active === "all"
                ? "bg-gold text-dark border-gold"
                : "border-white/[0.10] text-white/50 hover:border-white/30 hover:text-white/80"
            }`}
          >
            All
          </button>
          {categoryOrder.map(cat => {
            const count = modules.filter(m => m.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  active === cat
                    ? "bg-gold text-dark border-gold"
                    : "border-white/[0.10] text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                {categoryIcons[cat]} {categoryLabels[cat]}
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Catalog rows grouped by category */}
        <div className="space-y-10">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              {/* Category header — only shown when viewing all */}
              {active === "all" && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{categoryIcons[cat]}</span>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-white/40">
                    {categoryLabels[cat]}
                  </h3>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
              )}
              <div className="space-y-2">
                {items.map(mod => (
                  <div
                    key={mod.id}
                    className="flex items-start gap-4 px-5 py-4 rounded-xl border border-white/[0.06] bg-dark hover:border-white/[0.12] hover:bg-raised transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span
                          className="font-semibold text-white group-hover:text-gold transition-colors"
                          style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                        >
                          {mod.name}
                        </span>
                        {mod.recurring && (
                          <span className="text-[11px] text-white/30 border border-white/[0.08] rounded-full px-2 py-0.5">
                            recurring
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/40 mt-0.5 leading-snug">
                        {mod.problemHeadline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"
          >
            Activate services in the client portal <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
