import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getKnowledge(): Promise<string | null> {
  const url = process.env.KNOWLEDGE_DOC_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim().length > 100 ? text : null;
  } catch {
    return null;
  }
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

export async function GET() {
  const knowledge = await getKnowledge();
  if (!knowledge) {
    return Response.json({ available: false }, { status: 503 });
  }
  return Response.json({ available: true });
}

export async function POST(req: Request) {
  const knowledge = await getKnowledge();
  if (!knowledge) {
    return new Response("Knowledge base unavailable", { status: 503 });
  }

  try {
    const { messages } = await req.json();
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
