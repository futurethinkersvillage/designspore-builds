"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { HashIcon } from "@phosphor-icons/react";

/* ── AGENTS ───────────────────────────────────────────────────── */

type AgentSlug = "seneca" | "posi" | "marcus" | "ari" | "leo" | "cris";

const AGENTS: Record<AgentSlug, { name: string; role: string; color: string }> = {
  seneca: { name: "Seneca", role: "Your right hand", color: "#4FD1D9" },
  posi: { name: "Posi", role: "Email & social", color: "#A78BFA" },
  marcus: { name: "Marcus", role: "Operations", color: "#F87171" },
  ari: { name: "Ari", role: "Money & revenue", color: "#E5B94A" },
  leo: { name: "Leo", role: "Design", color: "#F472B6" },
  cris: { name: "Cris", role: "Builds your tools", color: "#60A5FA" },
};

/* ── SCENES ───────────────────────────────────────────────────────
   `history` renders instantly — it's what you scroll back into.
   `messages` animate in one at a time.
─────────────────────────────────────────────────────────────────── */

type Msg = {
  from: "you" | AgentSlug;
  text: string;
  think?: number;
  attachment?: "annotated-screenshot";
};

type Scene = {
  lead: AgentSlug;
  channel: string;
  caption: string;
  history: Msg[];
  messages: Msg[];
};

const SCENES: Scene[] = [
  {
    lead: "seneca",
    channel: "strategy-room",
    caption: "Seneca runs the others, then reports up to you.",
    history: [
      { from: "you", text: "how did last week go?" },
      {
        from: "seneca",
        text: "Good week. $18,400 invoiced, up 12% on the week before. Nothing on fire.",
      },
    ],
    messages: [
      { from: "seneca", text: "Monday, 7:00am. Everyone's reported in.", think: 1300 },
      {
        from: "seneca",
        text: "Ari found $8,000 in customers who didn't rebook this spring and has the outreach queued. Posi cleared 34 emails over the weekend and flagged three for you. Marcus took a job enquiry at 11:42pm and put it on your calendar. Leo's halfway through the homepage change.",
        think: 1900,
      },
      {
        from: "seneca",
        text: "The only thing that actually needs you today is the Braun quote. They've asked twice.",
        think: 1500,
      },
      { from: "you", text: "draft it and I'll look after lunch" },
      { from: "seneca", text: "On it.", think: 900 },
    ],
  },
  {
    lead: "ari",
    channel: "money",
    caption: "What's owed, and what's being left on the table.",
    history: [
      { from: "ari", text: "Heads up — Hendricks paid this morning. $2,400 in." },
    ],
    messages: [
      { from: "you", text: "who else hasn't paid me yet?" },
      {
        from: "ari",
        text: "Two left. Braun — $890, 11 days. Silva — $1,150, 9 days. Posi sent both a friendly reminder Friday; I'll chase again if nothing lands by Wednesday.",
        think: 1600,
      },
      {
        from: "ari",
        text: "Separately — eleven customers from last spring haven't rebooked this year. Same season, same service. That's about $8,000 sitting there.",
        think: 1700,
      },
      { from: "you", text: "huh. can you reach out?" },
      {
        from: "ari",
        text: "Written and queued — one each, referencing what they booked last time. Want to read them before they go?",
        think: 1400,
      },
      { from: "you", text: "send me the first three" },
    ],
  },
  {
    lead: "posi",
    channel: "comms",
    caption: "Email and social, handled and queued for your yes.",
    history: [
      {
        from: "posi",
        text: "Weekend inbox: 34 emails. 31 handled, 3 need you — they're at the top.",
      },
    ],
    messages: [
      { from: "you", text: "anything urgent?" },
      {
        from: "posi",
        text: "The Tourism Association wants you on a panel October 3rd. A supplier is raising prices 8% in November. And someone's asking if you're hiring.",
        think: 1700,
      },
      { from: "you", text: "yes to the panel. and post something about the new machine" },
      {
        from: "posi",
        text: "Panel accepted and in your calendar. For the machine — I've drafted a post using Thursday's photos, queued for Instagram and Facebook at 11am tomorrow.",
        think: 1800,
      },
      { from: "posi", text: "Want to see it before it goes out?", think: 900 },
      { from: "you", text: "yeah send it" },
    ],
  },
  {
    lead: "leo",
    channel: "website",
    caption: "Two agents, one job — Leo builds it, Cris checks it.",
    history: [
      { from: "leo", text: "Staging link's still live from last week if you want to compare." },
    ],
    messages: [
      {
        from: "you",
        text: "can you fix this",
        attachment: "annotated-screenshot",
      },
      {
        from: "leo",
        text: "Got it. On mobile that button sits below the fold, and the contrast is too low to pass accessibility. Moving it up under the headline and darkening it two steps.",
        think: 1900,
      },
      {
        from: "leo",
        text: "Done — it's on the staging link. I fixed the same button on your contact page while I was in there.",
        think: 1500,
      },
      { from: "cris", text: "I'll do a security pass before this goes live.", think: 1100 },
      {
        from: "cris",
        text: "Three things. Your contact form had no rate limiting — someone was submitting 40 an hour. An old plugin with a known vulnerability was still installed. And your admin login has no two-factor. First two are patched; the last one needs you to scan a QR code.",
        think: 2000,
      },
      { from: "you", text: "send it over" },
    ],
  },
  {
    lead: "marcus",
    channel: "operations",
    caption: "Nights and weekends included.",
    history: [
      {
        from: "marcus",
        text: "Firewood order from the Kellers — 2 cords, Saturday delivery. Added to their invoice.",
      },
    ],
    messages: [
      {
        from: "marcus",
        text: "11:42pm — someone asked through the website whether you can do a job the week of the 14th. I told them yes, you're open that week, and asked for their address and photos.",
        think: 1900,
      },
      {
        from: "marcus",
        text: "They sent both. It's on your calendar as a hold and the photos are in the folder.",
        think: 1500,
      },
      { from: "you", text: "nice" },
      { from: "marcus", text: "I'll confirm with them once you've had a look.", think: 900 },
    ],
  },
];

