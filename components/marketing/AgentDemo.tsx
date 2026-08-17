"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { HashIcon } from "@phosphor-icons/react";

/* ── AGENTS ───────────────────────────────────────────────────── */

type AgentSlug = "seneca" | "marcus" | "ari" | "posi" | "leo" | "cris";

const AGENTS: Record<AgentSlug, { name: string; role: string; color: string }> = {
  seneca: { name: "Seneca", role: "Your right hand", color: "#4FD1D9" },
  marcus: { name: "Marcus", role: "Operations", color: "#F87171" },
  ari: { name: "Ari", role: "Money & revenue", color: "#E5B94A" },
  posi: { name: "Posi", role: "Email & social", color: "#A78BFA" },
  leo: { name: "Leo", role: "Design", color: "#F472B6" },
  cris: { name: "Cris", role: "Builds your tools", color: "#60A5FA" },
};

/* ── SCENES ───────────────────────────────────────────────────────
   A sample of the team, not all of it — four short exchanges.
   `history` renders instantly; it's what you scroll back into.
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
    caption: "Seneca runs the others, then tells you the short version.",
    history: [
      { from: "you", text: "how'd last week go?" },
      { from: "seneca", text: "$18,400 invoiced. Best week since June." },
      { from: "you", text: "nice" },
    ],
    messages: [
      { from: "seneca", text: "Monday, 7am. Here's your week.", think: 1200 },
      {
        from: "seneca",
        text: "Three quotes still unanswered — $11,600 between them. Both crews finish Thursday, and next week is empty.",
        think: 1700,
      },
      {
        from: "seneca",
        text: "I'd chase the Braun quote first. It's the biggest and the oldest.",
        think: 1500,
      },
      { from: "you", text: "do it" },
    ],
  },
  {
    lead: "marcus",
    channel: "enquiries",
    caption: "The call you couldn't take, answered anyway.",
    history: [
      { from: "marcus", text: "Missed call at 2:14pm while you were up on the Dawson roof." },
    ],
    messages: [
      {
        from: "marcus",
        text: "I texted them back within the minute. They want a price on a metal roof out in Barriere.",
        think: 1500,
      },
      {
        from: "marcus",
        text: "Asked for photos and the address — both came in. You're booked to look at it Thursday 9am.",
        think: 1700,
      },
      { from: "you", text: "did they say a budget?" },
      { from: "marcus", text: "Not yet. I'll ask before Thursday so you're not guessing.", think: 1300 },
    ],
  },
  {
    lead: "ari",
    channel: "money",
    caption: "The money already sitting there, unchased.",
    history: [
      { from: "ari", text: "Hendricks finally paid. $2,400 in." },
      { from: "you", text: "about time" },
    ],
    messages: [
      { from: "you", text: "who else owes me?" },
      {
        from: "ari",
        text: "Braun, $890 — 11 days. Silva, $1,150 — 9 days. I've sent both a polite nudge.",
        think: 1500,
      },
      {
        from: "ari",
        text: "Bigger one: you sent nine quotes last month and four never got a reply. That's $16,000 nobody chased.",
        think: 1800,
      },
      { from: "you", text: "chase all four" },
    ],
  },
  {
    lead: "leo",
    channel: "website",
    caption: "Leo makes the change. Cris checks it's safe.",
    history: [
      { from: "you", text: "the quote button on the site is useless on my phone" },
      { from: "leo", text: "Send me a screenshot and mark up what you mean." },
    ],
    messages: [
      { from: "you", text: "like this", attachment: "annotated-screenshot" },
      {
        from: "leo",
        text: "Got it. On a phone that button's off the bottom of the screen, and the grey's too light to read. Moving it up, making it darker.",
        think: 1800,
      },
      { from: "leo", text: "Done. Have a look and tell me if it's right.", think: 1300 },
      {
        from: "cris",
        text: "Checked it before it goes live — your contact form had no spam protection, and one of your plugins was three years out of date. Both fixed.",
        think: 1900,
      },
      { from: "you", text: "didn't know that was a problem" },
    ],
  },
  {
    lead: "posi",
    channel: "reviews",
    caption: "Asked while they're still happy with you.",
    history: [
      { from: "posi", text: "Dawson job's marked finished." },
      { from: "you", text: "yep, went well" },
    ],
    messages: [
      {
        from: "posi",
        text: "I asked them for a review this morning while it was fresh. Five stars, and they named your crew in it.",
        think: 1600,
      },
      { from: "you", text: "oh good" },
      {
        from: "posi",
        text: "Put the before-and-after photos on Facebook with their words underneath. Two people have already asked what it cost.",
        think: 1800,
      },
      { from: "you", text: "pass them to Marcus" },
    ],
  },
];

/* ── ATTACHMENT ───────────────────────────────────────────────────
   The customer's marked-up screenshot. Drawn rather than shipped as a
   raster so it stays sharp at any size and weighs nothing.
─────────────────────────────────────────────────────────────────── */

const TREES = [6, 22, 38, 56, 74, 92, 112, 132, 154, 176, 198, 220, 244, 268, 292, 310];

