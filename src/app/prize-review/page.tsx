import type { Metadata } from "next";
import Image from "next/image";

// /prize-review: visual summary of the grant evaluation (Funding/grants/eval/results.md). Open link, noindex.
// ⚠️ Public: never put the land dispute, investor payouts, the land price or revenue on this page.

export const metadata: Metadata = {
  title: "Prize Review",
  robots: { index: false, follow: false, noarchive: true },
};

const IMG = "/images/grants";
const COST_SCALE = 1000; // C$K, shared by every award's range bar
const MONEY_SCALE = 5.8; // C$M, the largest central line

type Award = {
  name: string;
  form: string;
  photo: string;
  alt: string;
  pitch: string;
  box: string[];
  win: string;
  missing: string;
  low: number;
  high: number;
  costNote?: string;
  feature?: boolean;
};

const AWARDS: Award[] = [
  {
    name: "Tractor Zero",
    form: "Prize",
    photo: "golf-course-aerial",
    alt: "Aerial view of the golf course and valley",
    pitch: "Turn a 30-year-old tractor into a machine that works alone.",
    box: [
      "Tractor 30+ years old",
      "Retrofit parts under $5k, receipts published",
      "Safety system outside the cap and independently certified",
      "No remote human input during a run",
    ],
    win: "Unattended 2-hour mow, haul and snow-clearing tasks, three runs, zero safety faults. Public finale: a mowed image judged from the air.",
    missing: "Insurance quote, BC machinery rules, robotics contacts engaged",
    low: 180,
    high: 420,
  },
  {
    name: "The $10k House",
    form: "Prize",
    photo: "sauna-in-snow",
    alt: "Sauna by the river in snow",
    pitch: "How little can a warm, well-made house cost? Measured, not claimed.",
    box: [
      "Price the materials first, then set the cap per m²",
      "Receipts audited, AI design disclosed",
      "Flat-pack class: one trailer, published cut files",
      "Unoccupied during testing",
    ],
    win: "Sensors over two winters show the inside held warm on a capped heating budget.",
    missing: "The $10k figure has never been priced; engineer, permits",
    low: 350,
    high: 1000,
  },
  {
    name: "The Ember Test",
    form: "Prize",
    photo: "valley-forest",
    alt: "Forested valley",
    pitch: "The cheapest cabin wall and roof that survives wildfire embers.",
    box: [
      "Published ember exposure protocol",
      "Cost per m² audited",
      "Samples age one winter on site, then go to a certified lab",
      "No burning on site",
    ],
    win: "Passes at the lab at the lowest audited cost.",
    missing: "Lab partner and a written quote, required before listing",
    low: 180,
    high: 500,
  },
  {
    name: "Village on a Trailer",
    form: "Prize",
    photo: "festival-arcade-at-night",
    alt: "Arcade lit up at night at a festival",
    pitch: "Power, water and connection for 50 people, towed in on one trailer.",
    box: [
      "One trailer",
      "Supplies 50 people off-grid",
      "Passes electrical inspection",
      "Load metered, not estimated",
    ],
    win: "Lowest fuel per person-day at the 2027 test festivals, plus a 72-hour cold run.",
    missing: "Inspector, generator rules, load budget",
    low: 250,
    high: 750,
  },
  {
    name: "The AI-Off Test",
    form: "Grant",
    photo: "meetup-circle",
    alt: "People gathered in a circle at a meetup",
    pitch: "Does AI tutoring leave people able to do it once the AI is gone?",
    box: [
      "Neutral question, independent evaluator leads",
      "Control group, ethics approval, consent",
      "Delayed, proctored, AI-free exam",
      "Budget set from the evaluator's quote",
    ],
    win: "Treatment against control on the delayed AI-free test. Null results still get paid.",
    missing: "Evaluator, school partner, ethics board",
    low: 300,
    high: 800,
    costNote: "Red team guesses C$1.5–4M at real trial scale",
  },
  {
    name: "The Walking Sculpture",
    form: "Commission",
    photo: "valley-wide",
    alt: "Wide view of the valley",
    pitch: "A giant artwork that walks across the course. The one people travel to see.",
    box: [
      "Self-propelled, legged or stepping",
      "200 m across the course",
      "3 m exclusion zone, dead-man stop",
      "1 m working model first, paid 55/30/15",
    ],
    win: "Completes 200 m within an hour, unassisted, two runs.",
    missing: "Steel and welding capacity, crowd insurance",
    low: 260,
    high: 600,
  },
  {
    name: "Builder Apprenticeship",
    form: "Fellowship",
    photo: "bunk-cabins",
    alt: "Bunk cabins",
    pitch: "The award aimed most directly at people AI displaces: paid training into real trades.",
    box: [
      "Paid training on real builds",
      "Run on third-party training sites",
      "Registered training sponsor",
      "Stipends go to apprentices",
    ],
    win: "Practical exam pass rate, and who is still employed 12 months later.",
    missing: "Certifying body, training sponsor",
    low: 260,
    high: 570,
  },
  {
    name: "Prompt to Part",
    form: "Bounty",
    photo: "makerspace-workshop",
    alt: "Makerspace workshop",
    pitch: "Describe a broken part out loud, hold the replacement the same day.",
    box: [
      "Voice or text prompts only",
      "Blind set of ten real broken parts from resort machines",
      "None safety-critical",
      "Part in hand the same day",
    ],
    win: "Parts get installed and run for 30 days.",
    missing: "Liability terms for parts used elsewhere",
    low: 110,
    high: 350,
  },
  {
    name: "The Open Prize",
    form: "Commission",
    photo: "dome-at-sunset",
    alt: "The geodesic dome at sunset",
    pitch: "No brief, no problem to solve: the most astonishing work anyone can make. The one award that tests nothing.",
    box: [
      "No theme and no required use",
      "Open worldwide; every entry passes a safety review",
      "Five shortlisted artists paid to make the work, 55/30/15",
      "Shown on site in guest season, still standing after one winter",
    ],
    win: "An independent jury picks one. No score and no test, on purpose. The shortlist is paid either way.",
    missing: "Jury, safety reviewer, where finished works live. Added after the panels, so not priced or red-teamed",
    low: 150,
    high: 450,
    costNote: "Rough estimate from similar commissions, not a panel figure",
    feature: true,
  },
];

