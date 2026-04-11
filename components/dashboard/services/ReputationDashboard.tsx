const feed = [
  { name: "James R.", platform: "Google", stars: 5, text: "Called them at 8am for an emergency, they were at my house by 10. Fixed the issue quickly and cleaned up after themselves.", date: "Apr 10", status: "responded" },
  { name: "Linda H.", platform: "Google", stars: 5, text: "Very professional and knowledgeable. Gave me a fair quote upfront and stuck to it. Highly recommend.", date: "Apr 8", status: "responded" },
  { name: "Tom B.", platform: "Facebook", stars: 4, text: "Good work overall. Arrived on time, explained everything clearly. Wait time for non-emergency was a bit long.", date: "Apr 6", status: "pending" },
  { name: "Maria S.", platform: "Google", stars: 5, text: "These guys saved us! Hot water tank died on a Friday evening. They came Saturday morning and had it sorted by noon.", date: "Apr 3", status: "in-progress" },
  { name: "Anonymous", platform: "Yelp", stars: 3, text: "Work was fine but took longer than quoted. Communication could have been better.", date: "Apr 1", status: "pending" },
  { name: "Kevin P.", platform: "Google", stars: 5, text: "Third time using them and they never disappoint. Always on time, always professional.", date: "Mar 29", status: "responded" },
];

const platformStyle: Record<string, string> = {
  Google: "bg-gold/10 text-gold border-gold/20",
  Facebook: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Yelp: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusStyle: Record<string, string> = {
  responded: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  "in-progress": "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

const statusLabel: Record<string, string> = {
  responded: "Responded",
  pending: "Needs Response",
  "in-progress": "In Progress",
};

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= count ? "text-gold" : "text-white/15"}`}>★</span>
      ))}
    </span>
  );
}

export default function ReputationDashboard() {
  const platforms = [
    { name: "Google", rating: "4.9", count: 47 },
    { name: "Facebook", rating: "4.7", count: 18 },
    { name: "Yelp", rating: "4.2", count: 11 },
  ];

  const pendingCount = feed.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Reputation Management</p>
        <h1 className="text-2xl font-bold text-white">Review Monitor</h1>
      </div>

      {/* Platform scores */}
      <div className="grid grid-cols-3 gap-4">
        {platforms.map(({ name, rating, count }) => (
          <div key={name} className="bg-card border border-white/[0.07] rounded-2xl p-5 text-center">
            <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${platformStyle[name]}`}>{name}</span>
            <p className="text-3xl font-bold text-white tabular-nums">{rating}<span className="text-white/30 text-lg"> ★</span></p>
            <p className="text-xs text-white/30 mt-1">{count} reviews</p>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-yellow-500/[0.06] border border-yellow-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <p className="text-sm text-white/70">
            <span className="text-yellow-300 font-semibold">{pendingCount} reviews</span> need a response. Mike will draft and post on your behalf within 24 hours.
          </p>
        </div>
      )}

      {/* Review feed */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Review Feed</p>
          <span className="text-xs text-white/30">All platforms · Last 30 days</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {feed.map((r, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-white/50 shrink-0">
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  <Stars count={r.stars} />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformStyle[r.platform]}`}>{r.platform}</span>
                  <span className="text-[11px] text-white/25">{r.date}</span>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">{r.text}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle[r.status]}`}>
                {statusLabel[r.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
