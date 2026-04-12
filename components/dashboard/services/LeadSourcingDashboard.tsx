const leads = [
  { name: "Amanda Cole", company: "Cole Property Management", title: "Property Manager", email: "a.cole@••••.ca", phone: "250-555-••••", score: 9, status: "Qualified" },
  { name: "Brian Tanner", company: "Tanner Construction", title: "Owner", email: "btanner@••••.com", phone: "778-••••", score: 8, status: "Replied" },
  { name: "Susan White", company: "Clearwater Motel", title: "Operations Manager", email: "s.white@••••.ca", phone: "250-555-••••", score: 8, status: "Replied" },
  { name: "Derek Moon", company: "Moon Rentals Ltd.", title: "Owner", email: "derek@••••.ca", phone: "250-••••", score: 7, status: "Contacted" },
  { name: "Karen Fields", company: "Fields & Associates", title: "Office Manager", email: "kfields@••••.com", phone: "604-555-••••", score: 7, status: "Contacted" },
  { name: "Paul Vance", company: "Vance Home Services", title: "Owner", email: "pvance@••••.ca", phone: "250-555-••••", score: 6, status: "Contacted" },
  { name: "Lena Marsh", company: "Marsh Real Estate", title: "Realtor", email: "lena@••••.ca", phone: "778-••••", score: 6, status: "New" },
  { name: "Tony Geller", company: "Geller Builds Inc.", title: "Project Manager", email: "t.geller@••••.com", phone: "250-••••", score: 5, status: "New" },
  { name: "Diane Chow", company: "Chow Hospitality Group", title: "GM", email: "dchow@••••.ca", phone: "604-555-••••", score: 5, status: "New" },
  { name: "Mark Ellis", company: "Ellis Mechanical", title: "Owner", email: "mark@••••.ca", phone: "250-••••", score: 4, status: "New" },
];

const statusStyle: Record<string, string> = {
  Qualified: "bg-gold/10 text-gold border-gold/20",
  Replied: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Contacted: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  New: "bg-white/[0.06] text-white/40 border-white/[0.08]",
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 8 ? "text-gold" : score >= 6 ? "text-blue-300" : "text-white/40";
  return <span className={`text-sm font-bold tabular-nums ${color}`}>{score}<span className="text-white/20 font-normal">/10</span></span>;
}

export default function LeadSourcingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Lead Sourcing System</p>
        <h1 className="text-2xl font-bold text-white">Lead Pipeline</h1>
      </div>

      {/* Search prompt */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
        <p className="text-sm font-semibold text-white mb-3">Find New Leads</p>
        <div className="flex gap-3">
          <input
            type="text"
            readOnly
            value="Property managers in Kamloops, BC with 10+ rental units"
            className="flex-1 bg-dark border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-gold/40 placeholder:text-white/25"
          />
          <button className="shrink-0 px-6 py-3 bg-gold text-dark text-sm font-bold rounded-xl hover:bg-gold-light transition-colors">
            Search Leads
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {["Property managers — Kamloops", "HVAC contractors — Thompson-Nicola", "Restaurant owners — Clearwater", "Real estate agents — BC Interior"].map(s => (
            <button key={s} className="text-[11px] text-white/35 border border-white/[0.06] rounded-full px-3 py-1.5 hover:text-white/60 hover:border-white/[0.12] transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total contacts", value: "547" },
          { label: "New this week", value: "23" },
          { label: "Replied", value: "12" },
          { label: "Qualified", value: "4" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Contact List</p>
          <span className="text-xs text-white/30">Filtered: All — 10 of 547 shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Name", "Company", "Title", "Email", "ICP Score", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/25 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-white">{lead.name}</td>
                  <td className="px-5 py-3.5 text-sm text-white/60">{lead.company}</td>
                  <td className="px-5 py-3.5 text-sm text-white/45">{lead.title}</td>
                  <td className="px-5 py-3.5 text-sm text-white/35 tabular-nums">{lead.email}</td>
                  <td className="px-5 py-3.5"><ScoreBadge score={lead.score} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-xs text-white/25">Showing 10 of 547 contacts</span>
          <div className="flex gap-2">
            <button className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors">← Prev</button>
            <button className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
