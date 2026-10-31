import type { Metadata } from "next";
import Image from "next/image";
import { InterestForm } from "./InterestForm";

// /proof-of-winter: landing page for the proposed prize program. Open link, noindex until Mike approves.
// ⚠️ Public: check facts.md before adding claims. Nothing about legal matters, land price, revenue or investment terms.

export const metadata: Metadata = {
  title: "Proof of Winter",
  description: "Everything works in July. A proposed set of challenge prizes in Clearwater, BC, Canada, where winter decides and every result is published by name.",
  robots: { index: false, follow: false, noarchive: true },
};

const IMG = "/images/grants";

type Prize = {
  name: string;
  field: string;
  photo: string;
  alt: string;
  pitch: string;
  purse: string;
  first: string;
  who: string;
  win: string;
  rules: string[];
  why: React.ReactNode;
  open: string;
};

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/30 underline-offset-2 hover:decoration-ink">
      {children}
    </a>
  );
}

const PRIZES: Prize[] = [
  {
    name: "Tractor Zero",
    field: "Food and machines",
    photo: "golf-course-aerial",
    alt: "Aerial view of the golf course and valley",
    pitch: "Take a tractor older than most of its entrants, and make it work alone.",
    purse: "C$200K",
    first: "Autumn 2028",
    who: "Any team, anywhere",
    win: "The most work done across mow, haul, crop-row and snow-clearing runs, in autumn and again after winter. A safety fault voids the run.",
    rules: [
      "Tractor 30+ years old",
      "Drive parts under C$5K, receipts and designs published",
      "Safety system outside the cap, signed off by an independent reviewer",
      "Fenced course, no bystanders, no remote control during a run",
      "Public finale: a mowed image judged from the air",
    ],
    why: (
      <>
        Open-source steering kits <Src href="https://agopen.shop/">cost about €2,000</Src>. A commercial driverless retrofit{" "}
        <Src href="https://www.farm-equipment.com/articles/21992-what-it-takes-to-sell-and-service-autonomy-kits">was quoted near $65,000 plus $10,000 a year</Src> in 2023. The gap is safety, so that&apos;s what gets tested.
      </>
    ),
    open: "Insurance quote, WorkSafeBC rules, safety reviewer, cost of the safety system.",
  },
  {
    name: "The Winter House",
    field: "Housing",
    photo: "sauna-in-snow",
    alt: "Sauna by the river in snow",
    pitch: "The cheapest house that holds its warmth for two winters, proven on a meter and not a brochure.",
    purse: "C$350K",
    first: "Results spring 2031",
    who: "Designers, builders, students, any tool including AI",
    win: "Lowest build cost plus metered heat across two winters, holding 18°C inside.",
    rules: [
      "Cap per m² set after independent materials pricing, before rules open",
      "Receipts audited, AI use disclosed, plans published",
      "Fits on one trailer, four people assemble it",
      "Walls and roof also pass ember exposure at an accredited lab, after a winter on site",
      "Nobody lives in it during testing",
    ],
    why: (
      <>
        Wildfire-resistant features can <Src href="https://headwaterseconomics.org/natural-hazards/wildfire/construction-costs-for-wildfire-resistant-homes/">add under 3% to a standard new home</Src>. Whether the cheapest kit houses can pass is the open question.
      </>
    ),
    open: "Permits for test structures, engineer, lab quote. No ember standard for Canada confirmed yet.",
  },
  {
    name: "Village on a Trailer",
    field: "Energy",
    photo: "festival-arcade-at-night",
    alt: "Arcade lit up at night at a festival",
    pitch: "Power, water and connection for 50 people, towed in on one trailer, for the day the grid is gone.",
    purse: "C$300K",
    first: "Summer 2028",
    who: "Any team, anywhere",
    win: "Least fuel per person per day against a published load, at a live gathering and in a 72-hour cold run.",
    rules: [
      "One road-legal trailer",
      "Supplies 50 people for 7 days off-grid",
      "Same fixed load for every team, metered",
      "Passes electrical inspection",
    ],
    why: <>Emergency camps and big events often lean on diesel generators. We found no public, side-by-side test of who does the job on the least fuel in the cold.</>,
    open: "Inspector, generator rules, and a sourced baseline for what camps burn today.",
  },
  {
    name: "The AI-Off Games",
    field: "Education",
    photo: "meetup-circle",
    alt: "People gathered in a circle at a meetup",
    pitch: "Teach an adult a real skill with any AI tutor. Switch the AI off. See what's still there in spring.",
    purse: "C$100K",
    first: "Results spring 2028",
    who: "Teams building AI tutors and learning methods",
    win: "The tutor whose learners do best on the task with no AI, live in autumn and proctored six months later.",
    rules: [
      "Adult volunteers, assigned to tutors by lottery",
      "A hands-on skill nobody has tried, revealed on the day",
      "Same task for everyone, scored blind",
      "Results published even when the AI loses",
    ],
    why: (
      <>
        Studies disagree: one group <Src href="https://pubmed.ncbi.nlm.nih.gov/40560616/">scored 17% worse without AI</Src> after practising with it, another{" "}
        <Src href="https://arxiv.org/html/2607.08849v2">kept a gain a week later</Src>. Researchers are measuring this. We found no prize paying on it.
      </>
    ),
    open: "This is a contest, not a causal trial. A full school trial would be a separate gift, led by an outside evaluator.",
  },
  {
    name: "The Relaunch",
    field: "Work",
    photo: "bunk-cabins",
    alt: "Bunk cabins on the property",
    pitch: "A month, C$10K and a workshop, for people shut out of work. Are they still earning after the winter?",
    purse: "C$10K each, 20 people",
    first: "May 2028",
    who: "People who lost work to automation or can't get a first job",
    win: "Earned income at 12 months, checked independently, against a waitlist chosen by lottery. The program is scored, and so are we.",
    rules: [
      "Selection by lottery among those who qualify",
      "A month on site with the shop, mentors and any AI tools",
      "Make something to sell, or start a trade",
      "Income results published whatever they show",
    ],
    why: (
      <>
        The door is closing at the start, not the end. In Canada the job-finding gap for AI-exposed work{" "}
        <Src href="https://www.bankofcanada.ca/2026/08/sparks-at-bank-article-2026-19/">went from −2.2 to −13.9 points</Src> while layoffs barely moved. The Bank of Canada says that isn&apos;t proof of cause.
      </>
    ),
    open: "Evaluator, at-cost lodging disclosed, the paperwork for paying individuals through a charity.",
  },
  {
    name: "The Walking Sculpture",
    field: "Art and engineering",
    photo: "valley-wide",
    alt: "Wide view of the valley",
    pitch: "A work of art taller than a house walks across the fairway in autumn. In spring, it has to do it again.",
    purse: "C$750K commission",
    first: "Model 2028, walk 2029",
    who: "Artist and engineer teams; five paid to build a 1 m model",
    win: "200 m unassisted in under an hour, twice, either side of winter.",
    rules: [
      "Self-propelled and stepping, at least 5 m tall",
      "Working 1 m model first, then one team commissioned",
      "Paid in stages: 55%, 30%, then 15% after the second walk",
      "Exclusion zone and a dead-man stop",
    ],
    why: (
      <>
        The great ones are city projects: <Src href="https://actu.fr/occitanie/toulouse_31555/grand-spectacle-de-la-machine-a-toulouse-voici-combien-va-couter-ce-show-exceptionnel_61677916.html">Toulouse&apos;s Minotaure cost €2.5M to build</Src>. Doing this for a fraction, in the open, on a fairway, is the challenge.
      </>
    ),
    open: "Whether C$750K buys 5 m is unproven, so the model round tests it. Steel in kind, crowd insurance.",
  },
  {
    name: "Prompt to Part",
    field: "Making",
    photo: "makerspace-workshop",
    alt: "The makerspace workshop",
    pitch: "Our first year here, almost every machine broke. Describe the broken part out loud, and hold the new one that day.",
    purse: "C$100K",
    first: "Results spring 2028",
    who: "Software, AI and maker teams; no land needed to build",
    win: "Most of ten real broken parts installed on resort machines and still working after a winter.",
    rules: [
      "Voice or text only, no CAD by hand",
      "Ten mystery parts, none safety-critical",
      "Part in hand the same day",
      "Install day open to the public",
    ],
    why: <>Every farm, resort and remote town has a shed of machines waiting on a part. A test on real breakage is harder to fake than a demo.</>,
    open: "Liability for parts used elsewhere. AI labs may close this gap quickly; if so, the prize says so.",
  },
  {
    name: "The Open Course",
    field: "Pure art",
    photo: "river-at-dusk",
    alt: "The river at dusk",
    pitch: "Eighteen holes of disc golf, and no other brief. It solves nothing. It only has to astonish you and survive.",
    purse: "C$15K per hole + C$100K best in course",
    first: "First six holes 2028",
    who: "Anyone, anywhere, free to enter",
    win: "An independent jury picks one, and players vote too. There's no score, on purpose. Every commissioned artist gets paid.",
    rules: [
      "One rule: a disc must be able to reach it",
      "Six new works a year on the existing 18-hole course",
      "Must still stand after one winter",
      "Artists keep ownership; works are on loan",
      "Every proposal passes a safety review",
    ],
    why: (
      <>
        The closest precedent for open entry and a big purse is <Src href="https://en.wikipedia.org/wiki/ArtPrize">ArtPrize</Src>, which needed a whole downtown. This asks for a course in a valley instead. Nothing&apos;s been installed yet.
      </>
    ),
    open: "Jury, safety reviewer, and whether people travel for a course as they did for a city.",
  },
];

