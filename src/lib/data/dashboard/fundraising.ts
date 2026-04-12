import type { Campaign, Grant, Investor } from "./types";

// ─── Funding Overview ────────────────────────────────────────────────────────

export const fundingOverview = {
  totalRaised: 2400000,
  currentTarget: 750000,
  progress: 68,
  runway: 14,
};

// ─── Active Campaigns ────────────────────────────────────────────────────────

export const campaigns: Campaign[] = [
  { id: "c1", name: "Cabin Expansion Phase 2", type: "equity", goal: 500000, raised: 342000, daysLeft: 45, status: "active" },
  { id: "c2", name: "BC Green Infrastructure Grant", type: "grant", goal: 150000, raised: 150000, daysLeft: 0, status: "completed" },
  { id: "c3", name: "Community Crowdfund — Solar Array", type: "crowdfund", goal: 75000, raised: 51200, daysLeft: 22, status: "active" },
  { id: "c4", name: "Angel Round — Series Seed", type: "angel", goal: 200000, raised: 125000, daysLeft: 60, status: "active" },
];

// ─── Funding Sources (donut chart) ──────────────────────────────────────────

export const fundingSources = [
  { label: "Angel Investors", value: 35, amount: 840000 },
  { label: "Grants", value: 25, amount: 600000 },
  { label: "Crowdfunding", value: 20, amount: 480000 },
  { label: "Revenue Reinvestment", value: 15, amount: 360000 },
  { label: "Other", value: 5, amount: 120000 },
];

// ─── Monthly Inflow ──────────────────────────────────────────────────────────

export const monthlyInflow = [
  { month: "Jul 2025", amount: 42000 },
  { month: "Aug 2025", amount: 58000 },
  { month: "Sep 2025", amount: 35000 },
  { month: "Oct 2025", amount: 67000 },
  { month: "Nov 2025", amount: 48000 },
  { month: "Dec 2025", amount: 72000 },
  { month: "Jan 2026", amount: 55000 },
  { month: "Feb 2026", amount: 81000 },
  { month: "Mar 2026", amount: 63000 },
  { month: "Apr 2026", amount: 94000 },
  { month: "May 2026", amount: 76000 },
  { month: "Jun 2026", amount: 89000 },
];

// ─── Grants ──────────────────────────────────────────────────────────────────

export const grants: Grant[] = [
  { id: "g1", grantor: "BC Rural Dividend Fund", amount: 150000, status: "Disbursed", deadline: "2026-03-01", reporting: "Quarterly" },
  { id: "g2", grantor: "CMHC Housing Innovation", amount: 200000, status: "Approved", deadline: "2026-07-15", reporting: "Semi-annual" },
  { id: "g3", grantor: "BC Hydro Community Energy", amount: 75000, status: "In Review", deadline: "2026-08-30", reporting: "Annual" },
  { id: "g4", grantor: "Canada Summer Jobs", amount: 28000, status: "Disbursed", deadline: "2026-04-01", reporting: "Monthly" },
  { id: "g5", grantor: "TNRD Community Works Fund", amount: 45000, status: "Applied", deadline: "2026-09-15", reporting: "Quarterly" },
  { id: "g6", grantor: "BC Arts Council — Community Arts", amount: 18000, status: "In Review", deadline: "2026-06-30", reporting: "Annual" },
  { id: "g7", grantor: "Natural Sciences & Engineering (NSERC)", amount: 95000, status: "Applied", deadline: "2026-10-01", reporting: "Quarterly" },
  { id: "g8", grantor: "Indigenous & Northern Affairs — Land Stewardship", amount: 60000, status: "Approved", deadline: "2026-08-01", reporting: "Semi-annual" },
  { id: "g9", grantor: "Columbia Basin Trust", amount: 35000, status: "In Review", deadline: "2026-07-20", reporting: "Annual" },
  { id: "g10", grantor: "Federation of Canadian Municipalities — Green Fund", amount: 120000, status: "Applied", deadline: "2026-11-01", reporting: "Quarterly" },
];

// ─── Investors ───────────────────────────────────────────────────────────────

export const investors: Investor[] = [
  { id: "i1", name: "Rachel Thornton", amount: 200000, date: "2025-06-15", notes: "Lead angel, active advisor" },
  { id: "i2", name: "David Chen", amount: 150000, date: "2025-07-22", notes: "Strategic — regenerative ag network" },
  { id: "i3", name: "Greenfield Ventures", amount: 125000, date: "2025-09-10", notes: "Impact fund, board observer seat" },
  { id: "i4", name: "Mariana Oliveira", amount: 75000, date: "2025-10-05", notes: "Community builder, Portugal network" },
  { id: "i5", name: "James Whitfield", amount: 50000, date: "2025-11-18", notes: "Former cohousing developer" },
  { id: "i6", name: "Sun Valley Impact Fund", amount: 80000, date: "2025-12-02", notes: "Climate-focused LP" },
  { id: "i7", name: "Kenji Tanaka", amount: 40000, date: "2026-01-14", notes: "Satoyama Village co-founder" },
  { id: "i8", name: "Sarah Mitchell", amount: 25000, date: "2026-02-08", notes: "Elder member, personal investment" },
  { id: "i9", name: "The Collab Collective", amount: 60000, date: "2026-02-28", notes: "Co-living syndicate" },
  { id: "i10", name: "Erik Johansson", amount: 30000, date: "2026-03-15", notes: "Nordic Haven affiliate" },
  { id: "i11", name: "Priya Mehta", amount: 15000, date: "2026-04-01", notes: "Alumni work-stay, now investing" },
  { id: "i12", name: "Alex Drummond", amount: 10000, date: "2026-04-08", notes: "Local Clearwater supporter" },
];

// ─── Cap Table ───────────────────────────────────────────────────────────────

export const capTable = [
  { label: "Founders", percentage: 55 },
  { label: "Angel Investors", percentage: 20 },
  { label: "Strategic Partners", percentage: 15 },
  { label: "ESOP (Team Pool)", percentage: 10 },
];

// ─── Funding Milestones ──────────────────────────────────────────────────────

export const milestones = [
  { id: "m1", title: "Seed Round Close", target: 500000, current: 500000, date: "2025-09-30", status: "completed" as const },
  { id: "m2", title: "Cabin Phase 2 Funded", target: 500000, current: 342000, date: "2026-07-31", status: "in_progress" as const },
  { id: "m3", title: "Solar Array Fully Funded", target: 75000, current: 51200, date: "2026-06-30", status: "in_progress" as const },
  { id: "m4", title: "Series A Preparation", target: 2000000, current: 125000, date: "2027-03-31", status: "in_progress" as const },
  { id: "m5", title: "Grant Revenue $500K Cumulative", target: 500000, current: 378000, date: "2026-12-31", status: "in_progress" as const },
];
