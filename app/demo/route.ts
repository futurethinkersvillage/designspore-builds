import { redirect } from "next/navigation";

export function GET() {
  redirect(`/api/demo/enter?token=${process.env.DEMO_SECRET}`);
}
