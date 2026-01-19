"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface BountyCardProps {
  id: string | number;
  title: string;
  description: string;
  company: string;
  logo: string;
  amount: string;
  type: "USDC" | "XLM" | "EURC";
  tags: string[];
  participants: number;
  dueDate: string;
  isVerified?: boolean;
  className?: string;
  version?: "BOUNTY" | "PROJECT";
  status?: "Active" | "In Progress" | "Completed" | "Draft" | "Judging" | "Hiring";
  progress?: number;
  hired?: boolean;
  submissions?: number;
}

export function BountyCard({
  id,
  title,
  description,
  company,
  logo,
  amount,
  type,
  tags,
  participants,
  dueDate,
  className,
  version = "BOUNTY",
  status,
  progress,
  hired,
  submissions,
}: BountyCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col shrink-0 bg-background w-full md:w-[450.93px] md:min-w-[450.93px] border border-primary shadow-sm p-5 md:py-[25.77px] md:px-[30.92px]",
        className
      )}
      style={{
        minHeight: "258.19px",
        gap: "10.31px",
        borderRadius: "9.58px",
        borderWidth: "0.8px",
      }}
    >
      {/* 1. Header: Logo + Company */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full bg-background flex items-center justify-center">
            <Image
              src={logo}
              width={48}
              height={48}
              alt={company}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg text-muted-foreground font-inter font-medium">{company}</span>
        </div>

        {/* Status Badge (Owner View) */}
        {status && (
          <div className="flex gap-2">
            {status === "In Progress" && <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0 rounded-sm text-[10px] px-1.5">{version}</Badge>}
            <Badge variant="secondary" className="bg-[#1E1E1E] text-[#9CA3AF] hover:bg-[#2A2A2A] border-0 rounded-md text-[10px] font-medium px-2 py-0.5 uppercase tracking-wide">
              {status}
            </Badge>
          </div>
        )}
      </div>

      {/* 2. Main Content */}
      <div className="flex flex-col gap-2 mt-2">
        <Link href={`${version === "BOUNTY" ? "/dashboard/bounties" : "/dashboard/projects"}/${id}`} className="block">
          <h3 className="text-xl font-inter font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-[12px] font-inter text-muted-foreground font-light leading-relaxed">
          {description}
        </p>
      </div>

      {/* 3. Price Amount */}
      <div className="flex items-center gap-3 mt-1">
        <span className="text-[24px] leading-[46px] font-inter font-bold text-foreground">{amount}</span>
        <Badge className="bg-primary hover:bg-primary text-primary-foreground border-0 rounded-[5606.55px] px-3 py-1 text-xs font-medium font-inter text-[10px]">
          {type}
        </Badge>
      </div>

      {/* Progress Bar (Owner View) */}
      {status === 'In Progress' && (
        <div className="w-full h-1 bg-[#1E293B] rounded-full mb-2 overflow-hidden">
          <div className="h-full bg-blue-600 w-1/3 rounded-full" />
          <div className="mt-1 text-[10px] text-slate-500 font-medium hidden">Milestone 1</div> {/* Hidden label to match visual simplicity if needed */}
        </div>
      )}

      {/* 4. Footer: Tags/Meta & Button */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col gap-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/30 text-foreground border-[0.54px] border-primary/20 rounded-[5606.55px] px-2 py-0.5 text-[8px] font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-primary" />
              <span>{participants}</span>
            </div>
            {submissions !== undefined && (
              <div className="flex items-center gap-2">
                <Image src="/assets/icons/files.svg" alt="subs" width={14} height={14} className="opacity-60" />
                <span className="text-xs">{submissions} Submissions</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-primary" />
              <span>{dueDate.includes('Ended') ? 'Ended' : `Due in ${dueDate.replace('d', '')}`}</span>
            </div>
            {hired && <span className="text-green-500 text-xs flex items-center gap-1">• Hired</span>}
          </div>
        </div>

        {/* Action Button */}
        <Link href={`${version === "BOUNTY" ? "/dashboard/bounties" : "/dashboard/projects"}/${id}`}>
          <Button
            size="icon"
            className="h-11 w-11 py-[4.85px] rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <ChevronRight className="h-full w-full" strokeWidth={3} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
