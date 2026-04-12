"use client";

import { motion } from "framer-motion";
import {
  CalendarBlank, Star, Users, ChartPie, TrendUp,
  MapPin, Clock, User,
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
  { type: "Ceremony", title: "Full Moon Gathering", date: "Jun 14", time: "8:00 PM", location: "Fire Circle", facilitator: "Euvie I.", registered: 28, capacity: 40 },
  { type: "Workshop", title: "Permaculture Workshop", date: "Jun 16", time: "9:00 AM", location: "Garden Pavilion", facilitator: "Elena V.", registered: 18, capacity: 25 },
  { type: "Social", title: "Community Dinner", date: "Jun 18", time: "6:00 PM", location: "Main Gazebo", facilitator: "Yuki T.", registered: 45, capacity: 60 },
  { type: "Wellness", title: "Yoga Sunrise", date: "Jun 19", time: "6:00 AM", location: "Lake Deck", facilitator: "Rachel K.", registered: 12, capacity: 20 },
  { type: "Workshop", title: "Maker Night", date: "Jun 21", time: "7:00 PM", location: "Workshop", facilitator: "Marcus R.", registered: 22, capacity: 30 },
  { type: "Social", title: "Storytelling Circle", date: "Jun 22", time: "8:00 PM", location: "Fire Circle", facilitator: "Sophia R.", registered: 15, capacity: 25 },
  { type: "Wellness", title: "Forest Bathing", date: "Jun 24", time: "7:00 AM", location: "North Trail", facilitator: "Ben M.", registered: 8, capacity: 15 },
  { type: "Social", title: "Kids Adventure Day", date: "Jun 25", time: "10:00 AM", location: "Playground", facilitator: "Lena B.", registered: 20, capacity: 20 },
  { type: "Social", title: "Live Music Night", date: "Jun 27", time: "7:00 PM", location: "Main Gazebo", facilitator: "Chris D.", registered: 35, capacity: 50 },
  { type: "Wellness", title: "Sauna Social", date: "Jun 28", time: "6:00 PM", location: "Sauna", facilitator: "Ingrid L.", registered: 10, capacity: 12 },
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
  Workshop: "bg-[#38387F]/20 text-blue-400",
  Social: "bg-amber/20 text-amber",
  Ceremony: "bg-mauve/20 text-mauve",
  Wellness: "bg-emerald-500/20 text-emerald-400",
  Work: "bg-[#AF695E]/20 text-[#AF695E]",
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
          weight={n <= Math.floor(rating) ? "fill" : n - rating < 1 ? "fill" : "regular"}
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
  // June 2026 starts on Monday (day 1 = Mon)
  const daysInMonth = 30;
  const startDow = 0; // Monday-indexed: Mon=0
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
      {/* Legend */}
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

      {/* Upcoming Events list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
      >
        <h2 className="text-sm font-medium text-white mb-4">Upcoming Events</h2>
        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-[100px_1fr_120px_130px_110px_140px] gap-2 pb-2 border-b border-white/[0.04]">
          {["Type", "Event", "Date & Time", "Location", "Facilitator", "Registration"].map((h) => (
            <span key={h} className="text-xs uppercase text-white/30">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-white/[0.04]">
          {upcomingEvents.map((ev, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[100px_1fr_120px_130px_110px_140px] gap-2 items-center py-3"
            >
              <span className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium ${typeBadge[ev.type]}`}>
                {ev.type}
              </span>
              <span className="text-xs text-white/80 font-medium">{ev.title}</span>
              <span className="text-xs text-white/40">{ev.date}, {ev.time}</span>
              <span className="text-xs text-white/40 flex items-center gap-1"><MapPin size={10} />{ev.location}</span>
              <span className="text-xs text-white/40">{ev.facilitator}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber/70"
                    style={{ width: `${(ev.registered / ev.capacity) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/40 whitespace-nowrap">
                  {ev.registered}/{ev.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Course Catalog */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
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
