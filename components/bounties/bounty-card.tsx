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
}: BountyCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col shrink-0 bg-card w-full md:w-[450.93px] md:min-w-[450.93px] border border-primary shadow-sm p-5 md:py-[25.77px] md:px-[30.92px]",
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
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-primary" />
              <span>Due in {dueDate.replace('d', '')}</span>
            </div>
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
