"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ModuleCategory } from "@/lib/modules";

interface ModulesFilterProps {
  categories: [ModuleCategory, string][];
  currentCategory: string | null;
}

export default function ModulesFilter({ categories, currentCategory }: ModulesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Remove tier param if it exists (legacy)
    params.delete("tier");
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
      {categories.map(([value, label]) => (
        <button key={value} className={chip(currentCategory === value)} onClick={() => update("category", value)}>
          {label}
        </button>
      ))}
    </div>
  );
}
