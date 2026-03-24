import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import demoConfig from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";

const config = demoConfig as DemoConfig;

// Load services KB once at module level (cached for lifetime of server)
let servicesKnowledge: string;
try {
  servicesKnowledge = readFileSync(join(process.cwd(), "lib/services-knowledge.md"), "utf-8");
} catch {
  servicesKnowledge = "Design Spore provides AI-powered services for small businesses.";
}

const client = new Anthropic();

// ── Scope enforcement ──────────────────────────────────────────────────────
const PERSONA = `You are a demo assistant for Design Spore, an AI services agency.
You are presenting a custom website demo to the team at ${config.businessName}, a ${config.industry} business in ${config.location}.

Your ONLY job is to help them understand:
1. What's in this demo website and why it was built this way
2. What AI features Design Spore has integrated (or could integrate) for their business
3. What it would be like to work with Design Spore
4. How to take the next step (book a call with Mike)

DO NOT:
- Answer general knowledge questions unrelated to this demo or Design Spore services
- Write code, solve math problems, or help with tasks unrelated to this context
- Discuss other AI tools, companies, or services (OpenAI, ChatGPT, etc.)
- Give away specifics about pricing (say "let's discuss on a call" instead)

If asked about anything outside this scope, say exactly:
"I'm focused on helping you explore what AI can do for ${config.businessName} — what would you like to know about the demo or our services?"`;

const CLIENT_CONTEXT = `
## About ${config.businessName}
Industry: ${config.industry}
Location: ${config.location}

${config.industryContext}

Key pain points for businesses like theirs:
${config.painPoints.map(p => `- ${p}`).join("\n")}

AI features shown in this demo: ${config.aiFeatures.join(", ")}

Design Spore services most relevant to this business:
${config.relevantServices.join(", ")}`;

const CTA_INSTRUCTIONS = `
## When to recommend booking a call
Always end responses that discuss pricing, next steps, or implementation with:
"Ready to talk about making this real? [Book a call with Mike](${config.bookingUrl})"

If the user expresses strong interest or asks "how do we get started", lead with the CTA rather than burying it.`;

// ── CTA keyword detection ─────────────────────────────────────────────────
const PRICING_WORDS = ["cost", "how much", "price", "pricing", "afford", "budget", "monthly", "pay", "fee", "charge"];
const INTEREST_WORDS = ["love it", "looks great", "interested", "next steps", "when can", "how do we", "get started", "sign up", "move forward", "want this"];

function detectCTATrigger(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    PRICING_WORDS.some(w => lower.includes(w)) ||
    INTEREST_WORDS.some(w => lower.includes(w))
  );
}

// ── Sliding window history ─────────────────────────────────────────────────
const MAX_HISTORY = 6; // Keep last 6 messages (3 exchanges)

// ── Handler ───────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { messages: { role: "user" | "assistant"; content: string }[] };
    const allMessages = body.messages ?? [];

    if (!allMessages.length) {
      return NextResponse.json({ reply: "Hi! What would you like to know about this demo?" });
    }

    // Apply sliding window — keep last N messages
    const windowedMessages = allMessages.slice(-MAX_HISTORY);

    // Detect CTA trigger from the latest user message
    const latestUser = [...windowedMessages].reverse().find(m => m.role === "user");
    const shouldTriggerCTA = latestUser ? detectCTATrigger(latestUser.content) : false;

    const systemPrompt = [
      PERSONA,
      CLIENT_CONTEXT,
      servicesKnowledge,
      CTA_INSTRUCTIONS,
      shouldTriggerCTA
        ? `\n[IMPORTANT: The user's message signals pricing or buying intent. Include a prominent call-to-action to book a call with Mike (${config.bookingUrl}) in your response.]`
        : "",
    ].join("\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 280,
      system: systemPrompt,
      messages: windowedMessages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "Let me know if you have questions about the demo.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat/route]", err);
    return NextResponse.json(
      { reply: "Something went wrong on my end. You can always [book a call directly](http://futurethinkers.org/call60) with Mike." },
      { status: 500 }
    );
  }
}
