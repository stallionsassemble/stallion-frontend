import { projectService } from "@/lib/api/projects";
import { Metadata } from "next";
import { ProjectDetailsClient } from "./project-details-client";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const project = await projectService.getProject(id);

    if (!project) {
      return {
        title: "Project Not Found | Stallion",
      };
    }

    return {
      title: `${project.title} | Stallion`,
      description: project.shortDescription || project.description?.substring(0, 160) || "View this project on Stallion",
      openGraph: {
        title: project.title,
        description: project.shortDescription || "View this project on Stallion",
        images: [project.owner?.companyLogo || project.owner?.profilePicture || "/assets/icons/sdollar.png"],
      },
    };
  } catch (error) {
    console.error("Failed to fetch project metadata", error);
    return {
      title: "Stallion Project",
    };
  }
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetailsClient id={id} />;
}

