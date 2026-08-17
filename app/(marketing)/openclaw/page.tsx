import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CheckIcon,
  CheckCircleIcon,
  XIcon,
  PaletteIcon,
  CodeIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  PenNibIcon,
  TerminalWindowIcon,
  UsersThreeIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  PlugsConnectedIcon,
  LightningIcon,
  BooksIcon,
  CalendarCheckIcon,
  RocketLaunchIcon,
  StackIcon,
  ChatsCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "OpenClaw Setup + Your Agent Crew — Design Spore",
  description:
    "I install OpenClaw on your machine, give you a crew of named AI agents with defined roles, and run a monthly group where we build new capability together. $1,000 setup, $400/mo.",
};

/* ── DATA ─────────────────────────────────────────────────────── */

const walls = [
  {
    Icon: TerminalWindowIcon,
    headline: "The install works. Then you stare at it.",
    body: "Getting OpenClaw running is the easy part. Knowing what to point it at — which parts of your business are actually worth automating first — is the part nobody hands you.",
  },
  {
    Icon: UsersThreeIcon,
    headline: "One do-everything agent does nothing well",
    body: "Most people end up with a single generic assistant carrying every task. No roles, no memory of how it works, no consistency. A crew with defined jobs behaves completely differently.",
  },
  {
    Icon: CloudArrowUpIcon,
    headline: "Nowhere to put what you build",
    body: "An automation that only runs while your laptop is open isn't a system. Real ones need somewhere to live, a domain, and a way to push changes without a DevOps detour.",
  },
  {
    Icon: ChatsCircleIcon,
    headline: "Nobody to ask when it gets weird",
    body: "The things that actually matter — the phrasing, the guardrails, the hundred small judgment calls — aren't in any documentation. They come from other people doing the same work.",
  },
];

const setupIncludes = [
  {
    Icon: TerminalWindowIcon,
    title: "OpenClaw installed and hardened",
    body: "On your Mac, Windows machine, or a dedicated VPS. Configured properly, not just running.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Keys, billing, and spend guardrails",
    body: "Model access wired up with limits and approvals so nothing burns through your budget overnight.",
  },
  {
    Icon: UsersThreeIcon,
    title: "Your full agent crew, installed",
    body: "Six named agents with the SOUL.md files I've written and refined through real production use.",
  },
  {
    Icon: PlugsConnectedIcon,
    title: "Connected to what you already use",
    body: "Email, calendar, Drive, your CRM, Slack or Telegram — so the crew works on your real material, not demos.",
  },
  {
    Icon: LightningIcon,
    title: "Two automations built live with you",
    body: "Pulled from your actual business, built while you watch, so you can see how the pattern works and repeat it.",
  },
  {
    Icon: RocketLaunchIcon,
    title: "A deploy target that's already yours",
    body: "Space on Design Spore's Hetzner infrastructure, ready for the first thing you and your crew ship.",
  },
  {
    Icon: BooksIcon,
    title: "A recording of your exact install",
    body: "Not a generic tutorial — a walkthrough of your machine, your setup, your decisions, to rewatch anytime.",
  },
  {
    Icon: CalendarCheckIcon,
    title: "30 days of setup support",
    body: "Direct access while you get your footing, so a small snag doesn't stall the whole thing for a week.",
  },
];

const crew = [
  {
    initial: "L",
    name: "Leo",
    role: "Design & UI/UX",
    Icon: PaletteIcon,
    body: "Owns how things look and feel. Landing pages, brand systems, interface work, visual critique before anything ships.",
    skills: ["Brand systems", "UI/UX", "Design critique"],
  },
  {
    initial: "C",
    name: "Cris",
    role: "Code & Builds",
    Icon: CodeIcon,
    body: "Writes and ships the actual software. Web apps, scripts, integrations, refactors — the one you hand a hard technical problem.",
    skills: ["Full-stack", "Integrations", "Debugging"],
  },
  {
    initial: "M",
    name: "Marcus",
    role: "Operations",
    Icon: GearSixIcon,
    body: "Runs the recurring machinery. Scheduled jobs, inbox triage, follow-ups, reporting rhythms, the things that must happen weekly.",
    skills: ["Automations", "Scheduling", "Follow-up"],
  },
  {
    initial: "N",
    name: "Nora",
    role: "Research & Intel",
    Icon: MagnifyingGlassIcon,
    body: "Goes and finds out. Market scans, competitor teardowns, prospect research, sourcing the facts before a decision gets made.",
    skills: ["Deep research", "Competitive intel", "Sourcing"],
  },
  {
    initial: "A",
    name: "Ada",
    role: "Data & Reporting",
    Icon: ChartBarIcon,
    body: "Turns scattered numbers into something you can act on. Dashboards, spreadsheets, recurring reports that arrive without being asked.",
    skills: ["Dashboards", "Analysis", "Recurring reports"],
  },
  {
    initial: "I",
    name: "Iris",
    role: "Words & Content",
    Icon: PenNibIcon,
    body: "Handles everything written in your voice. Proposals, newsletters, site copy, social — trained on how you actually sound.",
    skills: ["Copywriting", "Newsletters", "Proposals"],
  },
];

