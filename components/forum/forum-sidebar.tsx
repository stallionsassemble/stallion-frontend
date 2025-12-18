"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RelatedDiscussion {
  id: string;
  title: string;
  replies: number;
  category: string;
}

export function ForumSidebar() {
  const relatedDiscussions: RelatedDiscussion[] = [
    { id: "1", title: "Advanced Soroban patterns for DeFi apps", replies: 23, category: "Smart Contracts" },
    { id: "2", title: "Advanced Soroban patterns for DeFi apps", replies: 23, category: "Smart Contracts" },
    { id: "3", title: "Advanced Soroban patterns for DeFi apps", replies: 23, category: "Smart Contracts" },
    { id: "4", title: "Advanced Soroban patterns for DeFi apps", replies: 23, category: "Smart Contracts" },
  ];

  return (
    <div className="hidden lg:block space-y-6 w-[471px] shrink-0 font-inter">
      {/* Author Card */}
      <Card className="bg-card border-primary/50 py-[12.85px] border-[0.68px] px-[19.77px] rounded-[10px] w-[471px] h-[177.81px] flex flex-col justify-between shadow-sm">
        <div className="flex flex-col items-start space-y-2">
          <div className="h-[52px] w-[52px] rounded-full overflow-hidden border-2 border-primary/20 bg-primary/20">
            <Image
              src="https://avatar.vercel.sh/stallion"
              width={52}
              height={52}
              alt="Stallion Foundation"
              className="object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[16px] font-bold text-foreground leading-tight">Stallion Foundation</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">@stellardev</span>
              <Badge variant="outline" className="text-[6px] h-4 px-2 bg-orange-700/30 text-foreground border-none flex items-center gap-1 rounded-full capitalize">
                <Users className="h-2.5 w-2.5" />
                Admin
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 -mt-[15px]">
          <div className="bg-primary/20 p-[10px] rounded-[10px] text-center space-y-0.5 w-full h-[50px]">
            <p className="text-[16px] font-extrabold text-foreground font-inter">46</p>
            <p className="text-[8px] text-muted-foreground font-light tracking-tight">Posts</p>
          </div>
          <div className="bg-primary/20 p-[10px] rounded-[10px] text-center w-full h-[50px]">
            <p className="text-[16px] font-extrabold text-foreground font-inter">156</p>
            <p className="text-[8px] text-muted-foreground font-light tracking-tight -mt-1">Replies</p>
          </div>
          <div className="bg-primary/20 p-[10px] rounded-[10px] text-center space-y-0.5 w-full h-[50px]">
            <p className="text-[16px] font-extrabold text-foreground font-inter">2.1k</p>
            <p className="text-[8px] text-muted-foreground font-light tracking-tight -mt-1">Likes</p>
          </div>
        </div>
      </Card>

      {/* Related Discussions */}
      <Card className="bg-card border-primary/50 border-[0.68px] py-[12.85px] px-[10px] rounded-[12px] space-y-0">
        <h4 className="text-[16px] font-medium text-foreground font-inter leading-none mb-1">Related Discussions</h4>
        <div className="space-y-[3px]">
          {relatedDiscussions.map((discussion) => (
            <Link key={discussion.id} href={`/dashboard/forums/${discussion.id}`} className="block group">
              <div className="bg-transparent border-primary/25 border p-3 group-hover:bg-primary/5 transition-all rounded-[12px] space-y-1.5 w-full">
                <Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[6px] h-3 px-2 font-medium">
                  {discussion.category}
                </Badge>
                <h5 className="text-[14px] font-medium font-inter text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                  {discussion.title}
                </h5>
                <div className="flex items-center gap-2 text-[10px] font-inter text-muted-foreground font-light">
                  <MessageSquare className="h-2 w-2 text-primary" />
                  <span className="text-muted-foreground">{discussion.replies} replies</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Popular Tags */}
      <Card className="bg-card border-primary/50 border-[0.68px] py-[12.85px] px-[10px] rounded-[10px] -space-y-3.5">
        <h4 className="text-[16px] font-medium text-foreground font-inter">Popular Tags</h4>
        <div className="flex flex-wrap gap-[4px]">
          {["Smart Contracts", "Smart Contracts", "Smart Contracts", "Smart Contracts"].map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="bg-primary/20 border-none text-foreground font-inter text-[10px] h-6 px-4 font-medium rounded-full cursor-pointer hover:bg-primary/30 transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
