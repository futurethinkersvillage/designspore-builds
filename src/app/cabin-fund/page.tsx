import DeckFrame from "@/components/DeckFrame";

// /cabin-fund — the cabin-development investment deck (lifestyle mezzanine note).
// Gated in middleware; carries investment terms so it must stay behind the password.
export default function CabinFundPage() {
  return <DeckFrame src="/cabin-fund/index.html" />;
}