const MONEY: [string, string, number][] = [
  ["The eight prizes, one run each", "2.8–6.45", 6.45],
  ["Operator, legal, reserve (20%)", "1.2–2.5", 2.5],
  ["Shared instruments and measurement crew", "1.0–1.75", 1.75],
  ["Second runs, only if the first results earn them", "1.0–1.5", 1.5],
  ["Second winters and 12-month follow-ups", "0.5–1.0", 1.0],
  ["Gatherings", "0.5–1.0", 1.0],
  ["Small grants and Maker Games, after sponsors", "0.3–0.8", 0.8],
];

const NOT_YET: [string, string][] = [
  ["Funder", "None yet. We aren't accepting gifts today; this is the start of the conversation."],
  ["Legal vehicle", "To be confirmed with charity counsel before any gift, including whether tax receipts are possible."],
  ["Judges and evaluators", "None named. Nobody on this page has agreed to anything."],
  ["Sponsors and labs", "None secured. Every prize that needs a quote waits for one before it opens."],
  ["Permits", "None for new builds. Anything that needs one waits for it."],
  ["First Nations and local government", "These conversations haven't started on this program, and should come before any site work."],
  ["Winter operations", "Guests come May to October. Winter here means our core team, so a measurement crew has to be hired."],
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`mb-4 text-[12px] font-medium uppercase tracking-[0.22em] ${light ? "text-amber" : "text-terracotta"}`}>{children}</p>;
}

