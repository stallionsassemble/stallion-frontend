"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface DetailsNavigationProps {
  backLink: string;
  backText: string;
  appliedUser?: string[]
}

export function DetailsNavigation({ backLink, backText, appliedUser = [] }: DetailsNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      {/* Back Button */}
      <Link
        href={backLink}
        className="inline-flex items-center gap-2 bg-card border-[0.69px] border-primary hover:bg-card/90 text-foreground text-xs font-medium px-4 py-2 rounded-lg transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backText}
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Avatar Stack */}
        {appliedUser && appliedUser.length > 0 && (
          <div className="flex -space-x-3 mr-2">
            {appliedUser.map((user, index) => (
              <div key={`${user}-${index}`} className="h-9 w-9 rounded-full border-2 border-background bg-white flex items-center justify-center relative z-10 overflow-hidden">
                <Image src={user || '/assets/icons/sdollar.png'} width={36} height={36} alt="Applicant" className="object-cover h-full w-full" />
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" className="bg-card border border-border hover:bg-muted text-foreground text-sm h-10 px-4 rounded-xl gap-2">
          <Bookmark className="h-4 w-4" />
          Bookmark
        </Button>

        <Button
          variant="outline"
          className="bg-card border border-border hover:bg-muted text-foreground text-sm h-10 px-4 rounded-xl gap-2 active:scale-95 transition-transform"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
          }}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
