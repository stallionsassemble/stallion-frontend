'use client'

import { ProjectDetailsClient } from "@/app/dashboard/projects/[id]/project-details-client";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();

  return <ProjectDetailsClient id={params.id} />
}