const FUNNEL: [string, number, string][] = [
  ["Ideas generated", 178, "Scored by independent reviewers on eight weighted criteria"],
  ["Shortlist", 30, "Priced, validated and given constraints by four panels"],
  ["Proposed awards", 8, "What survived the red team. Not re-scored as a set"],
];

const MONEY: [string, number, number][] = [
  ["Eight awards and ladder, one edition", 3.1, 5.8],
  ["The Open Prize (added later, rough)", 0.15, 0.3],
  ["Operator, legal, reserve", 1.4, 3.25],
  ["AI-Off at real trial scale", 1.2, 2.2],
  ["Shared test site and instruments", 1.0, 1.75],
  ["Gated second editions", 0.5, 1.25],
  ["Second winters, 12-month follow-ups", 0.5, 1.0],
  ["Bigger purses on two flagships", 0.5, 1.0],
];

const GATHER: [string, string][] = [
  ["Ten Anchors", "Recruit the first ten people everyone else wants to meet. A precondition, so it comes first."],
  ["Constraint Council", "High-level people write the next prize's rules. They can't enter or judge it."],
  ["Trial Days", "Guests watch machines and builds get tested. The only format that shows the thesis."],
  ["Future Thinkers Studio", "Conversations recorded on site. Cheap, and it already fits."],
  ["Judges' Week", "Bring the judges together with a dinner. Nothing to judge until year 2 or 3."],
];

const OPEN: [string, string][] = [
  ["Is this a story or a menu?", "The panel says the old categories were a filing system. The winter-testing line is the proposed fix, and “test sites are scarce” is still an inference."],
  ["Where is the displaced worker?", "The most exciting entries are robots doing work. Only the Apprenticeship and the AI-Off Test speak to people's capability."],
  ["Is pure art worth a place?", "The Open Prize is back by choice. Reviewers marked it down for having no test and no tie to this place, which may be the rubric's bias. The one-winter rule is a new answer to that, and no reviewer has seen it."],
  ["Are food and culture enough?", "Tractor Zero has no crop task, so it isn't a food award yet. Culture lives mostly in Gather."],
  ["Founder tools", "The zome generator, Village Stack and digital twin kept appearing. Awards must stay open to any tool."],
];

