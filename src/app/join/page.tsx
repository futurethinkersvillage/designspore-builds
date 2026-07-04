import DeckFrame from "@/components/DeckFrame";

// /join — member-facing Founding Membership sales deck (separate from the investor
// deck at /deck). Self-contained bundle at /join/index.html, shown via DeckFrame.
// Gated + chrome-free via middleware; contains membership pricing (not public).
export default function JoinDeckPage() {
  return <DeckFrame src="/join/index.html" />;
}
