import type { Task, WorkOrder, Project } from "./types";

// ─── Task Stats ──────────────────────────────────────────────────────────────

export const taskStats = {
  open: 34,
  inProgress: 18,
  completedThisWeek: 12,
  overdue: 3,
  avgCompletion: 2.3,
};

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const tasks: Task[] = [
  { id: "t1", title: "Fix sauna heater thermostat", assignee: "Jens Muller", priority: "high", category: "Maintenance", dueDate: "2026-06-14", status: "in_progress", subtasks: [{ title: "Order replacement part", done: true }, { title: "Install thermostat", done: false }, { title: "Test and calibrate", done: false }] },
  { id: "t2", title: "Install solar panel mounting brackets", assignee: "Takeshi Ono", priority: "high", category: "Infrastructure", dueDate: "2026-06-18", status: "in_progress", subtasks: [{ title: "Survey roof angles", done: true }, { title: "Drill anchor points", done: true }, { title: "Mount brackets", done: false }] },
  { id: "t3", title: "Update work-stay handbook v2.0", assignee: "Liam O'Brien", priority: "medium", category: "Admin", dueDate: "2026-06-20", status: "review" },
  { id: "t4", title: "Repair gazebo railing", assignee: "Tom Henriksen", priority: "medium", category: "Maintenance", dueDate: "2026-06-16", status: "in_progress" },
  { id: "t5", title: "Set up IoT gateway for greenhouse", assignee: "David Chen", priority: "high", category: "Technology", dueDate: "2026-06-15", status: "in_progress", subtasks: [{ title: "Configure Raspberry Pi", done: true }, { title: "Connect soil sensors", done: true }, { title: "Set up dashboard alerts", done: false }, { title: "Test data pipeline", done: false }] },
  { id: "t6", title: "Paint bunkhouse exterior — north wall", assignee: "Luis Garcia", priority: "low", category: "Maintenance", dueDate: "2026-06-25", status: "backlog" },
  { id: "t7", title: "Organize community tool library", assignee: "Emma Rodriguez", priority: "medium", category: "Community", dueDate: "2026-06-17", status: "in_progress" },
  { id: "t8", title: "Install drip irrigation — herb spiral", assignee: "Maya Chen", priority: "medium", category: "Farm", dueDate: "2026-06-19", status: "backlog" },
  { id: "t9", title: "Write June newsletter", assignee: "Priya Sharma", priority: "medium", category: "Communications", dueDate: "2026-06-12", status: "done" },
  { id: "t10", title: "Repair chicken coop wire mesh", assignee: "Tom Henriksen", priority: "high", category: "Farm", dueDate: "2026-06-13", status: "done" },
  { id: "t11", title: "Configure Stripe webhook for membership", assignee: "David Chen", priority: "high", category: "Technology", dueDate: "2026-06-11", status: "done" },
  { id: "t12", title: "Build raised beds for community garden", assignee: "Luis Garcia", priority: "medium", category: "Farm", dueDate: "2026-06-22", status: "backlog" },
  { id: "t13", title: "Replace fire extinguishers — all buildings", assignee: "James Whitfield", priority: "urgent", category: "Safety", dueDate: "2026-06-13", status: "in_progress" },
  { id: "t14", title: "Design event poster — Summer Solstice", assignee: "Anika Johansson", priority: "medium", category: "Communications", dueDate: "2026-06-15", status: "review" },
  { id: "t15", title: "Clear deadfall from Trail 3", assignee: "Erik Johansson", priority: "low", category: "Trails", dueDate: "2026-06-28", status: "backlog" },
  { id: "t16", title: "Audit emergency supply kits", assignee: "Sofia Andersson", priority: "medium", category: "Safety", dueDate: "2026-06-20", status: "in_progress" },
  { id: "t17", title: "Upgrade WiFi access point — commons", assignee: "David Chen", priority: "high", category: "Technology", dueDate: "2026-06-10", status: "done" },
  { id: "t18", title: "Prepare quarterly financial report", assignee: "Rachel Thornton", priority: "high", category: "Admin", dueDate: "2026-06-30", status: "in_progress" },
  { id: "t19", title: "Seal cabin 4 window frame leak", assignee: "Jens Muller", priority: "medium", category: "Maintenance", dueDate: "2026-06-21", status: "backlog" },
  { id: "t20", title: "Transplant seedlings to main garden", assignee: "Maya Chen", priority: "medium", category: "Farm", dueDate: "2026-06-14", status: "done" },
];

