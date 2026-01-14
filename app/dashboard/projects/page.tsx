import { Metadata } from "next";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Browse Projects",
  description: "Explore diverse projects and find your next collaboration.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
