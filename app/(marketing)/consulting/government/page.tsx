import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartLineUpIcon,
  LightbulbIcon,
  FileTextIcon,
  CalendarCheckIcon,
  WarningCircleIcon,
  MapPinIcon,
  HandshakeIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Government AI Consulting — Design Spore",
  description:
    "AI strategy, policy, and staff training for BC municipalities, regional districts, and Indigenous governments. Rural-first. Vendor-neutral. Practical.",
};

const services = [
  {
    Icon: LightbulbIcon,
    title: "Council & Leadership Briefing",
    price: "From $1,800",
    duration: "Half-day",
    desc: "A non-technical overview for elected officials and senior staff. What AI is, how it's already entering your organization, what the policy gaps are, and what peer governments are doing. Designed for a council chamber, not a tech conference.",
    deliverable: "Written briefing document + FAQ for public communications",
  },
  {
    Icon: UsersIcon,
    title: "Staff AI Literacy Training",
    price: "From $2,800",
    duration: "Full day",
    desc: "Hands-on training for department heads and frontline staff. What tools are safe to use, what isn't appropriate for government context, how to evaluate AI outputs, and practical workflows for their roles.",
    deliverable: "Training materials + acceptable use guidelines template",
  },
  {
    Icon: ShieldCheckIcon,
    title: "AI Policy & Governance Framework",
    price: "From $5,000",
    duration: "2–4 weeks",
    desc: "A practical policy framework covering acceptable use, procurement criteria, data privacy, public transparency, and staff guidelines. Written in plain language your staff will actually read — not legalese designed to sit in a drawer.",
    deliverable: "Complete policy document + implementation checklist",
  },
  {
    Icon: ChartLineUpIcon,
    title: "Use Case Assessment",
    price: "From $4,000",
    duration: "2–3 weeks",
    desc: "A structured audit of your organization's workflows to identify where AI can reduce administrative burden, improve service delivery, or free up staff time. Produces a prioritized, costed roadmap you can take to council or Treasury.",
    deliverable: "Prioritized opportunity report + budget estimates",
  },
  {
    Icon: CalendarCheckIcon,
    title: "Implementation Oversight",
    price: "$2,500/mo",
    duration: "Ongoing retainer",
    desc: "Ongoing advisory as your organization begins adopting AI tools. Vendor evaluation, procurement guidance, implementation checkpoints, and a standing advisor relationship to navigate issues as they arise.",
    deliverable: "Monthly report + standing advisory access",
  },
  {
    Icon: FileTextIcon,
    title: "RFP Response Support",
    price: "Quoted on scope",
    duration: "Varies",
    desc: "Need to issue an RFP for an AI system and don't know how to write the evaluation criteria? Or want an independent technical reviewer for proposals you've received? I can fill either role.",
    deliverable: "RFP criteria document or vendor evaluation report",
  },
];

const urgencyPoints = [
  {
    headline: "Your staff are already using AI — with or without policy",
    body: "ChatGPT, Copilot, Grammarly, and dozens of other AI tools are in use right now by public sector employees across BC. Without a policy, you have no visibility, no control over what data is being shared, and no liability protection. Every week without a framework is a week of unmanaged exposure.",
  },
  {
    headline: "Provincial and federal frameworks are being written now",
    body: "BC and the federal government are actively developing AI governance standards for the public sector. Organizations that have already built internal policies will be ahead of compliance requirements — and will have a seat at the table in shaping what those standards look like.",
  },
  {
    headline: "Residents and media are starting to ask",
    body: "AI is in the news constantly. It's only a matter of time before a resident or local journalist asks your council \"what's your AI policy?\" Having a clear, thoughtful answer is no longer optional — it's basic governance.",
  },
  {
    headline: "The efficiency gains are real and urgently needed",
    body: "Rural and regional governments are chronically understaffed relative to their service areas. AI doesn't replace staff — it eliminates the administrative overhead that burns them out. Governments that adopt early will be able to do more with what they have.",
  },
];

