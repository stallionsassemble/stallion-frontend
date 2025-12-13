"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users } from "lucide-react";
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
    <div className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-[#09090B] p-5 transition-all hover:border-[#007AFF] hover:bg-[#007AFF]/5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        {/* Logo */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/5 p-2">
          <Image
            src={logo}
            width={48}
            height={48}
            alt={company}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">{company}</span>
              {/* Verified Badge could go here */}
            </div>
            <Link href={`/dashboard/bounties/${id}`} className="block">
              <h3 className="text-lg font-bold text-white group-hover:text-[#007AFF] transition-colors">
                {title}
              </h3>
            </Link>
          </div>

          <p className="line-clamp-2 text-sm text-gray-400 max-w-xl">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0 rounded-md px-2 py-0.5 text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{participants} Applied</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Due in {dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side / Layout */}
      <div className="flex flex-row items-center justify-between border-t border-white/5 pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{amount}</span>
            <Badge variant="outline" className="border-[#007AFF] text-[#007AFF] bg-[#007AFF]/10 h-5 px-1.5 text-[10px]">
              {type}
            </Badge>
          </div>
        </div>

        <Link href={`/dashboard/bounties/${id}`}>
          <Button size="icon" className="h-10 w-10 rounded-full bg-[#007AFF] text-white hover:bg-[#0066CC]">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
