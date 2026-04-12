"use client";

import { motion } from "framer-motion";
import {
  GearSix, CheckCircle, Globe, MapPin, Clock,
  Shield, User, Eye, PencilSimple, Trash,
  Plug, Warning, Lock, Bell, ToggleRight,
} from "@phosphor-icons/react";

/* ── Data ─────────────────────────────────────────────────────────── */

const villageProfile = {
  name: "Wells Gray Village",
  description: "A 400-acre seasonal Smart Village near Clearwater, BC. Community-driven living, maker culture, and regenerative practices.",
  location: "Clearwater, BC, Canada",
  timezone: "America/Vancouver (UTC-7)",
  established: "2023",
  acreage: "400",
  website: "portal.place",
};

const roles = [
  { name: "Admin", members: 2, permissions: { viewAll: true, edit: true, delete: true, vote: true, finance: true, publicContent: true } },
  { name: "Steward", members: 28, permissions: { viewAll: true, edit: true, delete: false, vote: true, finance: false, publicContent: true } },
  { name: "Builder", members: 68, permissions: { viewAll: false, edit: false, delete: false, vote: true, finance: false, publicContent: false } },
  { name: "Member", members: 147, permissions: { viewAll: false, edit: false, delete: false, vote: true, finance: false, publicContent: false } },
  { name: "Guest", members: 0, permissions: { viewAll: false, edit: false, delete: false, vote: false, finance: false, publicContent: false } },
];

const integrations = [
  { name: "Weather API", provider: "Open-Meteo", status: "connected", lastSync: "2 min ago", icon: Globe },
  { name: "IoT Gateway", provider: "Node-RED v3.1", status: "connected", lastSync: "Real-time", icon: Plug },
  { name: "Stripe Payments", provider: "Stripe", status: "connected", lastSync: "Active", icon: Lock },
  { name: "Resend Email", provider: "Resend", status: "connected", lastSync: "8 min ago", icon: Bell },
  { name: "Slack Community", provider: "Slack API", status: "connected", lastSync: "1 min ago", icon: Bell },
];

const auditLog = [
  { id: 1, timestamp: "2026-06-10 14:32", user: "Mike G.", action: "Updated", resource: "Village profile description" },
  { id: 2, timestamp: "2026-06-10 13:18", user: "Sarah C.", action: "Created", resource: "Announcement: Summer Solstice Schedule" },
  { id: 3, timestamp: "2026-06-10 11:45", user: "Anika P.", action: "Resolved", resource: "Alert: WiFi node 7 offline" },
  { id: 4, timestamp: "2026-06-10 10:22", user: "Elena V.", action: "Updated", resource: "Farm plot: Greenhouse 1 status → Harvest Ready" },
  { id: 5, timestamp: "2026-06-09 16:55", user: "Mike G.", action: "Approved", resource: "Work-Stay application: Jonas B." },
  { id: 6, timestamp: "2026-06-09 15:30", user: "Ben M.", action: "Closed", resource: "Work Order #2026-087: Trail repair" },
  { id: 7, timestamp: "2026-06-09 14:11", user: "Sarah C.", action: "Created", resource: "Event: Full Moon Gathering (Jun 14)" },
  { id: 8, timestamp: "2026-06-09 12:44", user: "Marcus R.", action: "Updated", resource: "Task: Cabin Phase 2 progress → 35%" },
  { id: 9, timestamp: "2026-06-08 17:20", user: "Anika P.", action: "Connected", resource: "Integration: Slack API" },
  { id: 10, timestamp: "2026-06-08 15:05", user: "Mike G.", action: "Published", resource: "Proposal: Solar Array Expansion Phase 2" },
  { id: 11, timestamp: "2026-06-08 11:30", user: "Elena V.", action: "Logged", resource: "Harvest: Tomatoes — 420kg from Plot A" },
  { id: 12, timestamp: "2026-06-07 16:45", user: "Ingrid L.", action: "Updated", resource: "Safety contact list" },
  { id: 13, timestamp: "2026-06-07 14:22", user: "Ben M.", action: "Created", resource: "Work Order #2026-091: Sauna drainage" },
  { id: 14, timestamp: "2026-06-07 10:15", user: "Sarah C.", action: "Archived", resource: "Announcement: Spring 2026 Newsletter" },
  { id: 15, timestamp: "2026-06-06 16:00", user: "Mike G.", action: "Reviewed", resource: "Membership applications (3 approved)" },
  { id: 16, timestamp: "2026-06-06 13:30", user: "Anika P.", action: "Calibrated", resource: "IoT sensors: Plot C moisture sensors" },
  { id: 17, timestamp: "2026-06-05 17:45", user: "Marcus R.", action: "Completed", resource: "Task: Gazebo railing section B repair" },
  { id: 18, timestamp: "2026-06-05 14:22", user: "Elena V.", action: "Updated", resource: "Crop calendar: Wheat harvest window" },
  { id: 19, timestamp: "2026-06-04 11:10", user: "Sarah C.", action: "Sent", resource: "Newsletter: June 2026 Village Update" },
  { id: 20, timestamp: "2026-06-03 16:30", user: "Mike G.", action: "Approved", resource: "Budget: Trail system Phase 2 allocation" },
];

