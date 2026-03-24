"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ModuleCategory } from "@/lib/modules";

interface ModulesFilterProps {
  categories: [ModuleCategory, string][];
  currentTier: string | null;
  currentCategory: string | null;
}

const tierLabels = [
  { value: "1", label: "Flagship" },
  { value: "2", label: "Core" },
  { value: "3", label: "Quick Win" },
];

export default function ModulesFilter({ categories, currentTier, currentCategory }: ModulesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/modules?${params.toString()}`);
  }

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
      active
        ? "bg-gold text-dark"
        : "bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08]"
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Tier filters */}
      {tierLabels.map(({ value, label }) => (
        <button key={value} className={chip(currentTier === value)} onClick={() => update("tier", value)}>
          {label}
        </button>
      ))}

      <div className="w-px h-6 bg-white/[0.08] self-center mx-1" />

      {/* Category filters */}
      {categories.map(([value, label]) => (
        <button key={value} className={chip(currentCategory === value)} onClick={() => update("category", value)}>
          {label}
        </button>
      ))}
    </div>
  );
}
