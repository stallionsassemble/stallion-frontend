"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProject } from "@/lib/api/projects/queries";
import { format } from "date-fns";
import { ArrowLeft, Briefcase, Clock, Edit, FileText, Share2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: project, isLoading } = useGetProject(id);

  if (isLoading) {
    return <div className="p-8 text-center">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Link href="/dashboard/project-owner/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1600px] mx-auto pb-20 relative">
      {/* Back Nav */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/project-owner/projects">
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <Badge className="bg-blue-600 text-white font-bold mb-4 rounded-full px-3">{project.status}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{project.title}</h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-foreground/70 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <Briefcase className="h-3 w-3 text-primary" />
                </div>
                <span className="text-foreground/70">Stallion Foundation</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">{project.peopleNeeded} Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Posted {project.createdAt ? format(new Date(project.createdAt), 'MMM dd') : ''}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {project.skills?.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="bg-primary/20 text-foreground hover:bg-primary/20 border-0 px-3 py-1">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
              <CardContent className="p-4 h-full flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Applications</p>
                  <h3 className="text-2xl font-bold text-white">{project.applications?.length || 0}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
              <CardContent className="p-4 h-full flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Hired</p>
                  <h3 className="text-2xl font-bold text-white">{project.acceptedCount || 0}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-[1.17px] border-border h-[100px] relative overflow-hidden group">
              <CardContent className="p-4 h-full flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Budget</p>
                  <h3 className="text-2xl font-bold text-white">{project.reward}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <div className="text-xs font-bold text-slate-400">{project.currency}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 text-slate-300">
            <h3 className="text-xl font-bold text-white">Description</h3>
            <p className="whitespace-pre-wrap">{project.description}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
