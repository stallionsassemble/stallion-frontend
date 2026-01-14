import { Metadata } from "next";
import { BountiesClient } from "./bounties-client";

export const metadata: Metadata = {
  title: "Browse Bounties",
  description: "Find and apply for the latest bounties.",
};

export default function BountiesPage() {
  return <BountiesClient />;
}
