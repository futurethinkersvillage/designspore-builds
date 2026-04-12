"use client";

import { MagnifyingGlass, Bell } from "@phosphor-icons/react";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 h-16 border-b border-white/[0.06] shrink-0">
      {/* Left: page title */}
      <h2 className="text-lg font-semibold text-white/90 pl-10 lg:pl-0">
        {title}
      </h2>

      {/* Right: actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-sm w-56 transition-colors hover:border-white/[0.1]">
          <MagnifyingGlass size={16} className="shrink-0" />
          <span>Search...</span>
        </div>

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
  );
}
