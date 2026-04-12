import type { Proposal, Dispute, Agreement } from "./types";

// ─── Governance Stats ────────────────────────────────────────────────────────

export const governanceStats = {
  participation: 78,
  avgResolution: 4.2,
  proposalsThisQuarter: 12,
  consentRate: 85,
};

// ─── Active Proposals ────────────────────────────────────────────────────────

export const activeProposals: Proposal[] = [
  {
    id: "p1",
    title: "Solar Array Expansion — Phase 2",
    proposer: "Jens Muller",
    description: "Expand the existing solar array by 12 panels on the south-facing barn roof to increase energy self-sufficiency from 72% to an estimated 85%. Budget: $42,000 from the community crowdfund.",
    votesFor: 68,
    votesAgainst: 12,
    abstentions: 8,
    deadline: "2026-06-20",
    status: "active",
  },
  {
    id: "p2",
    title: "Community Garden Expansion",
    proposer: "Maya Chen",
    description: "Convert the 0.5-acre fallow plot behind the greenhouse into a community allotment garden with 20 individual plots available to members. Includes irrigation hookup and tool shed.",
    votesFor: 54,
    votesAgainst: 18,
    abstentions: 14,
    deadline: "2026-06-25",
    status: "active",
  },
  {
    id: "p3",
    title: "New Work-Stay Policy v2.0",
    proposer: "Liam O'Brien",
    description: "Update the work-stay program to include a structured mentorship component, skill-based matching, and a graduated hours model (15h/wk month 1, 20h/wk months 2-5). Adds $2K/quarter budget for participant supplies.",
    votesFor: 41,
    votesAgainst: 5,
    abstentions: 3,
    deadline: "2026-06-18",
    status: "active",
  },
  {
    id: "p4",
    title: "Quiet Hours Amendment",
    proposer: "Sofia Andersson",
    description: "Amend the existing Quiet Hours Policy to extend quiet hours from 22:00–07:00 to 21:30–07:30 on weeknights (Sun–Thu), with the existing 23:00–08:00 window kept for weekends. Add an exception process for scheduled events.",
    votesFor: 32,
    votesAgainst: 29,
    abstentions: 11,
    deadline: "2026-06-22",
    status: "active",
  },
  {
    id: "p5",
    title: "Internal Marketplace Launch",
    proposer: "Takeshi Ono",
    description: "Launch the internal village marketplace platform for peer-to-peer trading, tool rental, and service exchange. Includes a 2% community fee on monetary transactions to fund the maintenance budget.",
    votesFor: 59,
    votesAgainst: 8,
    abstentions: 6,
    deadline: "2026-06-28",
    status: "active",
  },
  {
    id: "p6",
    title: "Emergency Fund Increase",
    proposer: "Rachel Thornton",
    description: "Increase the community emergency reserve from $15,000 to $30,000 by allocating 5% of monthly net revenue until the target is reached. Estimated timeline: 8 months at current revenue.",
    votesFor: 72,
    votesAgainst: 3,
    abstentions: 2,
    deadline: "2026-06-15",
    status: "active",
  },
];

// ─── Proposal History ────────────────────────────────────────────────────────

