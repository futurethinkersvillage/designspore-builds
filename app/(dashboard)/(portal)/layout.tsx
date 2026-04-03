export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[portal-layout] REACHED - no auth check");
  return <div>{children}</div>;
}
