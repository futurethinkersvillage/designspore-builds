import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What's been built, what's in progress, and what's coming next at Portal.Place and Wells Gray Village.",
};

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
