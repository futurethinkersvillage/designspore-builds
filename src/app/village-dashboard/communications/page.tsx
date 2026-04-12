"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChatTeardrop, EnvelopeSimple, Megaphone, Eye,
  CursorClick, UsersThree, ArrowUp, TrendUp,
  Bell, Clock, WarningCircle, Info, CheckCircle,
  House, PaperPlaneTilt,
} from "@phosphor-icons/react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const stats = [
  { label: "Newsletter Open Rate", value: "64%", trend: "+3%", icon: Eye },
  { label: "Click-Through Rate", value: "12%", trend: "+1.2%", icon: CursorClick },
  { label: "Subscribers", value: "1,240", trend: "+8%", icon: UsersThree },
  { label: "Announcements/mo", value: "12", trend: "+2", icon: Megaphone },
];

const announcements = [
  { title: "Summer Solstice Schedule Released", body: "Full program for June 21 celebration now available. Sign up for workshops by June 15.", author: "Mike G.", date: "Jun 10", priority: "high", read: false },
  { title: "New Sauna Hours — Extended Evenings", body: "Sauna will now be open until 10pm on weekdays due to popular demand.", author: "Ben M.", date: "Jun 9", priority: "normal", read: false },
  { title: "Trail Closure: North Loop Section B", body: "Temporary closure for erosion repair. Expected to reopen by June 18.", author: "Marcus R.", date: "Jun 8", priority: "warning", read: true },
  { title: "Work-Stay Applications Now Open", body: "Fall 2026 cohort applications are live. Deadline August 1.", author: "Sarah C.", date: "Jun 7", priority: "high", read: true },
  { title: "Community Vote Results: Solar Expansion", body: "Proposal passed with 89% approval. Phase 2 construction begins July.", author: "Elena V.", date: "Jun 5", priority: "normal", read: true },
  { title: "Farm Harvest Day — Volunteers Welcome", body: "Join us Saturday for the first major harvest. Lunch provided.", author: "Elena V.", date: "Jun 4", priority: "normal", read: true },
  { title: "WiFi Upgrade Complete — All Zones", body: "Mesh network now covers all buildings and outdoor common areas.", author: "Anika P.", date: "Jun 2", priority: "normal", read: true },
  { title: "Emergency Contact List Updated", body: "New contacts for summer season posted at all information boards.", author: "Ingrid L.", date: "Jun 1", priority: "normal", read: true },
];

const subscriberGrowth = [
  { month: "Jul", subscribers: 820 }, { month: "Aug", subscribers: 870 },
  { month: "Sep", subscribers: 910 }, { month: "Oct", subscribers: 945 },
  { month: "Nov", subscribers: 980 }, { month: "Dec", subscribers: 1005 },
  { month: "Jan", subscribers: 1030 }, { month: "Feb", subscribers: 1065 },
  { month: "Mar", subscribers: 1105 }, { month: "Apr", subscribers: 1150 },
  { month: "May", subscribers: 1195 }, { month: "Jun", subscribers: 1240 },
];

const channelActivity = [
  { channel: "Slack", messages: 423, color: "#EA824E" },
  { channel: "Email", messages: 87, color: "#38387F" },
  { channel: "Boards", messages: 14, color: "#73516F" },
];

const sentiment = [
  { name: "Positive", value: 62, color: "#34d399" },
  { name: "Neutral", value: 30, color: "#60a5fa" },
  { name: "Concerns", value: 8, color: "#AF695E" },
];

const scheduledComms = [
  { title: "Weekly Digest", date: "Every Monday", type: "Newsletter" },
  { title: "Town Hall", date: "Jun 15, 7pm", type: "Meeting" },
  { title: "Monthly Report", date: "Jul 1", type: "Newsletter" },
  { title: "Quarterly Review", date: "Jul 5, 6pm", type: "Meeting" },
  { title: "Investor Update", date: "Jun 30", type: "Email" },
];

/* ── Chat data ────────────────────────────────────────────────────── */

const channels = {
  community: [
    { id: "general", label: "general" },
    { id: "announcements", label: "announcements" },
    { id: "events", label: "events" },
    { id: "marketplace", label: "marketplace" },
  ],
  workingGroups: [
    { id: "farm-team", label: "farm-team" },
    { id: "build-crew", label: "build-crew" },
    { id: "wellness", label: "wellness" },
    { id: "governance", label: "governance" },
  ],
};