const CUT = [
  "The Untouched Meal",
  "Twin to Town",
  "The Last Network",
  "The 30-Day Blackout",
  "The Productive Hardship Prize",
  "The Dome Commission",
  "Robot Choir",
  "The Cabin Commission",
  "Group Chat to Title Deed",
  "The AI Village Manager",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.22em] text-terracotta">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-[2.2rem] font-light leading-[1.08] text-ink sm:text-[3rem]">{children}</h2>;
}

function AwardCard({ award, index }: { award: Award; index: number }) {
  const left = (award.low / COST_SCALE) * 100;
  const width = ((award.high - award.low) / COST_SCALE) * 100;
  const range = `C$${award.low}K–${award.high >= 1000 ? "1M" : `${award.high}K`}`;

  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)] ${award.feature ? "md:col-span-2" : ""}`}>
      <div className={`relative bg-off-white ${award.feature ? "aspect-[16/9] md:aspect-[21/8]" : "aspect-[16/9]"}`}>
        <Image src={`${IMG}/${award.photo}.webp`} alt={award.alt} fill sizes={award.feature ? "(max-width: 768px) 100vw, 1080px" : "(max-width: 768px) 100vw, 520px"} className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[12px] font-medium text-white">
          {index + 1} · {award.form}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-[1.75rem] leading-tight text-ink">{award.name}</h3>
        <p className="mt-2 text-[16px] leading-[1.5] text-ink/80">{award.pitch}</p>

        <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink/50">The box</p>
        <ul className="mt-2 space-y-1.5 text-[15px] leading-[1.45] text-ink/80">
          {award.box.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink/50">How you win</p>
        <p className="mt-2 text-[15px] leading-[1.45] text-ink/80">{award.win}</p>

        <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink/50">Still missing</p>
        <p className="mt-2 text-[15px] leading-[1.45] text-ink/60">{award.missing}</p>

        <div className="mt-auto pt-6" title={`${award.name}: ${range} estimated, all-in, one edition`}>
          <div className="flex items-baseline justify-between gap-3 text-[14px]">
            <span className="text-ink/50">Estimated cost</span>
            <span className="font-medium text-ink">{range}</span>
          </div>
          <div className="relative mt-2 h-2 rounded-full bg-off-white">
            <div className="absolute inset-y-0 rounded-full bg-amber" style={{ left: `${left}%`, width: `${width}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-ink/40">
            <span>0</span>
            <span>C$1M</span>
          </div>
          {award.costNote && <p className="mt-2 text-[13px] leading-snug text-terracotta">{award.costNote}</p>}
        </div>
      </div>
    </article>
  );
}

