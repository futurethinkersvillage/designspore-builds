"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Storefront, CurrencyDollar, ShoppingCart, UserCircle,
  ArrowUp, Wrench, Leaf, Bicycle,
  Guitar, Barbell, Package, Sparkle, GlobeHemisphereWest,
} from "@phosphor-icons/react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";

/* ── Data ─────────────────────────────────────────────────────────── */

const stats = [
  { label: "Monthly Volume", value: "$4,200", trend: "+22%", icon: CurrencyDollar },
  { label: "Avg Transaction", value: "$35", trend: "+$4", icon: ShoppingCart },
  { label: "Active Sellers", value: "23", trend: "+5", icon: UserCircle },
  { label: "Total Listings", value: "42", trend: "+8", icon: Storefront },
];

const listings = [
  { title: "Chainsaw — Weekend Rental", category: "Tools", seller: "Marcus R.", price: "$25/day", type: "Rent", icon: Wrench, img: "/images/dashboard/market-chainsaw.jpg" },
  { title: "Fresh Organic Tomatoes (5kg)", category: "Produce", seller: "Elena V.", price: "$18", type: "Sale", icon: Leaf, img: "/images/dashboard/market-tomatoes.jpg" },
  { title: "Web Design Services", category: "Services", seller: "Anika P.", price: "$75/hr", type: "Service", icon: Package, img: "/images/dashboard/market-webdesign.jpg" },
  { title: "Carpentry Help — 4hr blocks", category: "Services", seller: "Kai N.", price: "$40/block", type: "Service", icon: Wrench, img: "/images/dashboard/market-carpentry.jpg" },
  { title: "Raw Wildflower Honey (1kg)", category: "Produce", seller: "Hannah F.", price: "$22", type: "Sale", icon: Leaf, img: "/images/dashboard/market-honey.jpg" },
  { title: "Firewood Bundle (0.5 cord)", category: "Produce", seller: "Ben M.", price: "$45", type: "Sale", icon: Leaf, img: "/images/dashboard/market-firewood.jpg" },
  { title: "Private Yoga Session", category: "Services", seller: "Rachel K.", price: "$50", type: "Service", icon: Barbell, img: "/images/dashboard/market-yoga.jpg" },
  { title: "Sourdough Bread Loaf", category: "Produce", seller: "Yuki T.", price: "$8", type: "Sale", icon: Leaf, img: "/images/dashboard/market-bread.jpg" },
  { title: "Mountain Bike — Weekly Rental", category: "Transport", seller: "Chris D.", price: "$15/day", type: "Rent", icon: Bicycle, img: "/images/dashboard/market-bike.jpg" },
  { title: "Guitar Lessons (1hr)", category: "Services", seller: "Chris D.", price: "$30", type: "Service", icon: Guitar, img: "/images/dashboard/market-guitar.jpg" },
  { title: "Mixed Berry Preserves (500ml)", category: "Produce", seller: "Mira J.", price: "$12", type: "Sale", icon: Leaf, img: "/images/dashboard/market-preserves.jpg" },
  { title: "Handmade Pottery Bowl", category: "Crafts", seller: "Priya S.", price: "$35", type: "Sale", icon: Package, img: "/images/dashboard/market-pottery.jpg" },
];

const typeStyles: Record<string, string> = {
  Sale: "bg-emerald-500/15 text-emerald-400",
  Rent: "bg-amber/15 text-amber",
  Service: "bg-indigo/15 text-blue-400",
  Swap: "bg-mauve/15 text-purple-300",
};

const transactions = [
  { item: "Chainsaw Rental", buyer: "Jonas B.", seller: "Marcus R.", type: "Rent", amount: "$25", date: "Jun 10" },
  { item: "Tomatoes (5kg)", buyer: "Yuki T.", seller: "Elena V.", type: "Sale", amount: "$18", date: "Jun 10" },
  { item: "Yoga Session", buyer: "Sarah C.", seller: "Rachel K.", type: "Service", amount: "$50", date: "Jun 9" },
  { item: "Sourdough Bread", buyer: "Thomas P.", seller: "Yuki T.", type: "Sale", amount: "$8", date: "Jun 9" },
  { item: "Web Design (2hr)", buyer: "Mike G.", seller: "Anika P.", type: "Service", amount: "$150", date: "Jun 8" },
  { item: "Honey (1kg)", buyer: "Priya S.", seller: "Hannah F.", type: "Sale", amount: "$22", date: "Jun 8" },
  { item: "Guitar Lesson", buyer: "Mei L.", seller: "Chris D.", type: "Service", amount: "$30", date: "Jun 7" },
  { item: "Firewood Bundle", buyer: "James W.", seller: "Ben M.", type: "Sale", amount: "$45", date: "Jun 7" },
  { item: "Mountain Bike", buyer: "Alex T.", seller: "Chris D.", type: "Rent", amount: "$15", date: "Jun 6" },
  { item: "Preserves (500ml)", buyer: "Ingrid L.", seller: "Mira J.", type: "Sale", amount: "$12", date: "Jun 5" },
];

