import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founders Membership — Wells Gray Village",
  description: "Founding Membership at Wells Gray Village — a non-voting equity stake, free seasonal stays, and lifetime access. 50 spots only.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
