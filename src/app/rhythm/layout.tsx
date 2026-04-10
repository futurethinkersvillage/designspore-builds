import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Village Rhythm",
  description: "Sunday gatherings at Wells Gray Village — Forest School, Builders Club, Business Meetup, Community Sauna, Golf, and Campfire. May 1 – Sep 30.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