function AnnotatedScreenshot() {
  return (
    <div className="mt-2 max-w-[300px] rounded-lg overflow-hidden border border-black/40">
      <svg
        viewBox="0 0 320 200"
        className="w-full block"
        role="img"
        aria-label="Screenshot of a landscaping company homepage with a hand-drawn red circle around the Get a Free Quote button, labelled: bigger and higher up"
      >
        <defs>
          <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FB4DC" />
            <stop offset="100%" stopColor="#D9E9F3" />
          </linearGradient>
          <linearGradient id="ss-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6EA34F" />
            <stop offset="100%" stopColor="#4C7C39" />
          </linearGradient>
          <linearGradient id="ss-scrim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1A12" stopOpacity="0" />
            <stop offset="100%" stopColor="#0B1A12" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <rect width="320" height="200" fill="#FFFFFF" />

        {/* browser chrome */}
        <rect width="320" height="15" fill="#E4E7EB" />
        <circle cx="9" cy="7.5" r="2.6" fill="#C3C8CF" />
        <circle cx="18" cy="7.5" r="2.6" fill="#C3C8CF" />
        <circle cx="27" cy="7.5" r="2.6" fill="#C3C8CF" />
        <rect x="38" y="3.4" width="152" height="8.2" rx="4.1" fill="#FFFFFF" />
        <text x="44" y="9.9" fill="#8A9099" fontSize="5.4" fontFamily="system-ui, sans-serif">
          riverstonelandscaping.ca
        </text>

        {/* site header */}
        <rect y="15" width="320" height="23" fill="#FFFFFF" />
        <path d="M15 28 c0-4.5 3.4-8 7.6-8 c-0.6 4.6-3.4 8-7.6 8 z" fill="#4C7C39" />
        <text
          x="26"
          y="30"
          fill="#1F2A24"
          fontSize="9.5"
          fontWeight="700"
          fontFamily="Georgia, serif"
        >
          Riverstone
        </text>
        <text x="196" y="29.5" fill="#6B7280" fontSize="5.8" fontFamily="system-ui, sans-serif">
          Services
        </text>
        <text x="230" y="29.5" fill="#6B7280" fontSize="5.8" fontFamily="system-ui, sans-serif">
          Gallery
        </text>
        <text x="259" y="29.5" fill="#6B7280" fontSize="5.8" fontFamily="system-ui, sans-serif">
          About
        </text>
        <text x="286" y="29.5" fill="#6B7280" fontSize="5.8" fontFamily="system-ui, sans-serif">
          Contact
        </text>
        <rect y="37.6" width="320" height="0.8" fill="#E6E8EB" />

        {/* hero photo */}
        <rect y="38" width="320" height="98" fill="url(#ss-sky)" />
        <path d="M0 98 L52 63 L96 98 Z" fill="#9DB0AE" />
        <path d="M74 98 L128 57 L184 98 Z" fill="#8699A0" />
        <path d="M160 98 L214 68 L266 98 Z" fill="#9DB0AE" />
        <path d="M238 98 L286 72 L320 98 Z" fill="#8699A0" />
        <path d="M52 63 L63 71 L41 71 Z" fill="#EDF3F5" />
        <path d="M128 57 L141 67 L115 67 Z" fill="#EDF3F5" />
        {TREES.map((x, i) => (
          <path
            key={x}
            d={`M${x} 105 L${x + (i % 3 === 0 ? 5.5 : 4.5)} 91 L${x + (i % 3 === 0 ? 11 : 9)} 105 Z`}
            fill={i % 2 === 0 ? "#2E5B3F" : "#264C35"}
          />
        ))}
        <rect y="103" width="320" height="33" fill="url(#ss-grass)" />
        <path
          d="M0 109 q80 -6 160 2 q80 8 160 0 l0 25 l-320 0 z"
          fill="#5B9146"
          opacity="0.5"
        />
        <rect y="38" width="320" height="98" fill="url(#ss-scrim)" />

        {/* hero copy */}
        <text x="15" y="109" fill="#FFFFFF" fontSize="13" fontWeight="700" fontFamily="Georgia, serif">
          Yards that look better
        </text>
        <text x="15" y="124" fill="#FFFFFF" fontSize="13" fontWeight="700" fontFamily="Georgia, serif">
          every single year.
        </text>

        {/* below the fold */}
        <rect y="140.4" width="320" height="0.7" fill="#ECEEF0" />
        <text x="15" y="154" fill="#5A6470" fontSize="6.4" fontFamily="system-ui, sans-serif">
          Design, planting and maintenance since 2009.
        </text>
        {/* the washed-out button, sitting too low */}
        <rect x="15" y="163" width="92" height="21" rx="4" fill="#D8DCE0" />
        <text
          x="29"
          y="176.5"
          fill="#FFFFFF"
          fontSize="7"
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
        >
          Get a Free Quote
        </text>

        {/* the customer's markup */}
        <g stroke="#FF3B30" strokeWidth="2.4" fill="none" strokeLinecap="round">
          <ellipse cx="63" cy="173" rx="57" ry="18" transform="rotate(-2.5 63 173)" />
          <path d="M204 158 C 222 166, 200 178, 126 176" />
          <path d="M126 176 l 12 -6 M126 176 l 10 7" />
        </g>
        <text x="209" y="148" fill="#FF3B30" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          bigger +
        </text>
        <text x="209" y="159" fill="#FF3B30" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          higher up
        </text>
      </svg>
      <p className="px-3 py-2 text-[11px] text-[#80848E] bg-[#0F1214]">homepage-mobile.png</p>
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
        t += 900;
      } else {
        t += 900;
        timers.push(setTimeout(() => setStep(i + 1), t));
        t += 400;
      }
    });

    // Sit on the finished conversation long enough to actually read it, then
    // advance — unless the reader is hovering or has scrolled up into history.
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
    timers.push(setTimeout(advance, t + 9000));

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
                  className="flex gap-3 animate-[fade-up_0.4s_ease-out_both]"
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
