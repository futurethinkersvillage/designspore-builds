import type { Event, Course } from "./types";

// ─── Event Stats ─────────────────────────────────────────────────────────────

export const eventStats = {
  thisMonth: 14,
  totalRegistrations: 287,
  avgAttendance: 82,
  topRated: 4.8,
};

// ─── Upcoming Events ─────────────────────────────────────────────────────────

export const upcomingEvents: Event[] = [
  { id: "e1", title: "Full Moon Gathering", date: "2026-06-14", time: "20:00", location: "Fire Circle", type: "ceremony", registered: 34, capacity: 50, facilitator: "Maya Chen" },
  { id: "e2", title: "Permaculture Workshop: Composting", date: "2026-06-15", time: "10:00", location: "Main Garden", type: "workshop", registered: 18, capacity: 20, facilitator: "Kofi Asante" },
  { id: "e3", title: "Community Dinner", date: "2026-06-16", time: "18:30", location: "Commons Hall", type: "social", registered: 62, capacity: 80, facilitator: "Priya Sharma" },
  { id: "e4", title: "Yoga Sunrise Session", date: "2026-06-17", time: "06:00", location: "Meadow Deck", type: "wellness", registered: 14, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "e5", title: "Maker Night: Woodworking", date: "2026-06-18", time: "19:00", location: "Workshop Barn", type: "workshop", registered: 11, capacity: 15, facilitator: "Takeshi Ono" },
  { id: "e6", title: "Storytelling Circle", date: "2026-06-19", time: "19:30", location: "Library Loft", type: "social", registered: 22, capacity: 30, facilitator: "Camila Reyes" },
  { id: "e7", title: "Forest Bathing Walk", date: "2026-06-20", time: "07:00", location: "North Trail", type: "wellness", registered: 16, capacity: 20, facilitator: "Freya Olsen" },
  { id: "e8", title: "Kids Adventure Day", date: "2026-06-21", time: "09:00", location: "Meadow & Trails", type: "social", registered: 28, capacity: 35, facilitator: "Sarah Mitchell" },
  { id: "e9", title: "Live Music Night", date: "2026-06-21", time: "20:00", location: "Commons Hall", type: "social", registered: 45, capacity: 60, facilitator: "Camila Reyes" },
  { id: "e10", title: "Sauna Social", date: "2026-06-22", time: "18:00", location: "Sauna Building", type: "social", registered: 12, capacity: 16, facilitator: "Sofia Andersson" },
];

// ─── Calendar Events (June 2026) ─────────────────────────────────────────────