const categories = [
  { name: "Produce", count: 15, color: "bg-emerald-500/15 text-emerald-400" },
  { name: "Services", count: 12, color: "bg-indigo/15 text-blue-400" },
  { name: "Tools", count: 8, color: "bg-amber/15 text-amber" },
  { name: "Transport", count: 4, color: "bg-mauve/15 text-purple-300" },
  { name: "Crafts", count: 3, color: "bg-terracotta/15 text-orange-300" },
];

const aiRecommendations = [
  { title: "Carpentry Help — 4hr blocks", reason: "Based on your carpentry skills", price: "$40/block", seller: "Kai N." },
  { title: "Mountain Bike — Weekly Rental", reason: "You browsed transport listings recently", price: "$15/day", seller: "Chris D." },
  { title: "Firewood Bundle (0.5 cord)", reason: "Seasonal need match — winter prep activity", price: "$45", seller: "Ben M." },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ── Page ─────────────────────────────────────────────────────────── */

export default function MarketplacePage() {
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Marketplace & <span className="italic">Resources</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Tool sharing, produce, services, and skill exchanges</p>
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
        {stats.map((s) => (
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

      {/* AI Recommendations */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-amber/20 bg-amber/[0.04] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-amber/15 p-1.5">
            <Sparkle size={15} weight="fill" className="text-amber" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Suggested for You</h2>
            <p className="text-[11px] text-white/35 mt-0.5">Personalized picks based on your skills and recent activity</p>
          </div>
        </div>
        <div className="space-y-2">
          {aiRecommendations.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.05] px-4 py-3 hover:bg-white/[0.07] transition-colors cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-white/80 font-medium truncate">{r.title}</div>
                <div className="text-[11px] text-amber/70 mt-0.5">{r.reason}</div>
              </div>
              <div className="ml-4 text-right shrink-0">
                <div className="text-sm font-semibold text-amber">{r.price}</div>
                <div className="text-[10px] text-white/30">{r.seller}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white cursor-pointer">All (42)</span>
        {categories.map((c) => (
          <span key={c.name} className={`rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer ${c.color}`}>
            {c.name} ({c.count})
          </span>
        ))}
      </div>

      {/* Listings grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((l) => (
          <motion.div key={l.title} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer overflow-hidden">
            {/* Image with badge overlay */}
            <div className="relative">
              <img
                src={l.img}
                alt={l.title}
                className="w-full h-36 object-cover rounded-t-2xl"
              />
              <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${typeStyles[l.type]}`}>
                {l.type}
              </span>
            </div>
            {/* Card content */}
            <div className="p-4">
              <h3 className="text-sm text-white/80 font-medium mb-1 line-clamp-2">{l.title}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/30">{l.seller}</span>
                <span className="text-sm font-semibold text-amber">{l.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-2.5 text-left text-xs uppercase text-white/30 font-medium">Item</th>
                <th className="py-2.5 text-left text-xs uppercase text-white/30 font-medium">Buyer</th>
                <th className="py-2.5 text-left text-xs uppercase text-white/30 font-medium">Seller</th>
                <th className="py-2.5 text-left text-xs uppercase text-white/30 font-medium">Type</th>
                <th className="py-2.5 text-right text-xs uppercase text-white/30 font-medium">Amount</th>
                <th className="py-2.5 text-right text-xs uppercase text-white/30 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 text-sm text-white/70">{t.item}</td>
                  <td className="py-3 text-xs text-white/50">{t.buyer}</td>
                  <td className="py-3 text-xs text-white/50">{t.seller}</td>
                  <td className="py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeStyles[t.type]}`}>{t.type}</span></td>
                  <td className="py-3 text-right text-sm font-medium text-white">{t.amount}</td>
                  <td className="py-3 text-right text-xs text-white/40">{t.date}</td>
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
