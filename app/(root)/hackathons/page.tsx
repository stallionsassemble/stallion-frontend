import { HackathonsClient } from "@/components/hackathons/hackathons-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathons",
  description: "Participate in the world's best remote and in-person upcoming Web3 hackathons 2026.",
};

export default function HackathonsPage() {
  return <HackathonsClient />;
}
