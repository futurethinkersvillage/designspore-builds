"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const CustomModuleModal = dynamic(() => import("./CustomModuleModal"), { ssr: false });

export default function RequestCustomModuleButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleMatch(moduleId: string, _moduleName: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("detail", moduleId);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20 text-sm rounded-xl transition-colors"
      >
        <span className="text-base leading-none">+</span>
        Request a custom service
      </button>

      {open && (
        <CustomModuleModal
          onClose={() => setOpen(false)}
          onMatchFound={handleMatch}
        />
      )}
    </>
  );
}
