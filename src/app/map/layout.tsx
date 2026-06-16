import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Development Map",
  description:
    "Interactive development master plan for the Wells Gray Golf & RV Resort property — existing operations and planned expansion. Toggle layers and backdrops.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
