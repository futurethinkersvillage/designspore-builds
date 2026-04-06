"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { useDemoQueue } from "./DemoQueueProvider";
import { buildSchedule, type QueueEntry } from "@/lib/queue";
import { getModuleById, type ModuleTier } from "@/lib/modules";
import TierBadge from "./TierBadge";
import AllocationMeter from "./AllocationMeter";
import Link from "next/link";

interface QueueVisualProps {
  creditsPerMonth: number;
  serverEntries?: QueueEntry[];
  isDemo?: boolean;
}

function QueueItem({
  entry,
  onRemove,
  draggable,
}: {
  entry: QueueEntry;
  onRemove?: (moduleId: string) => void;
  draggable?: boolean;
}) {
  const mod = getModuleById(entry.moduleId);
  if (!mod) return null;

  const inner = (
    <div className="flex items-center justify-between gap-3 bg-card border border-white/[0.05] rounded-xl px-4 py-3 w-full">
      <div className="flex items-center gap-2.5 min-w-0">
        {draggable && (
          <span className="text-white/20 cursor-grab active:cursor-grabbing shrink-0 select-none text-sm">
            ⠿
          </span>
        )}
        <TierBadge tier={mod.tier as ModuleTier} recurring={mod.recurring} />
        <span className="text-sm text-white truncate">{mod.name}</span>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(entry.moduleId)}
          className="shrink-0 text-white/20 hover:text-red-400 transition-colors text-lg leading-none"
          aria-label="Remove from queue"
        >
          ×
        </button>
      )}
    </div>
  );

  return inner;
}

function QueueLayout({
  entries,
  creditsPerMonth,
  onRemove,
  onReorder,
}: {
  entries: QueueEntry[];
  creditsPerMonth: number;
  onRemove?: (moduleId: string) => void;
  onReorder?: (entries: QueueEntry[]) => void;
}) {
  const schedule = buildSchedule(entries, creditsPerMonth);
  const currentMonth = schedule[0];
  const futureEntries = schedule
    .slice(1)
    .flatMap((m) => m.entries);

  const creditsUsed = currentMonth?.creditsUsed ?? 0;
  const currentEntries = currentMonth?.entries ?? [];

  return (
    <div className="space-y-5">
      {/* Credit meter for this cycle */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">
            This cycle · {currentMonth?.label ?? ""}
          </p>
          <p className="text-xs text-white/30 tabular-nums">
            {creditsUsed} / {creditsPerMonth} credits
          </p>
        </div>
        <AllocationMeter creditsUsed={creditsUsed} creditsTotal={creditsPerMonth} />

        {/* Current month entries — draggable */}
        {currentEntries.length > 0 ? (
          onReorder ? (
            <Reorder.Group
              axis="y"
              values={entries}
              onReorder={onReorder}
              className="space-y-2 pt-1"
              as="ul"
            >
              {currentEntries.map((e) => (
                <Reorder.Item key={e.moduleId} value={e} as="li">
                  <QueueItem entry={e} onRemove={onRemove} draggable />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <ul className="space-y-2 pt-1">
              {currentEntries.map((e) => (
                <li key={e.moduleId}>
                  <QueueItem entry={e} onRemove={onRemove} />
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="border border-dashed border-white/[0.08] rounded-xl px-4 py-5 text-center">
            <p className="text-xs text-white/25 mb-1">Nothing queued yet</p>
            <Link
              href="/modules"
              className="text-xs text-gold/50 hover:text-gold transition-colors"
            >
              + Browse services
            </Link>
          </div>
        )}
      </div>

      {/* Next cycle overflow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">
            Next up in the following cycle
          </p>
          <Link
            href="/modules"
            className="text-xs text-gold/50 hover:text-gold transition-colors"
          >
            + Add service
          </Link>
        </div>

        {futureEntries.length > 0 ? (
          <ul className="space-y-2">
            {futureEntries.map((e) => (
              <li key={e.moduleId}>
                <QueueItem entry={e} onRemove={onRemove} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-white/[0.06] rounded-xl px-4 py-5 text-center">
            <p className="text-xs text-white/20">
              Services added beyond this month's credits will queue here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DemoQueueVisual({ creditsPerMonth }: { creditsPerMonth: number }) {
  const { entries, removeFromQueue, reorderQueue } = useDemoQueue();
  return (
    <QueueLayout
      entries={entries}
      creditsPerMonth={creditsPerMonth}
      onRemove={removeFromQueue}
      onReorder={reorderQueue}
    />
  );
}

function LiveQueueVisual({
  creditsPerMonth,
  serverEntries,
}: {
  creditsPerMonth: number;
  serverEntries: QueueEntry[];
}) {
  const [entries, setEntries] = useState<QueueEntry[]>(serverEntries);
  return (
    <QueueLayout
      entries={entries}
      creditsPerMonth={creditsPerMonth}
      onReorder={setEntries}
    />
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
