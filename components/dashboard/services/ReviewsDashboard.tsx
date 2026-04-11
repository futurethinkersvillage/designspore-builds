const reviews = [
  { name: "James R.", stars: 5, platform: "Google", date: "Apr 10", text: "Called them at 8am for an emergency, they were at my house by 10. Fixed the issue quickly and cleaned up after themselves. Will absolutely use again.", responded: true },
  { name: "Linda H.", stars: 5, platform: "Google", date: "Apr 8", text: "Very professional and knowledgeable. Gave me a fair quote upfront and stuck to it. Highly recommend to anyone in Clearwater.", responded: true },
  { name: "Tom B.", stars: 4, platform: "Facebook", date: "Apr 6", text: "Good work overall. Arrived on time, explained everything clearly. Only docking one star because the wait time was a bit long for a non-emergency call.", responded: true },
  { name: "Maria S.", stars: 5, platform: "Google", date: "Apr 3", text: "These guys saved us! Hot water tank died on a Friday evening. They came Saturday morning and had a new one installed by noon. Lifesavers.", responded: false },
  { name: "Kevin P.", stars: 5, platform: "Google", date: "Apr 1", text: "Third time using them and they never disappoint. Always on time, always professional. The best in town.", responded: true },
  { name: "Carla W.", stars: 4, platform: "Facebook", date: "Mar 29", text: "Solid service. Did a full bathroom re-pipe and it went smoothly. Kept me informed throughout.", responded: false },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-sm ${i <= count ? "text-gold" : "text-white/15"}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsDashboard() {
  const platforms = [
    { name: "Google", rating: "4.9", count: 47, color: "text-gold" },
    { name: "Facebook", rating: "4.7", count: 18, color: "text-blue-300" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Review Generation System</p>
        <h1 className="text-2xl font-bold text-white">Reputation Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "New reviews this month", value: "12" },
          { label: "Overall average rating", value: "4.8 ★" },
          { label: "Review requests sent", value: "38" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-2 gap-4">
        {platforms.map(({ name, rating, count, color }) => (
          <div key={name} className="bg-raised border border-white/[0.06] rounded-2xl p-6 flex items-center gap-5">
            <div className={`text-4xl font-bold tabular-nums ${color}`}>{rating}</div>
            <div>
              <p className="text-white font-semibold">{name}</p>
              <Stars count={Math.round(parseFloat(rating))} />
              <p className="text-xs text-white/30 mt-1">{count} reviews total</p>
            </div>
          </div>
        ))}
      </div>

      {/* Review feed */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <p className="text-sm font-semibold text-white">Recent Reviews</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {reviews.map((r, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-white/60 shrink-0">
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  <Stars count={r.stars} />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.platform === "Google" ? "bg-gold/10 text-gold border-gold/20" : "bg-blue-500/10 text-blue-300 border-blue-500/20"}`}>
                    {r.platform}
                  </span>
                  <span className="text-[11px] text-white/25">{r.date}</span>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">{r.text}</p>
              </div>
              <div className="shrink-0">
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${r.responded ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"}`}>
                  {r.responded ? "Responded" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
