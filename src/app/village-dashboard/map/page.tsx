"use client";

import { motion } from "framer-motion";
import {
  GlobeHemisphereWest, Users, MapPin, Airplane,
  ArrowUp, ArrowRight, Plus, Star,
} from "@phosphor-icons/react";
import { useState } from "react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";

/* ── Data ─────────────────────────────────────────────────────────── */

const networkStats = [
  { label: "Active Villages", value: "15", trend: "+3 this year", icon: GlobeHemisphereWest },
  { label: "Countries", value: "12", trend: "+2 this year", icon: MapPin },
  { label: "Total Members", value: "1,847", trend: "+18%", icon: Users },
  { label: "Active Relocations", value: "420", trend: "+34%", icon: Airplane },
];

interface Village {
  id: string; name: string; country: string; region: string;
  lat: number; lng: number; members: number; year: number;
  focus: string[]; status: "Active" | "Forming" | "Planning";
  description: string;
}

const villages: Village[] = [
  { id: "wg", name: "Wells Gray Village", country: "Canada", region: "BC", lat: 51.65, lng: -120.02, members: 247, year: 2023, focus: ["Tech", "Eco", "Family"], status: "Active", description: "Flagship 400-acre village near Clearwater, BC. Year-round programs." },
  { id: "cc", name: "Cascadia Commons", country: "USA", region: "Oregon", lat: 44.05, lng: -123.09, members: 182, year: 2024, focus: ["Tech", "Farming"], status: "Active", description: "Pacific Northwest tech-meets-farm community." },
  { id: "tv", name: "Tierra Viva", country: "Costa Rica", region: "Guanacaste", lat: 10.27, lng: -85.59, members: 134, year: 2024, focus: ["Eco", "Spiritual"], status: "Active", description: "Tropical regenerative village with permaculture focus." },
  { id: "gg", name: "Gaia's Garden", country: "Portugal", region: "Alentejo", lat: 38.57, lng: -7.91, members: 96, year: 2025, focus: ["Eco", "Family", "Farming"], status: "Active", description: "Mediterranean climate village with cork oak forests." },
  { id: "nh", name: "Nordic Haven", country: "Sweden", region: "Dalarna", lat: 60.48, lng: 15.44, members: 67, year: 2025, focus: ["Tech", "Eco"], status: "Forming", description: "Scandinavian village focused on sustainable tech." },
  { id: "sv", name: "Satoyama Village", country: "Japan", region: "Nagano", lat: 36.23, lng: 138.18, members: 143, year: 2024, focus: ["Spiritual", "Farming"], status: "Active", description: "Traditional Japanese countryside meets modern community." },
  { id: "tn", name: "Terra Nova", country: "New Zealand", region: "Canterbury", lat: -43.53, lng: 172.64, members: 89, year: 2025, focus: ["Eco", "Family"], status: "Active", description: "South Island regenerative farming community." },
  { id: "uv", name: "Ubuntu Village", country: "South Africa", region: "Western Cape", lat: -33.92, lng: 18.42, members: 54, year: 2026, focus: ["Family", "Farming"], status: "Forming", description: "Community-centered village near Cape Town." },
  { id: "dv", name: "Dharma Valley", country: "India", region: "Himachal Pradesh", lat: 32.22, lng: 77.17, members: 38, year: 2026, focus: ["Spiritual", "Eco"], status: "Planning", description: "Himalayan retreat village with meditation focus." },
  { id: "ac", name: "Alpine Collective", country: "Switzerland", region: "Graubünden", lat: 46.85, lng: 9.53, members: 112, year: 2024, focus: ["Tech", "Eco"], status: "Active", description: "High-altitude village combining innovation and nature." },
  { id: "bs", name: "Bosque Sagrado", country: "Mexico", region: "Oaxaca", lat: 17.06, lng: -96.73, members: 71, year: 2025, focus: ["Spiritual", "Farming"], status: "Forming", description: "Sacred forest community with indigenous partnerships." },
  { id: "oo", name: "Outback Oasis", country: "Australia", region: "Victoria", lat: -37.81, lng: 144.96, members: 98, year: 2024, focus: ["Eco", "Tech"], status: "Active", description: "Arid-adapted village pioneering water conservation." },
  { id: "gr", name: "Green Roots", country: "United Kingdom", region: "Devon", lat: 50.72, lng: -3.53, members: 156, year: 2023, focus: ["Farming", "Family"], status: "Active", description: "English countryside village with heritage farming." },
  { id: "in", name: "Île Nouvelle", country: "France", region: "Dordogne", lat: 44.86, lng: 0.58, members: 42, year: 2026, focus: ["Eco", "Family"], status: "Planning", description: "French river valley village with vineyard terraces." },
  { id: "ar", name: "Andes Refuge", country: "Chile", region: "Araucanía", lat: -38.74, lng: -72.60, members: 48, year: 2025, focus: ["Eco", "Spiritual"], status: "Forming", description: "Patagonian foothills with volcanic hot springs." },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  Forming: "bg-amber/15 text-amber",
  Planning: "bg-blue-500/15 text-blue-400",
};