export const proposalHistory: Proposal[] = [
  { id: "ph1", title: "Establish Community Tool Library", proposer: "Liam O'Brien", description: "Create a shared tool library in the workshop barn.", votesFor: 82, votesAgainst: 4, abstentions: 6, deadline: "2026-05-10", status: "passed" },
  { id: "ph2", title: "Guest Overnight Policy", proposer: "Priya Sharma", description: "Allow members to host up to 2 guests for 3 nights max without approval.", votesFor: 65, votesAgainst: 22, abstentions: 9, deadline: "2026-05-08", status: "passed" },
  { id: "ph3", title: "Alcohol-Free Zones Designation", proposer: "Sofia Andersson", description: "Designate the main garden and children's area as alcohol-free zones.", votesFor: 71, votesAgainst: 14, abstentions: 8, deadline: "2026-04-28", status: "passed" },
  { id: "ph4", title: "Monthly Community Meal Budget", proposer: "Emma Rodriguez", description: "Allocate $600/month for weekly community dinners.", votesFor: 88, votesAgainst: 2, abstentions: 3, deadline: "2026-04-25", status: "passed" },
  { id: "ph5", title: "Pet Limit per Dwelling", proposer: "James Whitfield", description: "Limit to 2 pets per dwelling unit with a waiver process.", votesFor: 44, votesAgainst: 38, abstentions: 12, deadline: "2026-04-20", status: "passed" },
  { id: "ph6", title: "Short-Term Rental on Airbnb", proposer: "David Chen", description: "List vacant cabins on Airbnb during low-occupancy months.", votesFor: 28, votesAgainst: 52, abstentions: 14, deadline: "2026-04-15", status: "rejected" },
  { id: "ph7", title: "Electric Vehicle Charging Stations", proposer: "Jens Muller", description: "Install 4 Level 2 EV chargers in the parking area.", votesFor: 76, votesAgainst: 9, abstentions: 5, deadline: "2026-04-10", status: "passed" },
  { id: "ph8", title: "Composting Toilet Pilot", proposer: "Maya Chen", description: "Install composting toilets in 2 cabins as a pilot program.", votesFor: 58, votesAgainst: 24, abstentions: 11, deadline: "2026-03-30", status: "passed" },
  { id: "ph9", title: "Member Dues Increase (5%)", proposer: "Rachel Thornton", description: "Increase all membership tier prices by 5% effective Q3.", votesFor: 34, votesAgainst: 45, abstentions: 15, deadline: "2026-03-25", status: "rejected" },
  { id: "ph10", title: "Work-Stay Cohort Size — Increase to 15", proposer: "Liam O'Brien", description: "Increase maximum cohort size from 12 to 15 participants.", votesFor: 42, votesAgainst: 36, abstentions: 14, deadline: "2026-03-20", status: "passed" },
  { id: "ph11", title: "Shared Kitchen Hours Extension", proposer: "Priya Sharma", description: "Extend communal kitchen hours to 06:00–23:00 daily.", votesFor: 79, votesAgainst: 7, abstentions: 4, deadline: "2026-03-15", status: "passed" },
  { id: "ph12", title: "Treehouse Build Approval", proposer: "Takeshi Ono", description: "Approve construction of an elevated treehouse workspace.", votesFor: 61, votesAgainst: 19, abstentions: 10, deadline: "2026-03-10", status: "passed" },
  { id: "ph13", title: "Fire Pit Curfew Policy", proposer: "Sofia Andersson", description: "Require all outdoor fires extinguished by 23:00.", votesFor: 83, votesAgainst: 5, abstentions: 3, deadline: "2026-02-28", status: "passed" },
  { id: "ph14", title: "Greenhouse Gas Heating System", proposer: "Jens Muller", description: "Install radiant floor heating in Greenhouse 1.", votesFor: 67, votesAgainst: 16, abstentions: 8, deadline: "2026-02-20", status: "passed" },
  { id: "ph15", title: "Children's Outdoor Classroom", proposer: "Emma Rodriguez", description: "Build a covered outdoor learning space near the meadow.", votesFor: 74, votesAgainst: 8, abstentions: 7, deadline: "2026-02-15", status: "passed" },
  { id: "ph16", title: "Ban Single-Use Plastics", proposer: "Maya Chen", description: "Prohibit single-use plastics in all communal areas.", votesFor: 91, votesAgainst: 1, abstentions: 2, deadline: "2026-02-10", status: "passed" },
  { id: "ph17", title: "Winter Heating Subsidy", proposer: "Rachel Thornton", description: "Subsidize 30% of heating costs Dec–Feb for lower-tier members.", votesFor: 55, votesAgainst: 28, abstentions: 10, deadline: "2026-01-30", status: "passed" },
  { id: "ph18", title: "Cannabis Growing Prohibition", proposer: "James Whitfield", description: "Prohibit personal cannabis cultivation on village grounds.", votesFor: 30, votesAgainst: 48, abstentions: 16, deadline: "2026-01-25", status: "rejected" },
  { id: "ph19", title: "Trail System Master Plan", proposer: "David Chen", description: "Adopt the 5-year trail development master plan.", votesFor: 85, votesAgainst: 3, abstentions: 4, deadline: "2026-01-20", status: "passed" },
  { id: "ph20", title: "Sauna Booking System", proposer: "Sofia Andersson", description: "Implement an online booking system for the sauna.", votesFor: 78, votesAgainst: 6, abstentions: 8, deadline: "2026-01-15", status: "passed" },
  { id: "ph21", title: "Year-Round Farmers Market Stall", proposer: "Maya Chen", description: "Rent a permanent stall at the Clearwater Farmers Market.", votesFor: 63, votesAgainst: 21, abstentions: 9, deadline: "2026-01-10", status: "passed" },
];

