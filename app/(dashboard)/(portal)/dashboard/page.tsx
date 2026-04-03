export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  console.log("[dashboard-page] REACHED - no auth check");
  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>Dashboard Debug - If you see this, routing works!</h1>
    </div>
  );
}
