"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Circle, Hourglass } from "@phosphor-icons/react";

type Status = "done" | "in-progress" | "planned";

interface RoadmapItem {
  label: string;
  status: Status;
  detail?: string;
}

interface Phase {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  status: "current" | "next" | "vision";
  items: RoadmapItem[];
}

const PHASES: Phase[] = [
  {
    number: "01",
    title: "The Foundation",
    subtitle: "Operating now",
    status: "current",
    description:
      "The village is live and welcoming guests, work-stayers, and members across the 400-acre property near Clearwater, BC.",
    items: [
      { label: "400-acre property secured & operating", status: "done" },
      { label: "RV sites with hookups", status: "done" },
      { label: "Geodesic dome for events & gatherings", status: "done" },
      { label: "Cedar barrel sauna & cold plunge", status: "done" },
      { label: "Community gazebo & campfire grounds", status: "done" },
      { label: "9-hole disc golf course", status: "done" },
      { label: "Bunk cabins with shared facilities", status: "done" },
      { label: "Shower house & washroom facilities", status: "done" },
      { label: "Private swimming lake", status: "done" },
      { label: "Work-Stay cohort program", status: "done" },
      { label: "Seasonal membership program", status: "done" },
      { label: "Guest booking via Wells Gray Resort", status: "done" },
      { label: "Portal.Place website & virtual tour", status: "done" },
      { label: "Portal.Place Intel — regional newsletter", status: "done" },
    ],
  },
  {
    number: "02",
    title: "The Build-Out",
    subtitle: "Bridge funding in progress",
    status: "next",
    description:
      "Infrastructure expansion to support year-round residency, larger events, and a growing membership community.",
    items: [
      { label: "New private cabins (4–6 units)", status: "in-progress", detail: "Planning underway" },
      { label: "Coworking gazebo & fast WiFi nodes", status: "in-progress", detail: "Site selected" },
      { label: "Long-term RV site leases for members", status: "planned" },
      { label: "Expanded glamping offerings", status: "planned" },
      { label: "Member portal — booking priority & community board", status: "planned" },
      { label: "Village AI — guest & member assistant", status: "planned", detail: "Early prototype live" },
      { label: "Regenerative food garden", status: "planned" },
      { label: "Outdoor event infrastructure upgrades", status: "planned" },
      { label: "Partner village node (location TBD)", status: "planned" },
    ],
  },
  {
    number: "03",
    title: "The Network",
    subtitle: "Full vision",
    status: "vision",
    description:
      "A network of villages across BC and beyond — each one a node in a living community of people building a better way to live.",
    items: [
      { label: "Full-season residential membership tiers", status: "planned" },
      { label: "Village AI deployed across all nodes", status: "planned" },
      { label: "Second flagship village (BC / Pacific Northwest)", status: "planned" },
      { label: "Network membership — one membership, all locations", status: "planned" },
      { label: "Community land trust & co-ownership model", status: "planned" },
      { label: "Village design consulting for partner operators", status: "planned" },
      { label: "Annual Portal.Place gathering", status: "planned" },
      { label: "Regenerative infrastructure templates (open source)", status: "planned" },
    ],
  },
];

function StatusIcon({ status }: { status: Status }) {
  if (status === "done") return <CheckCircle size={16} weight="fill" className="text-amber shrink-0 mt-0.5" />;
  if (status === "in-progress") return <Hourglass size={16} weight="fill" className="text-amber/60 shrink-0 mt-0.5" />;
  return <Circle size={16} weight="regular" className="text-white/25 shrink-0 mt-0.5" />;
}

const STATUS_LABELS: Record<Status, string> = {
  done: "Done",
  "in-progress": "In progress",
  planned: "Planned",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-warm-dark">
      {/* Header */}
      <section className="mx-auto max-w-[1400px] px-6 pt-36 pb-20 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber mb-6">
            What&apos;s Coming
          </p>
          <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] font-light leading-[0.92] tracking-tighter text-white mb-8">
            The<br />
            <span className="italic">Roadmap</span>
          </h1>
          <p className="text-base leading-relaxed text-white/60 max-w-[52ch]">
            We&apos;re building in public. Here&apos;s what we&apos;ve built, what&apos;s in
            progress, and where we&apos;re headed. No promises, no fluff — just honest
            progress.
          </p>
        </motion.div>
      </section>

      {/* Legend */}
      <div className="mx-auto max-w-[1400px] px-6 pb-10 lg:px-16">
        <div className="flex flex-wrap gap-6 text-xs text-white/55">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} weight="fill" className="text-amber" />
            Done
          </div>
          <div className="flex items-center gap-2">
            <Hourglass size={14} weight="fill" className="text-amber/60" />
            In progress
          </div>
          <div className="flex items-center gap-2">
            <Circle size={14} weight="regular" className="text-white/25" />
            Planned
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="mx-auto max-w-[1400px] px-6 pb-32 lg:px-16">
        <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
          {PHASES.map((phase, phaseIdx) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: phaseIdx * 0.1, duration: 0.5 }}
              className="py-14"
            >
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
                {/* Phase header */}
                <div className="lg:pt-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-white/25">{phase.number}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        phase.status === "current"
                          ? "bg-amber/15 text-amber"
                          : phase.status === "next"
                          ? "bg-white/10 text-white/60"
                          : "bg-white/5 text-white/35"
                      }`}
                    >
                      {phase.subtitle}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl font-light text-white mb-4 lg:text-4xl">
                    {phase.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-white/55 max-w-[38ch]">
                    {phase.description}
                  </p>
                  {phase.status === "current" && (
                    <div className="mt-6">
                      <a
                        href="https://wellsgrayresort.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber/80"
                      >
                        Book a stay now <ArrowRight size={13} weight="bold" />
                      </a>
                    </div>
                  )}
                  {phase.status === "next" && (
                    <div className="mt-6">
                      <Link
                        href="/partner"
                        className="inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber/80"
                      >
                        Investor access <ArrowRight size={13} weight="bold" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <StatusIcon status={item.status} />
                      <div>
                        <span
                          className={`text-sm ${
                            item.status === "done"
                              ? "text-white"
                              : item.status === "in-progress"
                              ? "text-white/80"
                              : "text-white/45"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.detail && (
                          <span className="ml-2 text-xs text-amber/60">{item.detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="border-t border-white/10 bg-[#0A0910]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35 mb-4">
            Get involved
          </p>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] text-white mb-6">
            Help build what&apos;s next
          </h2>
          <p className="text-sm text-white/55 max-w-[44ch] mx-auto mb-10">
            Whether you&apos;re an investor, member, builder, or just curious — there&apos;s
            a place for you in the roadmap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Partner & invest <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Join as a member <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
