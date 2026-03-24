"use client";

import { useState, useEffect } from "react";
import { ArrowRight, MapTrifold, Sun, Moon } from "@phosphor-icons/react";

interface Props {
  businessName: string;
  bookingUrl: string;
  tourSteps: { target: string }[];
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("ds-theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ds-theme", next);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-7 h-7 rounded transition-all duration-200"
      style={{
        color: "rgba(255,255,255,0.4)",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark"
        ? <Sun size={13} weight="bold" />
        : <Moon size={13} weight="bold" />}
    </button>
  );
}

const DS_LOGO_SVG = (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="16" cy="16" r="16" fill="#BE8C2A" fillOpacity="0.15" />
    <circle cx="16" cy="16" r="6" fill="#BE8C2A" />
    <circle cx="16" cy="6" r="3" fill="#D4A44A" />
    <circle cx="26" cy="21" r="3" fill="#D4A44A" />
    <circle cx="6" cy="21" r="3" fill="#D4A44A" />
  </svg>
);

export default function DemoBar({ businessName, bookingUrl, tourSteps }: Props) {
  const [welcomed, setWelcomed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show welcome tooltip once
    const key = `ds-demo-welcomed-${businessName}`;
    if (!sessionStorage.getItem(key)) {
      setWelcomed(true);
      sessionStorage.setItem(key, "1");
    }
  }, [businessName]);

  function startTour() {
    window.dispatchEvent(new CustomEvent("ds-start-tour"));
    setWelcomed(false);
  }

  return (
    <>
      {/* Main bar */}
      <div
        className="sticky top-0 z-50 w-full flex items-center justify-between gap-3 px-4 md:px-6"
        style={{
          height: "48px",
          background: "linear-gradient(90deg, #0C1012 0%, #151A1F 50%, #0C1012 100%)",
          borderBottom: "1px solid rgba(190,140,42,0.25)",
        }}
      >
        {/* Left: DS branding */}
        <div className="flex items-center gap-2 shrink-0">
          {DS_LOGO_SVG}
          <span
            className="hidden sm:block text-xs font-bold tracking-widest uppercase"
            style={{ color: "#BE8C2A", fontFamily: "var(--font-archivo)", letterSpacing: "0.12em" }}
          >
            Design Spore
          </span>
          <span className="hidden md:block text-white/30 text-xs mx-1">·</span>
          <span className="hidden md:block text-white/50 text-xs" style={{ fontFamily: "var(--font-inter)" }}>
            Custom AI demo for{" "}
            <span className="text-white/80 font-medium">{businessName}</span>
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          {tourSteps.length > 0 && (
            <button
              onClick={startTour}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-200"
            >
              <MapTrifold size={13} weight="bold" />
              Take a Tour
            </button>
          )}
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold flex items-center gap-1.5 text-xs"
          >
            <span className="hidden sm:inline">Book a Call</span>
            <span className="sm:hidden">Book</span>
            <ArrowRight size={12} weight="bold" />
          </a>
        </div>
      </div>

      {/* Welcome tooltip — shows once on first visit */}
      {welcomed && !dismissed && (
        <div
          className="fixed top-14 right-4 z-50 max-w-xs rounded-lg border p-4 shadow-xl"
          style={{
            background: "#1B2126",
            borderColor: "rgba(190,140,42,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(190,140,42,0.1)",
          }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
          <p className="text-white/90 text-sm font-semibold mb-1">
            👋 Welcome to your demo
          </p>
          <p className="text-white/55 text-xs leading-relaxed mb-3">
            Mike from Design Spore built this to show what&apos;s possible for{" "}
            <span className="text-white/80">{businessName}</span> with AI. Explore the site, chat with the bot, or take a quick tour.
          </p>
          <div className="flex gap-2">
            {tourSteps.length > 0 && (
              <button
                onClick={startTour}
                className="btn-gold text-xs flex items-center gap-1"
              >
                <MapTrifold size={11} weight="bold" />
                Take Tour
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-white/40 hover:text-white/60 transition-colors px-2"
            >
              Explore on my own
            </button>
          </div>
        </div>
      )}
    </>
  );
}
