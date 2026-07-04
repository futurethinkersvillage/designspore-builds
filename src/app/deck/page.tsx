import DeckFrame from "@/components/DeckFrame";

// /deck — always the LATEST deck version. Bump this src when a new version ships;
// the previous version stays reachable at its /deckN URL.
export default function DeckPage() {
  return <DeckFrame src="/deck2/index.html" />;
}
