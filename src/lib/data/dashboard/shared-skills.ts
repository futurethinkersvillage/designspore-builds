export type SkillCategory =
  | "Governance"
  | "Communications"
  | "Operations"
  | "Land & Energy"
  | "People & Culture"
  | "Network";

export type SkillVerification = "verified" | "community" | "experimental";

export interface SharedSkill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  /** Human-readable author name */
  author: string;
  /** Originating village */
  authorVillage: string;
  installs: number;
  rating: number; // 0-5
  verification: SkillVerification;
  /** IDs of agents that currently have this skill installed (matches AgentData.id) */
  installedOn: string[];
  /** Compatible agent IDs (any agent that *could* install it) */
  compatible: string[];
  updated: string;
}

export const sharedSkills: SharedSkill[] = [
  {
    id: "s3-consent-round",
    name: "Sociocracy 3.0 Consent Round",
    description: "Facilitates a structured S3 consent round — clarifying questions, reactions, objections, integration. Surfaces tensions before vote.",
    category: "Governance",
    author: "Marcus Rivera",
    authorVillage: "Earthsong (NZ)",
    installs: 23,
    rating: 4.8,
    verification: "verified",
    installedOn: ["sage"],
    compatible: ["sage"],
    updated: "2 weeks ago",
  },
  {
    id: "bilingual-announce",
    name: "Bilingual Announcement Drafter",
    description: "Drafts community announcements in EN + a second language with cultural-context review. Currently supports 7 languages.",
    category: "Communications",
    author: "Yuki Tanaka",
    authorVillage: "Wells Gray Village",
    installs: 47,
    rating: 4.6,
    verification: "verified",
    installedOn: ["sage"],
    compatible: ["sage", "iris"],
    updated: "5 days ago",
  },
  {
    id: "compost-tracker",
    name: "Circular Compost Tracker",
    description: "Logs compost inputs, monitors C:N ratio, predicts ready-to-spread dates. Integrates with soil sensor readings.",
    category: "Land & Energy",
    author: "Elena Vasquez",
    authorVillage: "Riverside Co-op",
    installs: 18,
    rating: 4.4,
    verification: "community",
    installedOn: ["fern"],
    compatible: ["fern"],
    updated: "1 month ago",
  },
  {
    id: "skill-matcher",
    name: "Skill-to-Project Matcher",
    description: "Cross-references member skill profiles with active project needs. Suggests intros and confidence-scores each match.",
    category: "People & Culture",
    author: "Anika Patel",
    authorVillage: "Wells Gray Village",
    installs: 89,
    rating: 4.9,
    verification: "verified",
    installedOn: ["iris"],
    compatible: ["iris", "forge"],
    updated: "1 week ago",
  },
  {
    id: "inter-village-swap",
    name: "Inter-Village Resource Swap",
    description: "Coordinates lending/swapping of tools, seeds, and skills across villages in your network. Tracks reputation and balances.",
    category: "Network",
    author: "Chris Delaney",
    authorVillage: "Terraluna Ecovillage",
    installs: 34,
    rating: 4.5,
    verification: "verified",
    installedOn: ["atlas"],
    compatible: ["atlas"],
    updated: "3 weeks ago",
  },
  {
    id: "burndown-reporter",
    name: "Sprint Burndown Reporter",
    description: "Auto-generates weekly task burndown summaries with blockers, velocity trends, and reassignment suggestions.",
    category: "Operations",
    author: "Sarah Lindqvist",
    authorVillage: "Wells Gray Village",
    installs: 56,
    rating: 4.3,
    verification: "community",
    installedOn: ["forge"],
    compatible: ["forge"],
    updated: "4 days ago",
  },
  {
    id: "restorative-circle",
    name: "Restorative Circle Facilitator",
    description: "Guides a 5-stage restorative justice circle when conflicts arise. Generates pre-circle prep prompts for facilitator.",
    category: "Governance",
    author: "Mira Johal",
    authorVillage: "Wells Gray Village",
    installs: 12,
    rating: 4.7,
    verification: "experimental",
    installedOn: [],
    compatible: ["sage", "iris"],
    updated: "Just released",
  },
  {
    id: "solar-forecaster",
    name: "Solar Production Forecaster",
    description: "7-day solar generation forecast using local weather + panel orientation. Suggests load-shifting opportunities.",
    category: "Land & Energy",
    author: "James Whittaker",
    authorVillage: "Riverside Co-op",
    installs: 41,
    rating: 4.6,
    verification: "verified",
    installedOn: ["fern"],
    compatible: ["fern"],
    updated: "2 weeks ago",
  },
  {
    id: "newcomer-onboarding",
    name: "Newcomer Onboarding Sequence",
    description: "Personalized 30-day onboarding journey for new members — intros, orientations, micro-tasks, check-ins.",
    category: "People & Culture",
    author: "Hannah Forsberg",
    authorVillage: "Wells Gray Village",
    installs: 67,
    rating: 4.8,
    verification: "verified",
    installedOn: ["iris"],
    compatible: ["iris"],
    updated: "1 week ago",
  },
];

export const skillStats = {
  total: sharedSkills.length,
  totalInstalls: sharedSkills.reduce((sum, s) => sum + s.installs, 0),
  contributors: new Set(sharedSkills.map((s) => s.author)).size,
  verified: sharedSkills.filter((s) => s.verification === "verified").length,
};
