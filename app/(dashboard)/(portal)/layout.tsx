import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DemoBanner from "@/components/dashboard/DemoBanner";
import { DemoQueueProvider } from "@/components/dashboard/DemoQueueProvider";
import Link from "next/link";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("ds_demo");
  const isDemo =
    !!process.env.DEMO_SECRET && demoCookie?.value === process.env.DEMO_SECRET;

  if (!isDemo) {
    const session = await auth();
    if (!session) redirect("/login");

    // Account exists but payment hasn't completed yet
    const isActive = (session.user as { isActive?: boolean }).isActive;
    if (!isActive) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-darker px-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3">Almost there</p>
              <h1 className="text-2xl font-bold text-white mb-2">Payment pending</h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Your account was created but we haven&apos;t received payment yet. If you just completed checkout,
                it may take a moment — try refreshing. If something went wrong, you can restart checkout below.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="inline-block px-6 py-3 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
              >
                Restart checkout
              </Link>
              <Link
                href="/login"
                className="text-sm text-white/30 hover:text-white transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  const inner = (
    <div className="flex flex-col min-h-screen bg-dark">
      {isDemo && <DemoBanner />}
      <div className="flex flex-1 min-h-0">
        <Sidebar isDemo={isDemo} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar isDemo={isDemo} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );

  return isDemo ? <DemoQueueProvider>{inner}</DemoQueueProvider> : inner;
}
