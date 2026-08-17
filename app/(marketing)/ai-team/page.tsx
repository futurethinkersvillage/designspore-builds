import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  SunHorizonIcon,
  CalendarCheckIcon,
  ReceiptIcon,
  PaperPlaneTiltIcon,
  FileTextIcon,
  BriefcaseIcon,
  PenNibIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  PaletteIcon,
  CodeIcon,
} from "@phosphor-icons/react/dist/ssr";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Your Own Team of AI Agents — Design Spore",
  description:
    "Six AI agents with names and jobs, set up on your own computer, doing real work for your business. $1,000 to set up, $400/month to keep growing it.",
};

/* ── DATA ─────────────────────────────────────────────────────── */

const scenes = [
  {
    Icon: EnvelopeSimpleIcon,
    when: "A customer emails at 11pm.",
    then: "They get a real, helpful reply before you wake up — not an auto-responder. You read the thread over coffee and step in if you want to.",
  },
  {
    Icon: SunHorizonIcon,
    when: "It's Monday morning.",
    then: "A one-page summary of your business is already in your inbox. What came in, what went out, what needs you today.",
  },
  {
    Icon: CalendarCheckIcon,
    when: "Someone books a call with you.",
    then: "By the time you join, you've been handed a short brief on who they are, what they do, and what they probably want.",
  },
  {
    Icon: ReceiptIcon,
    when: "An invoice goes two weeks late.",
    then: "It's already been chased. Politely, twice. You never had to be the person who sends that email.",
  },
  {
    Icon: PaperPlaneTiltIcon,
    when: "You've been meaning to send a newsletter for months.",
    then: "It's written, in your voice, sitting in your drafts. You read it, change a line, hit send.",
  },
  {
    Icon: FileTextIcon,
    when: "A quote request comes in.",
    then: "The quote is drafted with your pricing already in it. You check the number and send it the same hour, not next week.",
  },
];

const team = [
  {
    initial: "M",
    name: "Marcus",
    role: "Your operations person",
    Icon: BriefcaseIcon,
    body: "Watches your inbox, chases what needs chasing, sends the reminders, keeps the weekly stuff from slipping.",
  },
  {
    initial: "I",
    name: "Iris",
    role: "Your writer",
    Icon: PenNibIcon,
    body: "Emails, proposals, newsletters, website copy — written the way you'd write it, not the way a robot would.",
  },
  {
    initial: "N",
    name: "Nora",
    role: "Your researcher",
    Icon: MagnifyingGlassIcon,
    body: "Finds things out. Who this client is, what competitors charge, what you should know before that meeting.",
  },
  {
    initial: "A",
    name: "Ada",
    role: "Your numbers person",
    Icon: ChartBarIcon,
    body: "Pulls your numbers together into something you'd actually read. Weekly, monthly, or whenever you ask.",
  },
  {
    initial: "L",
    name: "Leo",
    role: "Your designer",
    Icon: PaletteIcon,
    body: "Makes things look right. Landing pages, sales sheets, anything a customer is going to lay eyes on.",
  },
  {
    initial: "C",
    name: "Cris",
    role: "Your developer",
    Icon: CodeIcon,
    body: "Builds the actual tools. A booking system, a calculator for your site, something custom that didn't exist before.",
  },
];

const steps = [
  {
    n: "01",
    title: "We set it up together",
    body: "One session, about half a day, over a screen share. I handle the technical part while you watch. By the end it's running on your own computer and already doing two real jobs pulled from your business.",
  },
  {
    n: "02",
    title: "You start asking them for things",
    body: "In plain sentences, the way you'd ask a person. There are no commands to memorize. If you can write a text message, you can run your team.",
  },
  {
    n: "03",
    title: "We add to it every month",
    body: "Once a month the group gets on a call, we build something new together, and everyone leaves with it already working. This part is why people stay.",
  },
];

