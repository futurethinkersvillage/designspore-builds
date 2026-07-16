import DeckFrame from "@/components/DeckFrame";

// /future-school — the Future School program deck (Portal.Place education program).
// Public for sharing; renders chrome-free via middleware. ?v busts the iframe cache on redeploy.
export default function FutureSchoolPage() {
  return <DeckFrame src="/future-school/index.html?v=20260716a" />;
}
