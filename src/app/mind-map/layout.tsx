import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision Mind Map",
  description:
    "An interactive map of the Portal.Place vision — 400 acres, a network of villages, and an experiment in how a resilient civilization could work.",
};

export default function MindMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
