import type { WorkStayParticipant, WorkStayApplication } from "./types";

// ─── Current Cohort ──────────────────────────────────────────────────────────

export const currentCohort = {
  name: "Summer 2026",
  participants: 12,
  startDate: "2026-04-15",
  endDate: "2026-09-15",
  currentWeek: 8,
  totalWeeks: 22,
};

// ─── Application Pipeline ────────────────────────────────────────────────────

export const applicationPipeline: WorkStayApplication[] = [
  { stage: "Applied", count: 47 },
  { stage: "Screening", count: 18 },
  { stage: "Interview", count: 8 },
  { stage: "Accepted", count: 12 },
  { stage: "Waitlist", count: 6 },
];

// ─── Participants ────────────────────────────────────────────────────────────

export const participants: WorkStayParticipant[] = [
  { id: "ws1", name: "Luis Garcia", skills: ["Carpentry", "Tiling", "Painting"], arrival: "2026-04-15", departure: "2026-09-15", hoursCompleted: 142, rating: 4.9 },
  { id: "ws2", name: "Anika Johansson", skills: ["Design", "Photography", "Social Media"], arrival: "2026-04-15", departure: "2026-09-15", hoursCompleted: 128, rating: 4.7 },
  { id: "ws3", name: "Kofi Asante", skills: ["Farming", "Composting", "Irrigation"], arrival: "2026-04-15", departure: "2026-09-15", hoursCompleted: 156, rating: 4.8 },
  { id: "ws4", name: "Mei Lin Wong", skills: ["Cooking", "Fermentation", "Nutrition"], arrival: "2026-04-15", departure: "2026-08-15", hoursCompleted: 134, rating: 4.6 },
  { id: "ws5", name: "Soren Vestergaard", skills: ["Tech", "IoT", "Electrical"], arrival: "2026-04-20", departure: "2026-09-15", hoursCompleted: 118, rating: 4.8 },
  { id: "ws6", name: "Camila Reyes", skills: ["Teaching", "Music", "Event Planning"], arrival: "2026-04-20", departure: "2026-09-15", hoursCompleted: 124, rating: 4.5 },
  { id: "ws7", name: "Yuki Nakamura", skills: ["Natural Building", "Cob", "Earthworks"], arrival: "2026-05-01", departure: "2026-09-15", hoursCompleted: 108, rating: 4.9 },
  { id: "ws8", name: "Hannah Okoye", skills: ["Farming", "Beekeeping", "Herbalism"], arrival: "2026-05-01", departure: "2026-08-31", hoursCompleted: 112, rating: 4.7 },
  { id: "ws9", name: "Marco Bianchi", skills: ["Carpentry", "Furniture Making", "Welding"], arrival: "2026-05-01", departure: "2026-09-15", hoursCompleted: 116, rating: 4.8 },
  { id: "ws10", name: "Freya Olsen", skills: ["Yoga", "Wellness", "Community Facilitation"], arrival: "2026-05-15", departure: "2026-09-15", hoursCompleted: 94, rating: 4.6 },
  { id: "ws11", name: "Raj Patel", skills: ["Tech", "Web Development", "Data Analysis"], arrival: "2026-05-15", departure: "2026-08-15", hoursCompleted: 88, rating: 4.4 },
  { id: "ws12", name: "Isabelle Moreau", skills: ["Design", "Landscaping", "Permaculture"], arrival: "2026-05-15", departure: "2026-09-15", hoursCompleted: 82, rating: 4.7 },
];

// ─── Weekly Schedule ─────────────────────────────────────────────────────────

export const weeklySchedule = [
  { day: "Monday", morning: "Garden & Farm Work", afternoon: "Free / Skills Workshop" },
  { day: "Tuesday", morning: "Construction Projects", afternoon: "Free / Mentoring" },
  { day: "Wednesday", morning: "Kitchen & Meal Prep", afternoon: "Community Meeting" },
  { day: "Thursday", morning: "Maintenance & Repairs", afternoon: "Free / Personal Projects" },
  { day: "Friday", morning: "Trail & Grounds Work", afternoon: "Free / Exploration" },
  { day: "Saturday", morning: "Flexible / Catch-up Tasks", afternoon: "Free" },
  { day: "Sunday", morning: "Free", afternoon: "Free" },
];

// ─── Task Assignments (this week) ────────────────────────────────────────────

export const taskAssignments = [
  { participant: "Luis Garcia", area: "Cabin Phase 2 — Framing", hours: 20 },
  { participant: "Anika Johansson", area: "Social Media & Event Design", hours: 15 },
  { participant: "Kofi Asante", area: "Main Garden — Transplanting", hours: 20 },
  { participant: "Mei Lin Wong", area: "Commons Kitchen — Meal Prep", hours: 18 },
  { participant: "Soren Vestergaard", area: "IoT Gateway — Greenhouse Sensors", hours: 20 },
  { participant: "Camila Reyes", area: "Summer Solstice Event Planning", hours: 15 },
  { participant: "Yuki Nakamura", area: "Cob Bench Build — Fire Circle", hours: 20 },
  { participant: "Hannah Okoye", area: "Beehive Inspection & Garden", hours: 18 },
  { participant: "Marco Bianchi", area: "Gazebo Construction — Decking", hours: 20 },
  { participant: "Freya Olsen", area: "Morning Yoga + Wellness Coord", hours: 15 },
  { participant: "Raj Patel", area: "WiFi Infrastructure Upgrade", hours: 18 },
  { participant: "Isabelle Moreau", area: "Pollinator Meadow Landscaping", hours: 15 },
];

// ─── Past Cohorts ────────────────────────────────────────────────────────────

export const pastCohorts = [
  { name: "Winter 2025-26", period: "Nov 2025 – Mar 2026", participants: 8, avgRating: 4.6, completionRate: 88, topSkills: ["Carpentry", "Tech", "Cooking"] },
  { name: "Summer 2025", period: "Apr 2025 – Sep 2025", participants: 10, avgRating: 4.7, completionRate: 92, topSkills: ["Farming", "Building", "Design"] },
  { name: "Winter 2024-25", period: "Nov 2024 – Mar 2025", participants: 6, avgRating: 4.4, completionRate: 83, topSkills: ["Tech", "Admin", "Cooking"] },
  { name: "Summer 2024", period: "Apr 2024 – Sep 2024", participants: 8, avgRating: 4.5, completionRate: 90, topSkills: ["Carpentry", "Farming", "Music"] },
];
