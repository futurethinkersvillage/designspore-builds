"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { HashIcon } from "@phosphor-icons/react";

/* ── SCENES ───────────────────────────────────────────────────────
   Each scene is one agent doing one job. Mix of asked-for work and
   work the agent starts on its own, so both modes are visible.
─────────────────────────────────────────────────────────────────── */

type Msg = { from: "you" | "agent"; text: string; think?: number };

type Scene = {
  slug: string;
  name: string;
  role: string;
  color: string;
  channel: string;
  caption: string;
  messages: Msg[];
};

const SCENES: Scene[] = [
  {
    slug: "posi",
    name: "Posi",
    role: "Comms & correspondence",
    color: "#A78BFA",
    channel: "money",
    caption: "Ask a question, get an answer and an action.",
    messages: [
      { from: "you", text: "who hasn't paid me yet?" },
      {
        from: "agent",
        text: "Three invoices are overdue. Hendricks — $2,400, 18 days. Braun — $890, 11 days. Silva — $1,150, 9 days. Want me to send reminders?",
        think: 1500,
      },
      { from: "you", text: "yes, keep them friendly" },
      {
        from: "agent",
        text: "Sent all three. I'll follow up again Friday if nothing comes in.",
        think: 1200,
      },
    ],
  },
  {
    slug: "seneca",
    name: "Seneca",
    role: "Your right hand",
    color: "#4FD1D9",
    channel: "morning",
    caption: "Some of it happens before you're awake.",
    messages: [
      {
        from: "agent",
        text: "Monday, 7:00am. Here's your week: $14,200 invoiced last week, $6,100 still out. Two quotes waiting on you since Thursday. Your 2pm today moved to 3pm.",
        think: 1400,
      },
      {
        from: "agent",
        text: "The only thing that actually needs you today is the Braun quote — they've asked twice.",
        think: 1600,
      },
      { from: "you", text: "draft it and I'll look after lunch" },
      { from: "agent", text: "On it.", think: 900 },
    ],
  },
  {
    slug: "ari",
    name: "Ari",
    role: "Revenue & opportunities",
    color: "#E5B94A",
    channel: "revenue",
    caption: "They notice things you don't have time to notice.",
    messages: [
      {
        from: "agent",
        text: "Eleven customers from last spring haven't booked again this year. Same season, same service. That's about $8,000 sitting there.",
        think: 1500,
      },
      { from: "you", text: "huh. can you reach out?" },
      {
        from: "agent",
        text: "Written and queued — one message each, referencing what they booked last time. Want to read them before they go?",
        think: 1400,
      },
      { from: "you", text: "yeah send me the first three" },
    ],
  },
  {
    slug: "rufus",
    name: "Rufus",
    role: "Content & media",
    color: "#FB923C",
    channel: "content",
    caption: "The stuff you keep meaning to get to.",
    messages: [
      { from: "you", text: "we still haven't sent a newsletter since March" },
      {
        from: "agent",
        text: "I know. I've drafted one — the new equipment, the two projects from June, and the fall booking window. 400 words, sounds like you.",
        think: 1500,
      },
      { from: "you", text: "cut the last paragraph, then send it" },
      {
        from: "agent",
        text: "Gone. Scheduled for Tuesday 9am — that's when your list opens most.",
        think: 1100,
      },
    ],
  },
  {
    slug: "marcus",
    name: "Marcus",
    role: "Operations",
    color: "#F87171",
    channel: "operations",
    caption: "Nights and weekends included.",
    messages: [
      {
        from: "agent",
        text: "11:42pm — someone asked through the website whether you can do a job the week of the 14th. I told them yes, you have that week open, and asked for their address and photos.",
        think: 1500,
      },
      {
        from: "agent",
        text: "They sent both. It's on your calendar as a hold and the photos are in the folder.",
        think: 1400,
      },
      { from: "you", text: "nice" },
      { from: "agent", text: "I'll confirm with them once you've had a look.", think: 900 },
    ],
  },
];

/* ── COMPONENT ────────────────────────────────────────────────── */