const faqs = [
  {
    q: "Do I need to be technical?",
    a: "No. That's what the setup day is for — I do the technical part while you watch. After that, you're talking to your team in plain English. If you can write an email, you can do this.",
  },
  {
    q: "Where does all this actually run?",
    a: "On your own computer, or on a server I set up for you. It's yours. Your business information stays with you rather than getting handed to some company's platform, and nobody can raise your price or shut it off.",
  },
  {
    q: "What is it built on?",
    a: "An open-source system called OpenClaw, running the same AI models behind Claude and ChatGPT. You don't need to know or care about any of that — it's just the engine under the hood. It matters only because it means the thing you're buying is genuinely yours.",
  },
  {
    q: "What does it cost to run each month?",
    a: "Beyond the $400, you pay the AI company directly for what your team actually uses — your own account, your own card. For most small businesses that lands somewhere between $20 and $200 a month depending on how hard you work them.",
  },
  {
    q: "What if it turns out I don't like it?",
    a: "The monthly is cancel-anytime, no notice. Everything already set up on your computer stays yours and keeps working. You'd just stop getting the monthly calls and the new things we build.",
  },
  {
    q: "How is this different from just using ChatGPT?",
    a: "A chat window waits for you to think of something and forgets you the moment you close it. Your team remembers your business, has standing jobs they do without being asked, and can actually reach into your email, calendar, and files to get work done.",
  },
];

/* ── PAGE ─────────────────────────────────────────────────────── */

