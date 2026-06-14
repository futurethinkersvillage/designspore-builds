"use client";

import { MagnifyingGlass, TreeStructure, Cards } from "@phosphor-icons/react";
import { useMapStore } from "@/lib/mindmap/store";

export function Toolbar() {
  const view = useMapStore((s) => s.view);
  const setView = useMapStore((s) => s.setView);
  const query = useMapStore((s) => s.query);
  const setQuery = useMapStore((s) => s.setQuery);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <MagnifyingGlass
          size={15}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8a7f86]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the map…"
          className="w-52 rounded-full border border-[#ea824e]/20 bg-[#232323] py-1.5 pl-8 pr-3 text-[12.5px] text-[#faf8f4] placeholder:text-[#8a7f86] focus:border-[#ea824e]/50 focus:outline-none"
        />
      </div>

      <div className="flex rounded-full border border-[#ea824e]/20 bg-[#232323] p-0.5">
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors ${
            view === "map" ? "bg-[#ea824e] text-[#1a1720]" : "text-[#b3a8aa] hover:text-[#faf8f4]"
          }`}
        >
          <TreeStructure size={14} weight={view === "map" ? "bold" : "regular"} /> Map
        </button>
        <button
          onClick={() => setView("read")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors ${
            view === "read" ? "bg-[#ea824e] text-[#1a1720]" : "text-[#b3a8aa] hover:text-[#faf8f4]"
          }`}
        >
          <Cards size={14} weight={view === "read" ? "bold" : "regular"} /> Read
        </button>
      </div>
    </div>
  );
}
