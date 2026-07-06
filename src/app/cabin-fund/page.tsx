import DeckFrame from "@/components/DeckFrame";

// /cabin-fund — the cabin-development investment deck (lifestyle mezzanine note).
// Gated in middleware; carries investment terms so it must stay behind the password.
export default function CabinFundPage() {
  // ?v bumped on each deck redeploy to bust the browser cache on the iframe HTML.
  return <DeckFrame src="/cabin-fund/index.html?v=20260706d" />;
}
