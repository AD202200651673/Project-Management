import { DashboardHome } from "@/features/dashboard";

export const metadata = {
  title: "Dashboard | Project Management",
  description: "Project management dashboard with metrics and recent tasks",
};

export default function HomePage() {
  return <DashboardHome />;
}
