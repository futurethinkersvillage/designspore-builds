"use client";

import { motion } from "framer-motion";
import {
  CalendarBlank, Star, Users, ChartPie, TrendUp,
  MapPin, Clock, User, Sparkle,
} from "@phosphor-icons/react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

/* ── Animation helpers ─────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ── Inline data ───────────────────────────────────────────────── */

const stats = [
  { label: "Events This Month", value: "14", icon: CalendarBlank },
  { label: "Total Registrations", value: "287", icon: Users },
  { label: "Avg Attendance", value: "82%", icon: TrendUp },
  { label: "Top-Rated", value: "4.8/5.0", icon: Star },
];

const upcomingEvents = [
  {
    type: "Ceremony",
    title: "Full Moon Gathering",
    date: "Jun 14",
    time: "8:00 PM",
    location: "Fire Circle",
    facilitator: "Euvie I.",
    registered: 28,
    capacity: 40,
    image: "/images/dashboard/event-full-moon.jpg",
  },
  {
    type: "Workshop",
    title: "Permaculture Workshop",
    date: "Jun 16",
    time: "9:00 AM",
    location: "Garden Pavilion",
    facilitator: "Elena V.",
    registered: 18,
    capacity: 25,
    image: "/images/dashboard/event-permaculture.jpg",
  },
  {
    type: "Social",
    title: "Community Dinner",
    date: "Jun 18",
    time: "6:00 PM",
    location: "Main Gazebo",
    facilitator: "Yuki T.",
    registered: 45,
    capacity: 60,
    image: "/images/dashboard/event-dinner.jpg",
  },
  {
    type: "Wellness",
    title: "Yoga Sunrise",
    date: "Jun 19",
    time: "6:00 AM",
    location: "Lake Deck",
    facilitator: "Rachel K.",
    registered: 12,
    capacity: 20,
    image: "/images/dashboard/event-yoga.jpg",
  },
  {
    type: "Workshop",
    title: "Maker Night",
    date: "Jun 21",
    time: "7:00 PM",
    location: "Workshop",
    facilitator: "Marcus R.",
    registered: 22,
    capacity: 30,
    image: "/images/dashboard/event-maker.jpg",
  },
  {
    type: "Social",
    title: "Storytelling Circle",
    date: "Jun 22",
    time: "8:00 PM",
    location: "Fire Circle",
    facilitator: "Sophia R.",
    registered: 15,
    capacity: 25,
    image: "/images/dashboard/event-storytelling.jpg",
  },
  {
    type: "Wellness",
    title: "Forest Bathing",
    date: "Jun 24",
    time: "7:00 AM",
    location: "North Trail",
    facilitator: "Ben M.",
    registered: 8,
    capacity: 15,
    image: "/images/dashboard/event-forest.jpg",
  },
  {
    type: "Social",
    title: "Kids Adventure Day",
    date: "Jun 25",
    time: "10:00 AM",
    location: "Playground",
    facilitator: "Lena B.",
    registered: 20,
    capacity: 20,
    image: "/images/dashboard/event-kids.jpg",
  },
  {
    type: "Social",
    title: "Live Music Night",
    date: "Jun 27",
    time: "7:00 PM",
    location: "Main Gazebo",
    facilitator: "Chris D.",
    registered: 35,
    capacity: 50,
    image: "/images/dashboard/event-music.jpg",
  },
  {
    type: "Wellness",
    title: "Sauna Social",
    date: "Jun 28",
    time: "6:00 PM",
    location: "Sauna",
    facilitator: "Ingrid L.",
    registered: 10,
    capacity: 12,
    image: "/images/dashboard/event-sauna.jpg",
  },
];

const aiSuggestions = [
  {
    emoji: "🌿",
    title: "Herb Medicine Walk",
    reason: "High interest in plant knowledge + midsummer harvest timing",
  },
  {
    emoji: "🎨",
    title: "Natural Pigment Art Night",
    reason: "Creative workshop demand up 40% — pairs well with Maker Night crew",
  },
  {
    emoji: "🌊",
    title: "Lake Sunrise Swim",
    reason: "Wellness trend + warm June temps make early water rituals popular",
  },
];

const courses = [
  { title: "Permaculture Design Certificate", instructor: "Elena V.", weeks: 12, enrolled: 14, capacity: 16, rating: 4.9 },
  { title: "Natural Building Techniques", instructor: "Marcus C.", weeks: 8, enrolled: 10, capacity: 12, rating: 4.7 },
  { title: "Fermentation & Preservation", instructor: "Yuki T.", weeks: 4, enrolled: 18, capacity: 20, rating: 4.8 },
  { title: "Wilderness First Aid", instructor: "Ben M.", weeks: 2, enrolled: 8, capacity: 10, rating: 4.6 },
  { title: "Solar Installation Basics", instructor: "David O.", weeks: 6, enrolled: 6, capacity: 8, rating: 4.5 },
  { title: "Community Facilitation", instructor: "Sarah L.", weeks: 4, enrolled: 12, capacity: 15, rating: 4.9 },
];

