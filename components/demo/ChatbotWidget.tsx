"use client";

import { useState, useEffect, useRef } from "react";
import { ChatCircle, X, PaperPlaneRight } from "@phosphor-icons/react";
import type { DemoConfig } from "@/lib/demo-config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  config: Pick<DemoConfig, "businessName" | "industry" | "services" | "phone" | "email" | "location">;
}

// Strip all markdown formatting from AI responses
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function ChatbotWidget({ config }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLoadingRef = useRef(false);

  // Starter questions from their services
  const starters = [
    `What services does ${config.businessName} offer?`,
    `How do I get a free quote?`,
    `What areas do you serve?`,
    config.phone ? `Can I call to discuss my project?` : `How do I get in touch?`,
  ];

  // Auto-open after 30s, once per session
  useEffect(() => {
    const key = `ds-chat-auto-${config.businessName}`;
    if (sessionStorage.getItem(key)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      setAutoOpened(true);
      sessionStorage.setItem(key, "1");
    }, 30000);
    return () => clearTimeout(timer);
  }, [config.businessName]);

  // Listen for external open trigger
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ds-open-chat", handler);
    return () => window.removeEventListener("ds-open-chat", handler);
  }, []);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi! I can help answer questions about ${config.businessName}'s services. What can I help you with today?`,
      }]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, config.businessName, messages.length]);

  // When loading starts (user sent a message): scroll to bottom to show typing indicator
  useEffect(() => {
    if (loading && !prevLoadingRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
    prevLoadingRef.current = loading;
  }, [loading]);

  // When loading ends (response received): scroll so user's question is at top of container
  useEffect(() => {
    if (!loading && prevLoadingRef.current) {
      const container = scrollContainerRef.current;
      const userMsg = lastUserMsgRef.current;
      if (container && userMsg) {
        const offset = userMsg.offsetTop - container.offsetTop;
        container.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  }, [loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json() as { reply: string };
      setMessages(prev => [...prev, { role: "assistant", content: stripMarkdown(data.reply) }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Sorry, something went wrong. You can reach ${config.businessName} directly${config.phone ? ` at ${config.phone}` : ""} or use the contact form on this page.`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const hasConversation = messages.length > 1;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: "360px",
            maxWidth: "calc(100vw - 2rem)",
            height: "calc(100dvh - 8rem)",
            maxHeight: "520px",
            background: "#131719",
            border: "1px solid rgba(var(--accent-rgb, 190,140,42), 0.2)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(190,140,42,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{
              background: "#0C1012",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                style={{ background: "var(--accent, #BE8C2A)" }}
              >
                {config.businessName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">{config.businessName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <p className="text-xs text-white/35 leading-none">AI Assistant</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/25 hover:text-white/65 transition-colors p-1 rounded"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: `color-mix(in srgb, var(--accent, #BE8C2A) 30%, transparent) transparent`,
            }}
          >
            {messages.map((msg, i) => {
              const isLastUser = msg.role === "user" && i === messages.length - 1 - (loading ? 0 : 0);
              // Track the last user message for scroll-to positioning
              const isUserForRef = msg.role === "user" && messages.slice(i + 1).every(m => m.role === "assistant");

              return (
                <div
                  key={i}
                  ref={isUserForRef ? lastUserMsgRef : null}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="text-sm leading-relaxed rounded-xl px-3.5 py-2.5 max-w-[85%] whitespace-pre-wrap"
                    style={
                      msg.role === "user"
                        ? { background: "var(--accent, #BE8C2A)", color: "#0C1012", fontWeight: 500 }
                        : { background: "#1B2126", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.07)" }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-xl px-3.5 py-3 flex gap-1 items-center"
                  style={{ background: "#1B2126", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.35)",
                        animation: `glow-breathe 1s ease-in-out ${delay}ms infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Starter questions — show before and after first message */}
            {!loading && !hasConversation && (
              <div className="space-y-1.5 pt-1">
                {starters.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-xs rounded-lg px-3 py-2 transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(190,140,42,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(190,140,42,0.25)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="px-3 pb-3 pt-2.5 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ background: "#1B2126", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask a question…"
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="transition-all duration-150 p-1 rounded-lg disabled:opacity-25"
                style={{ color: "var(--accent, #BE8C2A)" }}
                aria-label="Send"
              >
                <PaperPlaneRight size={16} weight="fill" />
              </button>
            </div>
            <p className="text-center text-white/15 text-xs mt-2">
              AI powered by{" "}
              <span style={{ color: "rgba(190,140,42,0.5)" }}>Design Spore</span>
            </p>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        id="demo-chatbot-btn"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: open
            ? "#1B2126"
            : "var(--accent, #BE8C2A)",
          border: open ? "1px solid rgba(190,140,42,0.3)" : "none",
          boxShadow: open
            ? "0 4px 16px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(190,140,42,0.35)",
        }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <X size={22} color="rgba(255,255,255,0.7)" />
        ) : (
          <ChatCircle size={26} weight="fill" color="#0C1012" />
        )}

        {/* Pulse ring for auto-open attention */}
        {!open && autoOpened && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              animation: "glow-breathe 2s ease-in-out infinite",
              background: "rgba(190,140,42,0.25)",
            }}
          />
        )}
      </button>
    </>
  );
}
