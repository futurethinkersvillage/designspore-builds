import DeckFrame from "@/components/DeckFrame";

// /ns — Network School pitch deck (NS North popup proposal). ALWAYS the latest version.
// Major versions are frozen at /ns1, /ns2, … (each its own route + public/nsN bundle).
// Public (ungated) so it can be shared. Source: Projects/ns-deck.
export default function NsDeckPage() {
  // ?v bumped on each deck redeploy to bust the browser cache on the iframe HTML.
  return <DeckFrame src="/ns/index.html?v=20261022g" />;
}
