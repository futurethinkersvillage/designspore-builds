export type ModuleCategory =
  | "lead-generation"
  | "client-communication"
  | "reputation"
  | "operations"
  | "automation"
  | "website";

/**
 * Tier system — shown to clients, dollar values are internal only.
 *
 * Tier 1 — Flagship  ($1500): 1 per month. Major build/system.
 * Tier 2 — Core      ($750):  2 per month. Solid automation or integration.
 * Tier 3 — Quick Win ($375):  4 per month. Fast, focused wins.
 *
 * Monthly credit equivalents: Flagship=4, Core=2, Quick Win=1 (of 4 monthly credits)
 */
export type ModuleTier = 1 | 2 | 3;

export const tierConfig: Record<ModuleTier, { label: string; color: string; credits: number; description: string }> = {
  1: { label: "Flagship",  color: "gold",   credits: 4, description: "Major build — takes your full month" },
  2: { label: "Core",      color: "blue",   credits: 2, description: "Solid system — 2 fit in a month" },
  3: { label: "Quick Win", color: "green",  credits: 1, description: "Fast win — stack up to 4 per month" },
};

export const MONTHLY_CREDITS = 4; // Starter plan ($1,500/mo)

export interface Module {
  id: string;
  name: string;
  problemHeadline: string;
  problemDescription: string;
  category: ModuleCategory;
  tier: ModuleTier;
  /**
   * If true, this module renews automatically each month once activated.
   * Clients can cancel recurring modules from My Modules.
   * Mike manages fulfillment on a monthly cadence.
   */
  recurring?: boolean;
  shortDescription: string;
  serviceMechanism: string;
  businessOutcome: string;
  whyItMatters: string;
  estimatedValue: number; // internal only — never shown to clients
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
    tier: 3 as ModuleTier,
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
    estimatedValue: 375,
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
    tier: 2 as ModuleTier,
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
    estimatedValue: 750,
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
    tier: 1 as ModuleTier,
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
    estimatedValue: 1500,
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
    tier: 3 as ModuleTier,
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
    estimatedValue: 375,
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
    tier: 3 as ModuleTier,
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
    estimatedValue: 375,
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
    tier: 2 as ModuleTier,
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
    estimatedValue: 750,
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
    tier: 2 as ModuleTier,
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
    estimatedValue: 750, // Tier 2
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
    tier: 1 as ModuleTier,
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
  {
    id: "website-edit",
    name: "Website Edit",
    tier: 3 as ModuleTier,
    problemHeadline: "Your website says something about your business — make sure it's the right thing.",
    problemDescription:
      "Outdated copy, broken sections, old branding, missing offers — your site is often the first thing a prospect sees. Small inaccuracies erode trust before you even get a chance to talk.",
    category: "website",
    shortDescription: "Fast, professional updates to your existing website — copy, layout, offers, or branding.",
    serviceMechanism:
      "We make targeted edits to your existing website: update copy, swap images, fix layouts, add new sections, or refresh branding. Scoped, reviewed, and live within days.",
    businessOutcome:
      "A website that accurately reflects your current offer and makes the right first impression on every new visitor.",
    whyItMatters:
      "Your site works 24/7. Keeping it current costs almost nothing — but an outdated site can silently cost you clients every single week.",
    estimatedValue: 375,
    includedDeliverables: [
      "Up to 4 hours of website edits",
      "Copy, layout, image, or section updates",
      "Mobile check post-edit",
      "Staged preview before publishing",
    ],
    clientRequirements: ["List of changes needed (or a call to walk through them)", "Website login or editor access"],
    accessRequirements: ["CMS or hosting credentials"],
    dependencies: [],
    reviewProcess: "We stage all changes for your review before going live.",
    revisionExpectations: "One round of revisions included within 7 days of delivery.",
    idealBusinessType: ["home-services", "trades", "consulting", "real-estate", "coaching", "e-commerce", "hospitality"],
    tags: ["website", "edits", "copy", "design", "quick"],
    recommendedWhen: [
      "Your site has outdated pricing, services, or branding",
      "You've added new offerings that aren't reflected online",
      "Something is broken or looks wrong",
    ],
    ctaLabel: "Activate Website Edit",
  },
  {
    id: "website-build",
    name: "Website Build",
    tier: 1 as ModuleTier,
    problemHeadline: "Your website isn't winning business — it's just taking up space on the internet.",
    problemDescription:
      "A generic, slow, or confusing website doesn't just fail to convert — it actively undermines your credibility. If your site doesn't communicate your value clearly in the first 5 seconds, most visitors leave without ever reaching out.",
    category: "website",
    shortDescription:
      "A professionally designed, fast, conversion-focused website built from scratch for your business.",
    serviceMechanism:
      "We design and build a full website tailored to your brand, services, and goals. Built on a modern stack (Next.js or equivalent) with clear structure, fast load times, mobile-first design, and a CMS so you can manage content. Includes copy, layout, integrations, and launch.",
    businessOutcome:
      "A website that looks professional, loads fast, ranks better, and converts visitors into enquiries — built to grow with your business.",
    whyItMatters:
      "Your website is your hardest-working team member. A site built specifically for conversion can meaningfully change your revenue — and a poor one can silently drain it.",
    estimatedValue: 1500,
    includedDeliverables: [
      "Custom website design (up to 6 pages)",
      "Mobile-first, performance-optimised build",
      "Copywriting or copy refinement",
      "CMS integration for easy content updates",
      "Contact form + lead capture setup",
      "Basic SEO (meta, structure, speed)",
      "Launch + 30-day post-launch support",
    ],
    clientRequirements: [
      "Brand assets (logo, colours, fonts — or we'll define them)",
      "Service descriptions and business overview",
      "Any reference sites you like",
    ],
    accessRequirements: ["Domain access for DNS configuration", "Hosting account (or we provision one)"],
    dependencies: [],
    reviewProcess: "Design review at wireframe stage, then again before launch.",
    revisionExpectations: "2 full revision rounds included; scope adjustments by mutual agreement.",
    idealBusinessType: ["trades", "home-services", "consulting", "real-estate", "coaching", "agencies", "hospitality"],
    tags: ["website", "build", "design", "seo", "conversion"],
    recommendedWhen: [
      "You don't have a website, or it was built years ago",
      "Your site doesn't reflect the quality of your work",
      "You're investing in other marketing but have no strong home base",
    ],
    ctaLabel: "Activate Website Build",
  },

