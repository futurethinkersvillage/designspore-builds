"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Bell } from "@phosphor-icons/react";
import SearchModal from "./SearchModal";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-6 lg:px-8 h-16 border-b border-white/[0.06] shrink-0">
        {/* Left: page title */}
        <h2 className="text-lg font-semibold text-white/90 pl-10 lg:pl-0">{title}</h2>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-sm w-56 transition-colors hover:border-white/[0.12] hover:text-white/50"
          >
            <MagnifyingGlass size={16} className="shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono opacity-60">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl hover:bg-white/[0.04] transition-colors text-white/50 hover:text-white/80"
          >
            <MagnifyingGlass size={20} />
          </button>

          {/* Notification bell */}
          <button className="relative p-2 rounded-xl hover:bg-white/[0.04] transition-colors text-white/50 hover:text-white/80">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-amber text-[10px] font-bold text-warm-dark">
              3
            </span>
          </button>

          {/* User avatar */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber/20 border border-amber/30 text-amber text-xs font-semibold cursor-pointer hover:bg-amber/30 transition-colors">
            MG
          </div>
        </div>
      </header>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
