"use client";

import { Badge } from "@/components/ui/badge";
import { DollarSign, User } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400">
          2 Unread
        </Badge>
      </div>

      <div className="space-y-2 max-w-2xl">
        <div className="p-4 rounded-xl border border-white/10 bg-[#FF3B30]/10 border-l-2 border-l-[#FF3B30]">
          <div className="flex gap-4">
            <Badge variant="outline" className="h-6 w-20 justify-center rounded-full border-[#FF3B30]/20 bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] flex items-center gap-1 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              Rejected
            </Badge>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-white">Stallion Foundation</p>
                <span className="text-[10px] text-gray-400">Jan 10, 12:00 PM</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Submitted complete 3-part video series</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-primary/10 border-l-2 border-l-primary">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-white">Payment Received</p>
                <span className="text-[10px] text-gray-400">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">You received 500 USDC for Summer Fashion Lookbook</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#09090B] hover:bg-white/5 transition-colors">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-white">New bounty matches your skills</p>
                <span className="text-[10px] text-gray-400">1 day ago</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Techbrands - Design of new company brand guide</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#09090B] hover:bg-white/5 transition-colors">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-white">New bounty matches your skills</p>
                <span className="text-[10px] text-gray-400">1 day ago</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Techbrands - Design of new company brand guide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
