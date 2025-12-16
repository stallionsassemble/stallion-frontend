"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DetailsNavigationProps {
  backLink: string;
  backText: string;
}

export function DetailsNavigation({ backLink, backText }: DetailsNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      {/* Back Button */}
      <Link
        href={backLink}
        className="inline-flex items-center gap-2 bg-[#09090B] border-[0.69px] border-primary hover:bg-white/5 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backText}
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Avatar Stack */}
        <div className="flex -space-x-3 mr-2">
          <div className="h-9 w-9 rounded-full border-2 border-[#09090B] bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden relative z-30" />
          <div className="h-9 w-9 rounded-full border-2 border-[#09090B] bg-gradient-to-br from-yellow-400 to-orange-500 overflow-hidden relative z-20" />
          <div className="h-9 w-9 rounded-full border-2 border-[#09090B] bg-white flex items-center justify-center relative z-10">
            <Image src="/assets/icons/sdollar.png" width={20} height={20} alt="Stallion" className="object-contain" />
          </div>
        </div>

        <Button variant="outline" className="bg-[#09090B] border border-white/10 hover:bg-white/5 text-white text-sm h-10 px-4 rounded-xl gap-2">
          <Bookmark className="h-4 w-4" />
          Bookmark
        </Button>

        <Button variant="outline" className="bg-[#09090B] border border-white/10 hover:bg-white/5 text-white text-sm h-10 px-4 rounded-xl gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
