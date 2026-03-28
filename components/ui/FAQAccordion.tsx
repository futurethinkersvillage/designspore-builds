"use client";
import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";

const FAQS = [
  {
    q: "How much does a renovation typically cost?",
    a: "Every project varies by scope, materials, and complexity. During our free on-site estimate, we'll give you a clear written breakdown — no vague ranges, no surprises. Kitchen renovations typically run $15,000–$50,000; deck builds start around $8,000; whole-home renos vary widely by size.",
  },
  {
    q: "How long will my project take?",
    a: "A deck build usually takes 3–7 days of active work. A kitchen reno takes 2–4 weeks. We'll give you a realistic schedule before we start, and we actually stick to it — or we let you know immediately if something changes.",
  },
  {
    q: "Do you handle permits and inspections?",
    a: "Yes. For projects that require permits — structural work, decks over a certain height, plumbing or electrical rough-ins — we manage the permit process on your behalf. You won't need to deal with the city.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Fully licensed and insured in BC. We're happy to provide proof of insurance and our licence number before any work begins — we'd expect the same from any contractor we hired.",
  },
  {
    q: "What areas do you serve?",
    a: "We're based in Kamloops and serve the BC Interior, including Merritt, Barriere, Logan Lake, and surrounding areas. Reach out for projects further afield — we'll let you know if it's workable.",
  },
  {
    q: "How do I get started?",
    a: "Call, text, or fill out the form on this page. We'll book a free on-site visit within a few days and have a written estimate to you within a week. No obligation, no pressure.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderTop: "1px solid var(--border-base)" }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-6 py-6 text-left"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              aria-expanded={isOpen}
            >
              <span
                className="text-base font-semibold leading-snug"
                style={{ color: "var(--fg-primary-hex)" }}
              >
                {faq.q}
              </span>
              <span
                className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  color: isOpen ? "var(--accent)" : "rgba(255,255,255,0.3)",
                  background: isOpen
                    ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                    : "transparent",
                }}
              >
                {isOpen ? <Minus size={12} weight="bold" /> : <Plus size={12} weight="bold" />}
              </span>
            </button>
            <div
              style={{
                overflow: "hidden",
                maxHeight: isOpen ? "200px" : "0",
                transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <p
                className="text-sm leading-relaxed pb-6 max-w-2xl"
                style={{ color: "rgba(var(--fg-r,255),var(--fg-g,255),var(--fg-b,255),0.55)" }}
              >
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
      <div style={{ borderTop: "1px solid var(--border-base)" }} />
    </div>
  );
}
