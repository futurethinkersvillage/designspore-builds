"use client";

import { useState, useEffect, useRef } from "react";
import { ChatCircle, X, PaperPlaneRight, ArrowRight } from "@phosphor-icons/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  businessName: string;
  industry: string;
}

const DS_MARK = (
  <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="16" cy="16" r="6" fill="#BE8C2A" />
    <circle cx="16" cy="6" r="3" fill="#D4A44A" />
    <circle cx="26" cy="21" r="3" fill="#D4A44A" />
    <circle cx="6" cy="21" r="3" fill="#D4A44A" />
  </svg>
);

export default function ChatbotWidget({ businessName, industry }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open after 30s, once per session
  useEffect(() => {
    const key = `ds-chat-auto-${businessName}`;
    if (sessionStorage.getItem(key)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      setAutoOpened(true);
      sessionStorage.setItem(key, "1");
    }, 30000);
    return () => clearTimeout(timer);
  }, [businessName]);

  // Listen for external open trigger (e.g. from page "Chat Now" button)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ds-open-chat", handler);
    return () => window.removeEventListener("ds-open-chat", handler);
  }, []);

  // Initial greeting when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi! I'm here to walk you through what's possible for **${businessName}** with AI. What are you curious about?`,
      }]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, businessName, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
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
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I hit a snag. Try refreshing or book a call directly — Mike's happy to chat.",
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

  // Render message content with basic markdown: **bold** and links
  function renderContent(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
            className="underline text-gold hover:text-gold-light transition-colors">
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="chat-panel fixed bottom-20 right-4 z-50 flex flex-col rounded-xl overflow-hidden shadow-2xl"
          style={{
            width: "360px",
            maxWidth: "calc(100vw - 2rem)",
            height: "480px",
            maxHeight: "calc(100vh - 120px)",
            background: "#131719",
            border: "1px solid rgba(190,140,42,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(190,140,42,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{
              background: "linear-gradient(90deg, #0C1012, #151A1F)",
              borderBottom: "1px solid rgba(190,140,42,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              {DS_MARK}
              <div>
                <p className="text-xs font-bold text-white leading-none">Design Spore AI</p>
                <p className="text-xs text-white/40 leading-none mt-0.5">{businessName} demo</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white/70 transition-colors p-1 rounded"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="text-sm leading-relaxed rounded-lg px-3 py-2 max-w-[85%]"
                  style={
                    msg.role === "user"
                      ? { background: "var(--accent, #BE8C2A)", color: "#0C1012", fontWeight: 500 }
                      : { background: "#1B2126", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="text-sm rounded-lg px-3 py-2 flex gap-1 items-center"
                  style={{ background: "#1B2126", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-white/40"
                      style={{ animation: `glow-breathe 1s ease-in-out ${delay}ms infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Book a call nudge — appears after 4+ exchanges */}
          {messages.length >= 8 && (
            <div
              className="px-4 py-2 shrink-0 flex items-center justify-between"
              style={{ background: "rgba(190,140,42,0.06)", borderTop: "1px solid rgba(190,140,42,0.15)" }}
            >
              <span className="text-xs text-white/50">Ready to make this real?</span>
              <a
                href="http://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs flex items-center gap-1"
              >
                Book a Call <ArrowRight size={11} weight="bold" />
              </a>
            </div>
          )}

          {/* Input */}
          <div
            className="px-3 pb-3 pt-2 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: "#1B2126", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Ask about ${businessName}'s new site...`}
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="text-white/30 hover:text-white/80 disabled:opacity-30 transition-colors p-1 rounded"
                aria-label="Send"
              >
                <PaperPlaneRight size={16} weight="fill" />
              </button>
            </div>
            <p className="text-center text-white/20 text-xs mt-2">
              Powered by{" "}
              <span style={{ color: "#BE8C2A" }}>Design Spore</span>
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
            : "linear-gradient(135deg, #BE8C2A, #D4A44A)",
          border: open ? "1px solid rgba(190,140,42,0.3)" : "none",
          boxShadow: open
            ? "0 4px 16px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(190,140,42,0.4), 0 0 0 0 rgba(190,140,42,0)",
        }}
        aria-label={open ? "Close chat" : "Open AI chat"}
      >
        {open ? (
          <X size={22} color="rgba(255,255,255,0.7)" />
        ) : (
          <ChatCircle size={26} weight="fill" color="#0C1012" />
        )}

        {/* Pulse ring for auto-open */}
        {!open && autoOpened && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              animation: "glow-breathe 2s ease-in-out infinite",
              background: "rgba(190,140,42,0.3)",
            }}
          />
        )}
      </button>
    </>
  );
}
