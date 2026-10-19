import DeckFrame from "@/components/DeckFrame";

// /deck-long — HTML copy of the Google Slides "Portal.Place & Wells Gray Village Slide Deck - Long"
// (source: Projects/long-deck). Gated by the investor password via the "/deck" prefix in middleware.
export default function DeckLongPage() {
  return <DeckFrame src="/deck-long/index.html?v=20261019a" />;
}
