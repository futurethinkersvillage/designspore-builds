import type { RevenueMonth, Expense } from "./types";

// ─── P&L Summary ─────────────────────────────────────────────────────────────

export const plSummary = {
  revenue: 187420,
  expenses: 142380,
  netIncome: 45040,
  margin: 24.0,
};

// ─── Revenue Breakdown (12 months, stacked) ──────────────────────────────────

export const revenueBreakdown: RevenueMonth[] = [
  { month: "Jul 2025", accommodation: 48200, memberships: 28400, events: 12800, farm: 8600, consulting: 15200, workshops: 8200 },
  { month: "Aug 2025", accommodation: 52100, memberships: 28800, events: 14200, farm: 9400, consulting: 15800, workshops: 8600 },
  { month: "Sep 2025", accommodation: 50800, memberships: 29200, events: 15600, farm: 10200, consulting: 16400, workshops: 12000 },
  { month: "Oct 2025", accommodation: 49600, memberships: 30100, events: 16800, farm: 11800, consulting: 17200, workshops: 14300 },
  { month: "Nov 2025", accommodation: 44200, memberships: 30500, events: 18200, farm: 12400, consulting: 18800, workshops: 18000 },
  { month: "Dec 2025", accommodation: 46800, memberships: 31200, events: 20100, farm: 10600, consulting: 19200, workshops: 20600 },
  { month: "Jan 2026", accommodation: 48400, memberships: 31800, events: 19800, farm: 11200, consulting: 20400, workshops: 20700 },
  { month: "Feb 2026", accommodation: 52600, memberships: 32400, events: 21400, farm: 11800, consulting: 19800, workshops: 20700 },
  { month: "Mar 2026", accommodation: 55200, memberships: 33200, events: 22600, farm: 12400, consulting: 20200, workshops: 20600 },
  { month: "Apr 2026", accommodation: 58400, memberships: 33800, events: 23800, farm: 13200, consulting: 21400, workshops: 21200 },
  { month: "May 2026", accommodation: 62800, memberships: 34600, events: 24200, farm: 14800, consulting: 21800, workshops: 21400 },
  { month: "Jun 2026", accommodation: 66200, memberships: 35400, events: 25600, farm: 15400, consulting: 22200, workshops: 22620 },
];

// ─── Expense Breakdown ───────────────────────────────────────────────────────

export const expenseBreakdown: Expense[] = [
  { category: "Staff & Contractors", amount: 52800, percentage: 37.1 },
  { category: "Utilities & Energy", amount: 18400, percentage: 12.9 },
  { category: "Food & Supplies", amount: 21600, percentage: 15.2 },
  { category: "Maintenance & Repairs", amount: 17800, percentage: 12.5 },
  { category: "Insurance & Legal", amount: 14200, percentage: 10.0 },
  { category: "Marketing & Outreach", amount: 9800, percentage: 6.9 },
  { category: "Technology & Software", amount: 7780, percentage: 5.5 },
];

// ─── Occupancy ───────────────────────────────────────────────────────────────

export const occupancy = {
  overall: 89,
  cabins: 95,
  rv: 87,
  glamping: 92,
  bunkhouse: 78,
};

export const occupancyTrend = [
  { month: "Jul 2025", rate: 74 },
  { month: "Aug 2025", rate: 78 },
  { month: "Sep 2025", rate: 76 },
  { month: "Oct 2025", rate: 72 },
  { month: "Nov 2025", rate: 68 },
  { month: "Dec 2025", rate: 71 },
  { month: "Jan 2026", rate: 75 },
  { month: "Feb 2026", rate: 79 },
  { month: "Mar 2026", rate: 82 },
  { month: "Apr 2026", rate: 85 },
  { month: "May 2026", rate: 87 },
  { month: "Jun 2026", rate: 89 },
];

// ─── Budget vs Actual ────────────────────────────────────────────────────────

export const budgetVsActual = [
  { category: "Staff & Contractors", budget: 55000, actual: 52800 },
  { category: "Utilities & Energy", budget: 20000, actual: 18400 },
  { category: "Food & Supplies", budget: 22000, actual: 21600 },
  { category: "Maintenance & Repairs", budget: 15000, actual: 17800 },
  { category: "Insurance & Legal", budget: 14000, actual: 14200 },
  { category: "Marketing & Outreach", budget: 10000, actual: 9800 },
];
