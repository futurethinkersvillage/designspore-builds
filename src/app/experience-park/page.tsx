import DeckFrame from "@/components/DeckFrame";

// /experience-park — PUBLIC vision deck (golf course -> experience park). No investment terms.
// ?v bumped on each redeploy to bust the iframe cache.
export default function ExperienceParkPage() {
  return <DeckFrame src="/experience-park/index.html?v=20260912e" />;
}