const approach = [
  {
    step: "01",
    title: "Free Scoping Call",
    body: "30 minutes to understand your organization's size, current situation, most urgent needs, and any constraints (budget cycles, council sensitivities, existing vendor relationships). No commitment.",
  },
  {
    step: "02",
    title: "Proposal",
    body: "A written scope of work with timeline, deliverables, and fixed price. No hourly surprises. Designed to fit within your procurement thresholds where possible to keep the process simple.",
  },
  {
    step: "03",
    title: "Engagement",
    body: "Work begins. I keep you informed throughout. Most engagements include a kickoff, working sessions with relevant staff, and a final presentation to leadership or council.",
  },
  {
    step: "04",
    title: "Handoff",
    body: "Everything I produce is yours — fully editable, not locked into a proprietary format or platform. You can implement with your own staff, extend with future consultants, or continue with ongoing advisory.",
  },
];

const fundingSources = [
  {
    name: "NDIT",
    full: "Northern Development Initiative Trust",
    desc: "Capacity-building grants for local governments and non-profits in northern and central BC. AI literacy and digital strategy are eligible project types.",
    region: "Northern & central BC",
  },
  {
    name: "UBCM Grants",
    full: "Union of BC Municipalities",
    desc: "Various grant streams for member municipalities. Community Excellence Awards and specific capacity funding programs can apply to AI readiness work.",
    region: "All BC municipalities",
  },
  {
    name: "CRTC / ISED",
    full: "Federal Digital Capacity Programs",
    desc: "Federal programs supporting digital skills and infrastructure for underserved communities and public institutions.",
    region: "National",
  },
  {
    name: "FNIGC / ISC",
    full: "Indigenous Services Canada",
    desc: "Capacity-building funding streams for First Nations governments. Digital governance and data sovereignty are active priority areas.",
    region: "Indigenous governments",
  },
];

const whyMike = [
  "Clearwater-based — understands rural governance from inside the community",
  "Sits on the Clearwater Chamber of Commerce board",
  "Active relationship with TNRD",
  "Runs public AI education events — not just serving clients, building literacy",
  "Builds real AI systems, not just slide decks",
  "No software to sell — recommendations are purely situation-based",
  "Works within public-sector procurement budgets and timelines",
  "Available in-person across the Thompson–Nicola, Okanagan, and Cariboo regions",
];

