import DownloadButton from "./DownloadButton";

export const metadata = {
  title: "Résumé — Mike Gilliland",
  description: "Professional résumé for Mike Gilliland — founder, builder, AI systems consultant, and media producer.",
};

export default function ResumePage() {
  return (
    <>
      {/* Print styles injected globally for this page */}
      <style>{`
        @media print {
          @page {
            margin: 18mm 16mm;
            size: letter;
          }
          body {
            background: #fff !important;
            color: #111 !important;
            font-size: 11pt;
          }
          .resume-shell {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .page-break-before { page-break-before: always; }
          a { color: inherit !important; text-decoration: none !important; }
        }
      `}</style>

      {/* Screen chrome: back link + download button */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-6 py-3 backdrop-blur">
        <a href="/" className="font-mono text-xs text-neutral-500 transition hover:text-neutral-300">
          ← mikegilliland.ca
        </a>
        <DownloadButton />
      </div>

      {/* Resume body */}
      <div className="resume-shell mx-auto max-w-3xl px-8 py-12 print:py-0 bg-white text-neutral-900">

        {/* ── HEADER ── */}
        <header className="mb-8 flex items-start justify-between gap-6 border-b border-neutral-200 pb-8 print:border-neutral-300">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Mike Gilliland</h1>
            <p className="mt-1 text-base text-neutral-600">
              Founder · Builder · AI Systems Consultant · Media Producer
            </p>
          </div>
          <div className="text-right text-sm text-neutral-500 shrink-0">
            <p><a href="mailto:mike@designspore.co" className="hover:text-neutral-800">mike@designspore.co</a></p>
            <p><a href="https://mikegilliland.ca" className="hover:text-neutral-800">mikegilliland.ca</a></p>
            <p><a href="https://linkedin.com/in/mikevgilliland" className="hover:text-neutral-800">linkedin.com/in/mikevgilliland</a></p>
          </div>
        </header>

        {/* ── SUMMARY ── */}
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-neutral-700">
            Entrepreneur and systems builder with nearly 20 years spanning media production, digital brand
            strategy, and applied AI. Co-creator of Future Thinkers — a podcast with 130+ episodes and 5M+
            downloads — and founder of Design Spore, an AI services studio helping businesses deploy
            practical AI systems. Built and shipped multiple full-stack products including a regional
            intelligence platform, a smart village operating system, and a custom campground booking system.
            Equally comfortable directing a film shoot, designing a brand system, or architecting a
            multi-agent AI pipeline.
          </p>
        </section>

        {/* ── EXPERIENCE ── */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2">
            Experience
          </h2>
          <div className="space-y-6">

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-neutral-900">Co-Founder & Head of AI</h3>
                <span className="text-xs text-neutral-400">2020 – Present</span>
              </div>
              <p className="text-sm font-medium text-neutral-500">Design Spore · AI Services Studio</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-700 list-disc list-outside ml-4">
                <li>Built and deployed AI chatbots, automation pipelines, and custom software for businesses across hospitality, retail, and government sectors.</li>
                <li>Deliver AI readiness briefings, policy frameworks ($5K–$8K), and ongoing advisory retainers ($2,500+/mo) to local and regional governments.</li>
                <li>Developed Mission Control — a full-stack business dashboard with Kanban, CRM with Gmail import, and an AI agent fleet manager with per-run cost tracking.</li>
                <li>Organise and host regular AI-for-business meetups, positioning Design Spore as a trusted regional resource for practical AI adoption.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-neutral-900">Founder</h3>
                <span className="text-xs text-neutral-400">2020 – Present</span>
              </div>
              <p className="text-sm font-medium text-neutral-500">Portal.Place · Smart Village Prototype</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-700 list-disc list-outside ml-4">
                <li>Developing a 400-acre intentional community near Wells Gray Provincial Park as a working prototype for AI-assisted rural living.</li>
                <li>Shipped Portal.Place Intel — an AI-enriched regional intelligence feed (land deals, grants, jobs, events) with a feedback loop that improves over time.</li>
                <li>Built Village Dashboard, a smart village operating system covering members, governance, fundraising, IoT/energy, farm management, and marketplace.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-neutral-900">Co-Creator & Host</h3>
                <span className="text-xs text-neutral-400">2013 – Present</span>
              </div>
              <p className="text-sm font-medium text-neutral-500">Future Thinkers Podcast · futurethinkers.org</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-700 list-disc list-outside ml-4">
                <li>Produced 130+ long-form episodes exploring AI, technology, consciousness, and the future of civilisation — 5M+ total downloads, iTunes Top 40 in Tech.</li>
                <li>Covered by Forbes Tech Council, BBC Future, and Futurism; 200+ five-star reviews.</li>
                <li>Handled full production pipeline: research, interviewing, audio engineering, editing, show notes, distribution, and audience development.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-neutral-900">Multimedia Producer & Brand Strategist</h3>
                <span className="text-xs text-neutral-400">2005 – 2020</span>
              </div>
              <p className="text-sm font-medium text-neutral-500">Independent / Various Clients</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-700 list-disc list-outside ml-4">
                <li>Nearly 20 years in multimedia production: filming, directing, editing, colour grading, post-production, audio mixing, and motion graphics.</li>
                <li>Brand launches end-to-end: identity systems, visual design, UX/UI, web and app builds, content strategy, and go-to-market execution.</li>
                <li>Operated as a digital nomad (2012–2020), serving international clients across media, tech, wellness, and professional services sectors.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* ── SELECTED PROJECTS ── */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2">
            Selected Projects
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm print:gap-y-3">
            {[
              { name: "Portal.Place Intel", desc: "AI-enriched intelligence feed for BC/AB — Firecrawl + Claude Haiku, admin feedback loop, Zoom sync." },
              { name: "Village Dashboard", desc: "Smart village OS: members, governance, IoT, energy, farm, marketplace — deployed at portal.place." },
              { name: "Mission Control", desc: "Business dashboard with Kanban, CRM (Gmail import), and AI agent fleet manager with cost tracking." },
              { name: "Wells Gray Booking System", desc: "Custom campground booking replacing Checkfront — interactive Leaflet.js map, OTA sync to 6 platforms." },
              { name: "Portal.Place", desc: "Next.js marketing site with virtual panoramic tour, investor deck, and program pages for smart village." },
              { name: "Drawbridge", desc: "Chrome extension: annotate live websites like Figma, send tasks directly to Claude Code." },
            ].map((p) => (
              <div key={p.name}>
                <p className="font-medium text-neutral-800">{p.name}</p>
                <p className="mt-0.5 text-neutral-500 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[
              { label: "AI & Automation", items: "LLM integration, agent pipelines, chatbot development, AI policy frameworks, prompt engineering" },
              { label: "Full-Stack Development", items: "Next.js, Node.js, TypeScript, PostgreSQL, Redis, Docker, Coolify, REST APIs" },
              { label: "Media Production", items: "Filming, directing, editing, colour grading, audio engineering, post-production, motion graphics" },
              { label: "Design & Brand", items: "Visual identity, UX/UI, web design, brand strategy, go-to-market, Figma, Tailwind CSS" },
              { label: "Strategy & Consulting", items: "AI readiness assessments, government consulting, product strategy, community building" },
              { label: "Platforms & Tools", items: "Claude, OpenAI, Gemini, n8n, Stripe, Resend, Firecrawl, BullMQ, Drizzle ORM" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-medium text-neutral-800">{s.label}</p>
                <p className="mt-0.5 text-neutral-500 leading-snug">{s.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RECOGNITION ── */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2">
            Recognition & Speaking
          </h2>
          <ul className="space-y-1.5 text-sm text-neutral-700 list-disc list-outside ml-4">
            <li>Featured in <span className="font-medium">Forbes Tech Council</span>, BBC Future, and Futurism</li>
            <li>Future Thinkers Podcast — 5M+ downloads, iTunes Top 40 Tech, 200+ five-star reviews</li>
            <li>Speaker at Re:Build Festival (2021), The Stoa (2020), Collective Sapience Retreat (2023)</li>
            <li>Host of Future Thinkers Summit — community events on AI, systems thinking, and human potential</li>
          </ul>
        </section>

        {/* ── EDUCATION ── */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2">
            Education
          </h2>
          <div className="flex items-baseline justify-between text-sm">
            <div>
              <p className="font-medium text-neutral-800">Audio & Video Production</p>
              <p className="text-neutral-500">Art Institute of Vancouver</p>
            </div>
            <span className="text-xs text-neutral-400">Vancouver, BC</span>
          </div>
        </section>

      </div>
    </>
  );
}
