import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Tour",
  description:
    "Interactive tour of the Wells Gray Golf & RV Resort property — existing operations and planned expansion. Toggle layers and backdrops.",
};

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