export default function GovernmentConsultingPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-darker border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-5">
              AI Consulting · Government &amp; Public Sector · BC Interior
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.92] mb-6"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Your organization already has an AI problem. The question is whether you&apos;re managing it.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mb-10">
              AI strategy, policy frameworks, and staff training for BC municipalities, regional districts, and Indigenous governments — from someone who understands rural governance and has no product to sell you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:mike@designspore.co"
                className="inline-flex items-center gap-3 px-8 py-4 rounded bg-blue-500 text-white font-bold tracking-wide hover:bg-blue-400 transition-colors"
              >
                Request a Proposal <ArrowRightIcon size={16} weight="bold" />
              </a>
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded border border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Book a Free Scoping Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY NOW ───────────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">The policy vacuum</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Why this can&apos;t wait until next budget cycle.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {urgencyPoints.map(({ headline, body }) => (
              <div
                key={headline}
                className="rounded-2xl border border-white/[0.07] bg-dark p-7 hover:border-blue-500/25 transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <WarningCircleIcon size={18} className="text-blue-400 mt-0.5 shrink-0" weight="fill" />
                  <h3
                    className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                  >
                    {headline}
                  </h3>
                </div>
                <p className="text-white/50 leading-relaxed pl-7">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">Services</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              From first briefing to full implementation.
            </h2>
            <p className="mt-3 text-white/35 text-sm">All work is fixed-scope, fixed-price. No hourly billing surprises. Designed to fit within standard procurement thresholds.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col rounded-2xl border border-white/[0.07] bg-raised p-7 hover:border-blue-500/25 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/[0.15] flex items-center justify-center shrink-0">
                    <s.Icon size={20} className="text-blue-300" weight="duotone" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-300 font-bold text-sm">{s.price}</p>
                    <p className="text-white/30 text-xs">{s.duration}</p>
                  </div>
                </div>
                <h3
                  className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {s.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm flex-1 mb-5">{s.desc}</p>
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Deliverable</p>
                  <p className="text-sm text-white/60">{s.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">The process</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Simple, low-friction, designed for public-sector realities.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {approach.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-4">
                <div className="text-4xl font-bold text-white/10" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>{step}</div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>{title}</h3>
                <p className="text-white/45 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUNDING SOURCES ───────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">Budget questions?</p>
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                There are funding sources that cover this.
              </h2>
              <p className="mt-4 text-white/45 leading-relaxed">
                Several grant programs in BC and federally support exactly this kind of capacity-building work. Many engagements can be partially or fully offset. Ask me about this in our scoping call.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-4">
              {fundingSources.map(({ name, full, desc, region }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-white/[0.07] bg-raised p-6 hover:border-blue-500/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-sm font-bold text-blue-300">{name}</span>
                      <span className="text-xs text-white/30 ml-2">· {full}</span>
                    </div>
                    <span className="shrink-0 text-[11px] text-white/30 border border-white/[0.08] rounded-full px-2.5 py-1">
                      {region}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO MIKE IS / WHY THIS WORKS ──────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Why this works</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Not a big firm. Not from Vancouver. Actually from here.
              </h2>
              <p className="mt-5 text-white/45 leading-relaxed">
                Most AI consultants who approach government are either large firms billing at enterprise rates, or urban technologists who don&apos;t understand the realities of a 12-person municipality managing a 22,000 km² service area. I do.
              </p>
              <p className="mt-4 text-white/45 leading-relaxed">
                I live in Clearwater. I sit on the Chamber board. I have a standing relationship with TNRD. When I talk about rural governance constraints, I&apos;m not reading from a case study — I&apos;m describing the community I&apos;m in.
              </p>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <div className="space-y-2">
                {whyMike.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-dark text-white/60 text-sm"
                  >
                    <CheckCircleIcon size={15} className="text-gold shrink-0 mt-0.5" weight="fill" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO APPROACH ── The real strategy for Mike ─────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">How to get started</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Government doesn&apos;t move fast. Here&apos;s how to make it easy for them.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: HandshakeIcon,
                title: "Start with a free briefing offer",
                body: "The easiest way in is a no-cost 1-hour \"AI Awareness Briefing\" for council or leadership. No sales pitch — just education. It builds trust, surfaces real concerns, and almost always leads to a paid engagement. Offer this to your existing TNRD and Chamber relationships first.",
              },
              {
                Icon: MapPinIcon,
                title: "Use your community position",
                body: "Your Chamber board seat and TNRD relationships are your warmest leads. A personal introduction from you to a CAO carries 10x the weight of a cold email. Start there. Peer-to-peer referrals between municipalities (\"Clearwater did this with Mike\") are how this scales regionally.",
              },
              {
                Icon: MegaphoneIcon,
                title: "Get on the UBCM radar",
                body: "The Union of BC Municipalities annual conference is where every local government decision-maker in BC is in one place. Apply to present on AI readiness for rural municipalities. One good talk turns into 10 conversations. LGMA events work the same way.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.07] bg-raised p-7 hover:border-gold/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold" weight="duotone" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-5">Get in touch</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              The free scoping call is the right first step.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-4 max-w-xl">
              30 minutes to talk through your situation — current AI exposure, staff concerns, policy gaps, upcoming budget cycles, and what a realistic first engagement looks like. No commitment, no sales pitch.
            </p>
            <p className="text-white/35 text-sm mb-10">
              If you prefer to send an initial email, include your organization name, rough staff count, and the most pressing AI-related issue on your radar right now. I&apos;ll respond within one business day.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded bg-blue-500 text-white text-lg font-bold tracking-wide hover:bg-blue-400 transition-colors"
              >
                Book Free Scoping Call <ArrowRightIcon size={18} weight="bold" />
              </a>
              <a
                href="mailto:mike@designspore.co"
                className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Email Mike Directly
              </a>
            </div>
            <p className="mt-6 text-sm text-white/25">
              Based in Clearwater, BC. Active with TNRD and the Clearwater Chamber of Commerce. Available in person across interior BC and remotely across Canada.
            </p>
          </div>
        </div>
      </section>

      {/* ── BACK TO BUSINESS CONSULTING ───────────────────────────── */}
      <section className="bg-dark border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
          <Link
            href="/consulting"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            ← Looking for small business consulting instead?
          </Link>
        </div>
      </section>
    </>
  );
}
