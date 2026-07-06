import DeckFrame from "@/components/DeckFrame";

// /membership — the Founding Membership sales deck (this IS its canonical home).
// Self-contained bundle at /membership/index.html, shown full-screen via DeckFrame.
// Public + chrome-free via middleware; collects the $2,000 deposit on the last slide.
// (The old marketing page is preserved at page.tsx.bak / in git history.)
export default function MembershipPage() {
  return <DeckFrame src="/membership/index.html" />;
}
