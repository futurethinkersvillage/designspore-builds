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

// The Google Doc IS the system prompt — no hardcoded instructions.
// Structure your doc however you like; all agent behaviour is controlled there.

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
    const systemPrompt = knowledge;

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
