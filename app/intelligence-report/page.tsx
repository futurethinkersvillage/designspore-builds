import type { Metadata } from 'next'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

export const metadata: Metadata = {
  title: 'Intelligence Report — Wells Gray Resort Website Redesign',
  description:
    'Brand extraction, competitive analysis, differentiation maps, strategy brief, and design system — research deliverables for the Wells Gray Resort website rebuild.',
  robots: { index: false, follow: false },
}

const competitors = [
  {
    name: 'Clayoquot Wilderness Lodge',
    url: 'clayoquotwildernesslodge.com',
    score: '9/10',
    tier: 'World-class luxury',
    colors: ['#FFF9ED', '#343E48'],
    fonts: 'Reckless + Inter',
    radius: '0px',
    notes: 'Michelin 3 Keys. Editorial typography. Full-bleed photography. Zero card grids. Awards-first positioning.',
  },
  {
    name: 'Siwash Lake Wilderness Resort',
    url: 'siwashlake.com',
    score: '7/10',
    tier: 'Premium BC interior ranch',
    colors: ['#E9D8BA', '#EFF0E9'],
    fonts: 'Cinzel + Open Sans',
    radius: '3px',
    notes: '"Find Your Wild" positioning. Strong content but visually dated. Earthy palette. Dense layout.',
  },
  {
    name: 'Tin Poppy Retreat',
    url: 'tinpoppy.ca',
    score: '6/10',
    tier: 'BC off-grid cabin retreat',
    colors: ['#65BC7B', '#E2E2E2'],
    fonts: 'Poppins + Roboto',
    radius: '3px',
    notes: 'Good brand voice ("Far-Out. Off-Grid. World-Class."), weak execution. Simple WordPress, no differentiation.',
  },
  {
    name: 'Parksville RV Resort',
    url: 'parksvillervresort.ca',
    score: '5/10',
    tier: 'Mainstream BC RV park',
    colors: ['#9DB2B7', '#FFFFFF'],
    fonts: 'Montserrat + Open Sans',
    radius: '3px',
    notes: 'Generic booking-widget-first layout. No emotional resonance. Sets the low bar.',
  },
]

const colorMap = [
  { pattern: 'Cream/warm white background', competitors: '2/4', note: 'Top-tier sites trend warm' },
  { pattern: 'Forest/dark green', competitors: '1/4 (WG only)', note: "WG's existing brand asset" },
  { pattern: 'Blue accents', competitors: '3/4', note: 'Overused — avoid' },
  { pattern: 'Bright green accents', competitors: '1/4', note: 'Generic "nature = green"' },
  { pattern: 'Dark/atmospheric palette', competitors: '0/4', note: 'Complete market gap — WG owns this' },
  { pattern: 'Amber/ember/firelight accent', competitors: '0/4', note: 'Completely unclaimed — WG owns this' },
]

const fontMap = [
  { font: 'Open Sans / Inter / Poppins (body)', used: '4/4', note: 'Universal — no differentiation possible' },
  { font: 'Montserrat / Poppins (heading)', used: '2/4', note: 'Common, generic' },
  { font: 'Cinzel (classical serif heading)', used: '1/4', note: 'Dated' },
  { font: 'Reckless (editorial display)', used: '1/4', note: 'Premium — only the #1 site uses it' },
  { font: 'Fraunces (warm optical serif)', used: '0/4', note: 'Gap — unclaimed. WG choice.' },
]