export default function AgentDemo() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const pausedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      setTyping(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    setStep(0);
    setTyping(false);

    let t = 400;
    scene.messages.forEach((m, i) => {
      if (m.from === "agent") {
        timers.push(setTimeout(() => setTyping(true), t));
        t += m.think ?? 1300;
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setStep(i + 1);
          }, t)
        );
        t += 600;
      } else {
        t += 800;
        timers.push(setTimeout(() => setStep(i + 1), t));
        t += 300;
      }
    });

    // Hold on the finished scene, then advance — unless the user is hovering.
    const advance = () => {
      if (pausedRef.current) {
        timers.push(setTimeout(advance, 1000));
        return;
      }
      setSceneIdx((i) => (i + 1) % SCENES.length);
    };
    timers.push(setTimeout(advance, t + 4200));

    return () => timers.forEach(clearTimeout);
  }, [sceneIdx, scene.messages]);

  // Keep the newest message in view as they appear.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step, typing]);

  return (
    <div
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Discord-style window */}
      <div className="rounded-xl overflow-hidden border border-black/40 shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex h-[420px] bg-[#313338]">
        {/* Agent rail — doubles as the scene switcher */}
        <div className="w-[60px] shrink-0 bg-[#1E1F22] flex flex-col items-center py-3 gap-2">
          {SCENES.map((s, i) => {
            const active = i === sceneIdx;
            return (
              <button
                key={s.slug}
                onClick={() => goTo(i)}
                className="relative group/rail w-full flex justify-center py-0.5"
                aria-label={`Show ${s.name}, ${s.role}`}
                aria-current={active}
              >
                {/* active pill, like Discord's server indicator */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-white transition-all duration-300 ${
                    active ? "h-8" : "h-0 group-hover/rail:h-4"
                  }`}
                />
                <span
                  className={`relative block rounded-full overflow-hidden transition-all duration-300 ${
                    active
                      ? "w-10 h-10 ring-2 ring-offset-2 ring-offset-[#1E1F22]"
                      : "w-9 h-9 opacity-45 group-hover/rail:opacity-80"
                  }`}
                  style={active ? { boxShadow: `0 0 0 2px ${s.color}` } : undefined}
                >
                  <Image
                    src={`/agents/${s.slug}.webp`}
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
          {/* Channel header */}
          <div className="h-12 shrink-0 flex items-center gap-2 px-4 border-b border-black/25 bg-[#313338]">
            <HashIcon size={18} className="text-[#80848E]" weight="bold" />
            <span className="text-[15px] font-semibold text-white truncate">
              {scene.channel}
            </span>
            <span className="hidden sm:block ml-auto text-[11px] text-[#80848E] whitespace-nowrap">
              5 agents · always on
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-hidden px-4 py-4 space-y-4">
            {scene.messages.slice(0, step).map((m, i) =>
              m.from === "agent" ? (
                <div key={i} className="flex gap-3 animate-[fade-up_0.4s_ease-out_both]">
                  <span className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
                    <Image
                      src={`/agents/${scene.slug}.webp`}
                      alt=""
                      width={40}
                      height={40}
                      priority
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap leading-none mb-1">
                      <span
                        className="text-[15px] font-semibold"
                        style={{ color: scene.color }}
                      >
                        {scene.name}
                      </span>
                      {/* Discord marks non-humans with a tag. Ours says what it is. */}
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#5865F2] text-white px-1.5 py-[2px] rounded">
                        AI Agent
                      </span>
                    </div>
                    <p className="text-[14.5px] text-[#DBDEE1] leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3 animate-[fade-up_0.4s_ease-out_both]">
                  <span className="w-10 h-10 shrink-0 rounded-full bg-[#5865F2]/20 border border-white/10 flex items-center justify-center text-[13px] font-bold text-white/70">
                    You
                  </span>
                  <div className="min-w-0">
                    <div className="leading-none mb-1">
                      <span className="text-[15px] font-semibold text-white/85">You</span>
                    </div>
                    <p className="text-[14.5px] text-[#DBDEE1] leading-relaxed">{m.text}</p>
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex gap-3 items-center animate-[fade-in_0.3s_ease-out_both]">
                <span className="w-10 h-10 shrink-0 rounded-full overflow-hidden opacity-70">
                  <Image
                    src={`/agents/${scene.slug}.webp`}
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
                    {scene.name} is working…
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Input bar — visual only */}
          <div className="shrink-0 px-4 pb-4">
            <div className="rounded-lg bg-[#383A40] px-4 py-2.5 text-[14px] text-[#6D6F78]">
              Message @{scene.name}
            </div>
          </div>
        </div>
      </div>

      {/* Caption + dots */}
      <div className="mt-4 flex items-center gap-4">
        <p key={scene.slug} className="text-sm text-white/40 flex-1 animate-[fade-in_0.5s_ease-out_both]">
          {scene.caption}
        </p>
        <div className="flex gap-1.5 shrink-0">
          {SCENES.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => goTo(i)}
              aria-label={`Show ${s.name}`}
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