function H2({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <h2 className={`font-serif text-[2.2rem] font-light leading-[1.08] sm:text-[3rem] ${light ? "text-white" : "text-ink"}`}>{children}</h2>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-[0.12em] text-ink/50">{label}</dt>
      <dd className="mt-0.5 text-[15px] leading-snug text-ink">{value}</dd>
    </div>
  );
}

function PrizeCard({ prize }: { prize: Prize }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="relative aspect-[16/8] bg-off-white">
        <Image src={`${IMG}/${prize.photo}.webp`} alt={prize.alt} fill sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[12px] font-medium text-white">{prize.field}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-[1.8rem] leading-tight text-ink">{prize.name}</h3>
        <p className="mt-2 text-[17px] leading-[1.45] text-ink/85">{prize.pitch}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ink/10 pt-4">
          <Fact label="Proposed purse" value={prize.purse} />
          <Fact label="Earliest" value={prize.first} />
          <div className="col-span-2">
            <Fact label="Who can enter" value={prize.who} />
          </div>
        </dl>
        <p className="mt-4 text-[15px] leading-[1.5] text-ink/80">
          <span className="font-medium text-ink">How you win: </span>
          {prize.win}
        </p>
        <details className="group mt-4 border-t border-ink/10 pt-3">
          <summary className="cursor-pointer list-none py-1 text-[14px] font-medium text-terracotta">
            <span className="group-open:hidden">Rules, why it matters, what&apos;s open +</span>
            <span className="hidden group-open:inline">Close −</span>
          </summary>
          <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.45] text-ink/80">
            {prize.rules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] leading-[1.5] text-ink/70">{prize.why}</p>
          <p className="mt-3 text-[14px] leading-[1.5] text-ink/55">
            <span className="font-medium">Still open: </span>
            {prize.open}
          </p>
        </details>
      </div>
    </article>
  );
}