const permLabels = ["View All", "Edit", "Delete", "Voting", "Finance", "Public Content"];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ── Page ─────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Settings & <span className="italic">Configuration</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">Village profile, roles, integrations, and audit log</p>
      </div>

      {/* Village Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">Village Profile</h2>
          <button className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <PencilSimple size={12} /> Edit
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Village Name", value: villageProfile.name },
            { label: "Location", value: villageProfile.location, icon: MapPin },
            { label: "Timezone", value: villageProfile.timezone, icon: Clock },
            { label: "Established", value: villageProfile.established },
            { label: "Acreage", value: `${villageProfile.acreage} acres` },
            { label: "Website", value: villageProfile.website, icon: Globe },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-white/[0.03] p-3">
              <div className="text-[10px] uppercase tracking-wider text-white/25 mb-1">{f.label}</div>
              <div className="text-sm text-white/70">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
          <div className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Description</div>
          <p className="text-sm text-white/70">{villageProfile.description}</p>
        </div>
      </motion.div>

      {/* Roles & Permissions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Roles & Permissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-white/30 uppercase font-medium">Role</th>
                <th className="pb-3 text-center text-white/30 uppercase font-medium">Members</th>
                {permLabels.map((p) => (
                  <th key={p} className="pb-3 text-center text-white/30 uppercase font-medium">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => {
                const perms = Object.values(r.permissions);
                return (
                  <tr key={r.name} className="border-b border-white/[0.04]">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-amber/60" />
                        <span className="text-white/70 font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-white/40">{r.members}</td>
                    {perms.map((allowed, i) => (
                      <td key={i} className="py-3 text-center">
                        {allowed
                          ? <CheckCircle size={14} weight="fill" className="text-emerald-400 mx-auto" />
                          : <div className="w-3.5 h-3.5 rounded-full border border-white/10 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Integrations</h2>
        <div className="space-y-2">
          {integrations.map((intg) => (
            <div key={intg.name} className="flex items-center gap-4 rounded-xl bg-white/[0.03] px-4 py-3">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <intg.icon size={14} weight="fill" className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/70 font-medium">{intg.name}</div>
                <div className="text-xs text-white/30">{intg.provider}</div>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">Connected</span>
                <div className="text-[10px] text-white/25 mt-1">Synced {intg.lastSync}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          {[
            { label: "New member applications", enabled: true },
            { label: "Governance proposals & votes", enabled: true },
            { label: "Work order updates", enabled: true },
            { label: "Farm alerts & sensor warnings", enabled: true },
            { label: "Energy system alerts", enabled: false },
            { label: "Marketplace activity", enabled: false },
            { label: "Newsletter open stats", enabled: true },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-sm text-white/60">{n.label}</span>
              <div className={`flex items-center gap-2 text-xs font-medium ${n.enabled ? "text-emerald-400" : "text-white/25"}`}>
                <ToggleRight size={18} weight={n.enabled ? "fill" : "regular"} />
                {n.enabled ? "On" : "Off"}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Audit Log */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Audit Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Timestamp</th>
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">User</th>
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Action</th>
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Resource</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-[10px] font-mono text-white/30">{entry.timestamp}</td>
                  <td className="py-2.5 text-xs text-white/60">{entry.user}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      entry.action === "Approved" || entry.action === "Connected" || entry.action === "Resolved" || entry.action === "Completed"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : entry.action === "Created" || entry.action === "Published"
                        ? "bg-amber/15 text-amber"
                        : "bg-white/10 text-white/40"
                    }`}>{entry.action}</span>
                  </td>
                  <td className="py-2.5 text-xs text-white/50">{entry.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
