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

// Fuller investor writeups per sub-item (why it matters / benefit / ROI / expansion).
const LEAF_BODIES: Record<string, string> = {
  "land-0":
    "What makes this parcel rare isn't its size alone — it's what sits next door. The land opens directly onto Wells Gray, one of British Columbia's largest wilderness parks, famed for its waterfalls and untouched backcountry. That means the views, the quiet, and the wild access can never be developed away: a protected backdrop held in perpetuity, two hours north of Kamloops at 50° north.\n\n" +
    "Inside the fence line, the land already works. A private swimming lake, a creek winding through old-growth forest, and walking trails sit alongside built infrastructure — a geodesic dome, a wood-fired sauna, a 120-person event gazebo, a 9-hole golf and 18-hole disc-golf course, and twenty horse corrals. Gentle ~24°C summers carry a full May-to-October season of guests.\n\n" +
    "Crucially, this isn't raw acreage. It's a contiguous 400-acre site with road access, utilities, and five-plus years of operating history as Wells Gray Resort. Assembling recreation land of this scale beside a protected park — already zoned, serviced, and generating revenue — is effectively impossible to replicate today, and that scarcity is what the whole plan is secured against.",
  "land-1": "The property was acquired through community loans from the Future Thinkers audience rather than institutional capital, proving demand and aligning early backers as residents and advocates. This validated the model before outside money entered and built a committed user base most ventures must pay to acquire. Phase 1 of the current $6M raise pays out these loans and secures clean title, de-risking the cap table for new investors.",
  "land-2": "Phase 1 is built and operating, not projected: 40+ RV sites, a private lake, sauna, geodesic dome, and a 120-person gazebo are complete and generating revenue across a five-year operating history. This removes the execution and construction risk that sinks most development plays. Investors are funding expansion of a working hospitality business with proven occupancy, not betting on a greenfield concept.",
  "land-3": "Golf, disc golf, forest trails, horse corrals, and a kids playground spread amenity value across the full 400 acres, raising per-guest length of stay and justifying membership and immersion pricing. This breadth differentiates the site from single-purpose campgrounds and supports families for 30-day residencies. Recreation density is what converts a visit into a recurring membership relationship.",
  "land-4": "Permaculture land design sequences solar exposure, water flow, and forest zones so the property's natural systems do productive work, lowering long-term operating costs for food, energy, and water management. This is both an operating-margin lever and a credibility marker for the regeneration thesis residents pay to join. Thoughtful zoning also protects the land's ecological value, which is core to the asset's appreciation.",
  "land-5": "Off-grid power, water, and septic systems give the village operational independence from fragile rural infrastructure, reducing both ongoing utility costs and single-point-of-failure risk. Resilience is the product residents are buying, so the infrastructure is also marketing. Critically, these systems are the replicable template for future nodes that will sit on land without municipal services.",
  "land-6": "Wells Gray is the flagship anchor and living template every future node is cloned from, which is where the real optionality sits. Proving the full stack of land, programs, tech, and operating economics on one working site converts a single-asset business into a replicable network play. The value is leverage: each lesson learned here de-risks the $20M+ expansion phases and the eventual multi-property network.",
  "culture-0": "Seasonal membership from roughly $48/month, billed annually, follows the proven Soho House and Exclusive Resorts playbook: recurring, high-retention revenue against a fixed land base. Memberships monetize the community itself, not just rooms, producing predictable cash flow that compounds as the resident base grows. A Founding Member tier captures early demand at premium commitment, seeding both revenue and word-of-mouth.",
  "culture-1": "Positioning the village as a seasonal summer home rather than a full-time commune dramatically widens the addressable market to families and creators who want belonging without relocating. This rhythm matches how memberships and 30-day immersions are actually consumed, smoothing demand and lowering churn. It also sidesteps the governance and burnout failures that have historically sunk intentional communities.",
  "culture-2": "A curated base of values-aligned families and creators is the demand engine behind every revenue stream, from memberships to immersions to fabrication. Alignment drives retention, referrals, and the high-trust culture that makes the lifestyle product premium-priced and hard to copy. Selecting for fit early protects the brand and reduces the social friction that erodes community businesses over time.",
  "culture-3": "Seasonal festivals and gatherings are the calendar anchors that drive peak occupancy, ticketed and program revenue, and the shared memories that renew memberships year over year. Events concentrate demand into high-margin windows and double as the top of the funnel for new members. They are also content: each gathering feeds the media engine that markets the village to the wider audience.",
  "culture-4": "Artist residencies run as work-stay arrangements: artists contribute labor and creative work that beautifies the land while building culture, at low cash cost to the village. This converts an amenity expense into a contribution-based program and continuously generates the installations and atmosphere that justify premium pricing. Residencies also deepen the talent pipeline feeding the maker space and Design Spore.",
  "culture-5": "Treating art as Phase 1 infrastructure rather than a late amenity is a deliberate differentiation bet: the look and feel of the place is what members pay for and what photographs into media reach. Front-loading art compounds the brand and asset value early instead of retrofitting it expensively later. It signals the village is a cultural product, not a campground with add-ons.",
  "culture-6": "Wellness days, workshops, and rituals around the sauna, cold plunge, and campfire are the recurring programming that fills shoulder-season days and gives memberships weekly utility. These touchpoints drive retention and create upsell into paid courses, retreats, and immersions. They operationalize the wellness positioning that commands premium membership and stay pricing.",
  "culture-7": "Clear roles and codes of conduct are the unglamorous governance layer that keeps a high-trust community healthy and protects the brand from the conflicts that destroy intentional communities. This is risk management: defined expectations reduce disputes, liability, and churn. A documented governance model is also part of the replicable template licensed and exported to future nodes.",
  "os-0": "The Village Stack is a modular suite of AI and digital tools rather than one monolith, so each component can be deployed, improved, and licensed independently. Modularity lets new nodes adopt only what they need and lets the village sell the layer as a product without exposing the whole system. This architecture is the foundation of the tech moat and a future licensing revenue line.",
  "os-1": "A digital twin and live land mapping give a real-time 3D model of the 400 acres, turning the property into queryable data for planning, maintenance, and resident wayfinding. It lowers operating cost by making the physical site legible to both staff and AI systems. As a replicable module, the twin is also a sellable capability for any village mapping its own land.",
  "os-2": "An AI oracle assistant answers questions and guides residents and staff, reducing the human support load that normally scales linearly with headcount and guests. It improves the resident experience while holding down operating costs as occupancy grows. Packaged within the stack, it is a concrete demonstration of land-based AI that strengthens the licensing story.",
  "os-3": "A walkie-talkie coordination network gives the seasonal team of 6 to 20 real-time operational coordination across a large property, directly improving safety, response time, and labor efficiency. Coordination tooling is what lets a lean crew run a complex site, protecting margins. It is a practical, exportable module other multi-acre nodes will need on day one.",
  "os-4": "A single maintenance, repairs, and operations tracking system consolidates the work of running a 400-acre property into one source of truth, cutting downtime and deferred-maintenance risk that erodes asset value. Operational visibility is a direct margin and asset-protection lever. As part of the stack, it is among the most universally licensable modules for any physical-site operator.",
  "os-5": "The module suite spanning members, governance, energy, farm, and marketplace covers the full operating surface of a village in composable parts. Together they let a node run memberships, resources, and internal commerce on one coherent platform. This breadth is what makes the stack a credible licensable product and the network's connective tissue, not just internal tooling.",
  "os-6": "Embedding AI agents at every layer of operations is the bet that a small team can run a large, complex village by delegating routine coordination to software. The payoff is structurally lower labor cost per resident as the site and network scale. It also positions the village at the frontier of applied, land-based AI, reinforcing both the moat and the media narrative.",
  "os-7": "Open-sourcing the stack through the Future Thinkers Foundation lets any aligned village run a node, which accelerates network growth and standardizes the platform every future site depends on. Open source drives adoption and goodwill while the proprietary expertise, integrations, and brand remain the moat. It seeds the ecosystem the franchisable and licensing models will later monetize.",
  "net-0": "The network layer connecting people to aligned village nodes is the thesis that turns one property into a category: a replicable constellation rather than a single resort. Network effects compound membership value as nodes are added, since a membership becomes access to many places. This is the optionality that justifies the larger $20M+ phases and the long-term valuation upside.",
  "net-1": "Wells Gray as the flagship anchor is the strongest, fully operating node from which the network's standards, software, and brand radiate. A proven flagship de-risks every subsequent node and gives the network a credible reference site for partners and investors. Its operating history is the evidence base the entire replication strategy stands on.",
  "net-2": "Kamloops as a regional hub connects the BC interior and gives the network an urban gateway feeding members, talent, and logistics into Wells Gray and future nodes. A hub-and-spoke structure concentrates demand and distribution where population already is. It is the first step from a single site toward the multi-node network the larger raise funds.",
  "net-3": "A BC-interior trade network moving food, goods, and services between nodes turns the constellation into a small resilient economy, capturing value that would otherwise leak to outside suppliers. Inter-node trade lowers costs, deepens the resilience story residents buy, and creates internal revenue. It is the practical mechanism that makes a network of villages more valuable than the sum of standalone sites.",
  "net-4": "Member Credit and backhaul logistics move value and goods efficiently between villages, reducing waste on return trips and giving members a portable internal currency. This is the financial and physical plumbing that makes inter-node trade actually work at low cost. As the network grows, this layer becomes a defensible source of efficiency and member lock-in.",
  "net-5": "Intentions toward Indigenous partnership with the Simpcw and Tk'emlúps are aspirational and not yet signed, and are framed honestly as such. Genuine partnership would strengthen the land relationship, social license, and regeneration mission central to the brand. This is flagged as upside and relationship-building, not a committed dependency in the current plan.",
  "net-6": "Village as a service is the replicable, franchisable model: the packaged combination of template, tech stack, brand, and playbook that lets aligned operators launch a node. This converts hard-won operating knowledge into a scalable, capital-light revenue line beyond owning land directly. Franchising is the mechanism that takes the network from a few owned sites to a broad constellation.",
  "net-7": "Serving as a physical home base for digital nomads captures the exact macro tailwind driving the thesis: remote work, automation, and burnout pushing knowledge workers toward nature and community. Nomads are a high-fit, recurring membership and immersion audience that fills weekday and shoulder-season capacity. They also seed the talent and culture that make the village productive year-round.",
  "make-0": "The maker space, equipped with 3D printers, laser cutters, CNC, and UV tools, is the productive heart that turns the village from a place to stay into a place that builds. It enables on-site fabrication of cabins and goods, converting raw materials into high-margin product and member value. The equipment partnerships with Carbide 3D and xTool also anchor the local manufacturing strategy.",
  "make-1": "Woodworking, embroidery, and a jam studio round out a hands-on maker culture that gives members daily creative utility and produces sellable, locally made goods. This craft layer deepens the lifestyle product and feeds the marketplace and circular-economy modules. It is also the on-ramp that develops residents into contributors to the larger fabrication operation.",
  "make-2": "Manufacturing tiny homes and park-model cabins on-site is a direct, scalable revenue line with real margin: the village controls production and captures value that would otherwise go to outside builders. Local fabrication of cabins is one of the clearest monetization paths in the plan, and Phase 1 funds expanding the maker space precisely for this. It also supplies the village's own glamping and cabin inventory at cost.",
  "make-3": "Cabins built to template the model are designed so the build itself can be exported and reproduced at other nodes, turning fabrication into a network-scaling tool, not just local product. Standardized, manufacturable cabins lower the cost and risk of launching each new site. This couples the manufacturing revenue line directly to the replication thesis.",
  "make-4": "Physical art installations of sculpture and light across the land are the experiential differentiation that justifies premium membership and stay pricing and generates the imagery that powers the media engine. Art is treated as a productive asset that compounds brand value. Built largely through work-stay residencies, these installations come at low cash cost relative to their marketing return.",
  "make-5": "Positioning the village as a hub for local production and a circular making economy keeps value, materials, and skills inside the network rather than leaking to outside suppliers. Local, circular making lowers costs, strengthens the resilience story, and creates marketplace revenue. It is the economic engine that makes the village a producer, not just a consumer of goods.",
  "learn-0": "The Future Thinkers Foundation is the non-profit keeper of the mission, holding the open-sourced tools and educational programs that anchor the village's credibility and long-term purpose. The non-profit structure protects the mission from short-term commercial pressure and unlocks grants, partnerships, and goodwill. It is also the entity through which the stack is open-sourced to seed the network.",
  "learn-1": "Forest schooling, priced at $495 to $595 per month, teaches kids meta-skills, maker culture, and foraging while creating recurring family revenue and a powerful reason for families to commit seasonally. Education is the stickiest possible hook: it binds whole families to the village across years. It also differentiates the lifestyle product from any pure-hospitality competitor.",
  "learn-2": "Courses on resilience and meta-skills extend education to adults, monetizing the founders' expertise and audience through high-margin programming that fills capacity outside peak season. Adult education diversifies revenue beyond stays and memberships and reinforces the village's intellectual brand. Each course is also content that feeds the media funnel and recruits new members.",
  "learn-3": "Public AI-literacy events position the village as a regional knowledge hub, building goodwill, local relationships, and a pipeline of aligned future members at low cost. These community workshops convert the founders' AI and media expertise into reach and reputation. They also strengthen the land-based-AI narrative that differentiates the project.",
  "learn-4": "Openly published research on community design and governance turns the village's operating experience into intellectual authority and a credibility moat competitors cannot easily replicate. Published research attracts partners, talent, and press while documenting the playbook future nodes will follow. It reinforces the thesis that this is a studied, replicable model, not a one-off lifestyle bet.",
  "learn-5": "Work-stay programs and fellowships let people learn by doing on the land on a contribution basis, supplying motivated labor at low cash cost while developing the village's future operators and members. This converts a labor expense into a talent and culture pipeline. Fellowships also widen access and deepen the committed community that retention depends on.",
  "learn-6": "Open-sourcing the tools lets the model scale freely: adoption spreads without per-node sales friction while the village retains the brand, expertise, and network as the real moat. Free distribution maximizes ecosystem growth and standardizes the platform every node runs. Monetization shifts to licensing, services, and franchising on top of the open base.",
  "ai-0": "AI woven into daily operations rather than bolted on is the structural efficiency bet behind the whole model: software absorbs coordination work so a lean seasonal team can run a complex property. Native integration lowers cost per resident and improves experience as the site scales. It is also the lived proof point for the village's licensable tech and AI narrative.",
  "ai-1": "Autonomous agents at every layer of village life extend that efficiency, handling routine tasks across operations, programs, and resident support. The payoff is operating leverage: capacity grows faster than headcount and cost. As a frontier capability built on real land operations, it deepens both the moat and the story that attracts mission-aligned capital.",
  "ai-2": "Robotics for land and community work targets the practical, expensive labor of maintaining 400 acres, from grounds to farm tasks, where automation directly cuts cost and addresses rural labor scarcity. Field robotics is an emerging margin lever most hospitality operators ignore. Proving it here creates exportable capability and reinforces the land-based-AI frontier positioning.",
  "ai-3": "Framing land-based AI as a neglected frontier distinct from commercial, screen-bound AI is a genuine differentiation thesis with first-mover optionality. Most AI capital chases office and software use cases; applying it to physical land and community is comparatively open territory. Owning this niche is a strategic moat and a magnet for talent, press, and aligned investors.",
  "ai-4": "AI-native artists creating live generative art on the land fuse the village's art and AI threads into experiences competitors cannot easily copy. This produces continuously fresh, shareable installations that drive media reach and premium positioning at low marginal cost. It also showcases the creative side of land-based AI, reinforcing the frontier brand.",
  "ai-5": "Design Spore is the in-house AI and media production arm, a real studio with case studies including the Aeternity $79M raise and Game B at over 4M views. It is both a standalone revenue and consulting line and the engine that produces the village's marketing, fundraising, and content. Owning production in-house compounds reach while keeping customer-acquisition costs low.",
  "why-0": "At its core the village is an experiment in how a resilient civilization could actually work, tested on real land with real residents rather than theorized. This ambition is what attracts the mission-aligned capital, talent, and audience that give the project its unfair advantages. For investors it frames the venture as category-defining, with upside far beyond a single resort's cash flows.",
  "why-1": "Resilience built on food, energy, water, and mutual aid is the foundation residents are paying to access, and the macro hedge driving demand amid automation and instability. These systems lower operating costs while being the product itself. Tangible resilience differentiates the village from lifestyle competitors selling aesthetics without substance.",
  "why-2": "Long-horizon governance and Game B futures position the village as a serious laboratory for new social and economic models, attracting an intellectually committed community and partners. This depth is brand equity that premium pricing and the foundation's research authority rest on. It signals durable purpose, which is what sustains a multi-decade network rather than a trend.",
  "why-3": "The Future Thinkers Podcast, with 10M+ downloads, is the media engine and pre-built audience that already crowdfunded roughly $2.6M and now drives member acquisition at near-zero marginal cost. Owning distribution is the project's single biggest structural advantage over conventional developers. This flywheel of land, tech, and media is what makes growth capital-efficient.",
  "why-4": "Regeneration and land-based living anchor the ecological mission that gives the brand authenticity and protects the long-term value of the core asset. Ecological restoration is both a values commitment residents buy into and a driver of the land's appreciation and social license. It differentiates the village from extractive development and aligns with the regeneration capital pool.",
  "why-5": "Offering a whole way of life spanning resilience, art, craft, tech, family, and tradition is the integrated lifestyle product that makes the village a new real-estate category rather than a campground or club. Breadth is what justifies recurring membership and immersion pricing and drives deep retention. An integrated experience is also far harder for any single-vertical competitor to replicate.",
  "why-6": "Built to be replicated as a network rather than a single brand, the model treats every system, tool, and playbook as exportable from day one. This is the source of the largest valuation upside: the path from one 400-acre site to a constellation of nodes and a licensable platform. Designing for replication is what turns a strong lifestyle business into a scalable network play.",
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

// Optional "learn more" links per node id → a relevant page on the live site.
const LEAF_LINKS: Record<string, { href: string; label: string }> = {
  "land-0": { href: "https://portal.place/village", label: "Explore Wells Gray Village" },
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
      moreLink: b.moreLink,
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
    "400 acres of land, a network of villages, and an experiment in how a resilient civilization could actually work.",
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
