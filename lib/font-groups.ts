export interface FontGroup {
  id: string;
  label: string;
  description: string;
  display: string;   // CSS var for headings
  body: string;      // CSS var for body / UI text
  fallback: string;
}

export const fontGroups: FontGroup[] = [
  {
    id: "archivo-inter",
    label: "Archivo + Inter",
    description: "Clean tech — the safe, modern default",
    display: "var(--font-archivo)",
    body: "var(--font-inter)",
    fallback: "system-ui, sans-serif",
  },
  {
    id: "cormorant-inter",
    label: "Cormorant + Inter",
    description: "Editorial luxury — high-contrast serif headlines",
    display: "var(--font-cormorant)",
    body: "var(--font-inter)",
    fallback: "Georgia, serif",
  },
  {
    id: "playfair-dm-sans",
    label: "Playfair + DM Sans",
    description: "Classic premium — think Bloomberg, Stripe editorial",
    display: "var(--font-playfair)",
    body: "var(--font-dm-sans)",
    fallback: "Georgia, serif",
  },
  {
    id: "dm-serif-dm-sans",
    label: "DM Serif + DM Sans",
    description: "Modern editorial — cohesive newspaper feel",
    display: "var(--font-dm-serif)",
    body: "var(--font-dm-sans)",
    fallback: "Georgia, serif",
  },
  {
    id: "fraunces-jakarta",
    label: "Fraunces + Jakarta",
    description: "Contemporary luxury — distinctive ink-trap aesthetic",
    display: "var(--font-fraunces)",
    body: "var(--font-jakarta)",
    fallback: "Georgia, serif",
  },
  {
    id: "libre-inter",
    label: "Libre Baskerville + Inter",
    description: "Refined classical — authoritative and timeless",
    display: "var(--font-libre-baskerville)",
    body: "var(--font-inter)",
    fallback: "Georgia, serif",
  },
  {
    id: "crimson-inter",
    label: "Crimson Pro + Inter",
    description: "Warm serif — elegant, bookish, approachable",
    display: "var(--font-crimson-pro)",
    body: "var(--font-inter)",
    fallback: "Georgia, serif",
  },
  {
    id: "space-grotesk-inter",
    label: "Space Grotesk + Inter",
    description: "Tech premium — geometric sans with personality",
    display: "var(--font-space-grotesk)",
    body: "var(--font-inter)",
    fallback: "system-ui, sans-serif",
  },
  {
    id: "sora-inter",
    label: "Sora + Inter",
    description: "Geometric modern — rounded, friendly, premium SaaS",
    display: "var(--font-sora)",
    body: "var(--font-inter)",
    fallback: "system-ui, sans-serif",
  },
  {
    id: "outfit-jakarta",
    label: "Outfit + Jakarta",
    description: "Clean geometric — minimal, startup-polished",
    display: "var(--font-outfit)",
    body: "var(--font-jakarta)",
    fallback: "system-ui, sans-serif",
  },
];