const typeBreakdown = [
  { name: "Workshop", value: 35 },
  { name: "Social", value: 28 },
  { name: "Wellness", value: 18 },
  { name: "Ceremony", value: 12 },
  { name: "Work", value: 7 },
];

const pieColors = ["#38387F", "#EA824E", "#4ade80", "#73516F", "#AF695E"];

type CalendarEvent = { day: number; type: "Workshop" | "Social" | "Ceremony" | "Work" };

const calendarEvents: CalendarEvent[] = [
  { day: 1, type: "Workshop" }, { day: 2, type: "Social" },
  { day: 3, type: "Work" }, { day: 5, type: "Ceremony" },
  { day: 6, type: "Workshop" }, { day: 7, type: "Social" },
  { day: 8, type: "Workshop" }, { day: 9, type: "Work" },
  { day: 10, type: "Social" }, { day: 11, type: "Ceremony" },
  { day: 12, type: "Workshop" }, { day: 14, type: "Ceremony" },
  { day: 15, type: "Social" }, { day: 16, type: "Workshop" },
  { day: 18, type: "Social" }, { day: 19, type: "Workshop" },
  { day: 21, type: "Social" }, { day: 21, type: "Ceremony" },
  { day: 22, type: "Social" }, { day: 24, type: "Work" },
  { day: 25, type: "Social" }, { day: 26, type: "Workshop" },
  { day: 27, type: "Social" }, { day: 28, type: "Workshop" },
  { day: 29, type: "Ceremony" }, { day: 30, type: "Work" },
];

/* ── Helpers ────────────────────────────────────────────────────── */

const typeBadge: Record<string, string> = {
  Workshop: "bg-[#38387F]/70 text-blue-300 border border-blue-400/20",
  Social: "bg-amber/70 text-white border border-amber/30",
  Ceremony: "bg-[#73516F]/70 text-purple-200 border border-purple-400/20",
  Wellness: "bg-emerald-600/70 text-emerald-200 border border-emerald-400/20",
  Work: "bg-[#AF695E]/70 text-orange-200 border border-orange-400/20",
};

const typeBadgeSubtle: Record<string, string> = {
  Workshop: "bg-[#38387F]/20 text-blue-400",
  Social: "bg-amber/20 text-amber",
  Ceremony: "bg-[#73516F]/20 text-purple-300",
  Wellness: "bg-emerald-500/20 text-emerald-400",
  Work: "bg-[#AF695E]/20 text-[#AF695E]",
};

const typeBarColor: Record<string, string> = {
  Workshop: "bg-blue-500/70",
  Social: "bg-amber/70",
  Ceremony: "bg-purple-400/70",
  Wellness: "bg-emerald-400/70",
  Work: "bg-orange-400/70",
};

const dotColor: Record<string, string> = {
  Workshop: "bg-[#38387F]",
  Social: "bg-amber",
  Ceremony: "bg-mauve",
  Work: "bg-[#AF695E]",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          weight={n <= Math.round(rating) ? "fill" : "regular"}
          className={n <= Math.round(rating) ? "text-amber" : "text-white/15"}
        />
      ))}
      <span className="ml-1 text-[10px] text-white/40">{rating}</span>
    </span>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0F0D14]/95 px-3 py-2 text-xs">
      <p className="text-white font-medium">{payload[0].name}</p>
      <p className="text-white/50">{payload[0].value}%</p>
    </div>
  );
}

/* ── June 2026 calendar grid ──────────────────────────────────── */

