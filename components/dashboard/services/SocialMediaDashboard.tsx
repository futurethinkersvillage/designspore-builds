"use client";

import { useState } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = [7, 8, 9, 10, 11, 12, 13];

const scheduledPosts: Record<number, { platform: string; preview: string }[]> = {
  7:  [{ platform: "Facebook", preview: "Spring tune-up reminder — book your HVAC service before the heat hits." }],
  9:  [{ platform: "Instagram", preview: "Before & after: water heater replacement in Langford. Clean install, same-day service." }, { platform: "GMB", preview: "We're available 7 days a week for emergency calls. No extra charge for weekends." }],
  11: [{ platform: "Facebook", preview: "Customer shoutout: 'Called at 8am, fixed by 10. Absolute legends.'" }],
  12: [{ platform: "Instagram", preview: "Behind the scenes: stocking the van for a big commercial job this week." }],
  13: [{ platform: "GMB", preview: "Looking for a plumber in Clearwater? We service the whole Thompson region." }],
};

const drafts = [
  { id: 1, caption: "Spring is the perfect time to check your water heater. Most units last 8–12 years — is yours overdue? Book a free inspection this month. 🔧", platforms: ["Facebook", "GMB"], status: "ready" },
  { id: 2, caption: "Did you know? A leaking faucet can waste up to 20 gallons of water per day. Quick fix, big savings. Call us today.", platforms: ["Instagram", "Facebook"], status: "ready" },
  { id: 3, caption: "We just wrapped a full bathroom renovation in Kamloops. Swipe to see the transformation. DM us for a quote on your project.", platforms: ["Instagram"], status: "needs-photo" },
  { id: 4, caption: "Frozen pipes are no joke. Here's what to do (and NOT do) if you find one this spring. Link in bio for our full guide.", platforms: ["Facebook"], status: "ready" },
];

const analyticsData = [
  { platform: "Facebook", posts: 8, engagements: 412, reach: 3240, followers: 847 },
  { platform: "Instagram", posts: 5, engagements: 318, reach: 2100, followers: 512 },
  { platform: "GMB", posts: 4, engagements: 117, reach: 890, followers: null },
];

const platformStyle: Record<string, string> = {
  Facebook: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Instagram: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  GMB: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

const draftStatusStyle: Record<string, string> = {
  ready: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "needs-photo": "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
};

const tabs = ["Calendar", "Drafts", "Analytics"] as const;
type Tab = typeof tabs[number];

export default function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Calendar");
  const [selectedDay, setSelectedDay] = useState<number | null>(9);

  const todayIdx = 3; // Thursday = Apr 10

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Social Media Manager</p>
        <h1 className="text-2xl font-bold text-white">Social Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Posts This Month", value: "17", delta: "+5 vs last month", up: true },
          { label: "Total Engagements", value: "847", delta: "+12% vs last month", up: true },
          { label: "Platforms Connected", value: "3", delta: "Facebook · Instagram · GMB", up: null },
        ].map(({ label, value, delta, up }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
            <p className={`text-xs mt-1.5 ${up === true ? "text-emerald-400" : up === false ? "text-red-400" : "text-white/30"}`}>{delta}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-raised border border-white/[0.06] rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-gold/[0.12] text-gold" : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Calendar tab */}
      {activeTab === "Calendar" && (
        <div className="space-y-4">
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Week of Apr 7–13</p>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => {
                const date = weekDates[i];
                const posts = scheduledPosts[date];
                const isToday = i === todayIdx;
                const isSelected = selectedDay === date;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(posts ? date : null)}
                    className={`rounded-xl p-3 text-center transition-colors ${
                      isSelected ? "bg-gold/[0.12] border border-gold/20" : "bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05]"
                    }`}
                  >
                    <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1.5 ${isToday ? "text-gold" : "text-white/30"}`}>{day}</p>
                    <p className={`text-lg font-bold tabular-nums ${isToday ? "text-gold" : "text-white/70"}`}>{date}</p>
                    {posts && (
                      <div className="flex justify-center gap-0.5 mt-2">
                        {posts.map((p, pi) => (
                          <span key={pi} className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDay && scheduledPosts[selectedDay] && (
            <div className="space-y-3">
              {scheduledPosts[selectedDay].map((post, i) => (
                <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformStyle[post.platform]}`}>{post.platform}</span>
                    <span className="text-[11px] text-white/30">Apr {selectedDay} · Scheduled</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{post.preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drafts tab */}
      {activeTab === "Drafts" && (
        <div className="space-y-3">
          {drafts.map(draft => (
            <div key={draft.id} className="bg-raised border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {draft.platforms.map(p => (
                      <span key={p} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformStyle[p]}`}>{p}</span>
                    ))}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${draftStatusStyle[draft.status]}`}>
                      {draft.status === "ready" ? "Ready to post" : "Needs photo"}
                    </span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{draft.caption}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-gold/[0.12] text-gold hover:bg-gold/[0.18] transition-colors font-medium">
                    Approve
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white/70 hover:bg-white/[0.08] transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics tab */}
      {activeTab === "Analytics" && (
        <div className="space-y-4">
          <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Platform Breakdown — Last 30 Days</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Platform", "Posts", "Engagements", "Reach", "Followers"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {analyticsData.map(row => (
                  <tr key={row.platform} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformStyle[row.platform]}`}>{row.platform}</span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/60 tabular-nums">{row.posts}</td>
                    <td className="px-6 py-3.5 text-sm text-white/60 tabular-nums">{row.engagements.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-sm text-white/60 tabular-nums">{row.reach.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40 tabular-nums">{row.followers?.toLocaleString() ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top post */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-5">
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Top Performing Post This Month</p>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformStyle["Facebook"]}`}>Facebook</span>
              <span className="text-[11px] text-white/30">Apr 3</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-3">"Just finished a same-day emergency call at 9pm. Came home to a flooded basement, left with a dry one. That's the job."</p>
            <div className="flex gap-6">
              {[["Reach", "2,847"], ["Likes", "94"], ["Comments", "23"], ["Shares", "31"]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-base font-bold text-white tabular-nums">{val}</p>
                  <p className="text-[11px] text-white/30">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
