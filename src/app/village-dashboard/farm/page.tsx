"use client";

import { motion } from "framer-motion";
import {
  Plant, Drop, Thermometer, Sun, ArrowUp, Warning,
  CheckCircle, Info, WarningCircle,
} from "@phosphor-icons/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const stats = [
  { label: "Total Acreage", value: "12 acres", trend: "Active", trendUp: true, icon: Plant },
  { label: "Active Plots", value: "8", trend: "of 8", trendUp: true, icon: Plant },
  { label: "Current Yield", value: "2,340 kg", trend: "+12%", trendUp: true, icon: Plant },
  { label: "Water Efficiency", value: "87%", trend: "+5%", trendUp: true, icon: Drop },
  { label: "Active Sensors", value: "24", trend: "All online", trendUp: true, icon: Sun },
];

const plots = [
  { id: "A", name: "Main Veggie Garden", crop: "Tomatoes, Mixed Greens", status: "Growing", acreage: 2.2, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { id: "B", name: "Herb Spiral", crop: "Basil, Rosemary, Thyme", status: "Growing", acreage: 0.3, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { id: "C", name: "Greenhouse 1", crop: "Peppers, Cucumbers", status: "Harvest Ready", acreage: 0.5, color: "bg-amber/20 border-amber/30 text-amber" },
  { id: "D", name: "Orchard", crop: "Apples, Pears", status: "Growing", acreage: 2.8, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { id: "E", name: "Berry Patch", crop: "Blueberries, Raspberries", status: "Harvest Ready", acreage: 0.8, color: "bg-amber/20 border-amber/30 text-amber" },
  { id: "F", name: "Grain Field", crop: "Spring Wheat", status: "Growing", acreage: 3.2, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { id: "G", name: "Mushroom Forest", crop: "Shiitake, Oyster", status: "Planted", acreage: 0.6, color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
  { id: "H", name: "Pollinator Meadow", crop: "Wildflowers", status: "Growing", acreage: 1.6, color: "bg-mauve/20 border-mauve/30 text-purple-300" },
];

const currentSensors = [
  { label: "Soil Moisture", value: 68, unit: "%", min: 0, max: 100, status: "normal", icon: Drop },
  { label: "Soil Temperature", value: 18, unit: "°C", min: 0, max: 40, status: "normal", icon: Thermometer },
  { label: "Air Humidity", value: 54, unit: "%", min: 0, max: 100, status: "normal", icon: Drop },
  { label: "Light Level", value: 72, unit: "%", min: 0, max: 100, status: "normal", icon: Sun },
];

// 7 days × 4 readings per day
const sensorHistory = Array.from({ length: 28 }, (_, i) => {
  const dayPct = (i % 4) / 4; // 0, 0.25, 0.5, 0.75
  const dayName = ["Mon","Mon","Mon","Mon","Tue","Tue","Tue","Tue","Wed","Wed","Wed","Wed","Thu","Thu","Thu","Thu","Fri","Fri","Fri","Fri","Sat","Sat","Sat","Sat","Sun","Sun","Sun","Sun"][i];
  const timeLabel = ["6am","12pm","6pm","12am"][i % 4];
  return {
    time: `${dayName} ${timeLabel}`,
    moisture: Math.round(60 + Math.sin(i * 0.5) * 8 + Math.random() * 4),
    temp: Math.round(14 + Math.sin(dayPct * Math.PI) * 8 + Math.random() * 2),
    humidity: Math.round(50 + Math.sin(i * 0.3) * 10 + Math.random() * 5),
    light: Math.round(Math.max(0, 70 * Math.sin(dayPct * Math.PI) + Math.random() * 10)),
  };
});

const cropYields = [
  { crop: "Tomatoes", projected: 450, actual: 420 },
  { crop: "Greens", projected: 200, actual: 185 },
  { crop: "Peppers", projected: 180, actual: 195 },
  { crop: "Herbs", projected: 80, actual: 92 },
  { crop: "Berries", projected: 320, actual: 298 },
  { crop: "Wheat", projected: 600, actual: 0 },
  { crop: "Mushrooms", projected: 150, actual: 134 },
  { crop: "Cucumbers", projected: 160, actual: 176 },
];

const livestock = [
  { type: "Chickens", emoji: "🐓", count: 24, health: "Healthy", production: "18 eggs/day" },
  { type: "Goats", emoji: "🐐", count: 8, health: "Healthy", production: "6L milk/day" },
  { type: "Bees", emoji: "🐝", count: "6 hives", health: "Healthy", production: "45kg honey/season" },
];

const farmAlerts = [
  { icon: WarningCircle, message: "Low soil moisture in Plot F — Grain Field", severity: "warning", time: "2h ago" },
  { icon: Warning, message: "Unusual temperature spike in Greenhouse 1", severity: "warning", time: "5h ago" },
  { icon: CheckCircle, message: "Harvest ready: Peppers & Cucumbers — Plot C", severity: "info", time: "8h ago" },
  { icon: WarningCircle, message: "Possible pest activity detected — Berry Patch", severity: "danger", time: "1 day ago" },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs space-y-0.5">
      <p className="text-white/40 text-[10px] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function FarmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Farm Management <span className="italic">& IoT</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">Crop health, sensor data, yield tracking, and livestock</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={12} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400"><ArrowUp size={10} weight="bold" />{s.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {farmAlerts.map((a, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
            a.severity === "danger" ? "bg-red-500/[0.06] border-red-500/20" :
            a.severity === "warning" ? "bg-amber/[0.06] border-amber/20" :
            "bg-blue-500/[0.06] border-blue-500/20"
          }`}>
            <a.icon size={16} weight="fill" className={a.severity === "danger" ? "text-red-400 mt-0.5" : a.severity === "warning" ? "text-amber mt-0.5" : "text-blue-400 mt-0.5"} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/70">{a.message}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Plot map */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Farm Plots</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {plots.map((p) => (
            <div key={p.id} className={`rounded-xl border p-3 ${p.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-white/30">Plot {p.id}</span>
                <span className="text-[9px] font-medium">{p.status}</span>
              </div>
              <div className="text-xs font-medium text-white/80 mb-1">{p.name}</div>
              <div className="text-[10px] text-white/40">{p.crop}</div>
              <div className="text-[10px] text-white/25 mt-1">{p.acreage} acres</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {[["Growing", "emerald"], ["Harvest Ready", "amber"], ["Planted", "blue"]].map(([l, c]) => (
            <div key={l} className={`flex items-center gap-1.5 text-xs ${c === "emerald" ? "text-emerald-400" : c === "amber" ? "text-amber" : "text-blue-400"}`}>
              <div className={`w-2 h-2 rounded-full ${c === "emerald" ? "bg-emerald-500/50" : c === "amber" ? "bg-amber/50" : "bg-blue-500/50"}`} />{l}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current sensors */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Live Sensor Readings</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {currentSensors.map((s) => {
            const pct = Math.round((s.value - s.min) / (s.max - s.min) * 100);
            return (
              <div key={s.label} className="rounded-xl bg-white/[0.04] p-4 text-center">
                <s.icon size={20} weight="fill" className="text-amber mx-auto mb-2" />
                <div className="text-2xl font-semibold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-white/30 mb-3">{s.unit}</div>
                <div className="h-1.5 rounded-full bg-white/[0.06] mb-1">
                  <div className="h-full rounded-full bg-emerald-500/60 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Sensor history */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Sensor History (7 days)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sensorHistory}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="moisture" name="Moisture %" stroke="#34d399" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="temp" name="Temp °C" stroke="#EA824E" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="light" name="Light %" stroke="#73516F" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {[["Moisture %", "#34d399"], ["Temp °C", "#EA824E"], ["Humidity %", "#60a5fa"], ["Light %", "#73516F"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-5 h-0.5 rounded" style={{ background: c }} />{l}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Crop yields + Livestock */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Crop Yields — Projected vs Actual (kg)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cropYields} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} unit="kg" />
              <YAxis dataKey="crop" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="projected" name="Projected" fill="rgba(255,255,255,0.08)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#EA824E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Livestock</h2>
          <div className="space-y-3">
            {livestock.map((l) => (
              <div key={l.type} className="rounded-xl bg-white/[0.04] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{l.emoji}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{l.type}</div>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">{l.health}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-semibold text-white">{l.count}</div>
                    <div className="text-[10px] text-white/30">animals</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Plant size={10} weight="fill" className="text-amber" /> {l.production}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
