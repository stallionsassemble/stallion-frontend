"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  type: "USDC" | "SOL" | "USD";
  tags: string[];
  participants: number;
  dueDate: string;
  isVerified?: boolean;
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
}: BountyCardProps) {
  return (
    <div
      className="group relative flex flex-col shrink-0 bg-card"
      style={{
        minWidth: "450px",
        flex: "1 1 450px",
        minHeight: "303.1px",
        gap: "10.31px",
        paddingTop: "25.77px",
        paddingRight: "30.92px",
        paddingBottom: "25.77px",
        paddingLeft: "30.92px",
        borderRadius: "9.58px",
        borderWidth: "0.8px",
        borderColor: "#007AFF",
        boxShadow: "0px 4px 4px 0px #00000040",
      }}
    >
      {/* 1. Header: Logo + Company */}
      <div className="flex items-center gap-3">
        <div className="h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full bg-white flex items-center justify-center">
          {/* Assuming logo is black on transparent, user image shows White 'S' on Dark. 
               The code previously had bg-white/5. 
               Image shows a very clear White Logo. 
               If the src is an image file, I'll render it. */}
          <Image
            src={logo}
            width={48}
            height={48}
            alt={company}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-lg text-[#94A3B8] font-inter font-medium">{company}</span>
      </div>

      {/* 2. Main Content */}
      <div className="flex flex-col gap-2 mt-2">
        <Link href={`/dashboard/bounties/${id}`} className="block">
          <h3 className="text-xl font-inter font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-[10px] font-inter text-[#94A3B8] font-light leading-relaxed">
          {description}
        </p>
      </div>

      {/* 3. Price Amount */}
      <div className="flex items-center gap-3 mt-1">
        <span className="text-[24px] leading-[46px] font-inter font-bold text-white">{amount}</span>
        <Badge className="bg-primary hover:bg-primary text-white border-0 rounded-[5606.55px] px-3 py-1 text-xs font-medium font-inter text-[10px]">
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
                className="bg-[#113264] text-white border-[0.54px] border-[#113264] rounded-[5606.55px] px-2 py-0.5 text-[8px] font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-primary" />
              <span>{participants}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-primary" />
              <span>Due in {dueDate.replace('d', '')}d</span>
              {/* ensuring '10d' format */}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/dashboard/bounties/${id}`}>
          <Button
            size="icon"
            className="h-11 w-11 py-[4.85px] rounded-full bg-primary text-white hover:bg-[#0066CC] shadow-lg shadow-blue-900/20"
          >
            <ChevronRight className="h-full w-full" strokeWidth={3} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
