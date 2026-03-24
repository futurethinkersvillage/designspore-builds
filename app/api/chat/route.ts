import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import demoConfig from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";

const config = demoConfig as DemoConfig;
const client = new Anthropic();

// ── Customer-facing assistant persona ─────────────────────────────────────────
// The chatbot represents THIS BUSINESS, not Design Spore.
// It helps the business's potential customers — not Design Spore's prospects.

const PERSONA = `You are a friendly and helpful AI assistant for ${config.businessName}, a ${config.industry} business in ${config.location}.

Your job is to help potential customers:
- Understand what services ${config.businessName} offers
- Get answers to common questions about the work
- Know how to request a quote or get in touch
- Feel confident about hiring ${config.businessName}

You speak as if you are part of the ${config.businessName} team. Use "we" and "our".
Keep answers concise — 2–4 sentences max unless a detailed list is genuinely helpful.
Maintain a professional but warm, human tone. No corporate fluff.

CONTACT INFO (use when relevant):
${config.phone ? `- Phone: ${config.phone}` : ""}
${config.email ? `- Email: ${config.email}` : ""}
- Location: ${config.location}
${(config as DemoConfig & { address?: string }).address ? `- Address: ${(config as DemoConfig & { address?: string }).address}` : ""}

DO NOT:
- Mention Design Spore, AI tools, or this being a demo website
- Discuss pricing in specifics — say "we provide free quotes, just reach out"
- Invent services they don't offer
- Answer questions completely unrelated to the business or hiring a contractor`;

const SERVICES_CONTEXT = `
## Our Services
${config.services.map(s => `- **${s.name}**: ${s.description}`).join("\n")}

## Service Area
${config.location} and surrounding area.

## About Us
${config.aboutBlurb}`;

const QUOTE_NUDGE = `
When a user asks about pricing, cost, or is clearly ready to hire, respond helpfully then end with:
"The best next step is to reach out for a free quote — call us at ${config.phone ?? "the number on this page"} or use the contact form below."`;

const MAX_HISTORY = 8;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { messages: { role: "user" | "assistant"; content: string }[] };
    const allMessages = body.messages ?? [];
    if (!allMessages.length) {
      return NextResponse.json({ reply: `Hi! What can I help you with?` });
    }

    const windowedMessages = allMessages.slice(-MAX_HISTORY);

    const systemPrompt = [PERSONA, SERVICES_CONTEXT, QUOTE_NUDGE].join("\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: windowedMessages,
    });

    const reply = response.content[0].type === "text"
      ? response.content[0].text
      : "Let me know if you have any questions about our services.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat/route]", err);
    return NextResponse.json(
      { reply: `Sorry, I'm having trouble right now. Please call us at ${config.phone ?? "the number on this page"} and we'll be happy to help.` },
      { status: 500 }
    );
  }
}
