"use client";

import { useState, useRef, useEffect } from "react";
import { fontGroups, type FontGroup } from "@/lib/font-groups";

function applyFontGroup(group: FontGroup) {
  const root = document.documentElement;
  const display = `${group.display}, ${group.fallback}`;
  const body = `${group.body}, ${group.fallback}`;

  // Our custom dynamic variables
  root.style.setProperty("--font-display-active", display);
  root.style.setProperty("--font-body-active", body);

  // Override Tailwind's theme tokens so ALL utility classes update too
  root.style.setProperty("--font-sans", body);
  root.style.setProperty("--font-display", display);
  root.style.setProperty("--font-body", body);

  // Direct override on body for maximum inheritance coverage
  document.body.style.fontFamily = body;
}

export default function FontSelector() {
  const [open, setOpen] = useState(false);
  // Default to Outfit + Jakarta (last item) — the locked-in choice
  const [selected, setSelected] = useState<FontGroup>(fontGroups.find(g => g.id === "outfit-jakarta") ?? fontGroups[0]);
  const ref = useRef<HTMLDivElement>(null);

  // Apply default on mount
  useEffect(() => {
    applyFontGroup(selected);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(group: FontGroup) {
    setSelected(group);
    applyFontGroup(group);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/15 bg-white/5 text-xs text-white/70 hover:text-white hover:border-white/30 transition-all"
        title="Switch font pairing"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <text x="3" y="18" fontSize="16" fontWeight="bold" fill="currentColor" stroke="none">A</text>
          <text x="14" y="18" fontSize="11" fill="currentColor" stroke="none">a</text>
        </svg>
        <span className="hidden sm:inline max-w-[140px] truncate">{selected.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4 L5 7 L8 4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-white/15 bg-[#1B2126] shadow-2xl overflow-hidden">
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-[0.65rem] uppercase tracking-widest text-white/35 font-bold">Font Pairing</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {fontGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleSelect(group)}
                className={`w-full text-left px-3 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                  selected.id === group.id ? "bg-white/8" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-sm font-bold text-white"
                    style={{ fontFamily: `${group.display}, ${group.fallback}` }}
                  >
                    {group.label}
                  </span>
                  {selected.id === group.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  )}
                </div>
                <p
                  className="text-xs text-white/40 leading-snug"
                  style={{ fontFamily: `${group.body}, system-ui, sans-serif` }}
                >
                  {group.description}
                </p>
                {/* Live preview line */}
                <p
                  className="mt-1.5 text-lg font-bold text-white/70 leading-tight truncate"
                  style={{ fontFamily: `${group.display}, ${group.fallback}` }}
                >
                  AI Systems &amp; Launch Studio
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