export default function PrizeReviewPage() {
  return (
    <div className="bg-off-white text-ink">
      {/* Hero */}
      <section className="relative flex min-h-[86dvh] items-end overflow-hidden bg-warm-dark px-4 pb-14 pt-24 sm:px-6 sm:pb-20">
        <Image
          src={`${IMG}/winter-dusk-panorama.webp`}
          alt="The valley at dusk in winter"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative mx-auto w-full max-w-[1080px]">
          <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.22em] text-amber">
            Working draft · Evaluation of 30 Oct 2026
          </p>
          <h1 className="max-w-[900px] font-serif text-[2.7rem] font-light leading-[1.04] text-white sm:text-[4.6rem]">
            Where claims about cheap housing, machines, power and AI-era learning get tested in public, through a real winter.
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-[1.6] text-white/80 sm:text-[19px]">
            Nine proposed awards, with open results. We set the constraints; entrants invent inside them. Eight test a claim, and one exists purely to astonish.
          </p>
        </div>
      </section>

      {/* Funnel */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>How we got here</Eyebrow>
          <H2>178 ideas in, eight out</H2>
          <div className="mt-10 space-y-6">
            {FUNNEL.map(([label, count, note]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[16px] font-medium text-ink">{label}</span>
                  <span className="font-serif text-[2rem] leading-none text-ink">{count}</span>
                </div>
                <div className="mt-2 h-3 rounded-r bg-white">
                  <div className="h-full rounded-r bg-amber" style={{ width: `${(count / 178) * 100}%` }} />
                </div>
                <p className="mt-2 text-[14px] text-ink/60">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[680px] text-[16px] leading-[1.6] text-ink/70">
            Of the 30 on the shortlist, the red team kept one as it was, changed 19 and cut 10. Reviewers were separate from the people who wrote the ideas. A ninth, pure art, was added afterward by choice: The Open Prize scored 53 out of 100, near the bottom of the art group.
          </p>
        </div>
      </section>

      {/* Awards */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>The nine</Eyebrow>
          <H2>Each award is a box, a way to win and a price</H2>
          <p className="mt-5 max-w-[680px] text-[16px] leading-[1.6] text-ink/70">
            Photos are for mood only; none of these has been built, run or quoted. Every cost is a panel estimate for one edition, on the same scale.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {AWARDS.map((award, i) => (
              <AwardCard key={award.name} award={award} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Ladder */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>Around the nine</Eyebrow>
          <H2>A way in for smaller builders</H2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-serif text-[1.5rem] text-ink">Small grants</h3>
              <p className="mt-2 text-[16px] leading-[1.55] text-ink/70">Sculpture Disc Golf, the Portal Commission and Seven and Seventy. Small sums, shown in public, a few pieces at a time.</p>
            </div>
            <div>
              <h3 className="font-serif text-[1.5rem] text-ink">The Maker Games</h3>
              <p className="mt-2 text-[16px] leading-[1.55] text-ink/70">Annual 48-hour feeder, with the Carve-Off and Golf Cart Reborn as rounds. Runs only with half its budget from sponsors in writing. No sponsor is secured.</p>
            </div>
            <div>
              <h3 className="font-serif text-[1.5rem] text-ink">Entry into the big two</h3>
              <p className="mt-2 text-[16px] leading-[1.55] text-ink/70">Maker Games winners earn entry credit into Tractor Zero and Prompt to Part. Every winner publishes, so copying becomes a rule, not an award.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gather */}
      <section className="relative overflow-hidden bg-warm-dark px-4 py-16 sm:px-6 sm:py-24">
        <div className="relative mx-auto max-w-[1080px]">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.22em] text-amber">Gather</p>
          <h2 className="font-serif text-[2.2rem] font-light leading-[1.08] text-white sm:text-[3rem]">Reasons for people to come who aren&apos;t competing</h2>
          <p className="mt-5 max-w-[680px] text-[16px] leading-[1.6] text-white/70">Prizes attract builders. These five formats give high-level people a role.</p>
          <ol className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {GATHER.map(([name, text], i) => (
              <li key={name} className="flex gap-4">
                <span className="font-serif text-[1.8rem] leading-none text-amber">{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-medium text-white">{name}</h3>
                  <p className="mt-1 text-[15px] leading-[1.5] text-white/70">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Money */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>The money</Eyebrow>
          <H2>About C$15M in stages, not $20M</H2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["C$3–4M", "First stage: operator, evaluator, instruments, an AI-Off pilot, the Ember Test and Prompt to Part"],
              ["~C$15M", "Staged ceiling. Later stages release only on published results"],
              ["C$8.35–16.55M", "What the program adds up to, low to central, with no quotes behind it"],
            ].map(([value, text]) => (
              <div key={value} className="rounded-2xl bg-white p-6">
                <p className="font-serif text-[2.2rem] leading-none text-ink">{value}</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-ink/70">{text}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 text-[16px] font-medium text-ink">Where the central C$16.55M goes (C$M)</h3>
          <div className="mt-5 space-y-4">
            {MONEY.map(([label, low, central]) => (
              <div key={label} title={`${label}: C$${low}M low, C$${central}M central`}>
                <div className="flex items-baseline justify-between gap-4 text-[15px]">
                  <span className="text-ink/80">{label}</span>
                  <span className="shrink-0 text-ink/60">
                    {low}–<span className="font-medium text-ink">{central}</span>
                  </span>
                </div>
                <div className="relative mt-1.5 h-2.5 rounded-r bg-white">
                  <div className="h-full rounded-r bg-amber" style={{ width: `${(central / MONEY_SCALE) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[680px] text-[16px] leading-[1.6] text-ink/70">
            Multi-year testing is the strongest reason to spend more. Bigger purses are the weakest: they mostly buy prestige.
          </p>
        </div>
      </section>

      {/* Open questions */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>Where the panel pushed back</Eyebrow>
          <H2>Open before this becomes a pitch</H2>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {OPEN.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-serif text-[1.45rem] leading-snug text-ink">{q}</h3>
                <p className="mt-2 text-[16px] leading-[1.55] text-ink/70">{a}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 border-t border-ink/10 pt-8">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/50">Cut from the shortlist</h3>
            <p className="mt-3 text-[16px] leading-[1.6] text-ink/60">{CUT.join(" · ")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
