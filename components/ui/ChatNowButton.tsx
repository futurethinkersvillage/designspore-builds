"use client";

import { ArrowRight } from "@phosphor-icons/react";

export default function ChatNowButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("ds-open-chat"))}
      className="btn-primary shrink-0 flex items-center gap-2"
    >
      Chat Now <ArrowRight size={16} weight="bold" />
    </button>
  );
}
