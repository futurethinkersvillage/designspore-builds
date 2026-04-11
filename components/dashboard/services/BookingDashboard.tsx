const bookings = [
  { name: "Sarah Mitchell", service: "Emergency Drain Unblock", date: "Apr 12", time: "9:00 AM", status: "confirmed" },
  { name: "Dave Kowalski", service: "Hot Water Tank Quote", date: "Apr 12", time: "1:30 PM", status: "confirmed" },
  { name: "Chris Turner", service: "Outdoor Faucet Repair", date: "Apr 14", time: "10:00 AM", status: "pending" },
  { name: "Maria Santos", service: "Bathroom Re-Pipe Consult", date: "Apr 15", time: "2:00 PM", status: "confirmed" },
  { name: "Kevin Park", service: "Annual Inspection", date: "Apr 17", time: "11:00 AM", status: "pending" },
  { name: "Linda Harper", service: "Toilet Replacement", date: "Apr 8", time: "9:30 AM", status: "completed" },
  { name: "James Reed", service: "Pipe Leak Repair", date: "Apr 7", time: "3:00 PM", status: "completed" },
  { name: "Tom Burns", service: "Water Heater Service", date: "Apr 5", time: "10:00 AM", status: "completed" },
];

const statusStyle: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  completed: "bg-white/[0.06] text-white/30 border-white/[0.08]",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = [13, 14, 15, 16, 17, 18, 19];
const hasDot = [false, true, true, false, true, false, false];

export default function BookingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Appointment Booking Automation</p>
        <h1 className="text-2xl font-bold text-white">Bookings Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Bookings this month", value: "18" },
          { label: "Upcoming (next 7 days)", value: "3" },
          { label: "Reminders sent today", value: "2" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Week strip calendar */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Week of Apr 13–19</p>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => (
            <div key={day} className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${dates[i] === 14 || dates[i] === 15 || dates[i] === 17 ? "bg-gold/[0.06] border border-gold/20" : "border border-transparent"}`}>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">{day}</span>
              <span className={`text-lg font-bold tabular-nums ${hasDot[i] ? "text-white" : "text-white/30"}`}>{dates[i]}</span>
              {hasDot[i] && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
            </div>
          ))}
        </div>
      </div>

      {/* Bookings list */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <p className="text-sm font-semibold text-white">All Bookings</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {bookings.map((b, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] flex flex-col items-center justify-center shrink-0">
                <span className="text-[9px] text-white/30 uppercase leading-none">{b.date.split(" ")[0]}</span>
                <span className="text-base font-bold text-white leading-none">{b.date.split(" ")[1]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{b.name}</p>
                <p className="text-xs text-white/40">{b.service}</p>
              </div>
              <p className="text-sm text-white/40 tabular-nums shrink-0">{b.time}</p>
              <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyle[b.status]}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
