import { notFound } from "next/navigation";
import AnalyticsDashboard from "@/components/dashboard/services/AnalyticsDashboard";
import ChatbotDashboard from "@/components/dashboard/services/ChatbotDashboard";
import ReviewsDashboard from "@/components/dashboard/services/ReviewsDashboard";
import MissedCallDashboard from "@/components/dashboard/services/MissedCallDashboard";
import BookingDashboard from "@/components/dashboard/services/BookingDashboard";
import LeadSourcingDashboard from "@/components/dashboard/services/LeadSourcingDashboard";
import CompetitorDashboard from "@/components/dashboard/services/CompetitorDashboard";
import SeoDashboard from "@/components/dashboard/services/SeoDashboard";
import LeadResponseDashboard from "@/components/dashboard/services/LeadResponseDashboard";
import ReputationDashboard from "@/components/dashboard/services/ReputationDashboard";
import PhoneDashboard from "@/components/dashboard/services/PhoneDashboard";

const dashboards: Record<string, React.ComponentType> = {
  "monthly-analytics": AnalyticsDashboard,
  "chatbot-setup": ChatbotDashboard,
  "review-automation": ReviewsDashboard,
  "missed-call-text-back": MissedCallDashboard,
  "appointment-booking": BookingDashboard,
  "lead-sourcing": LeadSourcingDashboard,
  "competitor-pricing-monitor": CompetitorDashboard,
  "seo-health-check": SeoDashboard,
  "lead-response-automation": LeadResponseDashboard,
  "reputation-management": ReputationDashboard,
  "phone-system": PhoneDashboard,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDashboardPage({ params }: Props) {
  const { slug } = await params;
  const Dashboard = dashboards[slug];
  if (!Dashboard) notFound();
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <Dashboard />
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(dashboards).map(slug => ({ slug }));
}