export default function AiTeamPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-darker border-b border-white/[0.06] section-pad">
        <div className="glow-gold" style={{ width: 700, height: 700, top: -280, right: -200 }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-7">
              <p className="section-label hero-in hero-in-1">Set up for you · Working within a week</p>
              <h1
                className="hero-in hero-in-2 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                A team of AI agents that actually does your work.
              </h1>
              <p className="hero-in hero-in-3 text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mb-8">
                Six of them. Each with a name and a job — writing, chasing invoices,
                researching, reporting. Running on your own computer, doing the work
                you&apos;d otherwise hire someone for.
              </p>
              <div className="hero-in hero-in-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/35 mb-10">
                <span className="num">
                  <span className="text-gold font-semibold">$1,000</span> to set it up
                </span>
                <span className="w-px h-4 bg-white/10 hidden sm:block" />
                <span className="num">
                  <span className="text-gold font-semibold">$400</span>/month to keep growing it
                </span>
              </div>
              <div className="hero-in hero-in-5 flex flex-wrap gap-4">
                <a
                  href="https://cal.com/mikegilliland/consulting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4"
                >
                  Book a 20-Min Call <ArrowRightIcon size={16} weight="bold" />
                </a>
                <a href="#what-they-do" className="btn-outline text-base px-8 py-4">
                  See what they do
                </a>
              </div>
            </div>

            {/* Chat card */}
            <div className="lg:col-span-5 hero-in hero-in-4">
              <div className="rounded-2xl border border-white/[0.08] bg-dark overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-raised">
                  <span className="w-8 h-8 rounded-full bg-gold/12 border border-gold/30 flex items-center justify-center text-sm font-bold text-gold">
                    M
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">Marcus</p>
                    <p className="text-[11px] text-white/30">Your operations person</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gold/12 border border-gold/20 px-4 py-2.5">
                    <p className="text-[14px] text-white/80 leading-relaxed">
                      Who hasn&apos;t paid me yet?
                    </p>
                  </div>
                  <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-raised border border-white/[0.07] px-4 py-2.5">
                    <p className="text-[14px] text-white/60 leading-relaxed">
                      Three invoices are overdue. Hendricks is $2,400 at 18 days, Braun is
                      $890 at 11, and Silva is $1,150 at 9. Want me to send reminders?
                    </p>
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gold/12 border border-gold/20 px-4 py-2.5">
                    <p className="text-[14px] text-white/80 leading-relaxed">
                      yes, keep them friendly
                    </p>
                  </div>
                  <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-raised border border-white/[0.07] px-4 py-2.5">
                    <p className="text-[14px] text-white/60 leading-relaxed">
                      Sent. I&apos;ll follow up again Friday if nothing comes in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT THEY DO ─────────────────────────────────────── */}
      <section id="what-they-do" className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">What this looks like day to day</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Ordinary things that stop being your problem.
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenes.map(({ Icon, when, then }) => (
              <div key={when} className="card-premium p-7 group">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold" weight="duotone" />
                </div>
                <p
                  className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {when}
                </p>
                <p className="text-white/50 leading-relaxed text-[15px]">{then}</p>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal className="mt-10">
            <p className="text-white/35 text-lg max-w-2xl">
              None of that is a demo. That&apos;s just an ordinary week for someone who has
              a team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── MEET THE TEAM ────────────────────────────────────── */}
      <section id="team" className="relative overflow-hidden section-pad bg-darker border-b border-white/[0.06]">
        <div className="glow-gold" style={{ width: 600, height: 600, bottom: -260, left: -180 }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">Meet the team</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Six agents. Each one has a name and a job.
            </h2>
            <p className="mt-5 text-white/45 text-lg leading-relaxed">
              You don&apos;t operate software. You ask someone to do something, the way you
              would with staff.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map(({ initial, name, role, Icon, body }) => (
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
                <p className="text-white/50 text-[15px] leading-relaxed">{body}</p>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal className="mt-8">
            <p className="text-white/35 text-lg max-w-3xl leading-relaxed">
              Everyone I set up gets the same six. So when someone in the group says
              &ldquo;that&apos;s a job for Marcus,&rdquo; you know exactly who they mean — and when I
              make one of them better, yours gets better too.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">How it works</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Three steps, and the first one is mine.
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-white/[0.07] bg-raised p-8">
                <p
                  className="text-gold/40 text-4xl font-bold mb-5 num"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {n}
                </p>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {title}
                </h3>
                <p className="text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="section-label">What it costs</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              One setup fee, then one monthly. That&apos;s it.
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="relative flex flex-col rounded-2xl border border-gold/30 bg-gold/[0.04] p-8">
              <span className="absolute -top-3 left-6 text-[11px] font-bold bg-gold text-dark px-3 py-1 rounded-full uppercase tracking-wider">
                Start here
              </span>
              <div className="flex items-baseline gap-2 mb-2 mt-2">
                <span
                  className="text-5xl font-bold text-gold num"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  $1,000
                </span>
                <span className="text-white/30 text-sm">once</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Getting set up
              </h3>
              <ul className="space-y-3 text-[15px] text-white/55 flex-1 mb-7">
                {[
                  "Half a day together, over a screen share",
                  "All six agents installed and working",
                  "Connected to your email, calendar and files",
                  "Two real jobs from your business, set up live",
                  "A recording of your own setup to rewatch",
                  "A month of help while you find your feet",
                ].map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <CheckIcon size={15} className="text-gold shrink-0 mt-1.5" weight="bold" />
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
                Book a Call <ArrowRightIcon size={15} weight="bold" />
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-dark p-8 hover:border-gold/20 transition-all">
              <div className="flex items-baseline gap-2 mb-2 mt-2">
                <span
                  className="text-5xl font-bold text-white num"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  $400
                </span>
                <span className="text-white/30 text-sm">/month, cancel anytime</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Keeping it growing
              </h3>
              <ul className="space-y-3 text-[15px] text-white/55 flex-1 mb-7">
                {[
                  "A monthly call with the whole group",
                  "Something new built live — and installed for you",
                  "Your agents get smarter as I improve mine",
                  "Websites and tools we build get hosted for free",
                  "A group chat for questions between calls",
                  "Every call recorded, in case you miss one",
                ].map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <CheckIcon size={15} className="text-gold shrink-0 mt-1.5" weight="bold" />
                    {li}
                  </li>
                ))}
              </ul>
              <a href="#faq" className="btn-outline justify-center w-full">
                Common questions
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <ScrollReveal className="md:col-span-4">
              <p className="section-label">Questions</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                The things everyone asks first.
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="stagger" className="md:col-span-7 md:col-start-6 space-y-3">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-white/[0.07] bg-raised px-6 py-5 hover:border-gold/20 transition-all"
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
      <section className="relative overflow-hidden section-pad bg-raised">
        <div className="glow-gold" style={{ width: 640, height: 640, top: -240, left: "50%", marginLeft: -320 }} />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="section-label">Next step</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Twenty minutes. Tell me how your week goes.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              You don&apos;t need to know anything about AI to have this conversation. Just
              tell me what eats your time, and I&apos;ll tell you honestly which parts of it
              a team like this would take off your hands — and whether it&apos;s worth it yet.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base px-10 py-4"
              >
                Book a 20-Min Call <ArrowRightIcon size={18} weight="bold" />
              </a>
              <a href="mailto:mike@designspore.co" className="btn-outline text-base px-10 py-4">
                Email Mike
              </a>
            </div>
            <p className="mt-6 text-sm text-white/25">
              Based in Clearwater, BC. Setup happens remotely over a screen share.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
