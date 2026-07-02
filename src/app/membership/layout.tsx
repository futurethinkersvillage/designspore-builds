import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founders Membership — Wells Gray Village",
  description: "Join the founding circle at Wells Gray Village — 400 acres bordering Wells Gray Provincial Park. A non-voting equity stake, free seasonal stays, and a home base for life. 50 spots only.",
  openGraph: {
    title: "Founders Membership — Wells Gray Village",
    description: "50 founding spots. A non-voting equity stake, free seasonal stays, and a home base for life at Wells Gray Village, BC.",
  },
  twitter: {
    title: "Founders Membership — Wells Gray Village",
    description: "50 founding spots. A non-voting equity stake, free seasonal stays, and a home base for life at Wells Gray Village, BC.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
