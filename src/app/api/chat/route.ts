import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FALLBACK_KNOWLEDGE = `
Portal.Place is a Smart Village network being built by Mike Gilliland and Euvie Ivanova in the wilderness of Wells Gray, BC — a stunning mountain valley with hot springs, waterfalls, and old-growth forest. It's a living experiment in next-generation human community: where regenerative land stewardship meets intentional living, cutting-edge technology, and deep human connection.

The physical home is the Wells Gray Village — a 160-acre property at the edge of Wells Gray Provincial Park, currently operating as Wells Gray Resort (a glamping and RV destination) while being transformed into a permanent village.

Portal.Place is building a network of Smart Villages — intentional communities that combine off-grid resilience (solar, water, food production), AI and technology integration for abundance, conscious community and personal growth, nature immersion and wellness, and economic innovation (crypto, remote work, new models). Wells Gray is the first node. More villages will follow globally.

Ways to get involved:

Village Stays: RV sites, glamping cabins, event spaces at Wells Gray Village. Book directly at wellsgrayresort.ca. Great for anyone wanting to visit, attend an event, or experience the land.

Month-Long Immersion: A 30-day family residency package at the village. Full access to land, community, workshops, and programming. Ideal for families wanting a deep taste of village life. Contact Mike to apply.

Work-Stay Program (2026 cohort): 3 to 6 month immersive work-stay for skilled contributors. Trade skills (building, tech, growing, teaching, creating) for housing, food, and stipend. Applications open for the 2026 cohort. Ideal for people who want to live and build the village, not just visit.

Membership: Founding Member tier offers deep access, priority on future properties, and community governance. Village Member tier offers annual access passes, event discounts, and network benefits. Ideal for people who want ongoing connection to the project and network.

Investment and Partnership: Equity investment in the Wells Gray property and Portal.Place network. Land partnerships and joint ventures for new village nodes. Ideal for investors aligned with regenerative real estate and future-of-living thesis.

Smart Village Consulting: Mike offers advisory at $150/hr for founders, developers, and organizations building intentional communities or smart villages. Book a call at futurethinkers.org/call60.

Host an Event: Bring a retreat, workshop, gathering, or corporate offsite to Wells Gray. The venue sleeps around 40 people in a stunning wilderness setting. Contact Mike directly.

Media and Press: Mike and Euvie are experienced podcast hosts, speakers, and authors. Available for interviews, keynotes, collaborations. Media kit at portal.place/media-kit.

About Mike Gilliland: Co-founder of Portal.Place. Former tech entrepreneur, host of Future Thinkers podcast (2M+ downloads). Deep background in AI, crypto, consciousness, and systems thinking. Has spent years studying intentional communities, smart cities, and regenerative economies. Now building one.

About Euvie Ivanova: Co-founder. Filmmaker, podcaster, and author. Created Future Thinkers with Mike. Background in health optimization, systems thinking, and creative media. Leading the culture and media side of Portal.Place.

Wells Gray Provincial Park is one of BC's most spectacular wilderness areas — cascading waterfalls (including Helmcken Falls, Canada's 4th highest), ancient lava flows, abundant wildlife, and virtually no crowds. The village property borders the park, giving residents and guests direct access to thousands of kilometers of wilderness.

Contact: WhatsApp +1 778 881 8088 (fastest), email mike@portal.place, book a call at futurethinkers.org/call60, reservations at wellsgrayresort.ca.
`;

async function getKnowledge(): Promise<string> {
  const url = process.env.KNOWLEDGE_DOC_URL;
  if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const text = await res.text();
        if (text.trim().length > 100) return text;
      }
    } catch {
      // fall through to fallback
    }
  }
  return FALLBACK_KNOWLEDGE;
}

function buildSystemPrompt(knowledge: string): string {
  return `You are the guide for Portal.Place — a Smart Village project in Wells Gray, British Columbia, Canada. Your role is to help visitors understand what Portal.Place is and guide them toward ways they can get involved.

IMPORTANT FORMATTING RULES:
- Never use markdown formatting. No asterisks, no pound signs, no hyphens as bullet points, no backticks.
- Write in natural, flowing prose with line breaks between paragraphs.
- Keep responses warm and conversational, not like a list or document.
- Be concise — two to four short paragraphs is ideal unless asked for more detail.

TONE AND APPROACH:
- Warm, thoughtful, and genuinely excited about the project.
- Help visitors understand which path is right for them based on their interests.
- Don't be salesy — be helpful and honest.
- When someone seems interested in a specific path, guide them toward the right action (contact Mike, book a call, visit the relevant page).
- You can acknowledge you're an AI assistant for Portal.Place.

KNOWLEDGE BASE:
${knowledge}`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const knowledge = await getKnowledge();
    const systemPrompt = buildSystemPrompt(knowledge);

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
