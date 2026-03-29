"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Hackathon } from "@/lib/types/hackathon";
import { format } from "date-fns";

interface HackathonCardProps {
  hackathon: Hackathon;
  className?: string;
}

export function HackathonCard({ hackathon, className }: HackathonCardProps) {
  const isExpired = new Date(hackathon.endDate) < new Date();
  
  return (
    <Link 
      href={`/hackathons/${hackathon.id}`}
      className={cn(
        "group relative flex flex-col bg-[#09090B] border border-white/10 rounded-xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
        className
      )}
    >
      {/* Top Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={hackathon.heroImage || "/assets/dashboardMobile.png"}
          alt={hackathon.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#09090B] via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="secondary" 
            className={cn(
              "border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
              isExpired ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
            )}
          >
            {isExpired ? "Closed" : "Open"}
          </Badge>
        </div>

        {/* Host Logo Overlay */}
        <div className="absolute -bottom-6 left-5 h-12 w-12 rounded-xl bg-[#18181B] border border-white/10 p-2 overflow-hidden flex items-center justify-center shadow-xl">
          <Image
            src={hackathon.logo || "/assets/icons/sdollar.png"}
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 pt-10 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
            {hackathon.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {hackathon.shortDescription || hackathon.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {hackathon.tags?.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-white/5 border-white/10 text-[10px] text-gray-400 font-medium px-2 py-0"
            >
              {tag}
            </Badge>
          ))}
          {hackathon.tags?.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{hackathon.tags.length - 3}
            </span>
          )}
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-4 py-2 border-y border-white/5">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>{hackathon.participantCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>
              {format(new Date(hackathon.startDate), "MMM d")} - {format(new Date(hackathon.endDate), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xl font-bold text-white">
            ${hackathon.totalPrizePool?.toLocaleString()}
          </span>
          <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-0 text-[10px] px-2 py-0">
            {hackathon.currency || "USD"}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
