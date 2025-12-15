"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
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
      return "text-green-400 border-green-500/20 bg-green-500/10";
    case "Pending Review":
      return "text-orange-400 border-orange-500/20 bg-orange-500/10";
    case "Revision Requested":
      return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
    case "Rejected":
      return "text-red-400 border-red-500/20 bg-red-500/10";
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
    <div className="group rounded-xl border border-white/10 bg-[#09090B] p-5 transition-all hover:border-primary hover:bg-primary/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {/* Logo */}
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/5 p-2">
            <Image
              src={logo}
              width={48}
              height={48}
              alt={project}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-primary text-primary bg-primary/10 rounded-sm">
                Project
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-gray-400 max-w-2xl">
              {description}
            </p>

            <div className="flex items-center gap-4 pt-3 text-[10px] text-gray-500">
              <div className="flex items-center gap-1">
                <span>{project}</span>
              </div>
              <span>•</span>
              <span>Submitted {submittedAt}</span>
              <span>•</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex flex-row items-center justify-between border-t border-white/5 pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 gap-2 sm:gap-6 self-start w-full sm:w-auto">
          <Badge variant="outline" className={`h-6 px-2.5 text-xs font-medium border ${getStatusColor(status)}`}>
            {status}
          </Badge>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-2">
              <span className="text-xl font-bold text-white">{amount}</span>
              <Badge variant="secondary" className="bg-blue-500 px-1 py-0 text-[9px] text-white rounded-sm h-4">
                {type}
              </Badge>
            </div>

            <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10 p-0 sm:px-3">
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