/* ── ATTACHMENT ───────────────────────────────────────────────────
   A mock screenshot with the customer's markup on it. Drawn rather
   than shipped as a raster so it stays sharp and weighs nothing.
─────────────────────────────────────────────────────────────────── */

function AnnotatedScreenshot() {
  return (
    <div className="mt-2 max-w-[300px] rounded-lg overflow-hidden border border-black/40 bg-[#0F1214]">
      <svg viewBox="0 0 300 190" className="w-full block" role="img" aria-label="Screenshot of a website with a hand-drawn circle around the call-to-action button">
        <rect width="300" height="190" fill="#15191D" />
        {/* browser chrome */}
        <rect width="300" height="18" fill="#22282E" />
        <circle cx="10" cy="9" r="3" fill="#3C444C" />
        <circle cx="20" cy="9" r="3" fill="#3C444C" />
        <circle cx="30" cy="9" r="3" fill="#3C444C" />
        <rect x="42" y="4.5" width="120" height="9" rx="4.5" fill="#181D22" />
        {/* nav */}
        <rect x="14" y="30" width="42" height="7" rx="3.5" fill="#4A5560" />
        <rect x="200" y="30" width="24" height="6" rx="3" fill="#333B43" />
        <rect x="232" y="30" width="24" height="6" rx="3" fill="#333B43" />
        <rect x="264" y="30" width="22" height="6" rx="3" fill="#333B43" />
        {/* hero copy */}
        <rect x="14" y="60" width="180" height="13" rx="4" fill="#5A6672" />
        <rect x="14" y="80" width="140" height="13" rx="4" fill="#5A6672" />
        <rect x="14" y="104" width="210" height="6" rx="3" fill="#2F373E" />
        <rect x="14" y="116" width="185" height="6" rx="3" fill="#2F373E" />
        {/* the low-contrast button, sitting too low */}
        <rect x="14" y="150" width="86" height="24" rx="5" fill="#3A4149" />
        <rect x="30" y="159" width="54" height="6" rx="3" fill="#5C666F" />
        {/* markup */}
        <ellipse
          cx="57"
          cy="162"
          rx="60"
          ry="22"
          fill="none"
          stroke="#FF4D4D"
          strokeWidth="2.5"
          transform="rotate(-3 57 162)"
        />
        <path
          d="M150 120 C 175 132, 178 150, 130 158"
          fill="none"
          stroke="#FF4D4D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M130 158 l 11 -6 M130 158 l 7 8"
          fill="none"
          stroke="#FF4D4D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text x="158" y="108" fill="#FF4D4D" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
          bigger + higher
        </text>
        <text x="158" y="122" fill="#FF4D4D" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
          up
        </text>
      </svg>
      <p className="px-3 py-2 text-[11px] text-[#80848E]">homepage-mobile.png</p>
    </div>
  );
}

