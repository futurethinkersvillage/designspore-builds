import type { StatItem, ActivityItem, Event } from "./types";

// ─── Overview Stats ──────────────────────────────────────────────────────────

export const overviewStats: StatItem[] = [
  { label: "Members", value: 247, trend: "+12 this month", trendUp: true, icon: "UsersThree" },
  { label: "Monthly Revenue", value: "$187,420", trend: "+8.3% vs last month", trendUp: true, icon: "CurrencyDollar" },
  { label: "Active Projects", value: 23, trend: "+3 new this quarter", trendUp: true, icon: "Briefcase" },
  { label: "Occupancy", value: "89%", trend: "+4% vs last month", trendUp: true, icon: "Bed" },
  { label: "Energy Self-Sufficiency", value: "72%", trend: "+6% vs last quarter", trendUp: true, icon: "Lightning" },
  { label: "Community Health", value: "94/100", trend: "+2 since last survey", trendUp: true, icon: "Heartbeat" },
];

// ─── Revenue History (12 months) ─────────────────────────────────────────────

export const revenueHistory = [
  { month: "Jul 2025", revenue: 121400 },
  { month: "Aug 2025", revenue: 128900 },
  { month: "Sep 2025", revenue: 134200 },
  { month: "Oct 2025", revenue: 139800 },
  { month: "Nov 2025", revenue: 142100 },
  { month: "Dec 2025", revenue: 148500 },
  { month: "Jan 2026", revenue: 152300 },
  { month: "Feb 2026", revenue: 158700 },
  { month: "Mar 2026", revenue: 164200 },
  { month: "Apr 2026", revenue: 171800 },
  { month: "May 2026", revenue: 179600 },
  { month: "Jun 2026", revenue: 187420 },
];

// ─── Recent Activity ─────────────────────────────────────────────────────────

export const recentActivity: ActivityItem[] = [
  { id: "a1", icon: "UserPlus", label: "Anika Johansson joined as an Explorer member", time: "12 min ago", color: "emerald" },
  { id: "a2", icon: "CheckCircle", label: "Task completed: Install solar panel mounting brackets", time: "38 min ago", color: "blue" },
  { id: "a3", icon: "Scales", label: "Vote concluded: Solar Array Expansion — Passed (87%)", time: "1 hour ago", color: "violet" },
  { id: "a4", icon: "Plant", label: "Crop harvested: 48 kg tomatoes from Greenhouse 1", time: "2 hours ago", color: "green" },
  { id: "a5", icon: "Lightning", label: "Energy milestone: 72% self-sufficiency reached", time: "3 hours ago", color: "amber" },
  { id: "a6", icon: "Wrench", label: "Work order resolved: Sauna heater thermostat fixed", time: "4 hours ago", color: "orange" },
  { id: "a7", icon: "CalendarCheck", label: "Event registered: 23 signed up for Full Moon Gathering", time: "5 hours ago", color: "purple" },
  { id: "a8", icon: "CurrencyDollar", label: "Funding received: $25,000 from BC Green Infrastructure Grant", time: "6 hours ago", color: "emerald" },
  { id: "a9", icon: "Backpack", label: "Work-stay participant Luis completed 40-hour milestone", time: "8 hours ago", color: "teal" },
  { id: "a10", icon: "Storefront", label: "Marketplace: Fresh honey jars listed by Emma R.", time: "10 hours ago", color: "yellow" },
  { id: "a11", icon: "ChatTeardrop", label: "Announcement posted: Summer Solstice schedule released", time: "12 hours ago", color: "blue" },
  { id: "a12", icon: "TreeEvergreen", label: "Farm alert: Berry patch pest detection — organic spray applied", time: "1 day ago", color: "red" },
  { id: "a13", icon: "Handshake", label: "Dispute resolved: Garden boundary mediation completed", time: "1 day ago", color: "green" },
  { id: "a14", icon: "GraduationCap", label: "Course milestone: Permaculture Design — Week 6 complete", time: "2 days ago", color: "indigo" },
  { id: "a15", icon: "Globe", label: "Network update: Nordic Haven village joined the network", time: "2 days ago", color: "cyan" },
];

// ─── Upcoming Events ─────────────────────────────────────────────────────────

export const upcomingEvents: Event[] = [
  { id: "ue1", title: "Full Moon Gathering", date: "2026-06-14", time: "20:00", location: "Fire Circle", type: "ceremony", registered: 34, capacity: 50, facilitator: "Maya Chen" },
  { id: "ue2", title: "Permaculture Workshop: Composting", date: "2026-06-15", time: "10:00", location: "Main Garden", type: "workshop", registered: 18, capacity: 20, facilitator: "Jens Muller" },
  { id: "ue3", title: "Community Dinner", date: "2026-06-16", time: "18:30", location: "Commons Hall", type: "social", registered: 62, capacity: 80, facilitator: "Priya Sharma" },
  { id: "ue4", title: "Yoga Sunrise Session", date: "2026-06-17", time: "06:00", location: "Meadow Deck", type: "wellness", registered: 14, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ue5", title: "Maker Night: Woodworking", date: "2026-06-18", time: "19:00", location: "Workshop Barn", type: "workshop", registered: 11, capacity: 15, facilitator: "Takeshi Ono" },
];

// ─── Village Health Indicators ───────────────────────────────────────────────

export const villageHealth = [
  { label: "Water", value: 98, unit: "%" },
  { label: "Power", value: 95, unit: "%" },
  { label: "Internet", value: 99.2, unit: "%" },
  { label: "Air Quality", value: 94, unit: "%" },
];

// ─── Weather ─────────────────────────────────────────────────────────────────

export const weatherData = {
  temp: 22,
  condition: "Partly Cloudy",
  humidity: 45,
  wind: 12,
};
