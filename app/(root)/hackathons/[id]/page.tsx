import { HackathonDetailClient } from "@/components/hackathons/hackathon-detail-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon Details",
  description: "View hackathon details, prize pools, and requirements.",
};

export default function HackathonPage({ params }: { params: { id: string } }) {
  return <HackathonDetailClient id={params.id} />;
}
