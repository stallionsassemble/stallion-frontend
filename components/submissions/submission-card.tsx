"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, CircleCheckBig, Eye, Timer } from "lucide-react";
import Image from "next/image";

export type SubmissionStatus = "Approved" | "Pending Review" | "Revision Requested" | "Rejected" | "Draft";

export interface SubmissionCardProps {
  id: string | number;
  project: string;
  title: string;
  description: string;
  logo: string;
  amount: string;
  type: "USDC" | "SOL" | "USD";
  status: SubmissionStatus;
  submittedAt: string;
  lastUpdated: string;
}

const getStatusColor = (status: SubmissionStatus) => {
  switch (status) {
    case "Approved":
      return "text-[#86EAD4] border-green/11 bg-[#FFFFFF29]";
    case "Pending Review":
      return "text-[#FFD19A] border-orange/5 bg-[#FFFFFF29]";
    case "Revision Requested":
      return "text-[#ABC978] border-[#ABC978] bg-white/16";
    case "Rejected":
      return "text-red/10 border-[#DC3E42] bg-[#C8292929]";
    default:
      return "text-gray-400 border-gray-500/20 bg-gray-500/10";
  }
};

export function SubmissionCard({
  id,
  project,
  title,
  description,
  logo,
  amount,
  type,
  status,
  submittedAt,
  lastUpdated,
}: SubmissionCardProps) {
  return (
    <div className="group rounded-xl border-[0.77px] border-[#007AFF] bg-[#04020E] p-5 transition-all">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {/* Logo */}
          <div className="h-19 w-19 shrink-0 overflow-hidden rounded-full bg-white/5 p-2">
            <Image
              src={logo}
              width={76}
              height={76}
              alt={project}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="h-5 px-1.5 font-inter font-medium text-[8px] border-[#113264] border-[0.54px] text-white bg-[#113264] rounded-full">
                Project
              </Badge>
            </div>
            <h3 className="text-lg font-bold font-inter text-[#FAFAFAE5] transition-colors">
              {title}
            </h3>
            <p className="line-clamp-2 break-all font-inter font-light text-[10px] text-[#A1A1AA]">
              {description}
            </p>

            <div className="flex items-center gap-2 pt-3 text-[8px] text-[#F5F5F5] font-inter font-extralight">
              <div className="flex items-center">
                <BriefcaseBusiness className="h-2.5 w-2.5 text-primary" />
                <span>{project}</span>
              </div>
              <Timer className="h-2.5 w-2.5 text-primary" />
              <span>Submitted {submittedAt}</span>
              <Timer className="h-2.5 w-2.5 text-primary" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex flex-row items-center justify-between border-t border-white/5 pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 gap-2 sm:gap-6 self-start w-full sm:w-auto">
          <Badge variant="outline" className={`h-6 px-2.5 text-[8px] font-inter font-medium border-[0.54px] ${getStatusColor(status)}`}>
            <CircleCheckBig />
            {status}
          </Badge>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-2">
              <span className="text-xl font-inter font-bold text-white/90">{amount}</span>
              <Badge variant="secondary" className="bg-blue-500 px-1 py-0 text-[9px] text-[#F5F5F5] rounded-sm h-4">
                {type}
              </Badge>
            </div>

            <Button variant="ghost" size="sm" className="h-8 gap-2 font-inter text-[10px] font-medium text-primary hover:text-primary hover:bg-primary/10 p-0 sm:px-3">
              <Eye className="h-3 w-3" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
}
