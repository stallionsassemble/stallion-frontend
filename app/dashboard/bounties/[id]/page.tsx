import { bountyService } from "@/lib/api/bounties";
import { Metadata } from "next";
import { BountyDetailsClient } from "./bounty-details-client";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const bounty = await bountyService.getBounty(id);

    if (!bounty) {
      return {
        title: "Bounty Not Found | Stallion",
      };
    }

    return {
      title: `${bounty.title} | Stallion`,
      description: bounty.shortDescription || bounty.description?.substring(0, 160) || "View this bounty on Stallion",
      openGraph: {
        title: bounty.title,
        description: bounty.shortDescription || "View this bounty on Stallion",
        images: [bounty.owner?.companyLogo || bounty.owner?.profilePicture || "/assets/icons/sdollar.png"],
      },
    };
  } catch (error) {
    console.error("Failed to fetch bounty metadata", error);
    return {
      title: "Stallion Bounty",
    };
  }
}

export default async function BountyDetailsPage({ params }: Props) {
  const { id } = await params;
  return <BountyDetailsClient id={id} />;
}
