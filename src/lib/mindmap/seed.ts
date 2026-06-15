import type { MindMap, MapNode } from "./types";

// The Portal.Place vision map. Seven branches orbit the core; each branch is a
// self-contained writeup: a short "why it matters" blurb (the world context that
// makes it needed) plus the key points. (Sub-nodes were folded into the branches.)

const L = "/images/lib/"; // image library prefix

// Master investor doc (created in Mike's Drive). Section-level deep links land
// once the Google OAuth step adds heading anchors; for now each node links to the doc.
const DOC_ID = "1H8ud4EdrHE58x989g-9Zs8flebSYUMzvO1raz3aOnPA";
const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/edit`;

// Branches whose card art is an AI-generated on-brand illustration
// (in /public/images/gen/<key>.png) rather than a real photo.
const GEN = new Set<string>(["os", "net"]);
const imageFor = (id: string, fallback: string) =>
  GEN.has(id) ? `/images/gen/${id}.png` : fallback;

interface BranchSeed {
  key: string;
  title: string;
  short: string;
  color: string;
  icon: string;
  /** Funding tier ($M) at which this branch comes online. */
  tier: number;
  /** Image path for the image-backed card. */
  image: string;
  /** One-line lead shown on the card and at the top of the panel. */
  detail: string;
  /** Short "why this is needed" blurb — the meta perspective. */
  why: string;
  /** Key points (folded in from the former sub-nodes). */
  bullets: string[];
  /** A few supporting photos shown in the side panel. */
  gallery?: string[];
  /** "Learn more / take action" link shown at the end of the branch text. */
  moreLink?: { href: string; label: string };
}

const BRANCHES: BranchSeed[] = [
  {
    key: "land",
    title: "The Land & Place",
    short: "Wells Gray",
    color: "#b5894e",
    icon: "mountains",
    tier: 3,
    image: "/images/branches/land.jpg",
    detail:
      "400 acres beside Wells Gray Provincial Park — the home base, the testbed, and the hard asset behind the whole project.",
    why: "Every resilient future has to touch ground somewhere. Owning real land outright turns a vision into a place you can actually build on — and backs the investment with a tangible asset, not just a promise.",
    bullets: [
      "400 acres of lake, creek and forest at the gateway to Wells Gray Provincial Park",
      "Bought through community loans from the Future Thinkers audience — not institutional money",
      "Phase 1 is built and operating: 40+ RV sites, a private lake, sauna, dome and a 120-person gazebo",
      "Golf, disc golf, forest trails, horse corrals and kids' play already on the land",
      "Permaculture-designed and off-grid-capable — power, water and septic that can run independently",
      "This $3M phase funds a feasibility study for the residential buildout",
      "…and a community maker space — home for artist residencies, art, and on-site tiny-home builds",
      "The working prototype every future village is cloned from",
    ],
    gallery: [
      L + "swimming-lake-scaled.jpg",
      L + "aurora-at-night-scaled.jpg",
      L + "moose-at-lake-scaled.jpg",
    ],
    moreLink: { href: "https://portal.place/village", label: "Explore Wells Gray Village" },
  },
  {
    key: "live",
    title: "Residential Village",
    short: "Live Here",
    color: "#6f9e8a",
    icon: "house",
    tier: 20,
    image: L + "cabins-scaled.jpg",
    detail:
      "Permanent homes on the land — the step from seasonal stays to people actually living here year-round.",
    why: "A village isn't only a place you visit; eventually people put down roots. Residential development is the move from a seasonal community to a real town — the phase that turns members into neighbours who live here full-time.",
    bullets: [
      "Residential housing on the land — from seasonal stays to year-round living",
      "A second property to grow the footprint beyond Wells Gray",
      "A regenerative farm feeding residents and the wider network",
      "Built largely with the village's own maker space and cabin manufacturing",
      "Designed around the culture, schooling and mutual aid already in place",
      "Unlocks at the $20M / Phase 3 stage of the plan",
    ],
    moreLink: { href: "https://portal.place/contact", label: "Ask about residency" },
  },
  {
    key: "culture",
    title: "Culture & Community",
    short: "Membership",
    color: "#e8924f",
    icon: "users",
    tier: 6,
    image: "/images/branches/culture.jpg",
    detail:
      "The intentionally designed human layer — families, mutual aid, and the rhythm that makes a village actually hold together.",
    why: "Most communities don't fail on money or buildings; they fail on the human element. Culture has to be designed on purpose to grow resilient, capable people who can live and build together — it's the connective tissue between everything else here.",
    bullets: [
      "A seasonal 'summer home' membership rhythm — belonging without becoming a full-time commune",
      "Built for families: raising kids together, shared care, and real mutual aid",
      "Festivals, gatherings and shared rituals that turn neighbours into a tribe",
      "Artist residencies and art treated as infrastructure from day one",
      "Wellness days, workshops, sauna and campfire woven into the weekly rhythm",
      "Clear roles, values and codes of conduct that keep a high-trust culture healthy as it grows",
    ],
    moreLink: { href: "https://portal.place/membership", label: "Become a member" },
  },
  {
    key: "os",
    title: "The Village Stack",
    short: "Tech, AI & robots",
    color: "#6e78d0",
    icon: "cpu",
    tier: 6,
    image: "/images/gen/os.png",
    detail:
      "The technology layer — AI, robotics and open-source software that lets a small team run a big, complex place.",
    why: "Villages usually fail for predictable reasons: not enough money, not enough professional skill, thin infrastructure, and the messy human element. AI and robotics can ease all four — in just a few days we've used AI to build coordination, task-management, village-matchmaking and even a treasure-hunt system that simply wouldn't exist otherwise. Pointing this technology at land and community, instead of screens, is wide-open territory.",
    bullets: [
      "Village Stack: a modular suite of AI + software — a digital twin, an AI 'oracle', plus ops, energy, farm, governance and a marketplace",
      "AI agents woven into daily operations, not bolted on for show",
      "Robotics aimed at the real, expensive work of caring for 400 acres",
      "Coordination, task-management and matchmaking systems built in days with AI",
      "Makes a genuinely complex place runnable by a small seasonal team",
      "Open-sourced so any aligned village can run a node",
    ],
    moreLink: { href: "https://designspore.co", label: "Built with Design Spore" },
  },
  {
    key: "net",
    title: "Smart Village Network",
    short: "Network of Villages",
    color: "#c97e6f",
    icon: "share",
    tier: 50,
    image: "/images/gen/net.png",
    detail:
      "One village proves it; the network scales it — interoperable nodes anyone aligned can join or start.",
    why: "A single village is fragile and easy to dismiss; a network is a category. New tools make it possible to localize and coordinate in small, decentralized groups while keeping much of the benefit of bigger systems — so the model can spread instead of staying a one-off.",
    bullets: [
      "Portal.Place connects people to aligned village nodes",
      "Wells Gray as the flagship anchor, Kamloops as a regional hub",
      "A BC-interior trade network with Member Credit and shared backhaul logistics",
      "Honest intentions toward Indigenous partnership (Simpcw, Tk'emlúps)",
      "'Village as a service': templates and tooling so a node can start without starting from zero",
      "A real home base for the global digital-nomad movement",
    ],
    moreLink: { href: "https://portal.place/partner", label: "Bring a village to your land" },
  },
  {
    key: "make",
    title: "Make & Build",
    short: "Maker Culture",
    color: "#d9a03f",
    icon: "hammer",
    tier: 3,
    image: "/images/branches/make.jpg",
    detail:
      "Maker culture and the tools to build almost anything — and to create real value in a local economy.",
    why: "Self-sufficiency means being able to make what you need, not just buy it. Give people serious tools and the skills to use them, and a community can build its own homes, products and art — keeping the value, craft and money inside the local economy instead of shipping it all out.",
    bullets: [
      "A real maker space — 3D printers, laser, CNC, UV — to turn ideas into things you can hold",
      "Woodworking, embroidery and a music / jam studio for everyday making",
      "Members build their own projects, products and small businesses — not just cabins",
      "On-site manufacturing of tiny homes and cabins, built to a template that exports to other nodes",
      "Sculpture and light installations that make the land unforgettable",
      "A local, circular making economy that keeps materials, skills and money in the community",
    ],
    moreLink: { href: "https://portal.place/workstay", label: "Build with us — work-stay" },
  },
  {
    key: "learn",
    title: "Learn & Grow",
    short: "Future Thinkers Foundation",
    color: "#9e7bae",
    icon: "graduation",
    tier: 6,
    image: "/images/branches/learn.jpg",
    detail:
      "Hands-on education and meta-skills — how to learn, adapt and stay capable as the world shifts.",
    why: "AI and global instability are changing what it means to be useful, faster than schools can keep up. People of all ages need a way to upgrade — not just facts, but how to learn, how to work alongside AI, and the durable meta-skills that hold up when everything else is uncertain.",
    bullets: [
      "Forest school where kids learn by building, growing, foraging and getting their hands dirty",
      "Courses for adults in resilience, meta-skills, and working well alongside AI",
      "Learning how to learn — the skill underneath every other skill",
      "Free public AI-literacy nights that make the village a doorway for the whole region",
      "Work-stays and fellowships that trade your hands and time for skills and belonging",
      "Research and tools published openly, held by the Future Thinkers Foundation",
    ],
    moreLink: { href: "https://portal.place/donate", label: "Support the Foundation" },
  },
  {
    key: "why",
    title: "Civilization Redesign",
    short: "The Big Why",
    color: "#b97fa8",
    icon: "compass",
    tier: 3,
    image: "/images/branches/why.jpg",
    detail:
      "The point underneath everything: rebuild a good life at a human scale — local, connected and resilient.",
    why: "The modern West is atomized and declining — hyper-individualistic, and unable to picture a future outside fragile, centralized systems. But new technology makes it possible again to localize: to coordinate in small, decentralized groups while keeping much of the benefit of the big systems. This whole project is a bet on localism as the way through.",
    bullets: [
      "A direct answer to isolation, atomization, and a culture that can't imagine a future outside the status quo",
      "Localism: small, decentralized groups with much of the resilience of large systems and little of the fragility",
      "Resilience built on food, energy, water and neighbours you can count on",
      "Long-horizon thinking on governance and 'Game B' ways of organizing",
      "Grown around the Future Thinkers Podcast (10M+ downloads) — the campfire this started from",
      "Designed from the start to be replicated — a network, not a single brand",
    ],
    moreLink: { href: "https://futurethinkers.org", label: "Listen to Future Thinkers" },
  },
];

function buildNodes(): MapNode[] {
  const nodes: MapNode[] = [
    {
      id: "root",
      parentId: null,
      kind: "root",
      label: "The Village",
      sublabel: "Portal.Place",
      detail:
        "Wells Gray · Clearwater, BC — the anchor & living template. A big-picture vision map of the land project; eight branches framed as a worldview, not an org chart.",
      color: "#ea824e",
      icon: "campfire",
      complexity: 5,
      tier: 3,
      links: [
        {
          fileId: DOC_ID,
          fileType: "doc",
          fileName: "Investor Mind Map (Master)",
          targetLabel: "Full investor brief",
          deepLinkUrl: DOC_URL,
        },
      ],
    },
  ];

  for (const b of BRANCHES) {
    nodes.push({
      id: b.key,
      parentId: "root",
      kind: "branch",
      label: b.title,
      sublabel: b.short,
      detail: b.detail,
      why: b.why,
      bullets: b.bullets,
      gallery: b.gallery,
      moreLink: b.moreLink,
      color: b.color,
      icon: b.icon,
      image: imageFor(b.key, b.image),
      complexity: 4,
      tier: b.tier,
      links: [
        {
          fileId: DOC_ID,
          fileType: "doc",
          fileName: "Investor Mind Map (Master)",
          targetLabel: b.title,
          deepLinkUrl: DOC_URL,
        },
      ],
    });
  }

  return nodes;
}

export const PORTAL_PLACE_MAP: MindMap = {
  id: "portal-place",
  title: "The Portal.Place Vision",
  subtitle: "A vision map of the Wells Gray land project",
  eyebrow: "A Smart Village in the making · Wells Gray, BC",
  tagline:
    "A real 400-acre village in the BC wilderness — built and operating — and the blueprint for a whole network of them. Come visit, become a member, or help build what's next.",
  footerLead: "Built from the Portal.Place ecosystem — the land, the network, and the way of life.",
  walkthrough: {
    url: "https://www.youtube.com/embed/KBYm2xRwkrM",
    title: "Portal.Place — 45-minute project walkthrough",
  },
  entities: [
    "Wells Gray Resort",
    "Portal.Place",
    "Design Spore",
    "Future Thinkers Foundation",
  ],
  nodes: buildNodes(),
};
