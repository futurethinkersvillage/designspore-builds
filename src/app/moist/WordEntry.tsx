"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

export function WordEntry() {
  const router = useRouter();
  const [word, setWord] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const slug = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (slug) router.push(`/moist/${slug}`);
  }

  return (
    <form onSubmit={go} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="word from the stem…"
        aria-label="The word printed on your mushroom"
        className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 text-lg tracking-[0.3em] text-white placeholder:text-white/30 placeholder:tracking-normal focus:border-amber focus:outline-none uppercase"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-amber px-7 py-4 font-medium text-warm-dark transition hover:brightness-110"
      >
        Enter <ArrowRight weight="bold" size={18} />
      </button>
    </form>
  );
}
