export interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  thumbnail: string;
  heroImage?: string;
  problem: string;
  whatWeDid: string[];
  outcomes: string[];
  stats?: { value: string; label: string }[];
  videos?: string[]; // YouTube video IDs
  images?: string[];
  relatedServices: ("ai-services" | "launch-services")[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "future-thinkers",
    name: "Future Thinkers",
    tagline: "From zero to visionary global brand",
    tags: ["launch", "branding", "content", "media", "fundraising"],
    thumbnail: "https://designspore.co/wp-content/uploads/2025/12/Village-Ecosystem-Long-1024x576.jpg",
    problem:
      "\"We're learning about all these amazing ideas that could have a positive impact on the world, but nobody has heard of them, and they're often too complex and never found in the same place.\"",
    whatWeDid: [
      "Developed a visionary brand from the ground up",
      "Executed a multi-year content & marketing strategy",
      "Established thought leadership in emerging ideas and technology",
      "Built a pioneering multimedia brand platform",
      "Launched a $2M crowdfunding campaign for a smart village in Canada",
    ],
    outcomes: [
      "Built a pioneering change-maker multimedia brand",
      "Over 100 thought leaders featured",
      "Top viral video received 2 million views",
      "Invited to speak at dozens of conferences worldwide",
      "Featured in BBC and Forbes",
      "Raised $2 Million CAD in a crowdfunding campaign",
    ],
    stats: [
      { value: "$2M CAD", label: "Raised in crowdfunding" },
      { value: "2M+", label: "Video views" },
      { value: "100+", label: "Thought leaders featured" },
    ],
    videos: ["G3psxs3gyf8", "GYp81d0vFKY"],
    relatedServices: ["launch-services"],
  },
  {
    slug: "portal-place",
    name: "Portal.Place",
    tagline: "From visionary concept to scalable Smart Village network",
    tags: ["launch", "branding", "ai-systems", "website", "community"],
    thumbnail: "https://designspore.co/wp-content/uploads/2025/12/Village-Ecosystem-Long-1-1024x576.jpg",
    heroImage: "https://designspore.co/wp-content/uploads/2025/12/Screenshot-2025-12-31-152645-1024x591.png",
    problem:
      "\"We have a compelling vision for seasonal village living — but we need a clear offer, brand narrative, and repeatable operating system that can scale beyond one location without drifting into vague 'community' language or inconsistent guest experiences.\"",
    whatWeDid: [
      "Defined brand positioning and messaging architecture",
      "Built the Smart Village standard as a repeatable kit",
      "Created a conversion-ready website structure",
      "Developed story pillars, short-form video templates, and visual-first media strategy",
      "Prototyped AI-assisted operations concepts",
      "Designed an NFT art collection and access key framework",
    ],
    outcomes: [
      "Translated a big thesis into a concrete launch and business plan",
      "Created a clear membership offer, partner-ready standards, and scalable roadmap",
      "Built narrative and system foundation for near-term traction and long-term expansion",
    ],
    videos: ["xrL-wL5Bueg"],
    relatedServices: ["launch-services", "ai-services"],
  },
  {
    slug: "aeternity",
    name: "Aeternity",
    tagline: "Blockchain launch that raised $79M USD",
    tags: ["launch", "content", "media", "fundraising", "blockchain"],
    thumbnail: "https://designspore.co/wp-content/uploads/2024/08/aeternity-results-1024x621.png",
    problem:
      "\"We've got this groundbreaking technology that could change the world, but nobody knows who we are or how it works.\"",
    whatWeDid: [
      "Designed a content & influencer strategy",
      "Created a brand narrative and multimedia content",
      "Produced an explainer video",
      "Ran a full launch marketing campaign",
      "Created a sponsored segment on Future Thinkers with over 2 million views",
    ],
    outcomes: [
      "Positioned Aeternity Blockchain as a visionary newcomer and innovator",
      "Marketing campaign helped raise over $79 Million USD",
    ],
    stats: [
      { value: "$79M USD", label: "Raised in campaign" },
      { value: "2M+", label: "Video views on sponsored segment" },
    ],
    videos: ["Tf_YNgph84o"],
    relatedServices: ["launch-services"],
  },
  {
    slug: "wells-gray",
    name: "Wells Gray Resort & Village",
    tagline: "Real-world builds at our home base in Clearwater, BC",
    tags: ["tourism", "hospitality", "local-business", "launch"],
    thumbnail: "https://designspore.co/wp-content/uploads/2026/01/PXL_20260101_195310069-1024x767.jpg",
    problem:
      "\"We want to build a maker space to assist with village build projects, create new signage, build a dome and sauna, and develop a treasure hunt for our guests.\"",
    whatWeDid: [
      "Created a maker space with woodworking shop, laser cutter, and 3D printer",
      "Developed a treasure hunt with digital & physical rewards",
      "Designed new signage for the campsite & golf course",
      "Built a wood-fired barrel sauna",
      "Built a glamping dome",
    ],
    outcomes: [
      "Transformed the property with hands-on built infrastructure",
      "Created memorable guest experiences through physical and digital elements",
      "Established Wells Gray as a test site for innovative place-based projects",
    ],
    images: [
      "https://designspore.co/wp-content/uploads/2026/01/PXL_20260101_195310069-1024x767.jpg",
      "https://designspore.co/wp-content/uploads/2026/01/PXL_20250419_163130129.PORTRAIT-1-1024x908.jpg",
      "https://designspore.co/wp-content/uploads/2026/01/PXL_20250914_213519050-771x1024.jpg",
      "https://designspore.co/wp-content/uploads/2026/01/PXL_20241116_220444665-EDIT-1024x771.jpg",
    ],
    videos: ["rQwOshB6J3M"],
    relatedServices: ["launch-services"],
  },
  {
    slug: "equalli",
    name: "Equalli",
    tagline: "Craft jewellery brand from commodity to visionary",
    tags: ["branding", "launch", "content", "video"],
    thumbnail: "https://designspore.co/wp-content/uploads/2023/06/Client-Logos_0001_Equalli_Logo-150x150.png",
    problem:
      "\"I produce a world-class bespoke product, but nobody knows the heart, soul, blood, sweat, and tears that go into making it, and so they see it as a commodity.\"",
    whatWeDid: [
      "Created 2 compelling brand documentaries",
      "Developed a strategic content & marketing plan",
      "Produced product photography & videography",
      "Advised on product design and brand voice",
    ],
    outcomes: [
      "Helped Equalli jewellery craft a visionary brand",
      "Launched a successful business with a differentiated market position",
      "Established authority and trust in the craft jewellery space",
    ],
    videos: ["wSuO2PmAKHA"],
    relatedServices: ["launch-services"],
  },
  {
    slug: "empire-flippers",
    name: "Empire Flippers",
    tagline: "Becoming the #1 online business broker through content",
    tags: ["content", "website", "media", "launch"],
    thumbnail: "https://designspore.co/wp-content/uploads/2023/06/Client-Logos_0002_ef-logo-white-150x150.png",
    problem:
      "\"I've got a working business, but the sales process is complex and time consuming, and we have to do a lot of education and trust-building before we can make the sale.\"",
    whatWeDid: [
      "Designed a streamlined customer education system with attractive video templates",
      "Developed a strategic content plan",
      "Created compelling multimedia content for lead nurturing",
    ],
    outcomes: [
      "Elevated customer education and multimedia content strategy",
      "Helped Empire Flippers become the leader in their field",
    ],
    videos: ["wshy8i0mATs", "51VAPoHIbWo"],
    relatedServices: ["launch-services"],
  },
  {
    slug: "game-b-movement",
    name: "Game B Movement",
    tagline: "Complex philosophy turned viral — 4M views in 3 months",
    tags: ["launch", "content", "video", "community", "media"],
    thumbnail: "https://designspore.co/wp-content/uploads/2024/07/9653-e1723773032417.jpg",
    problem:
      "\"Game B ideas are gaining attention in niche circles but are too abstract and fragmented for a wider audience.\"",
    whatWeDid: [
      "Developed a clear narrative and visual identity",
      "Produced cinematic videos blending philosophy, culture, and technology",
      "Designed messaging that connected the ethos to real-world solutions",
      "Built strategic partnerships and influencer relationships",
      "Published 50+ custom videos across Instagram, TikTok, and other platforms",
    ],
    outcomes: [
      "Reached over 4 million views in 3 months",
      "Gained 4,500+ new followers",
      "Drove 21,500+ interactions",
      "Published 50+ custom videos",
    ],
    stats: [
      { value: "4M+", label: "Views in 3 months" },
      { value: "4,500+", label: "New followers" },
      { value: "21,500+", label: "Total interactions" },
      { value: "50+", label: "Custom videos" },
    ],
    videos: ["eAXrSUH2G9A"],
    relatedServices: ["launch-services"],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export const tagLabels: Record<string, string> = {
  "ai-systems": "AI Systems",
  launch: "Launch",
  branding: "Branding",
  website: "Website",
  content: "Content",
  video: "Video",
  tourism: "Tourism",
  hospitality: "Hospitality",
  education: "Education",
  "local-business": "Local Business",
  fundraising: "Fundraising",
  media: "Media",
  blockchain: "Blockchain",
  community: "Community",
};
