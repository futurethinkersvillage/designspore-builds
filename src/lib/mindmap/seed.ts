import type { MindMap, MapNode } from "./types";

// Transcribed from portal-place-mindmap-CONTEXT.md (§9) + Project Facts, enriched
// with per-sub-item context and imagery from the portal.place photo library.

const L = "/images/lib/"; // image library prefix

// Master investor doc (created in Mike's Drive). Section-level deep links land
// once the Google OAuth step adds heading anchors; for now each node links to the doc.
const DOC_ID = "1H8ud4EdrHE58x989g-9Zs8flebSYUMzvO1raz3aOnPA";
const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/edit`;

// Nodes with AI-generated on-brand illustrations (in /public/images/gen/<id>.png).
// Conceptual subjects with no good real photo; physical nodes keep real photos.
const GEN = new Set<string>([
  "os", "os-0", "os-1", "os-2", "os-3", "os-4", "os-5", "os-6", "os-7",
  "ai", "ai-0", "ai-1", "ai-2", "ai-3", "ai-4", "ai-5",
  "net", "net-0", "net-1", "net-2", "net-3", "net-4", "net-5", "net-6", "net-7",
  "why-0", "why-2", "learn-0", "learn-4",
]);
const imageFor = (id: string, fallback: string) =>
  GEN.has(id) ? `/images/gen/${id}.png` : fallback;

// Short, human write-up per sub-item (one or two sentences — the "why it matters"
// in plain language; the deeper investor case lives in the Brief / Read view).
const LEAF_BODIES: Record<string, string> = {
  "land-0":
    "What makes it rare is the neighbour: the land opens straight onto Wells Gray, one of BC's great wilderness parks, so the views and the quiet can never be built over. Two hours north of Kamloops, on a private lake, with old-growth forest at the door.",
  "land-1":
    "It was bought the rare way — through loans from the Future Thinkers audience, not a bank or a fund. The people who believed in it first are the people who live and build here now.",
  "land-2":
    "This isn't a someday render. The RV sites, lake, sauna, dome, and 120-person gazebo are built and full of guests every summer — five seasons and counting.",
  "land-3":
    "There's always a reason to wander out: a golf and disc-golf course, forest trails, horse corrals, and room for kids to roam. That's how a place turns into a home.",
  "land-4":
    "The land is laid out to work with nature, not against it — sun, water, and forest zones arranged so the place increasingly takes care of itself.",
  "land-5":
    "Power, water, and septic are built to stand on their own, so the village keeps running when the grid doesn't. Resilience here isn't a slogan; it's the plumbing.",
  "land-6":
    "Everything proven here — the land, the programs, the systems — becomes the blueprint the next village is built from. Wells Gray is the original; the rest get easier each time.",
  "culture-0":
    "Membership is about belonging, not a deed — a yearly pass to a community and a place. Think Soho House, for people who'd rather be in the forest.",
  "culture-1":
    "It's a summer home, not a commune. You come for seasons and weekends and keep your life — which is exactly why it lasts where full-time communes burn out.",
  "culture-2":
    "The community is chosen with care — families, makers, and resilience-minded people who share the values. That's what makes it feel like home, not a hotel.",
  "culture-3":
    "Festivals and gatherings are the heartbeat of the year — the nights people plan their season around and come back for.",
  "culture-4":
    "Artists live here on work-stays, leaving the land more beautiful than they found it. Much of the art you see was made by someone who stayed a while.",
  "culture-5":
    "Beauty comes first, not last. Art is part of the foundation here — it's why the place feels like somewhere, not a campground with extras.",
  "culture-6":
    "Saunas, cold plunges, workshops, and campfire rituals give the weeks a rhythm — the small, repeated things that actually make people well.",
  "culture-7":
    "A healthy community runs on clear agreements. Simple, shared codes keep the trust high and the drama low as more people arrive.",
  "os-0":
    "The software to run a village, built like Lego rather than a black box — take only the pieces you need. It's how a tiny crew keeps a big, complex place humming.",
  "os-1":
    "A living 3D map of all 400 acres, so the land itself becomes something you can plan around, maintain, and find your way through.",
  "os-2":
    "An on-site AI you can just ask — where's the trail, when's the event, who do I call — so help is always a question away.",
  "os-3":
    "A radio network that keeps a small seasonal crew moving as one across a big property: safer, faster, far less chaos.",
  "os-4":
    "One place to track every fix, chore, and repair, so nothing important slips through the cracks of a busy season.",
  "os-5":
    "Members, governance, energy, the farm, the marketplace — the everyday systems of a village in one coherent place. Run a community, not a pile of spreadsheets.",
  "os-6":
    "Helpful AI woven through every layer, so the place can grow without growing the headcount — or the burnout.",
  "os-7":
    "It's all open-sourced through the Foundation, so any aligned village anywhere can pick it up and run their own node for free.",
  "net-0":
    "One village is a place; many are a movement. Portal.Place is the thread connecting aligned villages, so one membership opens the door to all of them.",
  "net-1":
    "Wells Gray is the proven first node — the working reference every new village learns from, so each one starts further ahead.",
  "net-2":
    "Kamloops becomes the regional hub: the on-ramp from the city that feeds people, talent, and supplies out to the villages.",
  "net-3":
    "Food, goods, and skills moving between villages turn a scatter of places into a small, resilient economy that keeps value local.",
  "net-4":
    "A shared Member Credit and smart logistics let value and goods flow between villages — the seeds of the network's own internal economy.",
  "net-5":
    "We hope to build real partnership with the Simpcw and Tk'emlúps Nations, whose territory this is. An honest intention and a relationship to earn — not a done deal.",
  "net-6":
    "The whole village — template, tools, brand, and playbook — packaged so aligned founders can launch their own. Village as a service: start a node without starting from zero.",
  "net-7":
    "A real home base for remote workers and digital nomads — roots and a tribe for people who have freedom but not belonging.",
  "make-0":
    "A real workshop — 3D printers, laser, CNC — that turns the village from a place you stay into a place you build. Bring an idea, leave with the thing.",
  "make-1":
    "Woodworking, embroidery, and a music & jam studio — everyday making that turns guests into builders and ideas into things you can hold.",
  "make-2":
    "The village builds its own tiny homes and cabins on site, keeping the value (and the craft) that usually goes to outside builders.",
  "make-3":
    "Every cabin is designed to be built again elsewhere — so the way we make things travels to the next village too.",
  "make-4":
    "Sculpture and light installations across the land — the work that makes the place unforgettable, most of it made by artists in residence.",
  "make-5":
    "Make it here, trade it here: a local, circular making economy that keeps materials, skills, and money inside the community.",
  "learn-0":
    "The Future Thinkers Foundation holds the long game — the education, research, and open tools that keep the mission honest beyond any one season.",
  "learn-1":
    "Forest school where kids learn by doing — building, growing, foraging, getting their hands dirty. The kind of childhood a lot of parents are looking for.",
  "learn-2":
    "Courses for grown-ups in the skills that matter when things get uncertain — from resilience to working well alongside AI.",
  "learn-3":
    "Free, public AI-literacy nights that make the village a place the whole region learns — and a friendly doorway in.",
  "learn-4":
    "What works (and what doesn't) gets written down and shared openly, so the next community doesn't learn it the hard way.",
  "learn-5":
    "Come learn by working the land. Work-stays and fellowships trade your hands and time for skills, belonging, and a way in.",
  "learn-6":
    "The tools are given away, not gatekept — because the goal is a movement, not a monopoly.",
  "ai-0":
    "AI here is woven into the day-to-day, not bolted on for show — quietly making a complex place easier to run.",
  "ai-1":
    "Helpful agents at every layer take the busywork, so people can spend their time on the things only people can do.",
  "ai-2":
    "Robots aimed at the real, expensive work of caring for 400 acres — the grounds, the farm, the chores that wear a small crew down.",
  "ai-3":
    "Almost everyone is pointing AI at screens and offices. Pointing it at land and community is wide-open territory — and that's exactly where we're building.",
  "ai-4":
    "Artists using AI to create living light-and-code art on the land — a glimpse of where creativity and technology meet outdoors.",
  "ai-5":
    "Design Spore is the in-house studio behind the storytelling — the team that's helped raise tens of millions and reach millions of views.",
  "why-0":
    "Underneath it all is one question: what would a resilient, genuinely good way to live actually look like — not in theory, but on real land with real people? This is where we get to try.",
  "why-1":
    "Food, energy, water, and neighbours you can count on — the basics rebuilt close to home, so life holds together when the wider world wobbles.",
  "why-2":
    "Thinking in decades, not quarters — experimenting with governance and 'Game B' ideas for how people might organize and decide together.",
  "why-3":
    "The Future Thinkers Podcast — 10M+ downloads — is the campfire this whole thing grew around, and the reason the audience helped buy the land.",
  "why-4":
    "Healing the land and living closer to it isn't a feature; it's the point — a place that gives back more than it takes.",
  "why-5":
    "Not a product but a whole way of life — resilience, art, craft, technology, family, and tradition, woven together in one place.",
  "why-6":
    "It was always meant to be copied. Everything here is built so the next village — and the one after that — can begin.",
};

// Branch-level overview paragraphs — orient the reader and preview what they'll
// find as they explore the sub-nodes (shown in the side panel for each branch).
const BRANCH_BODIES: Record<string, string> = {
  land:
    "This is where the whole project touches ground. The sub-nodes here walk through the property itself — how the 400 acres were secured through community loans rather than institutional capital, what's already built and operating, and the recreation that spreads across the land from golf and disc golf to forest trails and horse corrals.\n\n" +
    "Dig deeper and you'll see how the land is designed to last: permaculture layout, off-grid-capable power, water, and septic, and the systems that let it run independently. Together they make Wells Gray not just a site but the living template every future village is cloned from.",
  culture:
    "Explore this branch to understand who the village is for and how it holds together. The sub-nodes cover the seasonal membership model, the 'summer home' rhythm that keeps it from becoming a commune, and the values-aligned families and creators who form the core.\n\n" +
    "From there it moves into what actually makes a community cohere — festivals and gatherings, artist residencies, art treated as infrastructure, wellness rituals, and the clear roles and codes of conduct that keep a high-trust culture healthy as it grows.",
  os:
    "The Village Stack is the software layer that lets a small team run a large, complex place. The sub-nodes break down the modular suite of tools — a digital twin of the land, an AI 'oracle' assistant, a coordination network for the seasonal crew, and operations tracking.\n\n" +
    "Go deeper and you'll find the modules spanning membership, governance, energy, farm, and marketplace, AI agents woven through every layer, and the decision to open-source the whole stack so any aligned village can run a node.",
  net:
    "This branch is the leap from one property to a category. The sub-nodes describe the network itself — how Portal.Place connects people to aligned nodes, with Wells Gray as the flagship anchor and Kamloops as a regional hub.\n\n" +
    "Explore further for the connective tissue: a BC-interior trade network, a Member Credit and backhaul logistics system, honest intentions toward Indigenous partnership, and the 'village as a service' model that makes the whole thing replicable — a home base for a generation of digital nomads.",
  make:
    "Make & Build is the productive heart of the village. The sub-nodes start in the maker space — 3D printers, laser, CNC, and UV — and the woodworking, embroidery, and jam studios that give members daily creative utility.\n\n" +
    "From there it scales into real revenue: manufacturing tiny homes and cabins on-site, building them to a template that exports to other nodes, physical art installations across the land, and a local, circular making economy that keeps value inside the network.",
  learn:
    "This is the mission's non-profit arm and its memory. The sub-nodes cover the Future Thinkers Foundation as keeper of the long-term purpose, forest schooling for kids, and courses on resilience and meta-skills for adults.\n\n" +
    "Deeper in you'll find the public-facing work — AI-literacy events, openly published research on community and governance, work-stay programs and fellowships, and the commitment to open-source the tools so the model can spread far beyond Wells Gray.",
  ai:
    "This branch is the project's frontier bet. The sub-nodes show how AI is woven into daily operations rather than bolted on, with autonomous agents at every layer and robotics applied to the real, expensive work of maintaining 400 acres.\n\n" +
    "Explore further for the thesis behind it: land-based, community AI as a neglected frontier distinct from commercial AI, AI-native artists creating on the land, and Design Spore — the in-house production arm that already powers the project's media and fundraising.",
  why:
    "This is the big why. The sub-nodes step back to the question underneath everything — what a resilient civilization could actually look like, built on food, energy, water, and mutual aid rather than fragile supply chains.\n\n" +
    "Go deeper for the long-horizon thinking: governance and 'Game B' futures, the Future Thinkers Podcast and its 10M+ downloads, regeneration and land-based living, and the conviction that this whole way of life is built to be replicated as a network, not a single brand.",
};

interface LeafSeed {
  label: string;
  detail: string;
  image: string;
}

interface BranchSeed {
  key: string;
  title: string;
  short: string;
  color: string;
  icon: string;
  complexity: number;
  /** Funding tier ($M) at which this branch comes online. */
  tier: number;
  /** Image path for the image-backed card. */
  image: string;
  detail: string;
  /** Optional "learn more" link shown at the end of the branch text. */
  moreLink?: { href: string; label: string };
  leaves: LeafSeed[];
}

// Supporting photo galleries per node id (a few extra photos in the side panel).
const LEAF_GALLERY: Record<string, string[]> = {
  "land-0": [L + "swimming-lake-scaled.jpg", L + "aurora-at-night-scaled.jpg", L + "moose-at-lake-scaled.jpg"],
};

// Optional "learn more" / call-to-action links per node id → a relevant page.
const LEAF_LINKS: Record<string, { href: string; label: string }> = {
  "land-0": { href: "https://portal.place/village", label: "Explore Wells Gray Village" },
  "culture-0": { href: "https://portal.place/membership", label: "Become a member" },
  "culture-4": { href: "https://portal.place/residency", label: "Apply for a residency" },
  "net-6": { href: "https://portal.place/partner", label: "Bring a village to your land" },
  "learn-5": { href: "https://portal.place/workstay", label: "Join a work-stay" },
  "ai-5": { href: "https://designspore.co", label: "See Design Spore's work" },
  "why-3": { href: "https://futurethinkers.org", label: "Listen to the podcast" },
};

// Per-branch "learn more / take action" links (fallback when a branch has no
// inline moreLink). Each points to a real next step on the live site.
const BRANCH_LINKS: Record<string, { href: string; label: string }> = {
  culture: { href: "https://portal.place/membership", label: "Become a member" },
  make: { href: "https://portal.place/workstay", label: "Build with us — work-stay" },
  learn: { href: "https://portal.place/donate", label: "Support the Foundation" },
  net: { href: "https://portal.place/partner", label: "Partner on the network" },
  ai: { href: "https://designspore.co", label: "Meet Design Spore" },
  why: { href: "https://futurethinkers.org", label: "Listen to Future Thinkers" },
};

const BRANCHES: BranchSeed[] = [
  {
    key: "land",
    title: "The Land & Place",
    short: "Wells Gray",
    color: "#b5894e",
    icon: "mountains",
    complexity: 4,
    tier: 3,
    image: "/images/branches/land.jpg",
    detail:
      "The flagship anchor and template — 400 acres beside Wells Gray Provincial Park, built and operating.",
    moreLink: { href: "https://portal.place/village", label: "Explore Wells Gray Village" },
    leaves: [
      {
        label: "400 acres beside Wells Gray Provincial Park",
        detail:
          "A 400-acre property at the gateway to Wells Gray Provincial Park near Clearwater, BC — lake, creek, and forest.",
        image: L + "creek-view-1-scaled.jpg",
      },
      {
        label: "Crowdfunded through community loans",
        detail:
          "The land was purchased through community loans raised via the Future Thinkers audience — not institutional capital.",
        image: L + "ft-podcast-cover.jpg",
      },
      {
        label: "Phase 1 built & operating",
        detail:
          "40+ RV sites, a private lake, sauna, geodesic dome, and a 120-person event gazebo — all complete and in use.",
        image: L + "dome-at-night-scaled.jpg",
      },
      {
        label: "Golf, disc golf, trails, corrals & play",
        detail:
          "Recreation across the land — a golf and disc-golf course, forest trails, horse corrals, and kids' play areas.",
        image: L + "golf-course-3.jpg",
      },
      {
        label: "Permaculture land design",
        detail:
          "Laid out on permaculture principles: solar exposure, natural water flow, and layered forest zones.",
        image: L + "the-creek-scaled.jpg",
      },
      {
        label: "Off-grid systems & resilient infrastructure",
        detail:
          "Off-grid-capable power, water, and septic systems built for resilience and independence year-round.",
        image: L + "shower-house-in-field-scaled.jpg",
      },
      {
        label: "The flagship anchor & living template",
        detail:
          "Wells Gray is the working prototype every future village in the network is templated from.",
        image: L + "wells-gray-golf-rv-06-1024x685.jpg",
      },
    ],
  },
  {
    key: "culture",
    title: "Culture & Community",
    short: "Membership",
    color: "#e8924f",
    icon: "users",
    complexity: 4,
    tier: 6,
    image: "/images/branches/culture.jpg",
    detail:
      "A values-aligned membership community on a seasonal rhythm — a summer home, not a commune.",
    leaves: [
      {
        label: "Seasonal membership",
        detail:
          "A seasonal membership model in the spirit of Soho House and Exclusive Resorts — belonging, not ownership.",
        image: L + "gazebo-community-meetup-scaled.jpg",
      },
      {
        label: "“Summer home” rhythm, not a commune",
        detail:
          "Members come for seasons and weekends — a summer-home / weekend-warrior rhythm, not a full-time commune.",
        image: L + "camper-daytime-scaled.jpg",
      },
      {
        label: "Values-aligned families & creators",
        detail:
          "A community of values-aligned families, creators, and resilience-minded people.",
        image: L + "many_people_sitting_202512032320-1024x576.jpeg",
      },
      {
        label: "Seasonal festivals & gatherings",
        detail: "Seasonal festivals and gatherings anchor the community calendar.",
        image: L + "canada-day-meetup-scaled.jpg",
      },
      {
        label: "Artist residencies (work-stay)",
        detail:
          "Artists join through work-stay residencies — making the land beautiful while building the culture.",
        image: L + "res-workshops.jpg",
      },
      {
        label: "Art as Phase 1 infrastructure",
        detail:
          "Art is treated as core infrastructure from day one, not a late-stage amenity.",
        image: L + "res-art-star.jpg",
      },
      {
        label: "Wellness days, workshops & rituals",
        detail:
          "Wellness days, workshops, and shared rituals like the community sauna and evening campfire.",
        image: L + "meditation-group.jpg",
      },
      {
        label: "Clear roles & codes of conduct",
        detail:
          "Clear roles and codes of conduct keep the community healthy and high-trust.",
        image: L + "gazebo-interior-scaled.jpg",
      },
    ],
  },
  {
    key: "os",
    title: "Village Stack",
    short: "The Software",
    color: "#6e78d0",
    icon: "cpu",
    complexity: 5,
    tier: 6,
    image: "/images/branches/os.png",
    detail:
      "A modular suite of AI + digital tools to run a village — open-sourced for any village to adopt.",
    leaves: [
      {
        label: "Modular suite of AI + digital tools",
        detail:
          "Village Stack is a modular suite of AI and digital tools — not a single monolithic platform.",
        image: L + "gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png",
      },
      {
        label: "Digital twin & land mapping",
        detail: "A live digital twin and drone-mapped 3D model of the entire property.",
        image: L + "Golf-Course-Above2.jpg",
      },
      {
        label: "AI “oracle” assistant",
        detail:
          "An AI 'oracle' assistant answers questions and guides residents and staff.",
        image: L + "gemini-2e4dc4.png",
      },
      {
        label: "Walkie-talkie coordination network",
        detail:
          "A walkie-talkie network keeps the team coordinated in real time across the land.",
        image: L + "a_young_camphost_202512041422-1024x576.jpeg",
      },
      {
        label: "Maintenance, repairs & ops tracking",
        detail:
          "Maintenance, repairs, and day-to-day operations are tracked in one system.",
        image: L + "wood-working-building-desk-scaled.jpg",
      },
      {
        label: "Members, governance, energy, farm, market",
        detail:
          "Modules span members, governance, energy, the farm, and a local marketplace.",
        image: L + "gemini-j6uwv7.png",
      },
      {
        label: "AI agents at every layer",
        detail: "AI agents are embedded at every layer of village operations.",
        image: L + "gemini_generated_image_j883fhj883fhj883.png",
      },
      {
        label: "Open-sourced for any village",
        detail:
          "Village Stack is open-sourced so any aligned village can run a node for free.",
        image: L + "gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png",
      },
    ],
  },
  {
    key: "net",
    title: "Smart Village Network",
    short: "Network of Villages",
    color: "#c97e6f",
    icon: "share",
    complexity: 5,
    tier: 50,
    image: "/images/branches/net.jpg",
    detail:
      "Portal.Place connects people to aligned nodes — a replicable village-as-a-service network.",
    leaves: [
      {
        label: "Connects people to aligned nodes",
        detail:
          "Portal.Place is the connective layer linking people to aligned village nodes.",
        image: L + "Golf-Course-Above2.jpg",
      },
      {
        label: "Wells Gray = flagship anchor",
        detail: "Wells Gray is the flagship anchor node the network grows from.",
        image: L + "aurora-at-night-scaled.jpg",
      },
      {
        label: "Kamloops = regional hub",
        detail: "Kamloops serves as the regional hub connecting the BC interior.",
        image: L + "buildings-in-winter-scaled.jpg",
      },
      {
        label: "BC-interior trade network",
        detail:
          "A BC-interior trade network moving food, goods, and services between nodes.",
        image: L + "picnic-tables-creek.jpg",
      },
      {
        label: "Member Credit & backhaul logistics",
        detail:
          "A Member Credit system and shared backhaul logistics move value between villages.",
        image: L + "rv-in-campsite-scaled.jpg",
      },
      {
        label: "Indigenous partnership intentions",
        detail:
          "Aspirational partnerships with the Simpcw and Tk'emlúps Indigenous communities.",
        image: L + "moose-at-lake-scaled.jpg",
      },
      {
        label: "“Village as a service”",
        detail:
          "A 'village as a service' model designed to be replicable and franchisable.",
        image: L + "cabins-scaled.jpg",
      },
      {
        label: "Home base for digital nomads",
        detail: "A physical home base for the global digital-nomad movement.",
        image: L + "camper-at-night-scaled.jpg",
      },
    ],
  },
  {
    key: "make",
    title: "Make & Build",
    short: "Maker Space",
    color: "#d9a03f",
    icon: "hammer",
    complexity: 3,
    tier: 3,
    image: "/images/branches/make.jpg",
    detail:
      "A local production hub and circular making economy — from maker space to manufactured cabins.",
    leaves: [
      {
        label: "Maker space: 3D, laser, CNC, UV",
        detail:
          "A maker space stocked with 3D printers, a laser cutter, CNC, and a UV printer.",
        image: L + "wood-working-building-desk-scaled.jpg",
      },
      {
        label: "Woodworking, embroidery & jam studio",
        detail: "A woodworking shop, embroidery, and a music / jam studio for makers.",
        image: L + "dome-interior-scaled.jpg",
      },
      {
        label: "Manufacturing tiny homes & cabins",
        detail: "On-site manufacturing of tiny homes and park-model cabins.",
        image: L + "cabin-scaled.jpg",
      },
      {
        label: "Cabins built to template the model",
        detail: "Cabins are built to template and export the model to other nodes.",
        image: L + "Cabin-3.2_PANO_0001-Cabin-3-2-1.jpg",
      },
      {
        label: "Physical art installations",
        detail: "Physical art installations — sculpture and light — across the land.",
        image: L + "res-art-sculptures.jpg",
      },
      {
        label: "Local production & circular economy",
        detail: "A local production hub powering a circular making economy.",
        image: L + "cabins-scaled.jpg",
      },
    ],
  },
  {
    key: "learn",
    title: "Learn & Grow",
    short: "Future Thinkers Foundation",
    color: "#9e7bae",
    icon: "graduation",
    complexity: 3,
    tier: 6,
    image: "/images/branches/learn.jpg",
    detail:
      "The non-profit arm and keeper of the mission — education, research, and fellowships.",
    leaves: [
      {
        label: "Non-profit keeper of the mission",
        detail:
          "The Future Thinkers Foundation is the non-profit keeper of the long-term mission.",
        image: L + "ft-podcast-cover.jpg",
      },
      {
        label: "Forest schooling",
        detail:
          "Forest schooling teaches meta-skills, maker culture, gardening, and foraging.",
        image: L + "kids-playing-golf-scaled.jpg",
      },
      {
        label: "Courses on resilience & meta-skills",
        detail: "Courses on resilience and durable meta-skills for an uncertain future.",
        image: L + "meditation-group.jpg",
      },
      {
        label: "Public AI-literacy events",
        detail: "Public AI-literacy events and workshops for the wider community.",
        image: L + "a_person_filming_202512032314-1024x576.jpeg",
      },
      {
        label: "Research on community & governance",
        detail: "Original research on community design and governance, published openly.",
        image: L + "mike-and-euvie-headshot.jpg",
      },
      {
        label: "Work-stay programs & fellowships",
        detail:
          "Work-stay programs and fellowships bring people onto the land to learn by doing.",
        image: L + "a_young_camphost_202512041422-1024x576.jpeg",
      },
      {
        label: "Open-sources the tools",
        detail: "Tools are open-sourced so the model can scale freely beyond Wells Gray.",
        image: L + "gemini-j6uwv7.png",
      },
    ],
  },
  {
    key: "ai",
    title: "AI & Robotics",
    short: "The Tech Frontier",
    color: "#7ca0c6",
    icon: "robot",
    complexity: 4,
    tier: 20,
    image: "/images/branches/ai.png",
    detail:
      "AI woven into daily ops, not bolted on — a neglected, land-based frontier vs. commercial AI.",
    leaves: [
      {
        label: "AI woven into daily operations",
        detail: "AI is woven into daily operations rather than bolted on as a gimmick.",
        image: L + "gemini-2e4dc4.png",
      },
      {
        label: "Agents at every layer",
        detail: "Autonomous agents operate at every layer of village life.",
        image: L + "gemini_generated_image_j883fhj883fhj883.png",
      },
      {
        label: "Robotics for land & community work",
        detail: "Robotics applied to land-based and community work.",
        image: L + "gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png",
      },
      {
        label: "A neglected frontier",
        detail:
          "Land-based, community AI is a neglected frontier — distinct from commercial AI.",
        image: L + "gemini-j6uwv7.png",
      },
      {
        label: "AI-native artists on the land",
        detail: "AI-native artists create live on the land.",
        image: L + "a_person_filming_202512032314-1024x576.jpeg",
      },
      {
        label: "Design Spore — production arm",
        detail:
          "Design Spore is the in-house creative and technical production arm.",
        image: L + "mike-and-euvie-headshot.jpg",
      },
    ],
  },
  {
    key: "why",
    title: "Civilization Redesign Experiments",
    short: "The Big Why",
    color: "#b97fa8",
    icon: "compass",
    complexity: 5,
    tier: 3,
    image: "/images/branches/why.jpg",
    detail:
      "The big why — experimenting with how a resilient civilization could work, built to be replicated.",
    leaves: [
      {
        label: "How a resilient civilization could work",
        detail: "A living experiment in how a resilient civilization could actually work.",
        image: L + "aurora-at-night-scaled.jpg",
      },
      {
        label: "Resilience: food, energy, water, mutual aid",
        detail: "Resilience built across food, energy, water, and mutual aid.",
        image: L + "swimming-lake-scaled.jpg",
      },
      {
        label: "Long-horizon governance & “Game B”",
        detail: "Long-horizon thinking on governance and 'Game B' futures.",
        image: L + "dome-movie-watching.jpg",
      },
      {
        label: "Future Thinkers Podcast (10M+ downloads)",
        detail:
          "The Future Thinkers Podcast — 130+ episodes and 10M+ downloads on civilization and resilience.",
        image: L + "ft-podcast-cover.jpg",
      },
      {
        label: "Regeneration & land-based living",
        detail: "Regeneration of land and a return to land-based living.",
        image: L + "the-creek-scaled.jpg",
      },
      {
        label: "A whole way of life",
        detail:
          "A whole way of life weaving resilience, art, craft, tech, family, and tradition.",
        image: L + "res-festival.jpg",
      },
      {
        label: "Built to be replicated",
        detail: "Built to be replicated — a network of villages, not a single brand.",
        image: L + "cabins-scaled.jpg",
      },
    ],
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
      body: BRANCH_BODIES[b.key],
      color: b.color,
      icon: b.icon,
      image: imageFor(b.key, b.image),
      complexity: b.complexity,
      tier: b.tier,
      moreLink: b.moreLink ?? BRANCH_LINKS[b.key],
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
    b.leaves.forEach((leaf, i) => {
      const lid = `${b.key}-${i}`;
      nodes.push({
        id: lid,
        parentId: b.key,
        kind: "leaf",
        label: leaf.label,
        detail: leaf.detail,
        body: LEAF_BODIES[lid],
        gallery: LEAF_GALLERY[lid],
        moreLink: LEAF_LINKS[lid],
        image: imageFor(lid, leaf.image),
        color: b.color,
        complexity: 1,
      });
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
