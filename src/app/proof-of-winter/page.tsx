import type { Metadata } from "next";
import Image from "next/image";
import { InterestForm } from "./InterestForm";

// /proof-of-winter: landing page for the proposed prize program. Open link, noindex until Mike approves.
// ⚠️ Public: check facts.md before adding claims. Nothing about legal matters, land price, revenue or investment terms.

const DESCRIPTION = "Everything works in July. A proposed prize program in Clearwater, BC, Canada, where winter decides and the results are public.";

export const metadata: Metadata = {
  title: "Proof of Winter",
  description: DESCRIPTION,
  robots: { index: false, follow: false, noarchive: true },
  openGraph: {
    title: "Proof of Winter",
    description: DESCRIPTION,
    images: [{ url: "/images/grants/winter-dusk-panorama.webp" }],
  },
  twitter: { card: "summary_large_image", title: "Proof of Winter", description: DESCRIPTION },
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
  cost: string;
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
    name: "The Relaunch",
    field: "Work",
    photo: `${IMG}/makerspace-workshop.webp`,
    alt: "The makerspace workshop",
    pitch: "Say you're 24, you did everything right, and the entry-level job is gone. Here's a month, C$10K and a workshop. Are you still earning after the winter?",
    purse: "C$10K each, 20 people to start",
    first: "May 2028",
    who: "People who lost work to automation or can't get a first job",
    win: "There's no single winner. An outside evaluator checks earned income at 12 months against a waitlist chosen by lottery, and we publish the totals, never individuals.",
    rules: [
      "Selection by lottery among those who qualify",
      "Groups of five, May to October, so it fits the lodging we have",
      "A month with the shop, mentors and any AI tools",
      "Leave with something to sell: a product, a service, a repair business",
      "With 20 people this is a pilot, not proof. If it looks promising, it gets first call on second-run money, to 40 more",
    ],
    why: (
      <>
        The door is closing at the start, not the end. In Canada the job-finding gap for the most AI-exposed work{" "}
        <Src href="https://www.bankofcanada.ca/2026/08/sparks-at-bank-article-2026-19/">went from −2.2 points (2015–19) to −13.9 (2025)</Src> while job separations barely moved. The Bank of Canada says this isn&apos;t proof of cause.
      </>
    ),
    cost: "C$400–700K, including the evaluator",
    open: "Evaluator; the rules for paying individuals through a charity; a month away is hard for parents, and we don't have a good answer yet.",
  },
  {
    name: "Tractor Zero",
    field: "Food and machines",
    photo: `${IMG}/golf-course-aerial.webp`,
    alt: "Aerial view of the golf course and valley",
    pitch: "Take a 30-year-old tractor and make it work alone: mow a field, haul a load, run a crop row, clear real snow.",
    purse: "C$200K",
    first: "Autumn 2028 to spring 2029",
    who: "Any team, anywhere",
    win: "Most points across four timed tasks, with the table published before entries open. Autumn, a mid-winter snow run, and again in spring. A safety fault voids the run.",
    rules: [
      "Tractor 30+ years old",
      "Drive parts under C$5K, receipts and designs published",
      "Safety system outside the cap, signed off by an independent reviewer",
      "Fenced course, no bystanders, no remote control during a run",
      "Public finale: a mowed image judged from the air",
    ],
    why: (
      <>
        Open-source steering kits <Src href="https://agopen.shop/">cost about €2,000 before tax</Src>. A commercial driverless kit for new tractors{" "}
        <Src href="https://www.farm-equipment.com/articles/21992-what-it-takes-to-sell-and-service-autonomy-kits">was nearly US$65,000 plus US$10,000 a year</Src> in 2023. We think safe unattended work on an old machine is the hard part, so that&apos;s what gets tested.
      </>
    ),
    cost: "C$250–500K",
    open: "Insurance quote, WorkSafeBC rules, safety reviewer, what the safety system costs.",
  },
  {
    name: "The Walking Sculpture",
    field: "Art and engineering",
    photo: `${IMG}/valley-wide.webp`,
    alt: "Wide view of the valley",
    pitch: "A work of art as tall as a giraffe walks across the fairway in autumn. In spring, it has to do it again.",
    purse: "C$750K commission",
    first: "Models 2030, walks 2031–32",
    who: "Artist and engineer teams; five paid to build a 1 m model",
    win: "200 m unassisted in under an hour, twice, either side of winter.",
    rules: [
      "Self-propelled and stepping, at least 5 m tall",
      "Working 1 m models first, then one team commissioned",
      "Paid in stages: 55%, 30%, then 15% after the second walk",
      "Exclusion zone and a dead-man stop",
    ],
    why: (
      <>
        Machines like this are usually city projects: <Src href="https://actu.fr/occitanie/toulouse_31555/grand-spectacle-de-la-machine-a-toulouse-voici-combien-va-couter-ce-show-exceptionnel_61677916.html">Toulouse&apos;s far larger Minotaure cost €2.5M to build</Src>. Can a smaller one be done for a fraction, in the open?
      </>
    ),
    cost: "C$800K–1.8M",
    open: "Whether C$750K buys 5 m is unproven. We need an engineer's estimate; the model round tests it too. Steel in kind, crowd insurance.",
  },
  {
    name: "The Winter House",
    field: "Housing",
    photo: `${IMG}/sauna-in-snow.webp`,
    alt: "Sauna by the river in snow",
    pitch: "The cheapest house that holds its warmth for two winters, proven on a meter and not a brochure.",
    purse: "C$350K",
    first: "Built 2029, results spring 2031",
    who: "Designers, builders, students, any tool including AI",
    win: "Lowest build cost plus ten years of heat at the metered rate, among houses that held 18°C for two winters.",
    rules: [
      "Cost cap per m² set after independent materials pricing, before rules open",
      "Receipts audited, AI use disclosed, plans published",
      "Fits on one trailer, four people assemble it",
      "Nobody sleeps in it: heaters and humidity simulate two people",
      "Walls and roof must also pass an ember test at an accredited lab, after a winter outdoors",
    ],
    why: (
      <>
        Wildfire-resistant features <Src href="https://headwaterseconomics.org/natural-hazards/wildfire/construction-costs-for-wildfire-resistant-homes/">added 2–3% to a US$500K California home</Src> in one study. Whether the cheapest kit houses can pass is the open question.
      </>
    ),
    cost: "C$450K–1.2M",
    open: "Permit route for test structures, engineer, lab quote, and which ember standard applies in Canada.",
  },
  {
    name: "Village on a Trailer",
    field: "Energy",
    photo: `${IMG}/festival-arcade-at-night.webp`,
    alt: "Arcade lit up at night at a festival",
    pitch: "Power, water and connection for 50 people, towed in on one trailer, for the day the grid is gone.",
    purse: "C$300K",
    first: "Summer and winter 2030",
    who: "Any team, anywhere",
    win: "Least fuel per person per day against a published load, at a live gathering and in a 72-hour cold run. Water and connection are pass or fail.",
    rules: [
      "One road-legal trailer",
      "Supplies 50 people for 7 days off-grid",
      "Same fixed load for every team, metered",
      "Passes electrical inspection",
    ],
    why: (
      <>
        The closest precedent we found is{" "}
        <Src href="https://fm.kuac.org/changing-arctic/2017-06-30/acep-competition-seeks-solutions-to-high-energy-costs-in-remote-alaskan-communities">Alaska&apos;s 2017 microgrid competition</Src>, whose US$308,000 prize was lab time, and which wasn&apos;t aimed at garage inventors. This one is open to them.
      </>
    ),
    cost: "C$250–750K",
    open: "Inspector, generator rules, and a sourced baseline for what emergency camps burn today.",
  },
  {
    name: "The AI-Off Games",
    field: "Education",
    photo: `${IMG}/meetup-circle.webp`,
    alt: "A Future Thinkers meetup in a circle",
    pitch: "Teach an adult a real skill with any AI tutor. Switch the AI off. See what's still there in spring.",
    purse: "C$100K",
    first: "Autumn 2028, retest spring 2029",
    who: "Teams building AI tutors and learning methods",
    win: "The tutor whose learners score highest on the task with no AI, live in autumn and proctored six months later. Anyone who misses the retest counts as a zero.",
    rules: [
      "Adult volunteers, 30 per tutor, assigned by lottery",
      "A hands-on skill revealed on the day, in the shop",
      "Same task for everyone, scored blind",
      "Independent ethics review before it opens",
      "Results published even when the AI loses",
    ],
    why: (
      <>
        Studies disagree. High school students who practised math with plain ChatGPT{" "}
        <Src href="https://pubmed.ncbi.nlm.nih.gov/40560616/">scored 17% worse without it</Src>, though a guarded tutor removed the harm. A{" "}
        <Src href="https://arxiv.org/html/2607.08849v2">2026 preprint on undergraduates</Src> found a gain still there a week later. Researchers are measuring this, and we found no prize paying on it.
      </>
    ),
    cost: "C$150–400K",
    open: "This is a contest, not a causal trial, and it needs a shop more than this valley. A full school trial would be a separate gift led by an outside evaluator.",
  },
  {
    name: "Prompt to Part",
    field: "Making",
    photo: `${IMG}/valley-river.webp`,
    alt: "The river running through the valley",
    pitch: "Our first year here, almost every machine broke. Describe the broken part out loud, and hold the new one that day.",
    purse: "C$100K",
    first: "Autumn 2028 to spring 2029",
    who: "Software, AI and maker teams, wherever you are",
    win: "Most of ten real parts installed and still working in spring, on machines that run through winter. Ties go to the lowest cost.",
    rules: [
      "Voice or text only, no CAD by hand",
      "Ten mystery parts, none safety-critical",
      "Part in hand the same day",
      "Install day open to the public",
    ],
    why: <>Every farm, resort and remote town has a shed of machines waiting on a part. Real breakage is harder to fake than a demo.</>,
    cost: "C$110–350K",
    open: "Liability for parts used elsewhere. AI labs may close this gap quickly; if so, the prize will say so.",
  },
  {
    name: "The Open Course",
    field: "Pure art",
    photo: "/images/disc-golf-tournament-scaled.jpg",
    alt: "Players on the course in summer",
    pitch: "Eighteen holes of disc golf, and no other brief. It solves nothing. It only has to astonish you and survive.",
    purse: "C$15K per hole + C$100K best in course",
    first: "First six holes 2030",
    who: "Anyone, anywhere, free to enter",
    win: "A jury of three artists and curators, named before entries open, picks one, and players vote too. Every commissioned artist gets paid either way.",
    rules: [
      "One rule: a disc must be able to reach it",
      "Six new works a year on the existing 18-hole course, among about 3,000 guests a year",
      "Must still stand after one winter",
      "Artists keep ownership; works are on loan",
      "Every proposal passes a safety review",
    ],
    why: (
      <>
        The closest precedent for open entry and a big purse is <Src href="https://en.wikipedia.org/wiki/ArtPrize">ArtPrize</Src>, which needed a whole downtown. This asks for a course in a valley. Nothing&apos;s been installed yet.
      </>
    ),
    cost: "C$350–750K",
    open: "Jury, safety reviewer, and whether people will travel for it.",
  },
];

