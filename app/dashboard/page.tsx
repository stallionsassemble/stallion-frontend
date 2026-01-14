import { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your stats, manage bounties, and find new opportunities.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
