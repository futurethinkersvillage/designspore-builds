import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-darker">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Client Portal</p>
        <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
          Dashboard
        </h1>
        <p className="text-white/40 mb-2">Welcome, {session.user?.name ?? session.user?.email}</p>
        <p className="text-white/25 text-sm">Full dashboard — Phase 2</p>
      </div>
    </div>
  );
}