const channelDescriptions: Record<string, string> = {
  "general": "Village-wide conversation",
  "announcements": "Official village announcements",
  "events": "Upcoming events and signups",
  "marketplace": "Goods, skills, and barter",
  "farm-team": "Farming, planting, and harvest",
  "build-crew": "Construction and maintenance",
  "wellness": "Yoga, sauna, and health",
  "governance": "Decisions and proposals",
};

type Reaction = { emoji: string; count: number };

type Message = {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  time: string;
  content: string;
  reactions?: Reaction[];
};

const generalMessages: Message[] = [
  {
    id: 1,
    author: "Elena V.",
    initials: "EV",
    avatarColor: "bg-emerald-700",
    time: "9:14 AM",
    content: "Good morning! Harvest day in Plot C starting at 9am, volunteers welcome 🌱",
    reactions: [{ emoji: "🌱", count: 5 }, { emoji: "👍", count: 3 }],
  },
  {
    id: 2,
    author: "Marcus R.",
    initials: "MR",
    avatarColor: "bg-blue-700",
    time: "9:22 AM",
    content: "Solar panel install team meeting at the workshop at 10, bring your coffee ☀️",
    reactions: [{ emoji: "☀️", count: 4 }],
  },
  {
    id: 3,
    author: "Yuki T.",
    initials: "YT",
    avatarColor: "bg-violet-700",
    time: "10:05 AM",
    content: "Lunch today: fresh tomato soup + sourdough from Hannah's batch. Come hungry!",
    reactions: [{ emoji: "😍", count: 8 }, { emoji: "🍞", count: 3 }],
  },
  {
    id: 4,
    author: "Ben M.",
    initials: "BM",
    avatarColor: "bg-amber-700",
    time: "10:31 AM",
    content: "Trail loop B is clear again, erosion repair finished ahead of schedule 🎉",
    reactions: [{ emoji: "🎉", count: 6 }, { emoji: "👍", count: 4 }],
  },
  {
    id: 5,
    author: "Anika P.",
    initials: "AP",
    avatarColor: "bg-rose-700",
    time: "11:00 AM",
    content: "WiFi signal in Cabin 7 upgraded — should be solid now. Let me know if issues",
    reactions: [{ emoji: "🙌", count: 2 }],
  },
  {
    id: 6,
    author: "Sarah C.",
    initials: "SC",
    avatarColor: "bg-teal-700",
    time: "11:45 AM",
    content: "Reminder: Town Hall tonight 7pm at the Main Gazebo. Summer program agenda",
    reactions: [{ emoji: "📌", count: 7 }],
  },
  {
    id: 7,
    author: "Mike G.",
    initials: "MG",
    avatarColor: "bg-orange-700",
    time: "12:10 PM",
    content: "Beautiful day for it. Sauna is fired up for the afternoon session 🔥",
    reactions: [{ emoji: "🔥", count: 9 }, { emoji: "😌", count: 3 }],
  },
  {
    id: 8,
    author: "Rachel K.",
    initials: "RK",
    avatarColor: "bg-indigo-700",
    time: "2:30 PM",
    content: "Yoga tomorrow 6am on the lake deck, weather looks perfect. 8 spots left",
    reactions: [{ emoji: "🧘", count: 5 }, { emoji: "🌅", count: 2 }],
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

const priorityStyles: Record<string, string> = {
  high: "bg-amber/15 text-amber",
  warning: "bg-red-500/15 text-red-400",
  normal: "bg-white/10 text-white/50",
};

const priorityIcons: Record<string, typeof Bell> = {
  high: Bell,
  warning: WarningCircle,
  normal: Info,
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-white">{p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function CommunicationsPage() {
  const [activeChannel, setActiveChannel] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Communications <span className="italic">Hub</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">Announcements, newsletters, and community engagement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={14} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400"><ArrowUp size={10} weight="bold" /> {s.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Community Chat */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]" style={{ minHeight: 520 }}>

          {/* Left sidebar */}
          <div className="bg-white/[0.03] border-b border-white/[0.06] lg:border-b-0 lg:border-r lg:border-white/[0.06] flex flex-col">
            {/* Sidebar header */}
            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
              <div className="rounded-lg bg-amber/15 p-1.5">
                <House size={15} weight="fill" className="text-amber" />
              </div>
              <span className="text-sm font-semibold text-white">Village OS</span>
            </div>

            {/* Channel list */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              {/* Community section */}
              <div>
                <p className="px-2 mb-1 text-[10px] font-semibold tracking-widest text-white/30 uppercase">Community</p>
                {channels.community.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors text-left ${
                      activeChannel === ch.id
                        ? "bg-amber/15 text-amber font-medium"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-white/25 text-base leading-none">#</span>
                    {ch.label}
                  </button>
                ))}
              </div>

              {/* Working Groups section */}
              <div>
                <p className="px-2 mb-1 text-[10px] font-semibold tracking-widest text-white/30 uppercase">Working Groups</p>
                {channels.workingGroups.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors text-left ${
                      activeChannel === ch.id
                        ? "bg-amber/15 text-amber font-medium"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-white/25 text-base leading-none">#</span>
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Online count */}
            <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black/30" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black/30" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black/30" />
              </div>
              <span className="text-xs text-white/35">12 members online</span>
            </div>
          </div>

          {/* Right chat area */}
          <div className="flex flex-col">
            {/* Channel header */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
              <span className="text-white/30 text-lg leading-none">#</span>
              <span className="text-sm font-semibold text-white">{activeChannel}</span>
              <span className="text-white/20 mx-1">—</span>
              <span className="text-xs text-white/40">{channelDescriptions[activeChannel] ?? "Channel"}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 max-h-[480px] scrollbar-thin scrollbar-thumb-white/10">
              {/* Date separator */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-medium text-white/25 uppercase tracking-widest">Today</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {activeChannel === "general" ? (
                generalMessages.map((msg) => (
                  <div key={msg.id} className="group flex items-start gap-3 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                    {/* Avatar */}
                    <div className={`shrink-0 w-8 h-8 rounded-full ${msg.avatarColor} flex items-center justify-center text-[11px] font-semibold text-white/90`}>
                      {msg.initials}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-white/80">{msg.author}</span>
                        <span className="text-[10px] text-white/25">{msg.time}</span>
                      </div>
                      <p className="text-sm text-white/60 mt-0.5 leading-relaxed">{msg.content}</p>
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {msg.reactions.map((r, ri) => (
                            <button
                              key={ri}
                              className="flex items-center gap-1 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] px-2 py-0.5 text-xs text-white/60 transition-colors"
                            >
                              <span>{r.emoji}</span>
                              <span className="text-[10px] text-white/40">{r.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
                    <ChatTeardrop size={18} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/30">No messages yet in <span className="text-white/50">#{activeChannel}</span></p>
                  <p className="text-xs text-white/20 mt-1">Be the first to start a conversation</p>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="px-5 py-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-2.5">
                <input
                  type="text"
                  placeholder={`Message #${activeChannel}…`}
                  className="flex-1 bg-transparent text-sm text-white/70 placeholder:text-white/25 outline-none"
                  readOnly
                />
                <button className="shrink-0 rounded-lg bg-amber/20 hover:bg-amber/30 p-1.5 transition-colors">
                  <PaperPlaneTilt size={14} weight="fill" className="text-amber" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Announcements + Scheduled */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Announcements feed */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Recent Announcements</h2>
            <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-medium text-amber">2 unread</span>
          </div>
          <div className="space-y-0">
            {announcements.map((a, i) => {
              const PIcon = priorityIcons[a.priority];
              return (
                <div key={i} className={`flex items-start gap-3 py-3.5 border-b border-white/[0.04] last:border-0 ${!a.read ? "bg-white/[0.02] -mx-2 px-2 rounded-lg" : ""}`}>
                  <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${priorityStyles[a.priority]}`}>
                    <PIcon size={12} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80 font-medium">{a.title}</span>
                      {!a.read && <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{a.body}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-white/25">{a.author}</span>
                      <span className="text-[10px] text-white/25">{a.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Scheduled */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Scheduled</h2>
            <Clock size={14} className="text-white/25" />
          </div>
          <div className="space-y-0">
            {scheduledComms.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  s.type === "Newsletter" ? "bg-amber/15 text-amber" :
                  s.type === "Meeting" ? "bg-indigo/15 text-blue-400" :
                  "bg-white/10 text-white/50"
                }`}>{s.type}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/70">{s.title}</div>
                  <div className="text-[10px] text-white/30">{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Subscriber growth */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Subscriber Growth</h2>
          <p className="text-xs text-white/30 mb-3">1,240 subscribers</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={subscriberGrowth}>
              <defs>
                <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA824E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EA824E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="subscribers" stroke="#EA824E" strokeWidth={2} fill="url(#subGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Channel activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Channel Activity</h2>
          <p className="text-xs text-white/30 mb-3">Messages per week</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={channelActivity} layout="vertical">
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="channel" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="messages" radius={[0, 6, 6, 0]}>
                {channelActivity.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sentiment */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Community Sentiment</h2>
          <p className="text-xs text-white/30 mb-3">Based on discussion analysis</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={sentiment} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                {sentiment.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {sentiment.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-white/50">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.name} ({s.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
