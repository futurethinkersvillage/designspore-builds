"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatCircle, X, PaperPlaneTilt, ArrowRight } from "@phosphor-icons/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ALL_STARTERS = [
  "What is Portal.Place?",
  "How can I visit the village?",
  "What is the Work-Stay program?",
  "How do I become a member?",
  "Can I invest in Portal.Place?",
  "What is the month-long immersion?",
  "Who are Mike and Euvie?",
  "What makes Wells Gray special?",
  "What is a Smart Village?",
  "Can I host a retreat there?",
  "What is the Future Thinkers podcast?",
  "How do I get started?",
];

// Strip any residual markdown symbols from AI responses
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")        // headings
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1")     // italic
    .replace(/`([^`]+)`/g, "$1")       // inline code
    .replace(/^[-*+]\s+/gm, "")        // unordered list bullets
    .replace(/^\d+\.\s+/gm, "")        // ordered list numbers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → just label
    .replace(/\n{3,}/g, "\n\n")        // collapse excess blank lines
    .trim();
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [usedStarters, setUsedStarters] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevStreamingRef = useRef("");

  const remainingStarters = ALL_STARTERS.filter((q) => !usedStarters.has(q));

  // Check availability once on first open
  useEffect(() => {
    if (open && available === null) {
      fetch("/api/chat")
        .then((r) => setAvailable(r.ok))
        .catch(() => setAvailable(false));
    }
  }, [open, available]);

  // Scroll to bottom when user sends (shows typing indicator)
  useEffect(() => {
    if (loading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  // When streaming first starts, scroll so the user's question is at the top
  useEffect(() => {
    if (streamingText && !prevStreamingRef.current && lastUserMsgRef.current) {
      lastUserMsgRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevStreamingRef.current = streamingText;
  }, [streamingText]);

  useEffect(() => {
    if (open && available && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, available]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    setUsedStarters((prev) => new Set([...prev, text]));

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingText(stripMarkdown(accumulated));
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: stripMarkdown(accumulated) },
      ]);
      setStreamingText("");
    } catch {
      setLoading(false);
      setStreamingText("");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I ran into an issue. Try reaching Mike directly at mike@portal.place or on WhatsApp.",
        },
      ]);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber shadow-lg shadow-black/40 transition-transform hover:scale-105"
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} weight="bold" className="text-warm-dark" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChatCircle size={24} weight="fill" className="text-warm-dark" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 flex w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1A1720] shadow-2xl shadow-black/60"
            style={{ maxHeight: "calc(100dvh - 8rem)", height: "calc(100dvh - 8rem)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/20">
                <ChatCircle size={16} weight="fill" className="text-amber" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  Portal.Place Guide
                </div>
                <div className="text-xs text-white/35">
                  Ask anything about the village
                </div>
              </div>
            </div>

            {/* Unavailable state */}
            {available === false && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/8">
                  <ChatCircle size={20} weight="light" className="text-white/30" />
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  The guide is temporarily unavailable.
                </p>
                <p className="mt-1 text-xs text-white/25">
                  Reach Mike directly at{" "}
                  <a href="mailto:mike@portal.place" className="text-amber/60 hover:text-amber transition-colors">
                    mike@portal.place
                  </a>
                </p>
              </div>
            )}

            {/* Checking state */}
            {available === null && (
              <div className="flex flex-1 items-center justify-center py-10">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1 w-1 rounded-full bg-white/25"
                      animate={{ opacity: [0.2, 0.7, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Messages + starters */}
            {available === true && (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(234,130,78,0.25) transparent",
              }}
            >
              {/* Welcome */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/70"
                >
                  Hi! I&apos;m here to help you explore Portal.Place — a Smart
                  Village being built in the wilderness of Wells Gray, BC.
                  What would you like to know?
                </motion.div>
              )}

              {/* Starter questions — shown until all used */}
              {remainingStarters.length > 0 && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-1.5"
                >
                  {remainingStarters.map((q, i) => (
                    <motion.button
                      key={q}
                      layout
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      onClick={() => sendMessage(q)}
                      className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-white/55 transition-all hover:border-amber/30 hover:bg-amber/5 hover:text-white"
                    >
                      <span>{q}</span>
                      <ArrowRight
                        size={11}
                        className="shrink-0 text-white/20 transition-all group-hover:text-amber/60 group-hover:translate-x-0.5"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  ref={msg.role === "user" && i === messages.length - 1 ? lastUserMsgRef : null}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-amber text-warm-dark font-medium"
                        : "bg-white/8 text-white/85"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Remaining starters — shown after conversation starts */}
              {messages.length > 0 && remainingStarters.length > 0 && !loading && !streamingText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xs text-white/25 mb-1.5">More questions</p>
                  <div className="space-y-1.5">
                    <AnimatePresence>
                      {remainingStarters.map((q) => (
                        <motion.button
                          key={q}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => sendMessage(q)}
                          className="group flex w-full items-center justify-between rounded-lg border border-white/8 bg-white/3 px-3 py-2 text-left text-xs text-white/40 transition-all hover:border-amber/25 hover:bg-amber/5 hover:text-white/70"
                        >
                          <span>{q}</span>
                          <ArrowRight
                            size={10}
                            className="shrink-0 text-white/15 transition-all group-hover:text-amber/50 group-hover:translate-x-0.5"
                          />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Streaming response */}
              {streamingText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl bg-white/8 px-3.5 py-2.5 text-sm leading-relaxed text-white/85 whitespace-pre-wrap">
                    {streamingText}
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-white/8">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
            )}

            {/* Input — only shown when available */}
            {available === true && <div className="border-t border-white/10 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the village..."
                  disabled={loading}
                  className="flex-1 rounded-lg bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none ring-0 transition-all focus:bg-white/10 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber text-warm-dark transition-all hover:bg-amber/90 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <PaperPlaneTilt size={15} weight="fill" />
                </button>
              </form>
            </div>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