const sharedLanguage = [
  {
    line: "This one's a job for Cris.",
    note: "Everyone knows exactly which agent that means, and what it'll do with the task.",
  },
  {
    line: "Give Leo the new UI/UX skill.",
    note: "A skill built by anyone in the group drops straight into the same agent on your machine.",
  },
  {
    line: "Marcus should be running that weekly.",
    note: "Recurring work has an obvious owner instead of living in your head.",
  },
];

const circleIncludes = [
  {
    Icon: ChatsCircleIcon,
    title: "Monthly live group call",
    body: "Ninety minutes. Questions answered, screens shared, problems debugged in front of everyone.",
  },
  {
    Icon: LightningIcon,
    title: "New capability built live",
    body: "Each call we build something new together — and everyone leaves with it installed, not just described.",
  },
  {
    Icon: StackIcon,
    title: "Skill drops",
    body: "New agent skills published to the group as they're built. Drop them in and your crew gets sharper.",
  },
  {
    Icon: UsersThreeIcon,
    title: "Crew updates",
    body: "As I refine the SOUL.md files in my own production setup, the improvements ship to everyone.",
  },
  {
    Icon: CloudArrowUpIcon,
    title: "Hosting included",
    body: "Sites and apps you or your crew build get deployed on Design Spore's Hetzner infrastructure.",
  },
  {
    Icon: BooksIcon,
    title: "Recordings and the group channel",
    body: "Every call recorded and indexed, plus a channel where the group trades wins and warnings between sessions.",
  },
];

const forYou = [
  "You run a business and already pay people to do repeatable work",
  "You've tried OpenClaw or Claude Code and know there's more there",
  "You'd rather own the system than rent another SaaS seat",
  "You want a group to learn with, not a course to watch alone",
];

const notForYou = [
  "You want a hands-off, done-for-you build (that's consulting — different page)",
  "You're looking for a chatbot on your website and nothing more",
  "You won't touch a terminal, ever, even with someone walking you through it",
  "You need enterprise procurement, SOC 2, and a security review first",
];

const faqs = [
  {
    q: "What is OpenClaw, exactly?",
    a: "It's an open-source runtime for AI agents that lives on your own machine or server. Instead of talking to a chat window in a browser, you have persistent agents with their own files, memory, tools, and access to your real systems. You own the whole thing — there's no platform in the middle deciding what you can do with it.",
  },
  {
    q: "Do I need to be technical?",
    a: "You need to be willing, not skilled. If you can follow along on a screen share and copy a command when asked, the setup day covers the rest. Most of the ongoing work is describing what you want in plain language — that's the whole point of the crew.",
  },
  {
    q: "Why standardized agents instead of building my own?",
    a: "Because a shared crew makes help transferable. When everyone runs the same six agents with the same souls, a fix that works for one person works for all of them. Yours will drift and personalize over time — that's fine and expected — but the common baseline is what makes the group worth being in.",
  },
  {
    q: "What does the $400/mo actually cover?",
    a: "The monthly call, new capability built live, skill drops, crew updates, the group channel, and hosting for what you build. It does not cover your model API usage — that goes directly to Anthropic or whoever else you use, and typically runs somewhere between a few dollars and a few hundred a month depending on how hard you push it.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, monthly, no notice period. Everything installed on your machine stays yours — the agents, the automations, the skills you already have. You'd lose the calls, future drops, and hosting.",
  },
  {
    q: "How big is the group?",
    a: "Capped, deliberately. Once it's large enough that individual questions can't get answered on a call, it stops being the thing people paid for. When the current cohort fills, new people go on a list for the next one.",
  },
];

