import type { Member } from "./types";

// ─── Member Stats ────────────────────────────────────────────────────────────

export const memberStats = {
  total: 247,
  activeThisMonth: 89,
  newThisQuarter: 23,
  skillCategories: 42,
};

// ─── Members ─────────────────────────────────────────────────────────────────

export const members: Member[] = [
  { id: "m1", name: "Maya Chen", role: "Farmer", skills: ["Permaculture", "Composting", "Seed Saving"], location: "Canada", joinedDate: "2023-06-15", active: true, tier: "Elder", avatar: "MC" },
  { id: "m2", name: "Jens Muller", role: "Builder", skills: ["Electrical", "Plumbing", "Solar Installation"], location: "Germany", joinedDate: "2023-08-20", active: true, tier: "Elder", avatar: "JM" },
  { id: "m3", name: "Priya Sharma", role: "Chef", skills: ["Cooking", "Fermentation", "Nutrition Planning"], location: "India", joinedDate: "2023-11-01", active: true, tier: "Steward", avatar: "PS" },
  { id: "m4", name: "Liam O'Brien", role: "Admin", skills: ["Program Management", "Writing", "Facilitation"], location: "Canada", joinedDate: "2024-01-10", active: true, tier: "Steward", avatar: "LO" },
  { id: "m5", name: "Sofia Andersson", role: "Teacher", skills: ["Yoga", "Meditation", "Wellness"], location: "Sweden", joinedDate: "2024-02-15", active: true, tier: "Steward", avatar: "SA" },
  { id: "m6", name: "Takeshi Ono", role: "Builder", skills: ["Carpentry", "Furniture Making", "CNC"], location: "Japan", joinedDate: "2024-03-01", active: true, tier: "Builder", avatar: "TO" },
  { id: "m7", name: "Emma Rodriguez", role: "Designer", skills: ["Graphic Design", "UI/UX", "Illustration"], location: "USA", joinedDate: "2024-03-20", active: true, tier: "Builder", avatar: "ER" },
  { id: "m8", name: "David Chen", role: "Developer", skills: ["Full Stack", "IoT", "Data Analysis"], location: "Canada", joinedDate: "2024-04-05", active: true, tier: "Steward", avatar: "DC" },
  { id: "m9", name: "Rachel Thornton", role: "Admin", skills: ["Finance", "Strategy", "Fundraising"], location: "Canada", joinedDate: "2023-06-15", active: true, tier: "Elder", avatar: "RT" },
  { id: "m10", name: "Tom Henriksen", role: "Builder", skills: ["Maintenance", "Welding", "Heavy Equipment"], location: "Canada", joinedDate: "2024-05-10", active: true, tier: "Builder", avatar: "TH" },
  { id: "m11", name: "Sarah Mitchell", role: "Teacher", skills: ["Homeschooling", "Outdoor Ed", "First Aid"], location: "Canada", joinedDate: "2024-06-01", active: true, tier: "Elder", avatar: "SM" },
  { id: "m12", name: "Erik Johansson", role: "Farmer", skills: ["Forestry", "Trail Building", "Chainsaw"], location: "Sweden", joinedDate: "2024-07-15", active: true, tier: "Builder", avatar: "EJ" },
  { id: "m13", name: "Anika Johansson", role: "Designer", skills: ["Photography", "Social Media", "Branding"], location: "Netherlands", joinedDate: "2026-04-15", active: true, tier: "Explorer", avatar: "AJ" },
  { id: "m14", name: "Kofi Asante", role: "Farmer", skills: ["Organic Farming", "Irrigation", "Livestock"], location: "Canada", joinedDate: "2025-09-01", active: true, tier: "Builder", avatar: "KA" },
  { id: "m15", name: "Mei Lin Wong", role: "Chef", skills: ["Baking", "Preservation", "Herbalism"], location: "Australia", joinedDate: "2025-10-15", active: true, tier: "Explorer", avatar: "MW" },
  { id: "m16", name: "James Whitfield", role: "Admin", skills: ["Legal", "Real Estate", "Policy"], location: "Canada", joinedDate: "2024-08-01", active: true, tier: "Steward", avatar: "JW" },
  { id: "m17", name: "Camila Reyes", role: "Teacher", skills: ["Music", "Event Planning", "Languages"], location: "USA", joinedDate: "2025-11-01", active: true, tier: "Explorer", avatar: "CR" },
  { id: "m18", name: "Yuki Nakamura", role: "Builder", skills: ["Natural Building", "Cob", "Earthworks"], location: "Japan", joinedDate: "2026-01-15", active: true, tier: "Explorer", avatar: "YN" },
  { id: "m19", name: "Hannah Okoye", role: "Farmer", skills: ["Beekeeping", "Herbalism", "Soil Science"], location: "USA", joinedDate: "2025-12-01", active: true, tier: "Explorer", avatar: "HO" },
  { id: "m20", name: "Marco Bianchi", role: "Builder", skills: ["Furniture", "Welding", "Metalwork"], location: "Germany", joinedDate: "2026-02-01", active: true, tier: "Explorer", avatar: "MB" },
  { id: "m21", name: "Freya Olsen", role: "Teacher", skills: ["Yoga", "Sound Healing", "Breathwork"], location: "Netherlands", joinedDate: "2025-08-15", active: true, tier: "Builder", avatar: "FO" },
  { id: "m22", name: "Raj Patel", role: "Developer", skills: ["Web Development", "Cloud", "Automation"], location: "Canada", joinedDate: "2026-03-01", active: true, tier: "Explorer", avatar: "RP" },
  { id: "m23", name: "Isabelle Moreau", role: "Designer", skills: ["Landscaping", "Permaculture Design", "CAD"], location: "Canada", joinedDate: "2026-03-15", active: true, tier: "Explorer", avatar: "IM" },
  { id: "m24", name: "Soren Vestergaard", role: "Developer", skills: ["Electronics", "IoT", "Renewable Energy"], location: "Germany", joinedDate: "2025-07-01", active: true, tier: "Builder", avatar: "SV" },
];

// ─── Skill Categories ────────────────────────────────────────────────────────

export const skillCategories = [
  { name: "Building", count: 48 },
  { name: "Farming", count: 42 },
  { name: "Technology", count: 36 },
  { name: "Cooking", count: 28 },
  { name: "Teaching", count: 24 },
  { name: "Design", count: 22 },
  { name: "Admin", count: 18 },
  { name: "Health", count: 16 },
  { name: "Music", count: 12 },
  { name: "Crafts", count: 10 },
];

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const leaderboard = [
  { name: "Jens Muller", hours: 342, badge: "Infrastructure Hero" },
  { name: "Maya Chen", hours: 318, badge: "Garden Guardian" },
  { name: "Liam O'Brien", hours: 296, badge: "Community Pillar" },
  { name: "David Chen", hours: 274, badge: "Tech Wizard" },
  { name: "Tom Henriksen", hours: 261, badge: "Fix-It Master" },
];