const differentiators = [
  {
    opp: 'Dark/Atmospheric Palette',
    impact: 'Highest',
    detail: 'Every competitor uses a light palette. Going dark — specifically the warmth of old-growth forest at dusk, cedar and ember light — instantly separates WG from every competitor at a glance.',
  },
  {
    opp: 'Amber/Ember Signature Accent',
    impact: 'High',
    detail: 'No competitor uses firelight tones. WG has fire pits, a wood-fired sauna, and a community culture built around gathering. Ember (#C4703A) is the signature accent waiting to be claimed.',
  },
  {
    opp: 'Community Angle (Seasonal Village)',
    impact: 'High',
    detail: 'Siwash and Clayoquot position as individual escapes. WG\'s "Not Just a Campground — A Culture" has zero competitive equivalent. The highest-LTV customer is the seasonal village member.',
  },
  {
    opp: 'Attainable Luxury Positioning',
    impact: 'Medium-High',
    detail: 'Clayoquot is aspirational but unattainable for families. Tin Poppy is affordable but not special. WG\'s $40–$90/night range with golf, sauna, and a private lake is "attainable luxury" — owned by nobody.',
  },
  {
    opp: 'Fraunces Typography',
    impact: 'Medium',
    detail: 'Warm optical serif — reads like a handcrafted cabin sign AND a premium travel magazine. Nobody in BC glamping uses it. Immediate visual differentiation from every competitor in the set.',
  },
  {
    opp: 'Golf + Glamping Dual Appeal',
    impact: 'Medium',
    detail: 'Having a 9-hole course on-site appeals to a demographic (golfers + non-golfer families) that none of the pure-glamping competitors address. Stay N Play packages are a unique conversion vehicle.',
  },
]

const designSystem = {
  colors: [
    { token: 'bark', hex: '#1C1A14', role: 'Dark background (warm near-black)' },
    { token: 'parchment', hex: '#F0EAD9', role: 'Light background + text on dark' },
    { token: 'forest', hex: '#2C4A2E', role: 'Brand green — nav, logo context' },
    { token: 'ember', hex: '#C4703A', role: 'Signature CTA + accent (unclaimed in market)' },
    { token: 'moss', hex: '#3E5C40', role: 'Mid-green for cards/surfaces' },
    { token: 'stone', hex: '#8A7F70', role: 'Secondary/muted text' },
    { token: 'creek', hex: '#6B9AAD', role: 'Water/explore references only' },
  ],
  fonts: {
    display: 'Fraunces — optical serif (Google Fonts). Warm, handcrafted, premium. Zero competitors use it.',
    body: 'Plus Jakarta Sans — geometric sans, more characterful than Inter/Open Sans used by all competitors.',
  },
  aesthetics: [
    { dim: 'Temperature', pos: '8/10 warm', reason: 'Warmest in competitive set. Firelight palette, cedar tones.' },
    { dim: 'Contrast', pos: '7/10', reason: 'Bark + parchment + ember = strong. Differentiates from Siwash\'s low-contrast beige.' },
    { dim: 'Materiality', pos: '7/10', reason: 'Subtle grain texture on dark sections. Cinematic film feel.' },
    { dim: 'Geometry', pos: '3/10 angular', reason: '4px radius max. Nature is rock faces, not bubbles. Aligned with Clayoquot.' },
    { dim: 'Density', pos: '5/10', reason: 'Real content volume but premium breathing room. Not gallery-sparse, not packed.' },
  ],
}

