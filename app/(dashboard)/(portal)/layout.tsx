import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DemoBanner from "@/components/dashboard/DemoBanner";
import { DemoQueueProvider } from "@/components/dashboard/DemoQueueProvider";

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
  }

  const inner = (
    <div className="flex flex-col min-h-screen bg-dark">
      {isDemo && <DemoBanner />}
      <div className="flex flex-1 min-h-0">
        <Sidebar isDemo={isDemo} />
        <div className="flex flex-col flex-1 min-w-0">
          <Topbar isDemo={isDemo} />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );

  return isDemo ? <DemoQueueProvider>{inner}</DemoQueueProvider> : inner;
}