const focusColors: Record<string, string> = {
  Tech: "bg-indigo/15 text-blue-400",
  Eco: "bg-emerald-500/15 text-emerald-400",
  Family: "bg-amber/15 text-amber",
  Spiritual: "bg-mauve/15 text-purple-300",
  Farming: "bg-terracotta/15 text-orange-300",
};

/* ── Map projection helpers (equirectangular) ─────────────────────── */

function toX(lng: number, w = 800) { return ((lng + 180) / 360) * w; }
function toY(lat: number, h = 400) { return ((90 - lat) / 180) * h; }

const latLines = [-60, -30, 0, 30, 60];
const lngLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

/* ── Page ─────────────────────────────────────────────────────────── */

export default function MapPage() {
  const [selected, setSelected] = useState<Village | null>(null);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Global Village <span className="italic">Map</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Smart village network across 12 countries</p>
        </div>
        <button
          onClick={() => setAgentOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#9B7FA0]/25 bg-[#9B7FA0]/10 text-xs font-medium text-[#9B7FA0] hover:opacity-80 transition-opacity self-start shrink-0"
        >
          <GlobeHemisphereWest size={13} weight="fill" /> Ask Atlas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {networkStats.map((s) => (
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

      {/* Map + Detail */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* SVG Map */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 overflow-hidden">
          <h2 className="text-sm font-medium text-white mb-4">Network Map</h2>
          <div className="relative rounded-xl overflow-hidden bg-[#080e1c]">
            {/* Satellite world map image (equirectangular Natural Earth) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg"
              alt="World satellite map"
              className="w-full object-cover"
              style={{ aspectRatio: "2/1", filter: "brightness(0.45) saturate(0.7)" }}
            />
            {/* SVG overlay — dots only, using same equirectangular coord mapping */}
            <svg
              viewBox="0 0 800 400"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              {/* Graticule */}
              {latLines.map((lat) => (
                <line key={`lat-${lat}`} x1="0" y1={toY(lat)} x2="800" y2={toY(lat)}
                  stroke={lat === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}
                  strokeDasharray={lat === 0 ? "4 4" : undefined}
                  strokeWidth={lat === 0 ? 0.8 : 0.5}
                />
              ))}
              {lngLines.map((lng) => (
                <line key={`lng-${lng}`} x1={toX(lng)} y1="0" x2={toX(lng)} y2="400"
                  stroke="rgba(255,255,255,0.04)" strokeWidth={0.5}
                />
              ))}
              {/* Village markers */}
              {villages.map((v) => {
                const x = toX(v.lng);
                const y = toY(v.lat);
                const isSelected = selected?.id === v.id;
                const mc = v.status === "Active" ? "#34d399" : v.status === "Forming" ? "#EA824E" : "#60a5fa";
                return (
                  <g key={v.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelected(v)}>
                    {v.status === "Active" && (
                      <circle cx={x} cy={y} r={12} fill="none" stroke={mc} strokeWidth={1} opacity={0.3}>
                        <animate attributeName="r" values="8;16;8" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={x} cy={y} r={isSelected ? 8 : 5} fill={mc} opacity={isSelected ? 1 : 0.85}
                      stroke={isSelected ? "white" : "rgba(0,0,0,0.5)"} strokeWidth={isSelected ? 2 : 1} />
                    <text x={x} y={y - 9} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="7"
                      fontFamily="sans-serif" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                      {v.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Active</div>
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-full bg-amber" /> Forming</div>
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Planning</div>
          </div>
        </motion.div>

        {/* Detail panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                  <p className="text-xs text-white/40">{selected.region}, {selected.country}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[selected.status]}`}>{selected.status}</span>
              </div>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-white/[0.04] p-3">
                  <div className="text-xs text-white/40">Members</div>
                  <div className="text-lg font-semibold text-white">{selected.members}</div>
                </div>
                <div className="rounded-xl bg-white/[0.04] p-3">
                  <div className="text-xs text-white/40">Founded</div>
                  <div className="text-lg font-semibold text-white">{selected.year}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-white/40 mb-2">Focus Areas</div>
                <div className="flex flex-wrap gap-2">
                  {selected.focus.map((f) => (
                    <span key={f} className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${focusColors[f] || "bg-white/10 text-white/50"}`}>{f}</span>
                  ))}
                </div>
              </div>
              <button className="w-full rounded-xl bg-amber/15 px-4 py-2.5 text-sm font-medium text-amber hover:bg-amber/25 transition-colors flex items-center justify-center gap-2">
                Explore Village <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MapPin size={32} weight="light" className="text-white/20 mb-3" />
              <p className="text-sm text-white/40">Select a village on the map</p>
              <p className="text-xs text-white/25 mt-1">Click any marker to see details</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Village List */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">All Villages</h2>
          <button className="flex items-center gap-1.5 rounded-lg bg-amber/15 px-3 py-1.5 text-xs font-medium text-amber hover:bg-amber/25 transition-colors">
            <Plus size={12} weight="bold" /> Add Your Village
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-2.5 px-0 text-left text-xs uppercase text-white/30 font-medium">Village</th>
                <th className="py-2.5 px-0 text-left text-xs uppercase text-white/30 font-medium">Country</th>
                <th className="py-2.5 px-0 text-left text-xs uppercase text-white/30 font-medium">Members</th>
                <th className="py-2.5 px-0 text-left text-xs uppercase text-white/30 font-medium">Focus</th>
                <th className="py-2.5 px-0 text-left text-xs uppercase text-white/30 font-medium">Status</th>
                <th className="py-2.5 px-0 text-left text-xs uppercase text-white/30 font-medium">Est.</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((v) => (
                <tr key={v.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelected(v)}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {v.id === "wg" && <Star size={12} weight="fill" className="text-amber" />}
                      <span className="text-sm text-white/70">{v.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-white/40">{v.country}</td>
                  <td className="py-3 text-sm font-medium text-white">{v.members}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      {v.focus.slice(0, 2).map((f) => (
                        <span key={f} className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${focusColors[f] || "bg-white/10 text-white/40"}`}>{f}</span>
                      ))}
                      {v.focus.length > 2 && <span className="text-[9px] text-white/25">+{v.focus.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[v.status]}`}>{v.status}</span></td>
                  <td className="py-3 text-xs text-white/40">{v.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Comparison */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Village Comparison — Top 3</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Metric</th>
                <th className="pb-3 text-center text-xs uppercase text-white/30 font-medium">Wells Gray</th>
                <th className="pb-3 text-center text-xs uppercase text-white/30 font-medium">Cascadia</th>
                <th className="pb-3 text-center text-xs uppercase text-white/30 font-medium">Green Roots</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ["Members", "247", "182", "156"],
                ["Acreage", "400", "280", "180"],
                ["Climate", "Continental", "Maritime", "Oceanic"],
                ["Avg Cost/mo", "$48–$497", "$55–$450", "$60–$520"],
                ["Focus", "Tech, Eco", "Tech, Farm", "Farm, Family"],
                ["Programs", "12", "8", "10"],
              ].map(([metric, ...vals]) => (
                <tr key={metric} className="border-b border-white/[0.04]">
                  <td className="py-2.5 text-xs text-white/50">{metric}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="py-2.5 text-center text-xs text-white/70">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <AgentDrawer agentId="atlas" isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}
