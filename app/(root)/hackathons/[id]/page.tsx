import { HackathonDetailClient } from "@/components/hackathons/hackathon-detail-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon Details",
  description: "View hackathon details, prize pools, and requirements.",
};

export default async function HackathonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HackathonDetailClient id={id} />;
}
