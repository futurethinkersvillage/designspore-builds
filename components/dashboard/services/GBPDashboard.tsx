"use client";

import { useState } from "react";

const completenessItems = [
  { label: "Business name", done: true },
  { label: "Phone number", done: true },
  { label: "Website URL", done: true },
  { label: "Business hours", done: true },
  { label: "Business description", done: true },
  { label: "Primary category", done: true },
  { label: "Service area defined", done: true },
  { label: "At least 10 photos", done: false },
  { label: "Products/services listed", done: false },
  { label: "Questions answered (Q&A)", done: false },
];

const posts = [
  { title: "Spring HVAC Tune-Up Special", body: "Book your spring tune-up before May 1st and save $40. Our technicians are fully certified and available 7 days a week.", date: "Apr 7", status: "published", type: "Offer" },
  { title: "New Service: Tankless Water Heater Installation", body: "We now offer full tankless water heater installations. Endless hot water, lower energy bills. Call for a free quote.", date: "Mar 29", status: "published", type: "Update" },
  { title: "Emergency Plumbing — Available 24/7", body: "Burst pipe? Flooding? We're on call around the clock. No emergency surcharge on weekends.", date: "Mar 21", status: "published", type: "Update" },
  { title: "April Maintenance Reminder", body: "Don't forget: spring is the best time to flush your water heater and check your outdoor taps. Book a checkup today.", date: "Apr 12", status: "scheduled", type: "Update" },
];

const photos = [
  { label: "Exterior", count: 3, category: "exterior" },
  { label: "Interior", count: 2, category: "interior" },
  { label: "Team", count: 4, category: "team" },
  { label: "Work / Projects", count: 6, category: "work" },
  { label: "Products", count: 1, category: "products" },
  { label: "Logo", count: 1, category: "logo" },
];

const qa = [
  {
    question: "Do you offer free estimates?",
    answer: "Yes — we provide free estimates for all non-emergency work. Call or fill out our contact form to schedule a visit.",
    status: "published",
    askedDate: "Mar 15",
  },
  {
    question: "What areas do you service?",
    answer: "We service Clearwater, Kamloops, Barriere, and the surrounding Thompson region. Call us if you're unsure if we cover your area.",
    status: "published",
    askedDate: "Mar 8",
  },
  {
    question: "Are you available on weekends?",
    answer: null,
    status: "unanswered",
    askedDate: "Apr 5",
  },
  {
    question: "Do you work on commercial properties?",
    answer: null,
    status: "unanswered",
    askedDate: "Apr 9",
  },
];

const tabs = ["Posts", "Photos", "Q&A"] as const;
type Tab = typeof tabs[number];

const postStatusStyle: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  scheduled: "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

const postTypeStyle: Record<string, string> = {
  Offer: "bg-gold/10 text-gold border-gold/20",
  Update: "bg-white/[0.05] text-white/50 border-white/[0.08]",
};

const score = 87;
const doneCount = completenessItems.filter(i => i.done).length;

export default function GBPDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Posts");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Google Business Profile</p>
        <h1 className="text-2xl font-bold text-white">GBP Manager</h1>
      </div>

      {/* Completeness + Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-white/[0.07] rounded-2xl p-5 col-span-1">
          <p className="text-xs text-white/40 mb-2">Profile Score</p>
          <p className="text-3xl font-bold tabular-nums" style={{ color: score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171" }}>
            {score}<span className="text-white/20 text-lg">/100</span>
          </p>
          <p className="text-xs text-white/30 mt-1.5">{doneCount}/{completenessItems.length} items complete</p>
        </div>
        {[
          { label: "Profile Views", value: "312", delta: "+18% this month", up: true },
          { label: "Direction Requests", value: "47", delta: "+9 vs last month", up: true },
          { label: "Calls from GBP", value: "28", delta: "This month", up: null },
        ].map(({ label, value, delta, up }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
            <p className={`text-xs mt-1.5 ${up === true ? "text-emerald-400" : up === false ? "text-red-400" : "text-white/30"}`}>{delta}</p>
          </div>
        ))}
      </div>

      {/* Completeness checklist */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-5">
        <p className="text-sm font-semibold text-white mb-3">Profile Completeness</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {completenessItems.map(item => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className={`text-sm ${item.done ? "text-emerald-400" : "text-white/20"}`}>{item.done ? "✓" : "○"}</span>
              <span className={`text-sm ${item.done ? "text-white/60" : "text-white/35"}`}>{item.label}</span>
            </div>
          ))}
        </div>
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

      {/* Posts tab */}
      {activeTab === "Posts" && (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-semibold text-white">{post.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${postTypeStyle[post.type]}`}>{post.type}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${postStatusStyle[post.status]}`}>{post.status}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{post.body}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0 mt-1">{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photos tab */}
      {activeTab === "Photos" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {photos.map(({ label, count }) => (
              <div key={label} className="bg-raised border border-white/[0.06] rounded-2xl p-4 text-center">
                <div className="w-full h-24 bg-white/[0.04] border border-white/[0.05] rounded-xl mb-3 flex items-center justify-center">
                  <span className="text-xs text-white/20">{label}</span>
                </div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-white/30">{count} photo{count !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-500/[0.05] border border-blue-500/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
            <p className="text-sm text-white/60">Profiles with 10+ photos receive <span className="text-blue-300 font-medium">35% more clicks</span>. The AI will prompt you to upload more photos this month.</p>
          </div>
        </div>
      )}

      {/* Q&A tab */}
      {activeTab === "Q&A" && (
        <div className="space-y-3">
          {qa.map((item, i) => (
            <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{item.question}</p>
                  <p className="text-[11px] text-white/25">Asked {item.askedDate}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                  item.status === "published"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                }`}>
                  {item.status === "published" ? "Answered" : "Needs Response"}
                </span>
              </div>
              {item.answer ? (
                <p className="text-sm text-white/50 leading-relaxed pl-3 border-l border-white/[0.08]">{item.answer}</p>
              ) : (
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                  <p className="text-xs text-white/30 mb-2">AI-drafted response:</p>
                  <p className="text-sm text-white/50 italic leading-relaxed">
                    {i === 2
                      ? "Yes! We're available 7 days a week including weekends. There's no extra charge for weekend appointments — just give us a call to book."
                      : "Yes, we handle both residential and commercial plumbing and HVAC work. Contact us to discuss your commercial project and we'll provide a tailored quote."}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-gold/[0.12] text-gold hover:bg-gold/[0.18] transition-colors font-medium">Publish</button>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white/70 transition-colors">Edit</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