  // ── Recurring modules ────────────────────────────────────────────────
  // These renew each month automatically. 1 credit = 1 Quick Win slot.
  {
    id: "chatbot-maintenance",
    name: "Chatbot Maintenance",
    tier: 3 as ModuleTier,
    recurring: true,
    problemHeadline: "Your chatbot is only as good as its last update.",
    problemDescription:
      "Services change, prices shift, new FAQs emerge — a chatbot that was accurate six months ago is quietly giving wrong answers today. Without ongoing tuning, it erodes trust instead of building it.",
    category: "automation",
    shortDescription: "Monthly tuning, content updates, and performance review for your active chatbot.",
    serviceMechanism:
      "Each month we review your chatbot's conversation logs, update it with any new information you provide, adjust responses that are underperforming, and confirm it's routing enquiries correctly.",
    businessOutcome: "A chatbot that stays accurate, relevant, and effective month after month without you having to think about it.",
    whyItMatters: "A well-maintained chatbot compounds in value — it gets smarter about your business over time.",
    estimatedValue: 375,
    includedDeliverables: [
      "Monthly conversation log review",
      "Content and FAQ updates",
      "Response quality adjustments",
      "Performance summary",
    ],
    clientRequirements: ["Active chatbot from DesignSpore", "Monthly updates or changes (if any)"],
    accessRequirements: ["Chatbot platform access"],
    dependencies: ["chatbot-setup"],
    reviewProcess: "We review logs proactively — you only need to flag anything specific.",
    revisionExpectations: "Changes applied within 5 business days of each month.",
    idealBusinessType: ["trades", "home-services", "medical", "consulting", "real-estate", "coaching"],
    tags: ["chatbot", "maintenance", "recurring", "monthly"],
    recommendedWhen: ["You have an active chatbot", "Your services or pricing change regularly"],
    ctaLabel: "Subscribe Monthly",
  },
  {
    id: "reputation-management",
    name: "Reputation Management",
    tier: 3 as ModuleTier,
    recurring: true,
    problemHeadline: "Reviews are coming in — but no one's responding.",
    problemDescription:
      "Unanswered reviews signal to Google and to future customers that you don't care. A single negative review left sitting for weeks can quietly cost you more than you'd expect.",
    category: "reputation",
    shortDescription: "Monthly review monitoring, response writing, and flagging for your business.",
    serviceMechanism:
      "We monitor your Google, Facebook, and other review platforms monthly. We write and post professional responses to new reviews (positive and negative) in your brand voice, flag anything that needs your direct attention, and track your overall rating trend.",
    businessOutcome: "A business that looks responsive, professional, and trustworthy to every prospective customer who checks your reviews.",
    whyItMatters: "93% of consumers read reviews before buying. Responding to them boosts your ranking and your conversion rate.",
    estimatedValue: 375,
    includedDeliverables: [
      "Review monitoring (Google, Facebook, + 1 other)",
      "Professional responses written in your voice",
      "Monthly review summary",
      "Escalation of concerning reviews",
    ],
    clientRequirements: ["Access to review platforms or management tool"],
    accessRequirements: ["Google Business Profile access", "Facebook Page access"],
    dependencies: [],
    reviewProcess: "We handle all responses directly. You receive a monthly summary.",
    revisionExpectations: "Responses can be adjusted within 48 hours of posting if needed.",
    idealBusinessType: ["trades", "home-services", "medical", "hospitality", "real-estate", "e-commerce"],
    tags: ["reviews", "reputation", "google", "recurring", "monthly"],
    recommendedWhen: ["You get regular reviews but don't respond", "You've had a negative review recently"],
    ctaLabel: "Subscribe Monthly",
  },
  {
    id: "seo-health-check",
    name: "SEO Health Check",
    tier: 3 as ModuleTier,
    recurring: true,
    problemHeadline: "Your website could be losing rankings and you'd never know.",
    problemDescription:
      "Search engines change their algorithms constantly. Broken links, slow pages, missing schema, and outdated content gradually push you down the results page — silently costing you leads.",
    category: "website",
    shortDescription: "Monthly SEO audit and small fixes to keep your site ranking well.",
    serviceMechanism:
      "Each month we run a technical SEO audit on your site — checking speed, broken links, meta tags, schema markup, and crawl errors. We fix anything minor directly and flag anything requiring larger work.",
    businessOutcome: "A website that holds and grows its search rankings without you having to understand SEO.",
    whyItMatters: "Organic search is the highest-ROI traffic channel. Letting it decay costs you compounding leads over time.",
    estimatedValue: 375,
    includedDeliverables: [
      "Monthly technical SEO audit",
      "Fix of minor issues (meta, broken links, redirects)",
      "Speed check",
      "Monthly ranking snapshot",
    ],
    clientRequirements: ["Website built by DesignSpore (or access to your CMS)"],
    accessRequirements: ["Google Search Console access", "Website CMS access"],
    dependencies: [],
    reviewProcess: "Audit and fixes handled proactively. Monthly report delivered to your inbox.",
    revisionExpectations: "Minor fixes applied within 5 business days.",
    idealBusinessType: ["trades", "home-services", "consulting", "real-estate", "e-commerce", "medical"],
    tags: ["seo", "website", "maintenance", "recurring", "monthly"],
    recommendedWhen: ["You rely on Google search for leads", "Your site hasn't been touched in months"],
    ctaLabel: "Subscribe Monthly",
  },
  {
    id: "lead-list-refresh",
    name: "Lead List Refresh",
    tier: 2 as ModuleTier,
    recurring: true,
    problemHeadline: "Your outbound list goes stale faster than you think.",
    problemDescription:
      "People change jobs, businesses move, and contact details go cold. An outbound list that was accurate 90 days ago may have 30%+ decay — and emailing dead addresses kills your deliverability.",
    category: "lead-generation",
    shortDescription: "Monthly refresh of your lead list with new verified contacts matching your ICP.",
    serviceMechanism:
      "Each month we pull a fresh batch of verified contacts matching your ideal client profile — correct job titles, industry, company size, and location. We clean existing contacts, add new ones, and remove bounces or unsubscribes.",
    businessOutcome: "A live, growing pipeline of fresh contacts who match exactly who you want to work with.",
    whyItMatters: "A healthy outbound list is your most reliable source of predictable new business — but only if it's current.",
    estimatedValue: 750,
    includedDeliverables: [
      "50–100 new verified contacts per month",
      "Existing list cleaning (removes bounces, duplicates)",
      "ICP-matched filtering",
      "Delivery to your CRM or spreadsheet",
    ],
    clientRequirements: ["Defined ideal client profile (ICP)", "Existing CRM or spreadsheet"],
    accessRequirements: ["CRM access for import"],
    dependencies: ["lead-sourcing"],
    reviewProcess: "List delivered by the 5th of each month for review before use.",
    revisionExpectations: "ICP filters can be adjusted monthly based on your feedback.",
    idealBusinessType: ["agencies", "consulting", "b2b-services", "financial-services", "real-estate"],
    tags: ["leads", "outbound", "list", "recurring", "monthly"],
    recommendedWhen: ["You're running outbound campaigns", "Your lead volume is inconsistent"],
    ctaLabel: "Subscribe Monthly",
  },
  {
    id: "monthly-analytics",
    name: "Monthly Analytics Report",
    tier: 3 as ModuleTier,
    recurring: true,
    problemHeadline: "You're flying blind on what's actually working.",
    problemDescription:
      "Without a clear monthly view of what's driving leads and what's not, you make guesses instead of decisions. Most business owners have data — they just never look at it in one place.",
    category: "operations",
    shortDescription: "A clear monthly report covering website traffic, leads, chatbot performance, and campaign results.",
    serviceMechanism:
      "Each month we pull data from your active systems (website, chatbot, lead gen, ads if applicable), synthesise it into a plain-English report, and give you 3 specific recommendations for the next month.",
    businessOutcome: "A monthly 10-minute read that tells you exactly what's working, what's not, and what to do about it.",
    whyItMatters: "The businesses that grow fastest aren't necessarily doing more — they're doing more of what works and less of what doesn't.",
    estimatedValue: 375,
    includedDeliverables: [
      "Monthly performance report (website, leads, chatbot)",
      "Top 3 recommendations for next month",
      "Trend vs. prior month",
      "Plain-English summary — no jargon",
    ],
    clientRequirements: ["Active DesignSpore systems (at least 1 service running)"],
    accessRequirements: ["Google Analytics / Search Console access", "Access to any active platform dashboards"],
    dependencies: [],
    reviewProcess: "Delivered by the 7th of each month via email.",
    revisionExpectations: "Report format can be adjusted after the first delivery.",
    idealBusinessType: ["trades", "home-services", "consulting", "real-estate", "agencies", "e-commerce"],
    tags: ["analytics", "reporting", "insights", "recurring", "monthly"],
    recommendedWhen: ["You have 2+ active services running", "You want to know if your investment is working"],
    ctaLabel: "Subscribe Monthly",
  },
];

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getModulesByCategory(category: ModuleCategory): Module[] {
  return modules.filter((m) => m.category === category);
}

export function getModulesByTier(tier: ModuleTier): Module[] {
  return modules.filter((m) => m.tier === tier);
}

export function getRecurringModules(): Module[] {
  return modules.filter((m) => m.recurring);
}

export function getOneTimeModules(): Module[] {
  return modules.filter((m) => !m.recurring);
}

export function creditsForModule(mod: Module): number {
  return tierConfig[mod.tier].credits;
}

export const categoryLabels: Record<ModuleCategory, string> = {
  "lead-generation": "Lead Generation",
  "client-communication": "Client Communication",
  reputation: "Reputation",
  operations: "Operations",
  automation: "Automation",
  website: "Website",
};
