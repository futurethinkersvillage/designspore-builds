// Shared data for /one-pager and /investor-print
// Edit here — both pages import from this file.

export const SUMMARY_ROWS = [
  { label: "RAISING", value: "$3M CAD" },
  { label: "STRUCTURE", value: "SPV — Multiple investors" },
  { label: "SECURITY", value: "First position on land title" },
  { label: "RETURN", value: "Fixed interest + equity kicker" },
  { label: "UPSIDE", value: "~50% target at next round" },
  { label: "TIMELINE", value: "18–24 months" },
  { label: "MIN. TICKET", value: "$100,000 CAD" },
];

export const MARKET_STATS = [
  {
    number: "200,000+",
    label: "visitors/year to adjacent Wells Gray Park",
    sub: "Local demand, proven gateway",
  },
  {
    number: "3,000+",
    label: "guests per year at our current site",
    sub: "Operating for 5 seasons",
  },
  {
    number: "$2T+",
    label: "wellness tourism market by 2030",
    sub: "10–12% CAGR globally",
  },
  {
    number: "40%+",
    label: "Canadian workers remote-capable",
    sub: "Where you live is now a choice",
  },
];

export const PROPERTY_ITEMS = [
  "393 acres across 2 land titles in Clearwater, BC",
  "C-3 + C-4 commercial/recreational zoning",
  "45 serviced RV sites + 30 non-serviced sites",
  "3 bunk cabins, 1 geodesic glamping dome",
  "120-person event gazebo with commercial kitchen",
  "Sauna, cold plunge, makerspace workshop",
  "9-hole golf + disc golf course",
  "Horse corral, private lake, 2 creeks",
  "Starlink internet throughout",
  "Held by Giant Supernova Holdings Inc.",
];

export const BUSINESS_ITEMS: { text: string; sensitive?: boolean }[] = [
  { text: "~$250K annual revenue, seasonal (May–Oct only)", sensitive: true },
  { text: "Revenue trend: $131K → $177K → $187K (2021–23)", sensitive: true },
  { text: "~3,000 guests/year with minimal paid marketing" },
  { text: "Appraised value: ~$2.25M+ (land, business, equipment)", sensitive: true },
  { text: "10+ years building Future Thinkers audience (10M+ downloads)" },
  { text: "Founders on-site, deeply operationally committed" },
];

export const BRIDGE_USES = [
  "Completes the makerspace to begin in-house cabin and unit fabrication",
  "Expands glamping and accommodation capacity (revenue-generating infrastructure)",
  "Funds feasibility, diligence, and structuring for the $20M expansion raise",
  "Builds the membership platform and improves investor materials",
  "Provides 3-year operations runway for the flagship site",
];

export const PROJECTION_ROWS = [
  { label: "Lodging (existing)", current: "$187K", yr1: "$250K", yr3: "$350K", sensitive: true },
  { label: "Glamping & Cabins", current: "—", yr1: "$400K", yr3: "$1.1M", sensitive: true },
  { label: "Wellness & Events", current: "$20K", yr1: "$150K", yr3: "$350K", sensitive: true },
  { label: "Memberships", current: "—", yr1: "$50K", yr3: "$250K", sensitive: true },
  { label: "Total", current: "~$250K", yr1: "~$850K", yr3: "~$2.0M", bold: true, sensitive: true },
];

export const COMPARISON_ROWS = [
  {
    left: "One-time cost with no return",
    right: "Fixed interest + equity kicker return",
  },
  {
    left: "Property tax, maintenance, liability",
    right: "No ownership costs",
  },
  {
    left: "Isolated — no community",
    right: "Community of like-minded people built in",
  },
  {
    left: "Used 2–4 weeks/year on average",
    right: "1–4 weeks allocated + open access anytime",
  },
  {
    left: "No emergency infrastructure",
    right: "Guaranteed emergency access for family",
  },
  {
    left: "No upside beyond land appreciation",
    right: "~50% upside kicker + priority expansion round",
  },
  {
    left: "You build it alone",
    right: "Professional team builds it, you benefit",
  },
  {
    left: "Static asset",
    right: "Growing network with software-like scalability",
  },
];

export const INVESTMENT_TIERS = [
  {
    name: "Trailblazer",
    amount: "$100K+",
    perks: [
      "1 week annual stay allocation",
      "Priority booking window",
      "Off-season open access",
      "Emergency family access",
      "First right on $20M raise",
      "Founding membership rate locked",
      "Annual Founders' Gathering invite",
    ],
  },
  {
    name: "Homesteader",
    amount: "$250K+",
    perks: [
      "3 weeks annual stay (up from 1)",
      "Dedicated Founders' Area site",
      "Personal storage locker on-site",
      "Full workshop + makerspace access",
      "Food program participation",
      "$750 annual on-site spending credit",
      "Founders' Council input on design",
      "Priority unit selection when built",
    ],
  },
  {
    name: "Cornerstone",
    amount: "$500K+",
    perks: [
      "4 weeks annual stay",
      "Naming rights (trail/garden/space)",
      "Advisory board seat",
      "Direct quarterly call with founders",
      "$1,500 annual spending credit",
      "First pick on all unit selections",
      "Extended family emergency access",
    ],
  },
];

export const FOUNDER_STATS = [
  { number: "10M+", label: "total podcast downloads" },
  { number: "5 yrs", label: "operating this destination" },
  { number: "$2.25M+", label: "current appraised property value", sensitive: true },
];
