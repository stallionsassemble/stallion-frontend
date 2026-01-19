'use client'

import { BountyDetailsClient } from "@/app/dashboard/bounties/[id]/bounty-details-client";
import { useParams } from "next/navigation";

export default function BountyDetailsPage() {
  const params = useParams<{ id: string }>();

  return <BountyDetailsClient id={params.id} />
}
