export default function CustomerPortalDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Customer Portal</p>
        <h1 className="text-2xl font-bold text-white">Customer-Facing Portal</h1>
      </div>

      <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-500/[0.05] border border-blue-500/20 rounded-xl">
        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
        <p className="text-sm text-white/60">
          Preview: This is what <span className="text-blue-300 font-medium">your customers</span> see at <span className="text-blue-300 font-mono text-xs">yoursite.com/portal</span>
        </p>
      </div>

      {/* Nested portal preview */}
      <div className="bg-[#1a2030] border border-white/[0.10] rounded-2xl overflow-hidden shadow-2xl">
        {/* Portal header */}
        <div className="bg-[#131823] border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white/[0.08] flex items-center justify-center text-xs font-bold text-white/60">YB</div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Your Business</p>
              <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-widest">Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/50">G</div>
            <span className="text-xs text-white/40">Gary T.</span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Job status tracker */}
          <div className="bg-[#131823] border border-white/[0.07] rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Current Job</p>
            <p className="text-sm font-semibold text-white mb-4">Water Heater Replacement — 142 Pine St</p>
            <div className="flex items-center gap-0">
              {[
                { label: "Booked", done: true },
                { label: "Confirmed", done: true },
                { label: "En Route", done: true },
                { label: "In Progress", done: false, active: true },
                { label: "Complete", done: false },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      step.done
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : step.active
                        ? "bg-gold/[0.15] border-gold/40 text-gold animate-pulse"
                        : "bg-white/[0.05] border-white/[0.10] text-white/20"
                    }`}>
                      {step.done ? "✓" : i + 1}
                    </div>
                    <p className={`text-[10px] mt-1.5 text-center leading-tight ${
                      step.done ? "text-emerald-400/70" : step.active ? "text-gold/70" : "text-white/20"
                    }`}>{step.label}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 ${step.done ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/35 mt-4">Technician arrived 9:47am · Est. completion: 12:30pm</p>
          </div>

          {/* Two column grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Recent invoices */}
            <div className="bg-[#131823] border border-white/[0.07] rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Recent Invoices</p>
              <div className="space-y-2.5">
                {[
                  { desc: "Water Heater Install", date: "Apr 9", amount: "$1,250", status: "Outstanding" },
                  { desc: "Emergency Call – Feb", date: "Feb 12", amount: "$420", status: "Paid" },
                  { desc: "Annual Inspection", date: "Jan 5", amount: "$180", status: "Paid" },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <div>
                      <p className="text-xs text-white/70 font-medium">{inv.desc}</p>
                      <p className="text-[10px] text-white/30">{inv.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">{inv.amount}</p>
                      <span className={`text-[9px] font-semibold ${inv.status === "Paid" ? "text-emerald-400" : "text-yellow-300"}`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 text-xs text-white/30 hover:text-white/50 transition-colors py-1.5 border border-white/[0.06] rounded-lg">
                View all & pay
              </button>
            </div>

            {/* Book a service */}
            <div className="bg-[#131823] border border-white/[0.07] rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Book a Service</p>
              <div className="space-y-2.5">
                {["Annual HVAC Tune-Up", "Plumbing Inspection", "Water Heater Flush", "Other / Emergency"].map(svc => (
                  <button key={svc} className="w-full text-left text-xs text-white/55 hover:text-white/80 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.05] transition-colors">
                    {svc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-[#131823] border border-white/[0.07] rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Documents</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Estimate #1041.pdf", date: "Apr 1" },
                { name: "Service Report – Feb.pdf", date: "Feb 12" },
                { name: "Warranty – Water Heater.pdf", date: "Apr 9" },
              ].map(doc => (
                <div key={doc.name} className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg hover:bg-white/[0.07] transition-colors cursor-pointer">
                  <span className="text-white/30 text-sm">📄</span>
                  <div>
                    <p className="text-xs text-white/65 font-medium">{doc.name}</p>
                    <p className="text-[10px] text-white/25">{doc.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin note */}
      <div className="bg-raised border border-white/[0.06] rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-white/25 font-semibold mb-2">About This Feature</p>
        <p className="text-sm text-white/50 leading-relaxed">Each customer receives a unique portal link via email or SMS after booking. They can track their job status in real time, view invoices and pay online, download documents, and rebook — without needing to call.</p>
      </div>
    </div>
  );
}