// ─── Work Orders ─────────────────────────────────────────────────────────────

export const workOrders: WorkOrder[] = [
  { id: "wo1", location: "Sauna Building", reportedBy: "Sofia Andersson", urgency: "high", assignedTo: "Jens Muller", status: "in_progress", created: "2026-06-08" },
  { id: "wo2", location: "Cabin 7 — Bathroom", reportedBy: "Sarah Mitchell", urgency: "medium", assignedTo: "Tom Henriksen", status: "assigned", created: "2026-06-09" },
  { id: "wo3", location: "Commons Hall — Kitchen", reportedBy: "Priya Sharma", urgency: "low", assignedTo: "Luis Garcia", status: "open", created: "2026-06-10" },
  { id: "wo4", location: "Greenhouse 1", reportedBy: "Maya Chen", urgency: "high", assignedTo: "David Chen", status: "in_progress", created: "2026-06-07" },
  { id: "wo5", location: "RV Pad 3 — Electrical", reportedBy: "Erik Johansson", urgency: "critical", assignedTo: "Jens Muller", status: "assigned", created: "2026-06-11" },
  { id: "wo6", location: "Workshop Barn — Roof", reportedBy: "Takeshi Ono", urgency: "medium", assignedTo: "Tom Henriksen", status: "open", created: "2026-06-10" },
  { id: "wo7", location: "Bunkhouse — Room 4", reportedBy: "Liam O'Brien", urgency: "low", assignedTo: "Luis Garcia", status: "completed", created: "2026-06-05" },
  { id: "wo8", location: "Main Garden — Irrigation Valve", reportedBy: "Maya Chen", urgency: "medium", assignedTo: "Jens Muller", status: "completed", created: "2026-06-04" },
  { id: "wo9", location: "Cabin 2 — Front Steps", reportedBy: "James Whitfield", urgency: "medium", assignedTo: "Tom Henriksen", status: "in_progress", created: "2026-06-09" },
  { id: "wo10", location: "Fire Circle — Seating", reportedBy: "Emma Rodriguez", urgency: "low", assignedTo: "Luis Garcia", status: "open", created: "2026-06-11" },
  { id: "wo11", location: "Coworking Gazebo — WiFi", reportedBy: "David Chen", urgency: "high", assignedTo: "David Chen", status: "completed", created: "2026-06-06" },
  { id: "wo12", location: "Trail 2 — Bridge Planks", reportedBy: "Erik Johansson", urgency: "medium", assignedTo: "Tom Henriksen", status: "assigned", created: "2026-06-10" },
];

// ─── Active Projects ─────────────────────────────────────────────────────────

export const projects: Project[] = [
  { id: "pj1", name: "Cabin Phase 2 — Build 6 Units", start: "2026-04-01", end: "2026-10-31", progress: 35, status: "on_track" },
  { id: "pj2", name: "Coworking Gazebo Construction", start: "2026-05-15", end: "2026-08-15", progress: 48, status: "on_track" },
  { id: "pj3", name: "Community Garden Expansion", start: "2026-06-01", end: "2026-08-31", progress: 12, status: "on_track" },
  { id: "pj4", name: "Trail System — Phase 1", start: "2026-03-01", end: "2026-09-30", progress: 62, status: "at_risk" },
  { id: "pj5", name: "WiFi Infrastructure Upgrade", start: "2026-05-01", end: "2026-07-15", progress: 78, status: "on_track" },
  { id: "pj6", name: "Solar Array Expansion", start: "2026-06-15", end: "2026-09-30", progress: 8, status: "on_track" },
];