export const calendarEvents: Event[] = [
  { id: "ce1", title: "Morning Yoga", date: "2026-06-01", time: "06:30", location: "Meadow Deck", type: "wellness", registered: 12, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ce2", title: "Garden Work Bee", date: "2026-06-01", time: "09:00", location: "Main Garden", type: "work", registered: 15, capacity: 20, facilitator: "Maya Chen" },
  { id: "ce3", title: "Community Lunch", date: "2026-06-02", time: "12:00", location: "Commons Hall", type: "social", registered: 48, capacity: 60, facilitator: "Priya Sharma" },
  { id: "ce4", title: "Fermentation Class", date: "2026-06-03", time: "14:00", location: "Kitchen Lab", type: "workshop", registered: 10, capacity: 12, facilitator: "Mei Lin Wong" },
  { id: "ce5", title: "Trail Maintenance", date: "2026-06-04", time: "08:00", location: "Trail System", type: "work", registered: 8, capacity: 15, facilitator: "Erik Johansson" },
  { id: "ce6", title: "Breathwork Session", date: "2026-06-04", time: "17:00", location: "Wellness Room", type: "wellness", registered: 9, capacity: 15, facilitator: "Freya Olsen" },
  { id: "ce7", title: "Open Mic Night", date: "2026-06-05", time: "19:00", location: "Fire Circle", type: "social", registered: 32, capacity: 50, facilitator: "Camila Reyes" },
  { id: "ce8", title: "Solar Panel Workshop", date: "2026-06-06", time: "10:00", location: "Workshop Barn", type: "workshop", registered: 14, capacity: 15, facilitator: "Jens Muller" },
  { id: "ce9", title: "Morning Yoga", date: "2026-06-06", time: "06:30", location: "Meadow Deck", type: "wellness", registered: 14, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ce10", title: "Kids Nature Walk", date: "2026-06-07", time: "10:00", location: "North Trail", type: "education", registered: 18, capacity: 20, facilitator: "Sarah Mitchell" },
  { id: "ce11", title: "Community Dinner", date: "2026-06-07", time: "18:00", location: "Commons Hall", type: "social", registered: 58, capacity: 80, facilitator: "Priya Sharma" },
  { id: "ce12", title: "Meditation Circle", date: "2026-06-08", time: "07:00", location: "Wellness Room", type: "wellness", registered: 11, capacity: 20, facilitator: "Freya Olsen" },
  { id: "ce13", title: "Construction Work Day", date: "2026-06-09", time: "08:00", location: "Cabin Phase 2", type: "work", registered: 12, capacity: 20, facilitator: "Takeshi Ono" },
  { id: "ce14", title: "Natural Building Class", date: "2026-06-10", time: "10:00", location: "Cob Area", type: "workshop", registered: 8, capacity: 12, facilitator: "Yuki Nakamura" },
  { id: "ce15", title: "Morning Yoga", date: "2026-06-10", time: "06:30", location: "Meadow Deck", type: "wellness", registered: 15, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ce16", title: "Governance Circle", date: "2026-06-11", time: "15:00", location: "Commons Hall", type: "work", registered: 24, capacity: 40, facilitator: "Liam O'Brien" },
  { id: "ce17", title: "Sound Healing", date: "2026-06-12", time: "19:00", location: "Wellness Room", type: "wellness", registered: 16, capacity: 20, facilitator: "Freya Olsen" },
  { id: "ce18", title: "Harvest Day", date: "2026-06-13", time: "08:00", location: "Main Garden", type: "work", registered: 18, capacity: 25, facilitator: "Maya Chen" },
  { id: "ce19", title: "Full Moon Gathering", date: "2026-06-14", time: "20:00", location: "Fire Circle", type: "ceremony", registered: 34, capacity: 50, facilitator: "Maya Chen" },
  { id: "ce20", title: "Permaculture Workshop", date: "2026-06-15", time: "10:00", location: "Main Garden", type: "workshop", registered: 18, capacity: 20, facilitator: "Kofi Asante" },
  { id: "ce21", title: "Morning Yoga", date: "2026-06-15", time: "06:30", location: "Meadow Deck", type: "wellness", registered: 13, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ce22", title: "Community Dinner", date: "2026-06-16", time: "18:30", location: "Commons Hall", type: "social", registered: 62, capacity: 80, facilitator: "Priya Sharma" },
  { id: "ce23", title: "Yoga Sunrise Session", date: "2026-06-17", time: "06:00", location: "Meadow Deck", type: "wellness", registered: 14, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ce24", title: "Maker Night", date: "2026-06-18", time: "19:00", location: "Workshop Barn", type: "workshop", registered: 11, capacity: 15, facilitator: "Takeshi Ono" },
  { id: "ce25", title: "Storytelling Circle", date: "2026-06-19", time: "19:30", location: "Library Loft", type: "social", registered: 22, capacity: 30, facilitator: "Camila Reyes" },
  { id: "ce26", title: "Forest Bathing", date: "2026-06-20", time: "07:00", location: "North Trail", type: "wellness", registered: 16, capacity: 20, facilitator: "Freya Olsen" },
  { id: "ce27", title: "Summer Solstice Celebration", date: "2026-06-21", time: "16:00", location: "Meadow & Fire Circle", type: "ceremony", registered: 87, capacity: 120, facilitator: "Maya Chen" },
  { id: "ce28", title: "Kids Adventure Day", date: "2026-06-21", time: "09:00", location: "Meadow & Trails", type: "social", registered: 28, capacity: 35, facilitator: "Sarah Mitchell" },
  { id: "ce29", title: "Sauna Social", date: "2026-06-22", time: "18:00", location: "Sauna Building", type: "social", registered: 12, capacity: 16, facilitator: "Sofia Andersson" },
  { id: "ce30", title: "Garden Planning Session", date: "2026-06-23", time: "10:00", location: "Greenhouse 1", type: "work", registered: 9, capacity: 15, facilitator: "Maya Chen" },
  { id: "ce31", title: "Morning Yoga", date: "2026-06-24", time: "06:30", location: "Meadow Deck", type: "wellness", registered: 12, capacity: 25, facilitator: "Sofia Andersson" },
  { id: "ce32", title: "First Aid Refresher", date: "2026-06-25", time: "13:00", location: "Commons Hall", type: "education", registered: 20, capacity: 25, facilitator: "Sarah Mitchell" },
  { id: "ce33", title: "Live Music Jam", date: "2026-06-26", time: "19:30", location: "Fire Circle", type: "social", registered: 28, capacity: 50, facilitator: "Camila Reyes" },
  { id: "ce34", title: "Community Dinner", date: "2026-06-28", time: "18:00", location: "Commons Hall", type: "social", registered: 55, capacity: 80, facilitator: "Priya Sharma" },
  { id: "ce35", title: "Month-End Review", date: "2026-06-30", time: "15:00", location: "Commons Hall", type: "work", registered: 32, capacity: 40, facilitator: "Rachel Thornton" },
];

// ─── Courses ─────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  { id: "co1", title: "Permaculture Design Certificate", instructor: "Maya Chen", weeks: 12, enrolled: 18, progress: 50, rating: 4.8 },
  { id: "co2", title: "Natural Building Foundations", instructor: "Yuki Nakamura", weeks: 8, enrolled: 12, progress: 62, rating: 4.7 },
  { id: "co3", title: "Fermentation & Preservation", instructor: "Mei Lin Wong", weeks: 6, enrolled: 14, progress: 83, rating: 4.9 },
  { id: "co4", title: "Wilderness First Aid", instructor: "Sarah Mitchell", weeks: 4, enrolled: 20, progress: 75, rating: 4.6 },
  { id: "co5", title: "Solar Installation Basics", instructor: "Jens Muller", weeks: 6, enrolled: 10, progress: 33, rating: 4.5 },
  { id: "co6", title: "Community Facilitation", instructor: "Liam O'Brien", weeks: 8, enrolled: 16, progress: 25, rating: 4.7 },
];

// ─── Featured Event ──────────────────────────────────────────────────────────

export const featuredEvent = {
  id: "feat1",
  title: "Summer Solstice Celebration",
  date: "2026-06-21",
  time: "16:00–23:00",
  location: "Meadow & Fire Circle",
  description: "Our biggest community celebration of the year. Join us for an afternoon of live music, farm-to-table feast, storytelling, fire ceremony, and dancing under the longest day's sky. Open to all members and their guests.",
  registered: 87,
  capacity: 120,
  facilitator: "Maya Chen",
  schedule: [
    { time: "16:00", activity: "Opening Circle & Welcome" },
    { time: "16:30", activity: "Live Music — Local & Village Artists" },
    { time: "18:00", activity: "Farm-to-Table Feast" },
    { time: "19:30", activity: "Storytelling & Poetry" },
    { time: "20:30", activity: "Fire Lighting Ceremony" },
    { time: "21:00", activity: "Drumming Circle & Dancing" },
    { time: "22:30", activity: "Closing Gratitude Circle" },
  ],
  tags: ["community", "celebration", "music", "food", "ceremony"],
};
