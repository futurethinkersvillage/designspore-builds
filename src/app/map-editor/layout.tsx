import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land Map Editor",
  description: "Edit the Wells Gray land map — drag, draw, rename features. Saves to the database.",
  robots: { index: false, follow: false },
};

export default function MapEditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
