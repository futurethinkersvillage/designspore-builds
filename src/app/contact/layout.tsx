import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Mike Gilliland at Portal.Place. Visit inquiries, membership questions, investment interest, media, and general contact.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
