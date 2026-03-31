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
    <div className="bg-ds-bg min-h-screen font-outfit" style={{ fontFamily: 'var(--font-outfit), system-ui, sans-serif' }}>

      {/* DesignSpore Header */}
      <header className="border-b border-ds-border" style={{ background: '#131719' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>
              Design Spore
            </span>
            <span style={{ color: '#3D4142' }}>·</span>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Intelligence Report</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs px-4 py-2 border transition-colors"
              style={{ borderColor: '#3D4142', color: '#9CA3AF' }}
            >
              View Live Site
            </Link>
            <PrintButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-ds-border" style={{ background: '#1B2126' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: '#BE8C2A' }}>
            Client / Wells Gray Golf &amp; RV Resort · March 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Website Redesign<br />Intelligence Report
          </h1>
          <p className="text-base" style={{ color: '#9CA3AF' }}>
            Brand extraction · Competitor analysis · Differentiation maps · Strategy · Design system
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-16 space-y-20">

        {/* ─── SECTION 1: Brand Snapshot ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>01</span>
            <h2 className="text-2xl font-semibold text-white">Brand Snapshot</h2>
            <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>Extracted from wellsgrayresort.ca</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div key={item.label} className="p-4" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>{item.label}</p>
                <p className="text-sm text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 2: Site Architecture ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>02</span>
            <h2 className="text-2xl font-semibold text-white">Site Architecture</h2>
            <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>Pages rebuilt in this project</span>
          </div>
          <div className="overflow-hidden" style={{ border: '1px solid #3D4142' }}>
            <table className="w-full text-sm">
              <thead style={{ background: '#1B2126' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold" style={{ color: '#9CA3AF' }}>Page</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold" style={{ color: '#9CA3AF' }}>Route</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-semibold" style={{ color: '#9CA3AF' }}>Priority</th>
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
                  <tr key={route} style={{ background: i % 2 === 0 ? 'transparent' : '#1B2126' }}>
                    <td className="px-4 py-3 text-white text-sm">{page}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: '#9CA3AF' }}>{route}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold" style={{
                        background: priority === 'Critical' ? 'rgba(190,140,42,0.15)' : priority === 'High' ? 'rgba(44,74,46,0.3)' : 'rgba(61,65,66,0.5)',
                        color: priority === 'Critical' ? '#D4A44A' : priority === 'High' ? '#6B9AAD' : '#9CA3AF',
                      }}>{priority}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── SECTION 3: Competitor Analysis ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>03</span>
            <h2 className="text-2xl font-semibold text-white">Competitor Analysis</h2>
            <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>4 competitors analyzed</span>
          </div>
          <div className="space-y-4">
            {competitors.map(c => (
              <div key={c.name} className="p-5 md:p-6" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{c.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{c.url} · {c.tier}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0" style={{ color: '#BE8C2A' }}>{c.score}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  {c.colors.map(hex => (
                    <div key={hex} className="flex items-center gap-1.5">
                      <div className="w-4 h-4" style={{ background: hex, border: '1px solid #3D4142' }} />
                      <span className="font-mono text-xs" style={{ color: '#9CA3AF' }}>{hex}</span>
                    </div>
                  ))}
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>· {c.fonts}</span>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>· radius: {c.radius}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{c.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 4: Frequency Maps ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>04</span>
            <h2 className="text-2xl font-semibold text-white">Frequency Maps</h2>
            <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>Overuse patterns and gaps</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#9CA3AF' }}>Color Frequency</h3>
              <div className="space-y-2">
                {colorMap.map(row => (
                  <div key={row.pattern} className="flex items-start gap-3 p-3" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                    <span className="shrink-0 w-12 text-center text-xs font-bold py-0.5" style={{
                      background: row.competitors.includes('0/4') ? 'rgba(190,140,42,0.15)' : 'rgba(61,65,66,0.5)',
                      color: row.competitors.includes('0/4') ? '#BE8C2A' : '#9CA3AF',
                    }}>{row.competitors}</span>
                    <div>
                      <p className="text-sm text-white">{row.pattern}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#9CA3AF' }}>Font Frequency</h3>
              <div className="space-y-2">
                {fontMap.map(row => (
                  <div key={row.font} className="flex items-start gap-3 p-3" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                    <span className="shrink-0 w-12 text-center text-xs font-bold py-0.5" style={{
                      background: row.used === '0/4' ? 'rgba(190,140,42,0.15)' : 'rgba(61,65,66,0.5)',
                      color: row.used === '0/4' ? '#BE8C2A' : '#9CA3AF',
                    }}>{row.used}</span>
                    <div>
                      <p className="text-sm text-white">{row.font}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: Differentiation Opportunities ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>05</span>
            <h2 className="text-2xl font-semibold text-white">Differentiation Opportunities</h2>
          </div>
          <div className="space-y-3">
            {differentiators.map(d => (
              <div key={d.opp} className="p-5 md:p-6" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white">{d.opp}</h3>
                  <span className="text-xs font-bold px-2 py-0.5" style={{
                    background: d.impact === 'Highest' ? 'rgba(190,140,42,0.2)' : d.impact === 'High' ? 'rgba(44,74,46,0.3)' : 'rgba(61,65,66,0.5)',
                    color: d.impact === 'Highest' ? '#BE8C2A' : d.impact === 'High' ? '#6B9AAD' : '#9CA3AF',
                  }}>{d.impact} Impact</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{d.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 6: Design System ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>06</span>
            <h2 className="text-2xl font-semibold text-white">Approved Design System</h2>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: '#9CA3AF' }}>Color Palette</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {designSystem.colors.map(c => (
                  <div key={c.token} className="overflow-hidden" style={{ border: '1px solid #3D4142' }}>
                    <div className="h-14" style={{ background: c.hex }} />
                    <div className="p-3" style={{ background: '#1B2126' }}>
                      <p className="font-mono text-xs text-white font-semibold">{c.hex}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#BE8C2A' }}>{c.token}</p>
                      <p className="text-xs mt-0.5 leading-tight" style={{ color: '#9CA3AF' }}>{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: '#9CA3AF' }}>Typography</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Display / Headings</p>
                  <p className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}>Fraunces</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{designSystem.fonts.display}</p>
                </div>
                <div className="p-5" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Body</p>
                  <p className="text-2xl text-white mb-2">Plus Jakarta Sans</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{designSystem.fonts.body}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: '#9CA3AF' }}>Aesthetic Dimensions</h3>
              <div className="space-y-2">
                {designSystem.aesthetics.map(a => (
                  <div key={a.dim} className="flex items-start gap-5 p-4" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                    <div className="shrink-0 w-32">
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{a.dim}</p>
                      <p className="text-sm font-semibold text-white">{a.pos}</p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{a.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 7: Conversion Strategy ─── */}
        <section>
          <div className="flex items-baseline gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid #3D4142' }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#BE8C2A' }}>07</span>
            <h2 className="text-2xl font-semibold text-white">Conversion Strategy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { rank: '01', label: 'Primary', goal: 'Reserve a stay', detail: 'Book overnight accommodation — dome, cabin, RV, or tent. CTAs throughout all pages.' },
              { rank: '02', label: 'Secondary', goal: 'Join Seasonal Village waitlist', detail: 'Highest LTV conversion. Dedicated page + waitlist form.' },
              { rank: '03', label: 'Tertiary', goal: 'Inquire about venue', detail: 'Weddings and events. Contact form with subject selector.' },
            ].map(g => (
              <div key={g.rank} className="p-5" style={{ background: '#1B2126', border: '1px solid #3D4142' }}>
                <span className="font-mono text-3xl font-bold" style={{ color: '#3D4142' }}>{g.rank}</span>
                <p className="text-xs uppercase tracking-wider mt-2 mb-1" style={{ color: '#9CA3AF' }}>{g.label}</p>
                <p className="font-semibold text-white text-lg mb-2">{g.goal}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-10 flex flex-col sm:flex-row justify-between gap-4" style={{ borderTop: '1px solid #3D4142' }}>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Research: March 2026 · Design Spore · wellsgrayresort.ca
          </p>
          <Link href="/" className="text-xs shrink-0 hover:underline" style={{ color: '#BE8C2A' }}>
            View Live Site →
          </Link>
        </footer>
      </main>
    </div>
  )
}