// ─── Active Disputes ─────────────────────────────────────────────────────────

export const disputes: Dispute[] = [
  { id: "d1", parties: ["Tom Henriksen", "Sarah Mitchell"], mediator: "Maya Chen", status: "in_mediation", priority: "medium", filed: "2026-06-02" },
  { id: "d2", parties: ["Workshop Group A", "Workshop Group B"], mediator: "Liam O'Brien", status: "open", priority: "low", filed: "2026-06-08" },
  { id: "d3", parties: ["Cabin 7 Residents", "RV Pad 3 Occupants"], mediator: "Sofia Andersson", status: "in_mediation", priority: "high", filed: "2026-05-28" },
  { id: "d4", parties: ["Emma Rodriguez", "Jens Muller"], mediator: "Rachel Thornton", status: "open", priority: "low", filed: "2026-06-10" },
];

// ─── Ratified Agreements ─────────────────────────────────────────────────────

export const agreements: Agreement[] = [
  { id: "ag1", title: "Quiet Hours Policy", category: "Community Living", adoptedDate: "2024-03-15", lastReviewed: "2026-04-01" },
  { id: "ag2", title: "Pet Policy", category: "Community Living", adoptedDate: "2024-06-01", lastReviewed: "2026-04-20" },
  { id: "ag3", title: "Tool Sharing Protocol", category: "Resources", adoptedDate: "2024-04-10", lastReviewed: "2026-05-10" },
  { id: "ag4", title: "Guest Guidelines", category: "Hospitality", adoptedDate: "2024-05-20", lastReviewed: "2026-05-08" },
  { id: "ag5", title: "Fire Safety Plan", category: "Safety", adoptedDate: "2023-11-01", lastReviewed: "2026-02-28" },
  { id: "ag6", title: "Water Conservation Rules", category: "Sustainability", adoptedDate: "2024-07-15", lastReviewed: "2026-03-15" },
  { id: "ag7", title: "Conflict Resolution Process", category: "Governance", adoptedDate: "2023-12-01", lastReviewed: "2026-01-20" },
  { id: "ag8", title: "Financial Transparency Charter", category: "Governance", adoptedDate: "2024-01-15", lastReviewed: "2026-02-10" },
  { id: "ag9", title: "Work-Stay Program Agreement", category: "Programs", adoptedDate: "2024-02-01", lastReviewed: "2026-05-01" },
  { id: "ag10", title: "Land Use & Zoning Guidelines", category: "Infrastructure", adoptedDate: "2023-10-01", lastReviewed: "2026-03-30" },
  { id: "ag11", title: "Communal Kitchen Use Agreement", category: "Community Living", adoptedDate: "2024-08-10", lastReviewed: "2026-04-15" },
  { id: "ag12", title: "Vehicle & Parking Policy", category: "Infrastructure", adoptedDate: "2024-09-01", lastReviewed: "2026-01-10" },
];