function CalendarGrid() {
  const daysInMonth = 30;
  const startDow = 0; // June 2026 starts Monday
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((wd) => (
          <div key={wd} className="text-center text-[10px] text-white/25 uppercase py-1">{wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const eventsForDay = day ? calendarEvents.filter((e) => e.day === day) : [];
          return (
            <div
              key={i}
              className={`rounded-lg border border-white/[0.04] p-1.5 min-h-[48px] ${
                day ? "bg-white/[0.02]" : ""
              }`}
            >
              {day && (
                <>
                  <span className="text-[10px] text-white/30">{day}</span>
                  <div className="flex gap-0.5 mt-1 flex-wrap">
                    {eventsForDay.map((ev, j) => (
                      <span key={j} className={`h-1.5 w-1.5 rounded-full ${dotColor[ev.type]}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3">
        {Object.entries(dotColor).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-[10px] text-white/30">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Event Card ────────────────────────────────────────────────── */

function EventCard({ ev }: { ev: typeof upcomingEvents[0] }) {
  const pct = Math.round((ev.registered / ev.capacity) * 100);
  const isFull = pct >= 100;
  const barColor = typeBarColor[ev.type] ?? "bg-amber/70";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden flex flex-col">
      {/* Cover image */}
      <div className="relative h-[130px] w-full shrink-0">
        <img
          src={ev.image}
          alt={ev.title}
          className="h-full w-full object-cover"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Badge overlaid top-left */}
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${typeBadge[ev.type]}`}
        >
          {ev.type}
        </span>
        {isFull && (
          <span className="absolute top-3 right-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/70">
            Full
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 gap-2.5 p-4">
        <h3 className="text-sm font-semibold text-white leading-snug">{ev.title}</h3>

        <div className="flex flex-col gap-1.5 text-[11px] text-white/45">
          <span className="flex items-center gap-1.5">
            <CalendarBlank size={11} className="shrink-0" />
            {ev.date} &middot; {ev.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={11} className="shrink-0" />
            {ev.location}
          </span>
          <span className="flex items-center gap-1.5">
            <User size={11} className="shrink-0" />
            {ev.facilitator}
          </span>
        </div>

        {/* Registration bar */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/30">Registration</span>
            <span className={`text-[10px] font-medium ${isFull ? "text-amber" : "text-white/50"}`}>
              {ev.registered}/{ev.capacity}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── AI Event Planner Panel ────────────────────────────────────── */

function AiEventPlanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.42 }}
      className="rounded-2xl border border-amber/[0.18] bg-amber/[0.04] p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg bg-amber/15 p-1.5">
          <Sparkle size={14} weight="fill" className="text-amber" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">AI Event Suggestions</h2>
          <p className="text-[10px] text-white/35 mt-0.5">Based on current member interests &amp; seasonal patterns</p>
        </div>
      </div>

      {/* Suggestions list */}
      <div className="space-y-2.5">
        {aiSuggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3.5 py-3"
          >
            <span className="text-xl shrink-0 leading-none">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{s.title}</p>
              <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed line-clamp-2">{s.reason}</p>
            </div>
            <button className="shrink-0 rounded-lg bg-amber/15 border border-amber/20 px-2.5 py-1.5 text-[10px] font-medium text-amber hover:bg-amber/25 transition-colors whitespace-nowrap">
              Add to Calendar
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function EventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Workshops, Courses & <span className="italic">Events</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Community programming, skill-building, and celebrations
        </p>
      </div>

      {/* Stats row */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5">
                <s.icon size={14} weight="fill" className="text-amber" />
              </div>
            </div>
            <div className="text-xl font-semibold text-white lg:text-2xl">{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Featured Event hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-amber/10 via-white/[0.04] to-mauve/10 p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-block rounded-full bg-amber/15 px-3 py-1 text-[11px] font-medium text-amber">
              Featured Event
            </span>
            <h2 className="font-serif text-2xl font-light text-white lg:text-3xl">
              Summer Solstice <span className="italic">Celebration</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1"><CalendarBlank size={12} /> June 21, 2026</span>
              <span className="flex items-center gap-1"><Clock size={12} /> All Day</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> Main Grounds</span>
              <span className="flex items-center gap-1"><User size={12} /> Facilitator: Mike G.</span>
            </div>
            <p className="max-w-xl text-sm text-white/50 leading-relaxed">
              Join us for our annual celebration of the longest day — music, feasting, ceremony, and community.
            </p>
          </div>
          <div className="shrink-0 text-center lg:text-right">
            <div className="text-xl font-semibold text-white lg:text-2xl">86 / 120</div>
            <div className="text-xs text-white/40 mb-2">Registered</div>
            <div className="h-2 w-40 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-amber" style={{ width: `${(86 / 120) * 100}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendar + Event Type Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] xl:gap-6">
        {/* Monthly Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">June 2026</h2>
          <CalendarGrid />
        </motion.div>

        {/* Event Type Breakdown donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">Event Type Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {typeBreakdown.map((_, i) => (
                  <Cell key={i} fill={pieColors[i]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {typeBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-white/50">{item.name}</span>
                </span>
                <span className="text-white/70 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events — visual card grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">Upcoming Events</h2>
          <span className="text-[11px] text-white/30">{upcomingEvents.length} events this month</span>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          {upcomingEvents.map((ev) => (
            <motion.div key={ev.title} variants={fadeUp}>
              <EventCard ev={ev} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* AI Event Planner */}
      <AiEventPlanner />

      {/* Course Catalog */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.48 }}
      >
        <h2 className="text-sm font-medium text-white mb-4">Course Catalog</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 space-y-3"
            >
              <h3 className="text-sm font-medium text-white">{c.title}</h3>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <User size={12} /> {c.instructor}
                <span className="text-white/15">|</span>
                {c.weeks} weeks
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/30">Enrolled</span>
                    <span className="text-[10px] text-white/50">{c.enrolled}/{c.capacity}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#38387F]"
                      style={{ width: `${(c.enrolled / c.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                <Stars rating={c.rating} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
