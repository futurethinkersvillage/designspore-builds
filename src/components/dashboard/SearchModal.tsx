"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass, X, ArrowRight,
  House, ChartLine, Scales, Briefcase, Kanban, Backpack,
  UsersThree, CalendarBlank, Crown, Plant, GlobeHemisphereWest,
  Lightning, Heartbeat, ChatTeardrop, Storefront, GearSix,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

interface SearchItem {
  label: string;
  href: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  category: string;
  description: string;
}

const pages: SearchItem[] = [
  { label: "Overview", href: "/", icon: House, category: "Pages", description: "Village executive summary & health" },
  { label: "Fundraising", href: "/fundraising", icon: ChartLine, category: "Pages", description: "Campaigns, cap table, investors" },
  { label: "Governance", href: "/governance", icon: Scales, category: "Pages", description: "Proposals, voting, conflict resolution" },
  { label: "Operations", href: "/operations", icon: Briefcase, category: "Pages", description: "P&L, occupancy, cash flow" },
  { label: "Tasks", href: "/tasks", icon: Kanban, category: "Pages", description: "Kanban board, work orders, projects" },
  { label: "Work-Stay", href: "/workstay", icon: Backpack, category: "Pages", description: "Programs, cohorts, applications" },
  { label: "Members", href: "/members", icon: UsersThree, category: "Pages", description: "Directory, skills matrix, map" },
  { label: "Events", href: "/events", icon: CalendarBlank, category: "Pages", description: "Calendar, workshops, courses" },
  { label: "Membership", href: "/membership", icon: Crown, category: "Pages", description: "Tiers, benefits, renewals" },
  { label: "Farm & IoT", href: "/farm", icon: Plant, category: "Pages", description: "Plots, sensors, harvest, livestock" },
  { label: "Network Map", href: "/map", icon: GlobeHemisphereWest, category: "Pages", description: "Global village network" },
  { label: "Energy", href: "/energy", icon: Lightning, category: "Pages", description: "Solar, battery, water, sustainability" },
  { label: "Wellness", href: "/wellness", icon: Heartbeat, category: "Pages", description: "Community health & programs" },
  { label: "Comms", href: "/communications", icon: ChatTeardrop, category: "Pages", description: "Announcements, chat, newsletter" },
  { label: "Marketplace", href: "/marketplace", icon: Storefront, category: "Pages", description: "Listings, tools, skill swaps" },
  { label: "Settings", href: "/settings", icon: GearSix, category: "Pages", description: "Profile, roles, integrations" },
];

const content: SearchItem[] = [
  { label: "Solar Array Expansion", href: "/governance", category: "Proposal", description: "Active vote — 5 days left" },
  { label: "Garden Expansion Phase 2", href: "/governance", category: "Proposal", description: "Consent process — 2 days left" },
  { label: "Emergency Water Protocol", href: "/governance", category: "Proposal", description: "Pending integration round" },
  { label: "BC Green Infrastructure Grant", href: "/fundraising", category: "Funding", description: "Approved — $150K" },
  { label: "Wells Gray Community Foundation", href: "/fundraising", category: "Funding", description: "Pending — $75K ask" },
  { label: "Summer 2026 Work-Stay", href: "/workstay", category: "Program", description: "12 participants, Week 8/22" },
  { label: "Full Moon Gathering", href: "/events", category: "Event", description: "Jun 14 — 28 registered" },
  { label: "Permaculture Workshop", href: "/events", category: "Event", description: "Jun 16 — 18 registered" },
  { label: "Plot A — Tomato Harvest", href: "/farm", category: "Farm", description: "Harvest ready — 2,340 kg" },
  { label: "Steward Tier", href: "/membership", category: "Membership", description: "$197/mo — 28 members" },
  { label: "Solar Battery", href: "/energy", category: "Energy", description: "78% charge — 45 kWh today" },
  { label: "Sarah Chen", href: "/members", category: "Member", description: "Builder · Permaculture, Code" },
  { label: "Marcus Rivera", href: "/members", category: "Member", description: "Work-Stay applicant · Carpentry" },
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered: SearchItem[] = query.trim()
    ? [...pages, ...content].filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : pages;

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && filtered[selected]) {
        window.location.href = filtered[selected].href;
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, selected, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-lg mx-4 bg-[#1A1720] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <MagnifyingGlass size={18} className="text-white/30 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, proposals, members..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          <div className="flex items-center gap-2">
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white/25 border border-white/[0.08] font-mono">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-10 text-center text-sm text-white/30">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <div className="px-2 py-1.5 text-[10px] font-medium text-white/25 uppercase tracking-widest">
                {query.trim() ? "Results" : "All pages"}
              </div>
              {filtered.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`${item.href}-${i}`}
                    href={item.href}
                    onClick={onClose}
                    onMouseEnter={() => setSelected(i)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                      i === selected ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        Icon ? "bg-white/[0.06]" : "bg-amber/10"
                      }`}
                    >
                      {Icon ? (
                        <Icon size={14} className="text-white/50" />
                      ) : (
                        <span className="text-[9px] font-bold text-amber/60 uppercase">
                          {item.category.slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                        {item.label}
                      </div>
                      <div className="text-xs text-white/30 truncate">{item.description}</div>
                    </div>
                    <span className="text-[10px] text-white/20 shrink-0 hidden sm:block">
                      {item.category}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-white/20 shrink-0 group-hover:text-white/40 transition-colors"
                    />
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-5 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-white/20 font-mono">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>ESC close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