/* ── COMPONENT ────────────────────────────────────────────────── */

export default function AgentDemo() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [typingAgent, setTypingAgent] = useState<AgentSlug | null>(null);
  const pausedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollH = useRef(0);

  const scene = SCENES[sceneIdx];

  const goTo = useCallback((i: number) => {
    pausedRef.current = false;
    setSceneIdx(i);
  }, []);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setStep(scene.messages.length);
      setTypingAgent(null);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    setStep(0);
    setTypingAgent(null);

    let t = 500;
    scene.messages.forEach((m, i) => {
      if (m.from !== "you") {
        const who = m.from;
        timers.push(setTimeout(() => setTypingAgent(who), t));
        t += m.think ?? 1300;
        timers.push(
          setTimeout(() => {
            setTypingAgent(null);
            setStep(i + 1);
          }, t)
        );
        t += 600;
      } else {
        t += 900;
        timers.push(setTimeout(() => setStep(i + 1), t));
        t += 300;
      }
    });

    // Hold on the finished scene, then advance — unless the reader is hovering
    // or has scrolled up into the history, in which case wait for them.
    const advance = () => {
      const el = scrollRef.current;
      const readingHistory =
        el != null && el.scrollHeight - el.scrollTop - el.clientHeight > 48;
      if (pausedRef.current || readingHistory) {
        timers.push(setTimeout(advance, 1000));
        return;
      }
      setSceneIdx((i) => (i + 1) % SCENES.length);
    };
    timers.push(setTimeout(advance, t + 4500));

    return () => timers.forEach(clearTimeout);
  }, [sceneIdx, scene.messages]);

  // A new scene starts at the bottom, showing the most recent messages.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    prevScrollH.current = el.scrollHeight;
  }, [sceneIdx]);

  // Follow new messages — but only if they were already at the bottom before
  // this one arrived. Comparing against the previous scroll height means we
  // never fight someone who has scrolled up to read the history.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const wasAtBottom = el.scrollTop + el.clientHeight >= prevScrollH.current - 48;
    if (wasAtBottom) el.scrollTop = el.scrollHeight;
    prevScrollH.current = el.scrollHeight;
  });

  // History first (instant), then whatever has animated in so far.
  const shown: Msg[] = [...scene.history, ...scene.messages.slice(0, step)];

  return (
    <div
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="rounded-xl overflow-hidden border border-black/40 shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex h-[460px] bg-[#313338]">
        {/* Agent rail — doubles as the scene switcher */}
        <div className="w-[60px] shrink-0 bg-[#1E1F22] flex flex-col items-center py-3 gap-2">
          {SCENES.map((s, i) => {
            const active = i === sceneIdx;
            const a = AGENTS[s.lead];
            return (
              <button
                key={s.channel}
                onClick={() => goTo(i)}
                className="relative group/rail w-full flex justify-center py-0.5"
                aria-label={`Show #${s.channel} — ${a.name}, ${a.role}`}
                aria-current={active}
              >
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-white transition-all duration-300 ${
                    active ? "h-8" : "h-0 group-hover/rail:h-4"
                  }`}
                />
                <span
                  className={`relative block rounded-full overflow-hidden transition-all duration-300 ${
                    active ? "w-10 h-10" : "w-9 h-9 opacity-45 group-hover/rail:opacity-80"
                  }`}
                  style={active ? { boxShadow: `0 0 0 2px ${a.color}` } : undefined}
                >
                  <Image
                    src={`/agents/${s.lead}.webp`}
                    alt=""
                    width={48}
                    height={48}
                    priority
                    className="w-full h-full object-cover"
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Chat column */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="h-12 shrink-0 flex items-center gap-2 px-4 border-b border-black/25 bg-[#313338]">
            <HashIcon size={18} className="text-[#80848E]" weight="bold" />
            <span className="text-[15px] font-semibold text-white truncate">
              {scene.channel}
            </span>
            <span className="hidden sm:block ml-auto text-[11px] text-[#80848E] whitespace-nowrap">
              scroll up for earlier
            </span>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 [overflow-anchor:none]"
          >
            {shown.map((m, i) => {
              // Discord groups consecutive messages from the same author.
              const grouped = i > 0 && shown[i - 1].from === m.from;
              const agent = m.from === "you" ? null : AGENTS[m.from as AgentSlug];

              return (
                <div
                  key={`${sceneIdx}-${i}`}
                  className={`flex gap-3 ${grouped ? "mt-0" : ""} animate-[fade-up_0.4s_ease-out_both]`}
                >
                  <div className="w-10 shrink-0">
                    {!grouped &&
                      (agent ? (
                        <span className="block w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={`/agents/${m.from}.webp`}
                            alt=""
                            width={40}
                            height={40}
                            priority
                            className="w-full h-full object-cover"
                          />
                        </span>
                      ) : (
                        <span className="flex w-10 h-10 rounded-full bg-[#5865F2]/20 border border-white/10 items-center justify-center text-[13px] font-bold text-white/70">
                          You
                        </span>
                      ))}
                  </div>

                  <div className="min-w-0 flex-1">
                    {!grouped && (
                      <div className="flex items-center gap-2 flex-wrap leading-none mb-1">
                        <span
                          className="text-[15px] font-semibold"
                          style={{ color: agent ? agent.color : "rgba(255,255,255,0.85)" }}
                        >
                          {agent ? agent.name : "You"}
                        </span>
                        {agent && (
                          /* Discord tags non-humans here. Ours says what it is. */
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#5865F2] text-white px-1.5 py-[2px] rounded">
                            AI Agent
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[14.5px] text-[#DBDEE1] leading-relaxed">{m.text}</p>
                    {m.attachment === "annotated-screenshot" && <AnnotatedScreenshot />}
                  </div>
                </div>
              );
            })}

            {typingAgent && (
              <div className="flex gap-3 items-center animate-[fade-in_0.3s_ease-out_both]">
                <span className="block w-10 h-10 shrink-0 rounded-full overflow-hidden opacity-70">
                  <Image
                    src={`/agents/${typingAgent}.webp`}
                    alt=""
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-cover"
                  />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-[#80848E] animate-bounce"
                        style={{ animationDelay: `${d * 140}ms`, animationDuration: "1s" }}
                      />
                    ))}
                  </span>
                  <span className="text-[12px] text-[#80848E]">
                    {AGENTS[typingAgent].name} is working…
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Input bar — visual only */}
          <div className="shrink-0 px-4 pb-4 pt-1">
            <div className="rounded-lg bg-[#383A40] px-4 py-2.5 text-[14px] text-[#6D6F78]">
              Message #{scene.channel}
            </div>
          </div>
        </div>
      </div>

      {/* Caption + dots */}
      <div className="mt-4 flex items-center gap-4">
        <p
          key={scene.channel}
          className="text-sm text-white/40 flex-1 animate-[fade-in_0.5s_ease-out_both]"
        >
          {scene.caption}
        </p>
        <div className="flex gap-1.5 shrink-0">
          {SCENES.map((s, i) => (
            <button
              key={s.channel}
              onClick={() => goTo(i)}
              aria-label={`Show #${s.channel}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === sceneIdx ? "w-6 bg-gold" : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
