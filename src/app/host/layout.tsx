import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host an Event",
  description: "Host your retreat, workshop, festival, or gathering at Wells Gray Village. Submit an inquiry to bring your event to our 400-acre Smart Village in BC.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
