import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Village AI",
  description: "An AI layer built into the village itself — guest orientation, local intelligence, community coordination. Coming to Portal.Place.",
};

export default function VillageAILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
