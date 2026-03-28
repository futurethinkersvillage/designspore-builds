"use client";

import { useDemoQueue } from "./DemoQueueProvider";
import { buildSchedule, type QueueEntry, type ScheduledMonth } from "@/lib/queue";
import { getModuleById, tierConfig, type ModuleTier } from "@/lib/modules";
import TierBadge from "./TierBadge";
import Link from "next/link";

interface QueueVisualProps {
  creditsPerMonth: number;
  // For live users: server-fetched entries
  serverEntries?: QueueEntry[];
  isDemo?: boolean;
}

function CreditSlots({ used, total }: { used: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-5 rounded-full transition-all ${
            i < used ? "bg-gold" : "bg-white/[0.08]"
          }`}
        />
      ))}
    </div>
  );
}

function MonthCard({
  month,
  onRemove,
  canRemove,
}: {
  month: ScheduledMonth;
  onRemove?: (moduleId: string) => void;
  canRemove?: boolean;
}) {
  const empty = month.entries.length === 0;
  const remaining = month.creditsTotal - month.creditsUsed;

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 transition-all ${
        month.isCurrent
          ? "border-gold/20 bg-gold/[0.03]"
          : "border-white/[0.06] bg-raised"
      }`}
    >
      {/* Month header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${
              month.isCurrent ? "text-gold" : "text-white/40"
            }`}
          >
            {month.isCurrent ? "This month" : month.label.split(" — ")[0] ?? month.label}
          </p>
          {month.isCurrent && (
            <p className="text-[11px] text-white/30 mt-0.5">
              {month.label.replace("This month — ", "")}
            </p>
          )}
        </div>
        <CreditSlots used={month.creditsUsed} total={month.creditsTotal} />
      </div>

      {/* Entries */}
      {empty ? (
        <div className="border border-dashed border-white/[0.08] rounded-xl px-4 py-6 text-center">
          <p className="text-xs text-white/25">
            {remaining} credit{remaining !== 1 ? "s" : ""} available
          </p>
          <Link
            href="/modules"
            className="text-xs text-gold/50 hover:text-gold transition-colors mt-1 inline-block"
          >
            + Add a service
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {month.entries.map((entry) => {
            const mod = getModuleById(entry.moduleId);
            if (!mod) return null;
            return (
              <li
                key={entry.moduleId}
                className="flex items-center justify-between gap-3 bg-card border border-white/[0.05] rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <TierBadge tier={mod.tier as ModuleTier} />
                  <span className="text-sm text-white truncate">{mod.name}</span>
                  {mod.recurring && (
                    <span className="text-[10px] text-white/25 shrink-0">↻ monthly</span>
                  )}
                </div>
                {canRemove && onRemove && (
                  <button
                    onClick={() => onRemove(entry.moduleId)}
                    className="shrink-0 text-white/20 hover:text-red-400 transition-colors text-lg leading-none"
                    aria-label="Remove from queue"
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Remaining slots hint */}
      {!empty && remaining > 0 && (
        <p className="text-[11px] text-white/25">
          {remaining} credit{remaining !== 1 ? "s" : ""} still available this month
        </p>
      )}
    </div>
  );
}

// Demo version — reads from localStorage context
function DemoQueueVisual({ creditsPerMonth }: { creditsPerMonth: number }) {
  const { entries, removeFromQueue } = useDemoQueue();
  const schedule = buildSchedule(entries, creditsPerMonth);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {schedule.map((month) => (
        <MonthCard
          key={month.month}
          month={month}
          onRemove={removeFromQueue}
          canRemove
        />
      ))}
    </div>
  );
}

// Live version — uses server-fetched entries (read-only visual)
function LiveQueueVisual({
  creditsPerMonth,
  serverEntries,
}: {
  creditsPerMonth: number;
  serverEntries: QueueEntry[];
}) {
  const schedule = buildSchedule(serverEntries, creditsPerMonth);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {schedule.map((month) => (
        <MonthCard key={month.month} month={month} />
      ))}
    </div>
  );
}

export default function QueueVisual({ creditsPerMonth, serverEntries, isDemo }: QueueVisualProps) {
  if (isDemo) return <DemoQueueVisual creditsPerMonth={creditsPerMonth} />;
  return (
    <LiveQueueVisual
      creditsPerMonth={creditsPerMonth}
      serverEntries={serverEntries ?? []}
    />
  );
}
