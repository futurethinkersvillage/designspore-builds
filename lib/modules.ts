export type ModuleCategory =
  | "lead-generation"
  | "client-communication"
  | "reputation"
  | "operations"
  | "automation";

export interface Module {
  id: string;
  name: string;
  problemHeadline: string;
  problemDescription: string;
  category: ModuleCategory;
  shortDescription: string;
  serviceMechanism: string;
  businessOutcome: string;
  whyItMatters: string;
  estimatedValue: number;
  includedDeliverables: string[];
  clientRequirements: string[];
  accessRequirements: string[];
  dependencies: string[];
  reviewProcess: string;
  revisionExpectations: string;
  idealBusinessType: string[];
  tags: string[];
  recommendedWhen: string[];
  ctaLabel: string;
}

export const modules: Module[] = [
  {
    id: "missed-call-text-back",
    name: "Missed Call Text-Back",
    problemHeadline: "Every missed call is a lead you'll never hear from again.",
    problemDescription:
      "When a potential client calls and hits voicemail, most hang up and call your competitor instead. You're losing work you never even knew was available — and the longer the silence, the colder they go.",
    category: "lead-generation",
    shortDescription:
      "Automatically text every missed caller within seconds so they know you're on it.",
    serviceMechanism:
      "We connect your phone system to an automated SMS responder that fires instantly when a call goes unanswered. The message is warm, on-brand, and includes a link to book a callback or reply directly.",
    businessOutcome:
      "Turn missed calls into booked appointments instead of dead leads. Most clients recapture 20–40% of calls that previously went unanswered.",
    whyItMatters:
      "Speed is trust. A text in 10 seconds says 'we value your time' better than a voicemail that gets returned two days later.",
    estimatedValue: 600,
    includedDeliverables: [
      "Missed-call SMS automation setup",
      "Custom message copy (2 variants A/B)",
      "Booking link or reply-flow integration",
      "7-day testing and monitoring",
    ],
    clientRequirements: [
      "Business phone number you own",
      "A booking tool or calendar link (optional but recommended)",
    ],
    accessRequirements: ["Phone system or VoIP credentials"],
    dependencies: [],
    reviewProcess:
      "We share the message copy and flow for your approval before going live.",
    revisionExpectations: "Up to 2 rounds of copy adjustments included.",
    idealBusinessType: [
      "trade",
      "home-services",
      "medical",
      "real-estate",
      "consulting",
      "legal",
    ],
    tags: ["sms", "automation", "leads", "phone"],
    recommendedWhen: [
      "You frequently miss calls during jobs or meetings",
      "You have no after-hours coverage",
      "Your conversion rate from calls feels low",
    ],
    ctaLabel: "Activate Missed Call Text-Back",
  },
  {
    id: "lead-response-automation",
    name: "Lead Response Automation",
    problemHeadline:
      "New enquiries are sitting in your inbox for hours — and costing you jobs.",
    problemDescription:
      "Studies consistently show that responding to a new lead within 5 minutes makes you 9× more likely to win the job. Most small businesses respond in hours, if at all. By then, the prospect has moved on.",
    category: "lead-generation",
    shortDescription:
      "Instant, personalised responses to every new lead — before your competitor even sees the notification.",
    serviceMechanism:
      "We build an AI-powered response system connected to your intake channels (contact forms, email, Facebook, Instagram). When a new enquiry arrives, it receives a branded, contextually relevant reply within 60 seconds, qualifying them and offering next steps.",
    businessOutcome:
      "More conversations started, more quotes requested, more jobs booked — without adding to your workload.",
    whyItMatters:
      "First contact sets the tone. An instant, professional response positions you as organised and client-focused before you've even spoken.",
    estimatedValue: 900,
    includedDeliverables: [
      "Response automation across up to 3 intake channels",
      "AI message personalisation based on inquiry content",
      "Lead qualification questions built into the flow",
      "Weekly summary report of lead activity",
    ],
    clientRequirements: [
      "Access to your current intake channels (email, forms, socials)",
      "A brief describing your services so messages stay on-brand",
    ],
    accessRequirements: [
      "Email credentials or forwarding setup",
      "Social media account access if applicable",
    ],
    dependencies: [],
    reviewProcess:
      "You approve all message templates and the qualification flow before launch.",
    revisionExpectations:
      "Unlimited template tweaks in the first 14 days; then 1 revision round per month.",
    idealBusinessType: [
      "trades",
      "home-services",
      "real-estate",
      "events",
      "coaching",
      "agencies",
    ],
    tags: ["leads", "automation", "ai", "email", "social"],
    recommendedWhen: [
      "You're generating leads but struggling to respond fast enough",
      "Leads frequently go cold before you follow up",
      "You handle intake manually across multiple channels",
    ],
    ctaLabel: "Activate Lead Response",
  },
  {
    id: "chatbot-setup",
    name: "Website Chatbot",
    problemHeadline:
      "Visitors leave your site with unanswered questions — and never come back.",
    problemDescription:
      "Most website visitors have 2–3 questions before they'll make contact. If those questions aren't answered immediately — on your pricing, your process, your availability — they bounce. You never know they were there.",
    category: "client-communication",
    shortDescription:
      "A trained AI chatbot that answers questions, qualifies visitors, and captures contact details 24/7.",
    serviceMechanism:
      "We build and deploy a conversational AI chatbot trained on your business — your services, FAQs, pricing structure, process, and tone. It handles common questions, collects lead info, and routes hot prospects to a booking flow or your inbox.",
    businessOutcome:
      "More leads captured from existing traffic, fewer repetitive questions to answer manually, and a professional 24/7 presence that works while you sleep.",
    whyItMatters:
      "Your website is your most valuable sales asset. A chatbot turns passive browsing into active conversations — at scale.",
    estimatedValue: 1200,
    includedDeliverables: [
      "Custom-trained chatbot (your services, FAQs, tone of voice)",
      "Lead capture + qualification flow",
      "Booking or contact handoff integration",
      "Website embed code and installation support",
      "30-day monitoring and refinement",
    ],
    clientRequirements: [
      "Access to your website (to install the embed)",
      "A list of common client questions and your answers",
      "Pricing or service structure overview",
    ],
    accessRequirements: ["Website CMS or hosting access"],
    dependencies: [],
    reviewProcess:
      "You test the bot in a staging environment and approve before it goes live on your site.",
    revisionExpectations:
      "2 rounds of conversation-flow revisions included; ongoing refinement in the first 30 days.",
    idealBusinessType: [
      "home-services",
      "consulting",
      "real-estate",
      "e-commerce",
      "medical",
      "legal",
      "coaching",
    ],
    tags: ["chatbot", "ai", "website", "leads", "automation"],
    recommendedWhen: [
      "You get repetitive questions via email or phone",
      "Your website has decent traffic but low conversion",
      "You want 24/7 client-facing availability without hiring",
    ],
    ctaLabel: "Activate Website Chatbot",
  },
  {
    id: "review-automation",
    name: "Review Generation System",
    problemHeadline:
      "Happy clients forget to leave reviews. Unhappy ones never do.",
    problemDescription:
      "Google reviews drive more business than almost any other marketing channel — yet most businesses rely on hoping clients remember to leave one. The result: your reputation doesn't reflect the quality of your work.",
    category: "reputation",
    shortDescription:
      "Automated review requests that go out at the perfect moment — when clients are happiest.",
    serviceMechanism:
      "We build a post-job or post-appointment automation that sends a personalised review request via SMS or email at the optimal moment (e.g. 24 hours after project completion). The message is direct, warm, and links straight to your Google Business Profile.",
    businessOutcome:
      "A steady stream of authentic 5-star reviews that compound over time — improving your search ranking and making it easier for new clients to choose you.",
    whyItMatters:
      "93% of consumers read online reviews before making a purchase decision. More reviews = more trust = more revenue.",
    estimatedValue: 700,
    includedDeliverables: [
      "Automated review request SMS + email sequence",
      "Timing logic (trigger-based or scheduled)",
      "Google Business Profile deep link integration",
      "Optional negative-experience filter to handle issues privately",
      "Monthly review volume report",
    ],
    clientRequirements: [
      "Google Business Profile (claimed and verified)",
      "A CRM, booking tool, or job management software to trigger from",
    ],
    accessRequirements: [
      "CRM or job management tool credentials",
      "Google Business Profile access",
    ],
    dependencies: [],
    reviewProcess:
      "We share the message sequence for your approval before activating.",
    revisionExpectations: "Up to 2 message revisions included.",
    idealBusinessType: [
      "home-services",
      "trades",
      "medical",
      "hospitality",
      "retail",
      "fitness",
      "personal-care",
    ],
    tags: ["reviews", "google", "reputation", "automation", "sms"],
    recommendedWhen: [
      "You do great work but have fewer reviews than competitors",
      "You rely on word-of-mouth but want to scale it digitally",
      "Your Google Business Profile feels thin compared to your actual reputation",
    ],
    ctaLabel: "Activate Review Generation",
  },
  {
    id: "estimate-follow-up",
    name: "Estimate Follow-Up Sequence",
    problemHeadline:
      "You're sending quotes and then hearing nothing — and assuming they went elsewhere.",
    problemDescription:
      "Most prospects who don't reply immediately aren't saying no — they're just busy, distracted, or waiting for the right moment. Without a follow-up system, you're leaving signed jobs on the table every single week.",
    category: "client-communication",
    shortDescription:
      "An automated follow-up sequence that nudges quote recipients at the right intervals — without you lifting a finger.",
    serviceMechanism:
      "We build a multi-touch follow-up automation triggered when a quote or estimate is sent. It sends a series of personalised messages over 7–14 days — a value reminder, a deadline nudge, and a final check-in — each one crafted to re-engage without feeling pushy.",
    businessOutcome:
      "More accepted quotes, less chasing, and insight into which prospects are warm vs. gone. Most clients see a 15–30% improvement in quote conversion within the first month.",
    whyItMatters:
      "The fortune is in the follow-up. Most sales happen after the 5th touchpoint — and most businesses give up after the 1st.",
    estimatedValue: 650,
    includedDeliverables: [
      "3–5 message follow-up sequence (SMS and/or email)",
      "Trigger integration with your quoting or CRM tool",
      "Personalisation tokens (name, quote amount, service)",
      "Auto-stop on reply or acceptance",
      "Conversion tracking report",
    ],
    clientRequirements: [
      "A quoting tool, CRM, or email system to trigger from",
      "Sample quotes to reference for message context",
    ],
    accessRequirements: ["Quoting tool or CRM credentials"],
    dependencies: [],
    reviewProcess:
      "Full sequence reviewed and approved by you before going live.",
    revisionExpectations:
      "Up to 2 rounds of message revisions; tone adjustments anytime in the first 30 days.",
    idealBusinessType: [
      "trades",
      "home-services",
      "consulting",
      "agencies",
      "events",
      "landscaping",
    ],
    tags: ["follow-up", "quotes", "automation", "sales", "email", "sms"],
    recommendedWhen: [
      "Your quote acceptance rate feels low",
      "You frequently forget to follow up",
      "You're sending a high volume of quotes",
    ],
    ctaLabel: "Activate Estimate Follow-Up",
  },
  {
    id: "crm-cleanup",
    name: "CRM Cleanup & Automation Setup",
    problemHeadline:
      "Your CRM is a graveyard. Contacts are stale, stages are wrong, and nothing is automated.",
    problemDescription:
      "A messy CRM doesn't just feel bad — it actively costs you money. Deals get forgotten. Follow-ups slip. You can't see what's working because the data is unreliable. Most businesses know their CRM is broken but don't have time to fix it.",
    category: "operations",
    shortDescription:
      "We audit, clean, and rebuild your CRM so it actually reflects reality — and automate the repetitive parts.",
    serviceMechanism:
      "We perform a full audit of your existing CRM: duplicate removal, stage realignment, dead deal archiving, and pipeline restructure. Then we build the core automations — stage-change notifications, task creation, follow-up triggers — so the system stays clean going forward.",
    businessOutcome:
      "A CRM you actually trust and use. Clear pipeline visibility, fewer dropped balls, and a system that nudges your team at the right time without manual management.",
    whyItMatters:
      "A CRM is only valuable if the data in it is accurate. Clean data means better decisions, fewer missed opportunities, and a team that stays aligned.",
    estimatedValue: 1000,
    includedDeliverables: [
      "Full CRM audit and data cleanup",
      "Pipeline stage realignment",
      "Core automation build (stage transitions, notifications, task triggers)",
      "Team walkthrough and documentation",
      "30-day post-launch support",
    ],
    clientRequirements: [
      "Access to your existing CRM",
      "A clear understanding of your sales stages",
      "Time for a 1-hour discovery call",
    ],
    accessRequirements: ["CRM admin credentials"],
    dependencies: [],
    reviewProcess:
      "We present the cleaned structure and automation map for approval before making changes.",
    revisionExpectations: "1 round of pipeline stage revisions included.",
    idealBusinessType: [
      "agencies",
      "consulting",
      "real-estate",
      "financial-services",
      "trades",
      "b2b-services",
    ],
    tags: ["crm", "operations", "automation", "data", "sales"],
    recommendedWhen: [
      "Your team isn't using the CRM consistently",
      "You have no visibility into your pipeline",
      "Leads are falling through the cracks regularly",
    ],
    ctaLabel: "Activate CRM Cleanup",
  },
  {
    id: "faq-automation",
    name: "FAQ & Intake Automation",
    problemHeadline:
      "You're answering the same 10 questions over and over — every single day.",
    problemDescription:
      "Every minute you spend answering 'What are your prices?' or 'How long does it take?' is a minute you're not doing billable work or growing your business. These questions aren't going to stop — but answering them manually doesn't have to be your job.",
    category: "automation",
    shortDescription:
      "Automate responses to your most common questions so your inbox handles itself.",
    serviceMechanism:
      "We identify your top 10–15 most-asked questions, build structured responses, and deploy them across your channels — email auto-replies, chatbot triggers, social DM automations, and/or SMS flows. New enquiries get instant, accurate answers without touching your calendar.",
    businessOutcome:
      "Hours saved per week, faster client qualification, and a consistent experience regardless of when someone reaches out.",
    whyItMatters:
      "Repetitive questions are a signal, not just an annoyance. Automating them frees you for higher-value interactions and makes your business feel effortlessly organised.",
    estimatedValue: 750,
    includedDeliverables: [
      "FAQ audit (top 15 questions identified)",
      "Response copy written and approved",
      "Deployment across up to 3 channels",
      "Keyword or intent-matching logic",
      "Monthly review of unanswered questions",
    ],
    clientRequirements: [
      "List of common questions (or access to past emails/enquiries to identify them)",
      "Approved answers or willingness to review our drafts",
    ],
    accessRequirements: [
      "Email, social, or chat platform credentials as relevant",
    ],
    dependencies: [],
    reviewProcess:
      "All FAQ responses reviewed and signed off before deployment.",
    revisionExpectations:
      "Unlimited copy edits in first 14 days; 1 revision round per quarter thereafter.",
    idealBusinessType: [
      "home-services",
      "medical",
      "legal",
      "hospitality",
      "fitness",
      "education",
      "e-commerce",
    ],
    tags: ["faq", "automation", "email", "social", "inbox", "ai"],
    recommendedWhen: [
      "You find yourself copying and pasting the same replies",
      "Response time to enquiries is slow due to volume",
      "New staff frequently ask you how to respond to common questions",
    ],
    ctaLabel: "Activate FAQ Automation",
  },
  {
    id: "lead-sourcing",
    name: "Lead Sourcing System",
    problemHeadline:
      "You're waiting for leads to come to you — but your competitors are going out to get them.",
    problemDescription:
      "Inbound marketing takes time to build. While you're waiting for SEO to kick in or word-of-mouth to spread, there are qualified prospects in your market right now who don't know you exist. Proactive outbound doesn't have to mean cold calling — it means using data and automation to show up where your clients already are.",
    category: "lead-generation",
    shortDescription:
      "A structured outbound system that finds and contacts qualified prospects on your behalf.",
    serviceMechanism:
      "We build a targeted lead sourcing workflow — identifying your ideal client profile, finding contact data through verified sources, and setting up an automated personalised outreach sequence (email and/or LinkedIn). Includes reply management and handoff protocols so warm leads go directly to you.",
    businessOutcome:
      "A predictable source of new conversations with qualified prospects, independent of referrals or ad spend.",
    whyItMatters:
      "The most successful service businesses don't wait for the phone to ring. A structured outbound system means growth is a dial you can turn — not something you hope for.",
    estimatedValue: 1500,
    includedDeliverables: [
      "Ideal client profile definition",
      "Verified contact list (up to 500 contacts in target niche)",
      "Personalised outreach sequence (3–5 touches)",
      "Reply handling framework",
      "Monthly pipeline report",
    ],
    clientRequirements: [
      "Clear description of your ideal client",
      "A professional email domain (no Gmail/Hotmail)",
      "LinkedIn profile or company page (if using LinkedIn outreach)",
    ],
    accessRequirements: [
      "Email sending domain credentials",
      "LinkedIn credentials if applicable",
    ],
    dependencies: ["lead-response-automation"],
    reviewProcess:
      "ICP, contact list sample, and full sequence reviewed before launch.",
    revisionExpectations:
      "2 rounds of sequence copy revisions; ICP can be refined within first 30 days.",
    idealBusinessType: [
      "agencies",
      "consulting",
      "b2b-services",
      "financial-services",
      "real-estate",
      "coaching",
    ],
    tags: ["outbound", "leads", "email", "linkedin", "sales", "automation"],
    recommendedWhen: [
      "Revenue is unpredictable month-to-month",
      "You rely entirely on referrals or inbound",
      "You have capacity but not enough new clients",
    ],
    ctaLabel: "Activate Lead Sourcing",
  },
];

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getModulesByCategory(category: ModuleCategory): Module[] {
  return modules.filter((m) => m.category === category);
}

export const categoryLabels: Record<ModuleCategory, string> = {
  "lead-generation": "Lead Generation",
  "client-communication": "Client Communication",
  reputation: "Reputation",
  operations: "Operations",
  automation: "Automation",
};