export default function IntelligenceReportPage() {
  return (
    <div className="bg-parchment min-h-screen">
      {/* Report Header */}
      <header className="bg-bark border-b border-border">
        <div className="container-content py-10">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Design Intelligence Report
          </p>
          <h1 className="font-display font-light text-parchment text-4xl md:text-5xl mb-3">
            Wells Gray Golf &amp; RV Resort
          </h1>
          <p className="font-body text-parchment/60 text-sm">
            Website redesign — brand extraction, competitor analysis, strategy, and design system
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/" className="btn-outline-parchment text-xs py-2">
              ← View Live Site
            </Link>
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="container-content py-16 space-y-20 max-w-4xl mx-auto">

        {/* ─── SECTION 1: Brand Snapshot ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Brand Snapshot</h2>
          <p className="font-body text-stone text-sm mb-8">Extracted from wellsgrayresort.ca</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: 'Company', value: 'Wells Gray Golf & RV Resort' },
              { label: 'Industry', value: 'Glamping / RV resort / Golf / Seasonal community' },
              { label: 'Location', value: '6624 Clearwater Valley Rd, Clearwater BC — inside Wells Gray Provincial Park' },
              { label: 'Brand Color', value: 'Dark forest green (logo)' },
              { label: 'Existing Fonts', value: 'WordPress/Elementor defaults — no identity' },
              { label: 'Tone', value: 'Warm, grounded, community-forward, family-friendly' },
              { label: 'Core Message', value: 'Creekside camping + glamping + golf + private lake + sauna inside a BC wilderness park' },
              { label: 'Key Differentiator', value: 'Seasonal Village — "Not just a campground, a culture." No competitive equivalent.' },
            ].map(item => (
              <div key={item.label} className="p-4 bg-white border border-bark/10 rounded">
                <p className="font-body text-xs text-stone uppercase tracking-wider mb-1">{item.label}</p>
                <p className="font-body text-sm text-bark">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 2: Page Structure ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Site Architecture</h2>
          <p className="font-body text-stone text-sm mb-8">Pages rebuilt in this project</p>
          <div className="overflow-hidden rounded border border-bark/10">
            <table className="w-full text-sm font-body">
              <thead className="bg-bark text-parchment">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Page</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Route</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Priority</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Home', '/', 'Critical'],
                  ['Stay (Accommodations)', '/stay', 'Critical'],
                  ['Play (Activities)', '/play', 'Critical'],
                  ['Explore (Wells Gray Park)', '/explore', 'High'],
                  ['Seasonal Village', '/seasonal-village', 'High'],
                  ['Venue (Weddings & Events)', '/venue', 'High'],
                  ['Our Story', '/about', 'High'],
                  ['Rates', '/rates', 'High'],
                  ['Contact', '/contact', 'High'],
                  ['Intelligence Report', '/intelligence-report', 'Reference'],
                ].map(([page, route, priority], i) => (
                  <tr key={route} className={i % 2 === 0 ? 'bg-white' : 'bg-parchment/50'}>
                    <td className="px-4 py-3 text-bark">{page}</td>
                    <td className="px-4 py-3 text-stone font-mono text-xs">{route}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        priority === 'Critical' ? 'bg-ember/10 text-ember' :
                        priority === 'High' ? 'bg-forest/10 text-forest' :
                        'bg-stone/10 text-stone'
                      }`}>{priority}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── SECTION 3: Competitor Analysis ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Competitor Analysis</h2>
          <p className="font-body text-stone text-sm mb-8">4 competitors analyzed across the BC glamping and RV resort landscape</p>
          <div className="space-y-5">
            {competitors.map(c => (
              <div key={c.name} className="p-5 md:p-6 bg-white border border-bark/10 rounded-lg">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display text-bark text-xl">{c.name}</h3>
                    <p className="font-body text-xs text-stone mt-0.5">{c.url} · {c.tier}</p>
                  </div>
                  <span className="font-body text-sm font-bold text-ember shrink-0">{c.score}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  {c.colors.map(hex => (
                    <div key={hex} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-sm border border-bark/10" style={{ background: hex }} />
                      <span className="font-mono text-xs text-stone">{hex}</span>
                    </div>
                  ))}
                  <span className="font-body text-xs text-stone">· {c.fonts}</span>
                  <span className="font-body text-xs text-stone">· radius: {c.radius}</span>
                </div>
                <p className="font-body text-sm text-stone leading-relaxed">{c.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 4: Frequency Maps ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Frequency Maps</h2>
          <p className="font-body text-stone text-sm mb-8">What patterns are overused — and where the gaps are</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-bark text-xl mb-4">Color Frequency</h3>
              <div className="space-y-3">
                {colorMap.map(row => (
                  <div key={row.pattern} className="flex items-start gap-3 p-3 bg-white border border-bark/10 rounded">
                    <span className={`shrink-0 w-14 text-center font-body text-xs font-bold py-0.5 rounded ${
                      row.competitors.includes('0/4') ? 'bg-ember/10 text-ember' : 'bg-stone/10 text-stone'
                    }`}>{row.competitors}</span>
                    <div>
                      <p className="font-body text-sm text-bark">{row.pattern}</p>
                      <p className="font-body text-xs text-stone">{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-bark text-xl mb-4">Font Frequency</h3>
              <div className="space-y-3">
                {fontMap.map(row => (
                  <div key={row.font} className="flex items-start gap-3 p-3 bg-white border border-bark/10 rounded">
                    <span className={`shrink-0 w-14 text-center font-body text-xs font-bold py-0.5 rounded ${
                      row.used === '0/4' ? 'bg-ember/10 text-ember' : 'bg-stone/10 text-stone'
                    }`}>{row.used}</span>
                    <div>
                      <p className="font-body text-sm text-bark">{row.font}</p>
                      <p className="font-body text-xs text-stone">{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: Differentiation Opportunities ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Differentiation Opportunities</h2>
          <p className="font-body text-stone text-sm mb-8">Gaps in the competitive set that Wells Gray can own</p>
          <div className="space-y-4">
            {differentiators.map(d => (
              <div key={d.opp} className="p-5 md:p-6 bg-white border border-bark/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-bark text-lg">{d.opp}</h3>
                  <span className={`font-body text-xs font-bold px-2 py-0.5 rounded ${
                    d.impact === 'Highest' ? 'bg-ember/20 text-ember' :
                    d.impact === 'High' ? 'bg-forest/10 text-forest' :
                    'bg-stone/10 text-stone'
                  }`}>{d.impact} Impact</span>
                </div>
                <p className="font-body text-sm text-stone leading-relaxed">{d.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 6: Design System ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Approved Design System</h2>
          <p className="font-body text-stone text-sm mb-8">Every decision derived from brand research and competitive analysis</p>

          <div className="space-y-10">
            <div>
              <h3 className="font-display text-bark text-xl mb-5">Color Palette</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {designSystem.colors.map(c => (
                  <div key={c.token} className="rounded overflow-hidden border border-bark/10">
                    <div className="h-16" style={{ background: c.hex }} />
                    <div className="p-3 bg-white">
                      <p className="font-mono text-xs text-bark font-semibold">{c.hex}</p>
                      <p className="font-body text-xs text-stone mt-0.5">{c.token}</p>
                      <p className="font-body text-xs text-stone/70 mt-0.5 leading-tight">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-bark text-xl mb-5">Typography</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 bg-white border border-bark/10 rounded">
                  <p className="font-body text-xs text-stone uppercase tracking-wider mb-2">Display / Headings</p>
                  <p className="font-display text-bark text-3xl mb-2">Fraunces</p>
                  <p className="font-body text-xs text-stone leading-relaxed">{designSystem.fonts.display}</p>
                </div>
                <div className="p-5 bg-white border border-bark/10 rounded">
                  <p className="font-body text-xs text-stone uppercase tracking-wider mb-2">Body</p>
                  <p className="font-body text-bark text-lg mb-2">Plus Jakarta Sans</p>
                  <p className="font-body text-xs text-stone leading-relaxed">{designSystem.fonts.body}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-bark text-xl mb-5">Aesthetic Dimensions</h3>
              <div className="space-y-3">
                {designSystem.aesthetics.map(a => (
                  <div key={a.dim} className="flex items-start gap-5 p-4 bg-white border border-bark/10 rounded">
                    <div className="shrink-0 w-32">
                      <p className="font-body text-xs text-stone">{a.dim}</p>
                      <p className="font-body text-sm font-semibold text-bark">{a.pos}</p>
                    </div>
                    <p className="font-body text-sm text-stone leading-relaxed">{a.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 7: Conversion Strategy ─── */}
        <section>
          <h2 className="font-display text-bark text-3xl mb-2 pb-3 border-b border-bark/10">Conversion Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { rank: '01', label: 'Primary', goal: 'Reserve a stay', detail: 'Book overnight accommodation — dome, cabin, RV, or tent. CTAs throughout all pages.' },
              { rank: '02', label: 'Secondary', goal: 'Join Seasonal Village waitlist', detail: 'Highest LTV conversion. Dedicated page + waitlist form.' },
              { rank: '03', label: 'Tertiary', goal: 'Inquire about venue', detail: 'Weddings and events. Contact form with subject selector.' },
            ].map(g => (
              <div key={g.rank} className="p-5 bg-white border border-bark/10 rounded">
                <span className="font-mono text-3xl text-bark/20 font-bold">{g.rank}</span>
                <p className="font-body text-xs text-stone uppercase tracking-wider mt-2 mb-1">{g.label}</p>
                <p className="font-display text-bark text-lg mb-2">{g.goal}</p>
                <p className="font-body text-sm text-stone leading-relaxed">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-10 border-t border-bark/10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-body text-xs text-stone">
            Research conducted: March 2026. Competitors: wellsgrayresort.ca, clayoquotwildernesslodge.com, siwashlake.com, tinpoppy.ca, parksvillervresort.ca
          </p>
          <Link href="/" className="font-body text-xs text-ember hover:underline shrink-0">
            View Live Site →
          </Link>
        </footer>
      </main>

    </div>
  )
}
