"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, Gift, MessageSquare, Timer, Users } from "lucide-react";
import Image from "next/image";

interface DetailsHeaderProps {
  type: "BOUNTY" | "PROJECT";
  title: string;
  company: string;
  logo: string;
  participants: number;
  dueDate: string;
  tags: string[];
  status?: string;
  commentsCount?: number;
}

export function DetailsHeader({
  type,
  title,
  company,
  logo,
  participants,
  dueDate,
  tags,
  status = "Submission Open",
  commentsCount = 20,
}: DetailsHeaderProps) {
  const isProject = type === "PROJECT";

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 font-inter">
      {/* Logo */}
      <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full bg-white flex items-center justify-center border border-white/10">
        <Image src={logo} width={80} height={80} alt={company} className="object-contain h-full w-full" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{title}</h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>{company}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{participants}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Due in {dueDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            <span>{status}</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>{commentsCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span>{isProject ? "Project" : "Bounty"}</span>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#113264] hover:bg-[#113264]/90 text-white border-0 rounded-full px-4 py-1 text-xs font-medium transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
