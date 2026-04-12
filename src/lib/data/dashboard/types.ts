// ─── Smart Village Dashboard — Shared Types ─────────────────────────────────

export interface StatItem {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "equity" | "grant" | "crowdfund" | "angel";
  goal: number;
  raised: number;
  daysLeft: number;
  status: "active" | "completed" | "paused" | "draft";
}

export interface Grant {
  id: string;
  grantor: string;
  amount: number;
  status: "Applied" | "Approved" | "In Review" | "Disbursed" | "Rejected";
  deadline: string;
  reporting: string;
}

export interface Investor {
  id: string;
  name: string;
  amount: number;
  date: string;
  notes: string;
}

export interface Proposal {
  id: string;
  title: string;
  proposer: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  deadline: string;
  status: "active" | "passed" | "rejected" | "tabled";
}

export interface Dispute {
  id: string;
  parties: string[];
  mediator: string;
  status: "open" | "in_mediation" | "resolved" | "escalated";
  priority: "low" | "medium" | "high";
  filed: string;
}

export interface Agreement {
  id: string;
  title: string;
  category: string;
  adoptedDate: string;
  lastReviewed: string;
}

export interface RevenueMonth {
  month: string;
  accommodation: number;
  memberships: number;
  events: number;
  farm: number;
  consulting: number;
  workshops: number;
}

export interface Expense {
  category: string;
  amount: number;
  percentage: number;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  dueDate: string;
  status: "backlog" | "in_progress" | "review" | "done";
  subtasks?: { title: string; done: boolean }[];
}

export interface WorkOrder {
  id: string;
  location: string;
  reportedBy: string;
  urgency: "low" | "medium" | "high" | "critical";
  assignedTo: string;
  status: "open" | "assigned" | "in_progress" | "completed";
  created: string;
}

export interface Project {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  status: "on_track" | "at_risk" | "delayed" | "completed";
}

export interface WorkStayParticipant {
  id: string;
  name: string;
  skills: string[];
  arrival: string;
  departure: string;
  hoursCompleted: number;
  rating: number;
}

export interface WorkStayApplication {
  stage: string;
  count: number;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  skills: string[];
  location: string;
  joinedDate: string;
  active: boolean;
  tier: "Explorer" | "Builder" | "Steward" | "Elder";
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "social" | "ceremony" | "work" | "education" | "wellness";
  registered: number;
  capacity: number;
  facilitator: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  weeks: number;
  enrolled: number;
  progress: number;
  rating: number;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  memberCount: number;
  color: string;
  benefits: string[];
}

export interface FarmPlot {
  id: string;
  name: string;
  crop: string;
  status: "planted" | "growing" | "harvest_ready" | "fallow" | "preparing";
  acreage: number;
}

export interface SensorReading {
  timestamp: string;
  soilMoisture: number;
  soilTemp: number;
  humidity: number;
  light: number;
}

export interface CropYield {
  crop: string;
  projected: number;
  actual: number;
}

export interface Livestock {
  type: string;
  count: number;
  health: "healthy" | "fair" | "needs_attention";
  production: string;
}

export interface Village {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  members: number;
  year: number;
  focus: string[];
  status: "Active" | "Forming" | "Planning";
}

export interface EnergyDay {
  date: string;
  solar: number;
  grid: number;
  battery: number;
}

export interface WellnessProgram {
  name: string;
  attendance: number;
  trend: "up" | "down" | "stable";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  priority: "low" | "normal" | "high" | "urgent";
  read: boolean;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  category: string;
  seller: string;
  price: number;
  type: "sale" | "rent" | "swap" | "service";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  label: string;
  time: string;
  color: string;
}