export default function ProofOfWinterPage() {
  return (
    <div className="bg-off-white text-ink">
      {/* Hero */}
      <section className="relative flex min-h-[92dvh] items-end overflow-hidden bg-warm-dark px-4 pb-12 pt-20 sm:px-6 sm:pb-16">
        <Image src={`${IMG}/winter-dusk-panorama.webp`} alt="The valley at dusk in winter" fill priority sizes="100vw" className="object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="relative mx-auto w-full max-w-[1080px]">
          <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.22em] text-amber">Proof of Winter · A proposal · Clearwater, BC, Canada</p>
          <h1 className="font-serif text-[3.4rem] font-light leading-[1] text-white sm:text-[6rem]">Everything works in July.</h1>
          <p className="mt-6 max-w-[680px] text-[18px] leading-[1.55] text-white/90 sm:text-[20px]">
            Eight proposed prizes for machines, houses, power, learning, new work and art, on a 400-acre golf and RV resort surrounded by Wells Gray Park. We set the constraints. You invent. Then winter decides, and every result is published by name.
          </p>
          <nav aria-label="Choose your path" className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {[
              ["#prizes", "I'd enter"],
              ["#funders", "I might fund it"],
              ["#council", "I'd write the rules"],
              ["#sponsors", "I'd sponsor it"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-white/40 px-5 py-3 text-center text-[15px] font-medium text-white transition hover:border-white hover:bg-white/10">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* The idea */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[680px]">
          <Eyebrow>The idea</Eyebrow>
          <H2>Any demo looks good on a nice day</H2>
          <div className="mt-8 space-y-5 text-[18px] leading-[1.65] text-ink/80">
            <p>
              We&apos;re surrounded by big claims. Robots for a few thousand dollars. Houses for a fraction of the price. AI that teaches anything. New careers for everyone it displaces. Some are true. Most get judged on a video.
            </p>
            <p>
              We learned this the hard way. In our first year running this place, almost every machine broke down. We had burst pipes, a heatwave, a record snowfall and about six lost golf carts. Nothing teaches you the difference between a good idea and a working one like that does.
            </p>
            <p className="font-serif text-[1.7rem] leading-snug text-ink">
              So every prize here ends with the same question: is it still working after the winter?
            </p>
            <p>Is the tractor still running? Is the house still warm? Does the skill survive with the AI turned off? Is the person still earning? Is the sculpture still walking? Open to anyone, side by side, failures published with the wins.</p>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section id="prizes" className="scroll-mt-4 px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>The eight prizes</Eyebrow>
          <H2>Pick your box</H2>
          <p className="mt-5 max-w-[680px] text-[17px] leading-[1.6] text-ink/70">
            These are draft rules and proposed numbers, and none has opened. Dates assume funding by mid-2027. If nobody reaches the published floor score, runners-up share a reduced amount, and the rest goes to small grants or back to the donor.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PRIZES.map((prize) => (
              <PrizeCard key={prize.name} prize={prize} />
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-ink/10 p-6 sm:p-8">
            <h3 className="font-serif text-[1.6rem] leading-tight text-ink">Smaller ways in</h3>
            <div className="mt-4 grid gap-6 text-[15px] leading-[1.55] text-ink/75 md:grid-cols-3">
              <p><span className="font-medium text-ink">The Maker Games.</span> A yearly 48-hour build weekend, with the Carve-Off and Golf Cart Reborn as rounds. Winners earn a credit toward Tractor Zero or Prompt to Part. It runs only if sponsors cover half.</p>
              <p><span className="font-medium text-ink">Winter Salad.</span> A C$25K bounty: fresh greens every week through January, off-grid, for one human hour a week, weighed and metered.</p>
              <p><span className="font-medium text-ink">Seven and Seventy.</span> Micro-grants for builds a 7-year-old and a 70-year-old make together. We publish what works, so families can copy it.</p>
            </div>
            <a href="#talk" className="mt-6 inline-block text-[15px] font-medium text-terracotta underline underline-offset-4">Tell us what you&apos;d enter, and get the draft rules</a>
          </div>
        </div>
      </section>

      {/* Why here */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1080px] gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Why here</Eyebrow>
            <H2>Great test labs exist. This is a different thing.</H2>
          </div>
          <div className="space-y-5 text-[17px] leading-[1.65] text-ink/80">
            <p>
              Canada has excellent places to test things, including{" "}
              <Src href="https://nrc.canada.ca/en/research-development/nrc-facilities/canadian-centre-housing-technology-research-facility">NRC&apos;s twin houses</Src>,{" "}
              <Src href="https://www.oldscollege.ca/smart-farm-research/index.html">Olds College&apos;s Smart Farm</Src> and{" "}
              <Src href="https://www.bcit.ca/building-science-centre-of-excellence/research-facilities/">BCIT</Src>. They have better instruments than we ever will, and we&apos;d rather learn from them and send them lab work. Their doors mostly open to clients, sponsors and manufacturers.
            </p>
            <p>
              What we couldn&apos;t find is a place where an outsider can bring a cheap claim, run it beside rivals through a winter of real use, and see the results published by name, failures included, for a prize. If it exists, <a href="#talk" className="underline underline-offset-2">tell us</a>.
            </p>
            <p>That needs somewhere with room, a shop, a road, people who&apos;ll watch, and a reason to care. We have those.</p>
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>Who&apos;s asking</Eyebrow>
          <H2>Mike Gilliland and Euvie Ivanova</H2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-white">
              <Image src={`${IMG}/future-thinkers-meetup.webp`} alt="Mike and Euvie with a Future Thinkers meetup crowd" fill sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
            </div>
            <div className="text-[17px] leading-[1.65] text-ink/80">
              <p>
                For more than ten years our podcast, Future Thinkers, has asked how technology changes the way we live. Then we stopped talking about it and took on a resort. We build things here: arcade cabinets, a treasure-hunt game, a drone-mapped digital twin, AI tools and CNC work.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  ["6 seasons", "running this place"],
                  ["~3,000", "guests a year"],
                  ["10M+", "podcast downloads"],
                  ["~10,000", "people on our list"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-serif text-[2rem] leading-none text-ink">{value}</dt>
                    <dd className="mt-1 text-[14px] text-ink/60">{label}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6">
                Also on the land: a makerspace, a 120-person gazebo with a commercial kitchen, a geodesic dome, a private lake, a first summer of forest school in 2026, and three Otherworld test festivals coming in 2027, with volunteer crews arriving early to build. We&apos;ve never run a prize, which is why a professional operator is the first hire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Council */}
      <section id="council" className="scroll-mt-4 bg-warm-dark px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow light>If you won&apos;t compete</Eyebrow>
          <H2 light>You don&apos;t enter. You write the rule.</H2>
          <p className="mt-6 max-w-[680px] text-[18px] leading-[1.6] text-white/80">
            The best question in a field usually comes from someone who&apos;d never enter a contest. We&apos;re inviting a small council of people from robotics, housing, learning, art, labour and philanthropy to decide what&apos;s worth proving next. You&apos;ll be at a table with people outside your field, far from your calendar, and you&apos;ll leave having made something: a rule people will spend years trying to meet.
          </p>
          <ol className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {[
              ["The Constraint Council", "A few days to write the next prize's rules. Members can't enter or judge the prize they wrote."],
              ["Trial Days", "Watch machines and builds face their test, then talk to the people who built them."],
              ["Judges' Week", "From year two: argue over real results, over long dinners."],
              ["The Future Thinkers Studio", "Record a conversation on site for an audience that's been listening for a decade."],
            ].map(([name, text]) => (
              <li key={name}>
                <h3 className="text-[17px] font-medium text-white">{name}</h3>
                <p className="mt-1 text-[15px] leading-[1.55] text-white/70">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[680px] text-[15px] leading-[1.6] text-white/60">
            Culture isn&apos;t a prize here. It&apos;s what happens when these people spend a week around the same fire. No one has been named yet; we&apos;re asking the first ten now.
          </p>
          <a href="#talk" className="mt-6 inline-block rounded-full bg-amber px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-amber/90">Ask about a seat</a>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="scroll-mt-4 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[680px]">
          <Eyebrow>Toolmakers and sponsors</Eyebrow>
          <H2>Put your machines where it&apos;s hard</H2>
          <div className="mt-8 space-y-4 text-[17px] leading-[1.65] text-ink/80">
            <p>Our makerspace is small today, and we&apos;re expanding it to work in most materials. Entrants need lasers, CNC, printers, batteries, sensors and steel. You&apos;d see your gear used by serious builders, on camera, in real conditions, in front of an audience that likes knowing how things are made.</p>
            <ul className="space-y-2">
              {["Your tools in the shop, and in entrants' hands", "A named class or Maker Games round, with your tools as the prize", "Honest footage and open results, through the Future Thinkers audience"].map((item) => (
                <li key={item} className="flex gap-2"><span aria-hidden className="mt-[12px] h-1 w-1 shrink-0 rounded-full bg-amber" /><span>{item}</span></li>
              ))}
            </ul>
            <p>Sponsors don&apos;t judge. If your machine fails, that gets published too, and so does how you fixed it. No sponsors are signed yet.</p>
          </div>
          <a href="#talk" className="mt-6 inline-block text-[15px] font-medium text-terracotta underline underline-offset-4">Talk to us about a class</a>
        </div>
      </section>

      {/* Funders */}
      <section id="funders" className="scroll-mt-4 bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>For funders</Eyebrow>
          <H2>Up to C$15M over five years, released on results</H2>
          <p className="mt-6 max-w-[680px] text-[18px] leading-[1.6] text-ink/80">
            You&apos;d be funding the public test the AI age is missing: what actually holds up, for machines and for people, with open results you can check yourself. If it fails, you&apos;ll see that too, by name.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Stage 1", "C$3–4M", "Operator, measurement crew and instruments, then the prizes that need the least: Prompt to Part, the AI-Off Games and the first Relaunch cohort."],
              ["Stage 2", "To about C$10M", "Released on Stage 1's published results: Tractor Zero, the Winter House, Village on a Trailer and the sculpture model."],
              ["Stage 3", "To C$15M", "Released on Stage 2's results: the walk, second runs and the Open Course in full."],
            ].map(([stage, value, text]) => (
              <div key={stage} className="rounded-2xl bg-off-white p-6">
                <p className="text-[12px] uppercase tracking-[0.14em] text-ink/50">{stage}</p>
                <p className="mt-2 font-serif text-[2rem] leading-none text-ink">{value}</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-ink/70">{text}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-12 text-[16px] font-medium text-ink">Where it goes (C$M, low to high)</h3>
          <div className="mt-5 max-w-[760px] space-y-4">
            {MONEY.map(([label, range, high]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between gap-4 text-[15px]">
                  <span className="text-ink/80">{label}</span>
                  <span className="shrink-0 font-medium text-ink">{range}</span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-r bg-off-white">
                  <div className="h-full rounded-r bg-amber" style={{ width: `${(high / 6.45) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-3 text-[15px]">
              <span className="font-medium text-ink">Total</span>
              <span className="font-medium text-ink">7.3–15</span>
            </div>
          </div>
          <p className="mt-6 max-w-[760px] text-[14px] leading-[1.6] text-ink/55">
            These are our estimates, with no quotes behind them yet. Getting real quotes is part of Stage 1. Purses are deliberately modest: the money goes to measuring honestly, because that&apos;s the scarce part.
          </p>
          <a href="#talk" className="mt-6 inline-block rounded-full bg-amber px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-amber/90">Ask for the briefing</a>
        </div>
      </section>

      {/* Not yet */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>Straight answers</Eyebrow>
          <H2>What doesn&apos;t exist yet</H2>
          <p className="mt-5 max-w-[680px] text-[17px] leading-[1.6] text-ink/70">A program about proof should start by showing its own gaps.</p>
          <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {NOT_YET.map(([term, text]) => (
              <div key={term} className="border-t border-ink/10 pt-3">
                <dt className="text-[16px] font-medium text-ink">{term}</dt>
                <dd className="mt-1 text-[15px] leading-[1.55] text-ink/70">{text}</dd>
              </div>
            ))}
          </dl>
          <details className="group mt-10 border-t border-ink/10 pt-4">
            <summary className="cursor-pointer list-none text-[15px] font-medium text-terracotta">How we chose these prizes +</summary>
            <p className="mt-3 max-w-[680px] text-[15px] leading-[1.6] text-ink/70">
              We started with 178 ideas and narrowed them using AI review panels with separate roles for story, feasibility, cost and red-team attack, kept apart from the panels writing the ideas. No outside human expert has reviewed this yet, and we want that next. The AI-panel scores are a sorting tool, not a credential.
            </p>
          </details>
        </div>
      </section>

      {/* Talk */}
      <section id="talk" className="scroll-mt-4 bg-warm-dark px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[680px]">
          <Eyebrow light>Start here</Eyebrow>
          <H2 light>Tell us where you fit</H2>
          <p className="mt-5 mb-8 text-[17px] leading-[1.6] text-white/75">This is a proposal, so telling us what&apos;s wrong with it counts. It isn&apos;t an application or a donation form.</p>
          <InterestForm />
        </div>
      </section>
    </div>
  );
}