/* ── PAGE ─────────────────────────────────────────────────────── */

export default function OpenClawPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-darker border-b border-white/[0.06] section-pad">
        <div className="glow-gold" style={{ width: 700, height: 700, top: -280, right: -200 }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <p className="section-label hero-in hero-in-1">
                OpenClaw setup · Agent crew · Monthly circle
              </p>
              <h1
                className="hero-in hero-in-2 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                You&apos;ve got AI tools. What you actually need is a staff.
              </h1>
              <p className="hero-in hero-in-3 text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mb-6">
                I&apos;ll install OpenClaw on your own machine, hand you a crew of named agents
                who each own a job, and put you in a group that keeps building — so the
                lessons compound instead of getting learned twice.
              </p>
              <div className="hero-in hero-in-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/35 mb-10">
                <span className="num"><span className="text-gold font-semibold">$1,000</span> one-time setup</span>
                <span className="w-px h-4 bg-white/10 hidden sm:block" />
                <span className="num"><span className="text-gold font-semibold">$400</span>/mo crew membership</span>
                <span className="w-px h-4 bg-white/10 hidden sm:block" />
                <span>Hosting included</span>
              </div>
              <div className="hero-in hero-in-5 flex flex-wrap gap-4">
                <a
                  href="https://cal.com/mikegilliland/consulting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4"
                >
                  Book a 20-Min Fit Call <ArrowRightIcon size={16} weight="bold" />
                </a>
                <a href="#crew" className="btn-outline text-base px-8 py-4">
                  Meet the crew
                </a>
              </div>
            </div>

            {/* Right — terminal card */}
            <div className="lg:col-span-5 hero-in hero-in-4">
              <div className="rounded-xl border border-white/[0.08] bg-dark overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-raised">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gold/40" />
                  <span
                    className="ml-2 text-[11px] text-white/30 tracking-wide"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    ~/crew/leo/SOUL.md
                  </span>
                </div>
                <div
                  className="p-5 text-[12.5px] leading-[1.9] text-white/45"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  <p className="text-white/25"># Leo — Design</p>
                  <p className="mt-3">
                    <span className="text-gold/70">role:</span> Owns visual craft.
                  </p>
                  <p>
                    <span className="text-gold/70">voice:</span> Direct. Opinionated.
                  </p>
                  <p>
                    <span className="text-gold/70">never:</span> Ships a default
                  </p>
                  <p className="pl-[4.2rem]">gradient hero.</p>
                  <p className="mt-3">
                    <span className="text-gold/70">skills:</span>
                  </p>
                  <p className="pl-4">- brand-systems</p>
                  <p className="pl-4">- ui-ux-pro</p>
                  <p className="pl-4">- design-critique</p>
                  <p className="mt-3 text-white/25">
                    # Same file on every machine
                  </p>
                  <p className="text-white/25"># in the group.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE WALL ─────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">Where people get stuck</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Everyone hits the same four walls in the first month.
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {walls.map(({ Icon, headline, body }) => (
              <div key={headline} className="card-premium p-7 group">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold" weight="duotone" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {headline}
                </h3>
                <p className="text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── THE SETUP ────────────────────────────────────────── */}
      <section id="setup" className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-12">
            <div className="md:col-span-8">
              <p className="section-label">The setup — one day</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                We do it together, on your machine, in one sitting.
              </h2>
              <p className="mt-5 text-white/45 text-lg leading-relaxed max-w-2xl">
                Not a video course you&apos;ll get to eventually. A scheduled working session
                where the thing gets built, tested, and left running on your hardware.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="stat-number text-5xl md:text-6xl">$1,000</p>
              <p className="text-white/30 text-sm mt-2">one-time · everything below</p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {setupIncludes.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.07] bg-raised p-6 hover:border-gold/25 transition-all"
              >
                <Icon size={22} className="text-gold mb-4" weight="duotone" />
                <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── MEET THE CREW ────────────────────────────────────── */}
      <section id="crew" className="relative overflow-hidden section-pad bg-darker border-b border-white/[0.06]">
        <div className="glow-gold" style={{ width: 600, height: 600, bottom: -260, left: -180 }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-14 max-w-3xl">
            <p className="section-label">Meet the crew</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Six agents. Same names, same jobs, on every machine in the group.
            </h2>
            <p className="mt-5 text-white/45 text-lg leading-relaxed">
              Each one gets a SOUL.md — a written character, a defined scope, a set of
              standing instructions. I write and maintain them. You get them installed,
              and they improve as mine do.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {crew.map(({ initial, name, role, Icon, body, skills }) => (
              <div key={name} className="card-premium p-7 group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-12 h-12 shrink-0 rounded-full bg-gold/12 border border-gold/30 flex items-center justify-center">
                    <span
                      className="text-lg font-bold text-gold"
                      style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                    >
                      {initial}
                    </span>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-raised border border-white/10 flex items-center justify-center">
                      <Icon size={11} className="text-gold" weight="fill" />
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold text-white leading-tight group-hover:text-gold transition-colors"
                      style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                    >
                      {name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-white/35 mt-1">{role}</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{body}</p>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {skills.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── SHARED LANGUAGE ──────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <ScrollReveal className="md:col-span-5">
              <p className="section-label">Why standardize</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                A shared crew gives the group a shared language.
              </h2>
              <p className="mt-5 text-white/45 leading-relaxed text-lg">
                This is the part that&apos;s hard to appreciate until you&apos;re in it. When
                everyone runs the same six agents, help becomes portable. A fix stops
                being &quot;here&apos;s roughly what I did&quot; and becomes a file you drop into
                the same place on your own machine.
              </p>
              <p className="mt-4 text-white/45 leading-relaxed text-lg">
                Yours will drift over time — personalized to your business, your voice,
                your tools. That&apos;s the point. But the common baseline is what makes
                twelve people building in parallel worth more than twelve people
                building alone.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="stagger" className="md:col-span-6 md:col-start-7 space-y-4">
              {sharedLanguage.map(({ line, note }) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/[0.07] bg-dark p-6 hover:border-gold/25 transition-all"
                >
                  <p
                    className="text-lg md:text-xl text-white mb-3 leading-snug"
                    style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                  >
                    <span className="text-gold/60 mr-2">&ldquo;</span>
                    {line}
                    <span className="text-gold/60 ml-1">&rdquo;</span>
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed">{note}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── THE MONTHLY CIRCLE ───────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-12">
            <div className="md:col-span-8">
              <p className="section-label">The monthly circle</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                The setup is day one. This is the part that compounds.
              </h2>
              <p className="mt-5 text-white/45 text-lg leading-relaxed max-w-2xl">
                This field moves faster than anyone can track alone. Once a month the
                group gets together, we build something new, and everyone leaves with it
                already installed.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="stat-number text-5xl md:text-6xl">$400<span className="text-2xl text-white/30">/mo</span></p>
              <p className="text-white/30 text-sm mt-2">cancel anytime</p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {circleIncludes.map(({ Icon, title, body }) => (
              <div key={title} className="card-premium p-7">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold" weight="duotone" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </ScrollReveal>

          {/* Hosting callout */}
          <ScrollReveal className="mt-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 rounded-2xl border border-gold/20 bg-gold/[0.04] p-7">
              <CloudArrowUpIcon size={32} className="text-gold shrink-0" weight="duotone" />
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">
                  Hosting is included — and it&apos;s the same infrastructure I run everything on.
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  Sites, dashboards, internal tools, agent-facing APIs — whatever you and
                  your crew build gets deployed to Design Spore&apos;s Hetzner servers with a
                  domain, SSL, and a push-to-deploy workflow. No separate hosting bill, no
                  DevOps rabbit hole, no waiting on me to click something.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">Pricing</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              One setup fee. One monthly. That&apos;s the whole thing.
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Setup */}
            <div className="relative flex flex-col rounded-2xl border border-gold/30 bg-gold/[0.04] p-8">
              <span className="absolute -top-3 left-6 text-[11px] font-bold bg-gold text-dark px-3 py-1 rounded-full uppercase tracking-wider">
                Start here
              </span>
              <p className="text-xs uppercase tracking-widest text-white/35 mb-4 mt-1">
                Step one
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="text-5xl font-bold text-gold num"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  $1,000
                </span>
                <span className="text-white/30 text-sm">one-time</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                The Setup Day
              </h3>
              <ul className="space-y-2.5 text-sm text-white/55 flex-1 mb-7">
                {[
                  "OpenClaw installed and configured on your machine",
                  "All six crew agents with maintained SOUL.md files",
                  "Connectors wired to your email, calendar, and tools",
                  "Two real automations built live with you",
                  "Recorded walkthrough of your exact install",
                  "30 days of direct setup support",
                ].map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <CheckIcon size={15} className="text-gold shrink-0 mt-1" weight="bold" />
                    {li}
                  </li>
                ))}
              </ul>
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center w-full"
              >
                Book a Fit Call <ArrowRightIcon size={15} weight="bold" />
              </a>
            </div>

            {/* Membership */}
            <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-dark p-8 hover:border-gold/20 transition-all">
              <p className="text-xs uppercase tracking-widest text-white/35 mb-4 mt-1">
                Then, ongoing
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="text-5xl font-bold text-white num"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  $400
                </span>
                <span className="text-white/30 text-sm">/month</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                The Crew Membership
              </h3>
              <ul className="space-y-2.5 text-sm text-white/55 flex-1 mb-7">
                {[
                  "Monthly 90-minute live group call",
                  "New capability built live, installed for everyone",
                  "Skill drops as they're built",
                  "Ongoing crew and SOUL.md updates",
                  "Hosting on Design Spore's Hetzner infrastructure",
                  "Group channel + call recordings",
                ].map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <CheckIcon size={15} className="text-gold shrink-0 mt-1" weight="bold" />
                    {li}
                  </li>
                ))}
              </ul>
              <a href="#faq" className="btn-outline justify-center w-full">
                Read the details
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-6 max-w-4xl">
            <p className="text-white/30 text-sm leading-relaxed">
              Model API usage is billed separately, directly by your provider — it&apos;s
              your account, your keys, your data. Seats are capped so the calls stay
              genuinely useful.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FIT ──────────────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">Honest fit check</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              This is very good for some people and wrong for others.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal className="rounded-2xl border border-gold/20 bg-gold/[0.03] p-8">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-6">
                A fit if
              </p>
              <ul className="space-y-4">
                {forYou.map((li) => (
                  <li key={li} className="flex gap-3 text-white/60 leading-relaxed">
                    <CheckCircleIcon size={18} className="text-gold shrink-0 mt-1" weight="fill" />
                    {li}
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal className="rounded-2xl border border-white/[0.07] bg-raised p-8">
              <p className="text-xs uppercase tracking-widest text-white/35 font-semibold mb-6">
                Not a fit if
              </p>
              <ul className="space-y-4">
                {notForYou.map((li) => (
                  <li key={li} className="flex gap-3 text-white/40 leading-relaxed">
                    <XIcon size={17} className="text-white/25 shrink-0 mt-1.5" weight="bold" />
                    {li}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <ScrollReveal className="md:col-span-4">
              <p className="section-label">Questions</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                The things people ask before signing up.
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="stagger" className="md:col-span-7 md:col-start-6 space-y-3">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-white/[0.07] bg-dark px-6 py-5 hover:border-gold/20 transition-all"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none text-white font-semibold">
                    {q}
                    <span className="shrink-0 mt-0.5 text-gold transition-transform duration-300 group-open:rotate-45">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-white/50 leading-relaxed text-[15px]">{a}</p>
                </details>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden section-pad bg-dark">
        <div className="glow-gold" style={{ width: 640, height: 640, top: -240, left: "50%", marginLeft: -320 }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="section-label">Next step</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Twenty minutes tells us both whether this makes sense.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              No pitch. You describe how your business runs, I tell you what your crew
              would realistically take off your plate in the first month — and if
              there&apos;s not enough there yet, I&apos;ll say so.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base px-10 py-4"
              >
                Book a 20-Min Fit Call <ArrowRightIcon size={18} weight="bold" />
              </a>
              <a href="mailto:mike@designspore.co" className="btn-outline text-base px-10 py-4">
                Email Mike Directly
              </a>
            </div>
            <p className="mt-6 text-sm text-white/25">
              Based in Clearwater, BC. Setup days run remotely over screen share.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
