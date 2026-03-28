/**
 * Queue logic — shared between server and client.
 *
 * A "queue entry" is a module that has been scheduled.
 * Entries are auto-assigned to the earliest month with enough credits.
 */

import { getModuleById, creditsForModule, type Module } from "./modules";

export interface QueueEntry {
  moduleId: string;
  addedAt: string; // ISO string
}

export interface ScheduledMonth {
  month: string;       // YYYY-MM
  label: string;       // "April 2026"
  entries: QueueEntry[];
  creditsUsed: number;
  creditsTotal: number;
  isCurrent: boolean;
  isFuture: boolean;
}

export function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getMonthKey(offset: number): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + offset, 1)
    .toISOString()
    .slice(0, 7);
}

/**
 * Given a flat list of queue entries, assign them to months greedily
 * based on credit capacity. Current month is slot 0, then +1, +2, +3...
 */
export function buildSchedule(
  entries: QueueEntry[],
  creditsPerMonth: number,
  maxMonths = 4
): ScheduledMonth[] {
  const currentMonth = getMonthKey(0);

  // Build empty month slots
  const months: ScheduledMonth[] = Array.from({ length: maxMonths }, (_, i) => {
    const month = getMonthKey(i);
    return {
      month,
      label: i === 0 ? `This month — ${formatMonthLabel(month)}` : formatMonthLabel(month),
      entries: [],
      creditsUsed: 0,
      creditsTotal: creditsPerMonth,
      isCurrent: i === 0,
      isFuture: i > 0,
    };
  });

  // Assign entries to months in order
  for (const entry of entries) {
    const mod = getModuleById(entry.moduleId);
    if (!mod) continue;
    const needed = creditsForModule(mod);
    // Find first month with enough room
    const slot = months.find((m) => m.creditsTotal - m.creditsUsed >= needed);
    if (slot) {
      slot.entries.push(entry);
      slot.creditsUsed += needed;
    }
    // If no slot fits (e.g. Flagship but month already has something), add overflow month
  }

  return months;
}