const MONEY: [string, string, number][] = [
  ["The eight prizes, one run each", "2.8–6.45", 6.45],
  ["Operator, legal, reserve (20%)", "1.2–2.5", 2.5],
  ["Shared instruments and measurement crew", "1.0–1.75", 1.75],
  ["Second runs, only if results earn them", "1.0–1.5", 1.5],
  ["Second winters and 12-month follow-ups", "0.5–1.0", 1.0],
  ["Gatherings", "0.5–1.0", 1.0],
  ["Small grants and Maker Games, after sponsors", "0.3–0.8", 0.8],
];

const NOT_YET: [string, string][] = [
  ["Who holds the site", "The resort is held by a private company, and we're among its owners. So any spending there would be at cost, disclosed and independently reviewed. Long term we'd like the site held by a non-profit; that's separate and not in this budget."],
  ["Funder", "None yet. We aren't accepting gifts today; this is the start of the conversation."],
  ["Legal vehicle", "To be set with charity counsel before any gift, including whether tax receipts are possible."],
  ["Judges, council, evaluators", "None named, and none has agreed."],
  ["An operator", "We've never run a prize, so an experienced operator is the first hire."],
  ["Sponsors and labs", "None secured. A prize that needs a quote waits for one before it opens."],
  ["Permits", "None for new builds. Anything that needs one waits for it."],
  ["First Nations and local government", "These conversations haven't started, and they should come before any site work."],
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
        <Image src={prize.photo} alt={prize.alt} fill sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
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
        <details className="group mt-auto border-t border-ink/10 pt-1 [&:not([open])]:mt-4">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center text-[14px] font-medium text-terracotta">
            <span className="group-open:hidden">Rules, evidence, what&apos;s still open +</span>
            <span className="hidden group-open:inline">Close −</span>
          </summary>
          <ul className="mt-2 space-y-1.5 text-[15px] leading-[1.45] text-ink/80">
            {prize.rules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] leading-[1.5] text-ink/70">{prize.why}</p>
          <p className="mt-3 text-[14px] leading-[1.5] text-ink/60">
            <span className="font-medium">Full cost of one run, our estimate: </span>
            {prize.cost}
          </p>
          <p className="mt-2 mb-2 text-[14px] leading-[1.5] text-ink/60">
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
      <section className="relative flex min-h-[92dvh] items-end overflow-hidden bg-warm-dark px-4 pb-10 pt-20 sm:px-6 sm:pb-14">
        <Image src={`${IMG}/winter-dusk-panorama.webp`} alt="The valley at dusk in winter" fill priority sizes="100vw" className="object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="relative mx-auto w-full max-w-[1080px]">
          <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.22em] text-amber">A proposal · Clearwater, BC, Canada</p>
          <h1 className="font-serif text-[3.4rem] font-light leading-[1] text-white sm:text-[6rem]">Everything works in July.</h1>
          <p className="mt-5 font-serif text-[1.7rem] leading-tight text-white sm:text-[2.2rem]">Proof of Winter: eight prizes that only pay if it still works in spring.</p>
          <p className="mt-4 max-w-[680px] text-[17px] leading-[1.55] text-white/85 sm:text-[19px]">
            For machines, houses, power, learning, new work and art, on a 400-acre golf and RV resort surrounded by Wells Gray Park. We set the constraints. You invent. Results go public.
          </p>
          <nav aria-label="Choose your path" className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {[
              ["#prizes", "I'd enter"],
              ["#relaunch", "I need a way back in"],
              ["#funders", "I might fund it"],
              ["#council", "I'd write the rules"],
              ["#sponsors", "I'd sponsor it"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="flex min-h-[48px] items-center justify-center rounded-full border border-white/40 px-4 text-center text-[15px] font-medium text-white transition hover:border-white hover:bg-white/10 sm:px-5">
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
              We&apos;re surrounded by big claims. Robots for a few thousand dollars. Houses for a fraction of the price. AI that teaches anything. New careers for anyone it shuts out. Some are true. Most get judged on a video.
            </p>
            <p>
              We learned the difference the hard way. In our first year running this place, almost every machine broke down. We had burst pipes, a heatwave, a record snowfall, and about six golf carts lost. Nothing separates a good idea from a working one like that does.
            </p>
            <p className="font-serif text-[1.7rem] leading-snug text-ink">So every prize here ends with the same question: is it still working after the winter?</p>
            <p>Is the tractor still running? Is the house still warm? Does the skill survive with the AI turned off? Is the person still earning? Is the sculpture still walking? Open to anyone, side by side, with the failures published beside the wins.</p>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section id="prizes" className="scroll-mt-4 px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>The eight prizes</Eyebrow>
          <H2>Eight prizes, one question</H2>
          <p className="mt-5 max-w-[680px] text-[17px] leading-[1.6] text-ink/70">
            These are draft rules and proposed numbers, and none has opened. Dates assume funding by mid-2027. Teams are published by name; people in The Relaunch never are. Each prize will set a minimum score. If nobody reaches it, runners-up share part of the purse and the rest moves to small grants.
          </p>
          <div id="relaunch" className="mt-10 grid scroll-mt-4 gap-5 md:grid-cols-2">
            {PRIZES.map((prize) => (
              <PrizeCard key={prize.name} prize={prize} />
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-ink/10 p-6 sm:p-8">
            <h3 className="font-serif text-[1.6rem] leading-tight text-ink">Smaller ways in</h3>
            <div className="mt-4 grid gap-6 text-[15px] leading-[1.55] text-ink/75 md:grid-cols-3">
              <p><span className="font-medium text-ink">The Maker Games.</span> A yearly 48-hour build weekend, with the Carve-Off and Golf Cart Reborn as rounds. Winners earn a credit toward Tractor Zero or Prompt to Part. It runs only if sponsors cover half.</p>
              <p><span className="font-medium text-ink">Winter Salad.</span> A C$25K bounty: fresh greens every week through January, off-grid, for one human hour a week, weighed and metered.</p>
              <p><span className="font-medium text-ink">Seven and Seventy.</span> Micro-grants up to C$5K for builds a 7-year-old and a 70-year-old make together. We publish what works, so families can copy it.</p>
            </div>
            <a href="#talk" className="mt-6 inline-flex min-h-[44px] items-center text-[15px] font-medium text-terracotta underline underline-offset-4">Tell us what you&apos;d enter</a>
          </div>
        </div>
      </section>

      {/* Why here */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1080px] gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Why here</Eyebrow>
            <H2>Great test labs exist. This is a different thing.</H2>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {[
                ["−5°C", "average January day"],
                ["95 cm", "snow a year"],
                ["170", "nights at or below freezing"],
                ["7", "nights below −20°C"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-[2rem] leading-none text-ink">{value}</dt>
                  <dd className="mt-1 text-[14px] text-ink/60">{label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13px] leading-[1.5] text-ink/50">
              <Src href="https://climate.weather.gc.ca/climate_normals/">Environment Canada</Src> 1981–2010 normals for Vavenby, the nearest station with normals, in the same valley. Not the site itself.
            </p>
          </div>
          <div className="space-y-5 text-[17px] leading-[1.65] text-ink/80">
            <p>
              Canada has excellent places to test things, including{" "}
              <Src href="https://nrc.canada.ca/en/research-development/nrc-facilities/canadian-centre-housing-technology-research-facility">NRC&apos;s twin houses</Src>,{" "}
              <Src href="https://www.oldscollege.ca/smart-farm-research/index.html">Olds College&apos;s Smart Farm</Src> and{" "}
              <Src href="https://www.canada.ca/en/polar-knowledge/advancingpolarknowledge.html">POLAR in Nunavut</Src>. They have better instruments than we ever will, and many have harder winters. As far as we can see, they mainly serve clients, sponsors and manufacturers. We&apos;d send them lab work, and we still need to ask them directly.
            </p>
            <p>
              What we couldn&apos;t find is a place where an outsider can bring a cheap claim, run it beside rivals through a winter, and see the results published by name, failures included, for a prize. If it exists, <a href="#talk" className="underline underline-offset-2">tell us</a>.
            </p>
            <p>This isn&apos;t the Arctic. It&apos;s a freeze-thaw, snow-on-the-ground winter of the kind many people live in, 123 km north of Kamloops on Highway 5, <Src href="https://wellsgray.ca/plan/">about 477 km from Vancouver</Src>, with a shop, a road and guests to watch.</p>
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
                For more than ten years our podcast, Future Thinkers, has asked how technology changes the way we live. Then we stopped only talking about it and took on a resort. We build things here: arcade cabinets, a treasure-hunt game, a drone-mapped digital twin, AI tools and CNC work.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  ["6 seasons", "running this place"],
                  ["~3,000", "guests a year"],
                  ["10M+", "podcast downloads, all time"],
                  ["~10,000", "people on our list"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-serif text-[2rem] leading-none text-ink">{value}</dt>
                    <dd className="mt-1 text-[14px] text-ink/60">{label}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6">
                Also here: a small makerspace, a 120-person gazebo with a commercial kitchen, a geodesic dome, a private lake and a first summer of forest school in 2026. Otherworld, a BC festival, plans three test festivals here in 2027, with volunteer crews arriving early to build.
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
            The best question in a field usually comes from someone who&apos;d never enter a contest. We&apos;re proposing a small council from robotics, housing, learning, art, labour and philanthropy to decide what&apos;s worth proving next. You&apos;d sit with people outside your field, far from your calendar, and leave having made something: a rule people will spend years trying to meet.
          </p>
          <ol className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {[
              ["The Constraint Council", "A few days in summer to write the next prize's rules. Members can't enter or judge the prize they wrote."],
              ["Trial Days", "Watch machines and builds face their test, then talk to the people who built them."],
              ["Judges' Week", "From year two: argue over real results, over long dinners."],
              ["The Future Thinkers Studio", "Record a conversation on site, for an audience built over a decade."],
            ].map(([name, text]) => (
              <li key={name}>
                <h3 className="text-[17px] font-medium text-white">{name}</h3>
                <p className="mt-1 text-[15px] leading-[1.55] text-white/70">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[680px] text-[15px] leading-[1.6] text-white/60">
            Culture isn&apos;t a prize here. It&apos;s what happens when these people spend a week around the same fire. Nobody has been named yet, so the first ten help decide who comes next.
          </p>
          <a href="#talk" className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-amber px-7 text-[15px] font-medium text-white transition hover:bg-amber/90">Ask about a seat</a>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="scroll-mt-4 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[680px]">
          <Eyebrow>Toolmakers and sponsors</Eyebrow>
          <H2>Put your machines where it&apos;s hard</H2>
          <div className="mt-8 space-y-4 text-[17px] leading-[1.65] text-ink/80">
            <p>Our makerspace is small today, and we plan to expand it to work in most materials. Entrants would need lasers, CNC, printers, batteries, sensors and steel. You&apos;d see your gear used by serious builders, on camera, in real conditions, for 10M+ all-time downloads and a list of ~10,000 people who like knowing how things are made.</p>
            <dl className="space-y-3">
              {[
                ["Tool partner: in kind", "Your tools in the shop and in entrants' hands."],
                ["Round sponsor: from C$25K", "A named Maker Games round, with your tools as the prize."],
                ["Class sponsor: from C$100K", "A named class in a prize, plus honest footage and open results."],
              ].map(([tier, text]) => (
                <div key={tier}>
                  <dt className="font-medium text-ink">{tier}</dt>
                  <dd className="text-[16px]">{text}</dd>
                </div>
              ))}
            </dl>
            <p>These tiers are proposals. Sponsors don&apos;t judge. If your machine fails, that gets published too, and so does how you fixed it. No sponsors are signed yet.</p>
          </div>
          <a href="#talk" className="mt-4 inline-flex min-h-[44px] items-center text-[15px] font-medium text-terracotta underline underline-offset-4">Talk to us about a class</a>
        </div>
      </section>

      {/* Funders */}
      <section id="funders" className="scroll-mt-4 bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>For funders</Eyebrow>
          <H2>Up to C$15M over five years, released on results</H2>
          <p className="mt-6 max-w-[680px] text-[18px] leading-[1.6] text-ink/80">
            The AI age is short on honest tests. You&apos;d fund one: what actually holds up, for machines and for people, with results anyone can check. You&apos;d help write the first rules. And if something fails, you&apos;ll see that too.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Stage 1 · 2027–29", "Up to C$4M", "Operator, quotes, first instruments and crew. The Relaunch pilot, Tractor Zero, the AI-Off Games, Prompt to Part."],
              ["Stage 2 · 2029–31", "To about C$10M", "The Winter House, Village on a Trailer, the sculpture models, the first six holes, follow-ups."],
              ["Stage 3 · 2031–32", "To C$15M", "The walk, the rest of the Open Course, and second runs, starting with The Relaunch."],
            ].map(([stage, value, text]) => (
              <div key={stage} className="rounded-2xl bg-off-white p-6">
                <p className="text-[12px] uppercase tracking-[0.14em] text-ink/50">{stage}</p>
                <p className="mt-2 font-serif text-[2rem] leading-none text-ink">{value}</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-ink/70">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[760px] text-[16px] leading-[1.6] text-ink/75">
            Each stage is released only after an independent panel, with no founders on it, checks results against tests published in advance. Money would be pledged and drawn by stage, so what isn&apos;t earned isn&apos;t spent.
          </p>
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
          <p className="mt-6 max-w-[760px] text-[14px] leading-[1.6] text-ink/60">
            These are our estimates, with no quotes behind them yet; getting quotes is the first job of Stage 1. Purses total about C$2.4M. A prize run also pays for testing, safety, judging and filming, and each prize&apos;s rules show its full estimate.
          </p>
          <a href="#talk" className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-amber px-7 text-[15px] font-medium text-white transition hover:bg-amber/90">Ask for a conversation</a>
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
          <details className="group mt-10 border-t border-ink/10 pt-2">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center text-[15px] font-medium text-terracotta">How we chose these prizes +</summary>
            <p className="mt-2 max-w-[680px] text-[15px] leading-[1.6] text-ink/70">
              We started with 178 ideas and narrowed them using AI review panels with separate roles for story, feasibility, cost and red-team attack, kept apart from the panels writing the ideas. No outside human expert has reviewed this yet, and we want that next. The panels&apos; scores are a sorting tool, not a credential.
            </p>
          </details>
        </div>
      </section>

      {/* Talk */}
      <section id="talk" className="scroll-mt-4 bg-warm-dark px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[680px]">
          <Eyebrow light>Start here</Eyebrow>
          <H2 light>Tell us where you fit</H2>
          <p className="mt-5 mb-8 text-[17px] leading-[1.6] text-white/75">This is a proposal, so telling us what&apos;s wrong with it counts. It isn&apos;t an application or a donation form. Your note goes to Mike and Euvie, and nobody else. We&apos;ll write back, and we&apos;ll tell you when full rules are ready.</p>
          <InterestForm />
          <p className="mt-10 border-t border-white/10 pt-6 text-[13px] leading-[1.6] text-white/50">
            Proof of Winter is a proposal by Mike Gilliland and Euvie Ivanova of Portal.Place and Future Thinkers, Clearwater, BC, Canada. Questions: <a className="underline" href="mailto:mike@futurethinkers.org">mike@futurethinkers.org</a>
          </p>
        </div>
      </section>
    </div>
  );
}
