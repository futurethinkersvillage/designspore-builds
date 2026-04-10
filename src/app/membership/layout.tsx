import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership",
  description: "Become a founding member of Portal.Place. Priority booking, members-only events, maker space access, and a real community in the BC wilderness.",
  openGraph: {
    title: "Membership — Portal.Place",
    description: "Become a founding member of Portal.Place.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
