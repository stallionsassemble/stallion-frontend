"use client";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, ChevronDown, DollarSign, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Helper to determine page title from pathname
  // This is a simple implementation, can be replaced with a more robust breadcrumb system
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/bounties":
        return "Browse Bounties";
      case "/dashboard/projects":
        return "Browse Projects";
      case "/dashboard/submissions":
        return "My Submission";
      case "/dashboard/messages":
        return "Messages";
      case "/dashboard/wallet":
        return "Wallet";
      case "/dashboard/notifications":
        return "Notification";
      case "/dashboard/profile":
        return "Profile";
      case "/dashboard/settings":
        return "Settings";
      default:
        // Capitalize first letter of the last segment if unknown
        const segment = path.split("/").pop();
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Dashboard";
    }
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/10 bg-[#04020E]/80 backdrop-blur-md px-4 md:px-8">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <MobileSidebar />
        <h1 className="text-xl font-medium text-white">{pageTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search - Visible on desktop */}
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search..."
            className="h-9 w-full rounded-full border-white/10 bg-white/5 pl-9 text-sm text-white placeholder:text-gray-500 focus-visible:ring-blue"
          />
        </div>

        {/* Wallet Address */}
        <div className="hidden items-center gap-2 rounded-full border border-blue bg-[#050B1C] px-3 py-1.5 md:flex">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="text-xs text-gray-400">Wallet Address</span>
          <span className="font-mono text-xs font-medium text-white">G...X4KL</span>
        </div>

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#09090B] border-white/10 text-white p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-bold">Notifications</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">2 News</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-4 border-b border-white/5 bg-[#FF3B30]/10 border-l-2 border-l-[#FF3B30]">
                <div className="flex gap-3">
                  <Badge variant="outline" className="h-6 rounded-full border-[#FF3B30]/20 bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] px-2 flex items-center gap-1 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
                    Rejected
                  </Badge>
                  <div>
                    <div className="flex justify-between items-start w-full">
                      <p className="text-sm font-medium text-white">Stallion Foundation</p>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">Jan 10, 12:00 PM</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Submitted complete 3-part video series</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-white/5 bg-[#007AFF]/20 border-l-2 border-l-[#007AFF]">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Payment Received</p>
                    <p className="text-xs text-gray-400 mt-0.5">You received 500 USDC for Summer Fashion Lookbook</p>
                    <p className="text-[10px] text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-white shrink-0 mt-1.5" />
                </div>
              </div>
              <div className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[#007AFF]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">New bounty matches your skills</p>
                    <p className="text-xs text-gray-400 mt-0.5">Techbrands - Design of new company brand guide</p>
                    <p className="text-[10px] text-gray-500 mt-1">1 day ago</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-[#007AFF] shrink-0 mt-1.5" />
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-white/10">
              <Link href="/dashboard/notifications" className="w-full">
                <Button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs h-8">
                  View all Notifications
                </Button>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 border-l border-white/10 pl-4 cursor-pointer">
              <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10">
                <Image
                  src="https://avatar.vercel.sh/tunde"
                  width={32}
                  height={32}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden items-center gap-1 md:flex">
                <span className="text-sm font-medium text-white">Tunde</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#09090B] border-white/10 text-white">
            <div className="bg-[#004085] -mt-1 -mx-1 p-3 rounded-t-md mb-2">
              <p className="text-lg font-bold text-white">Profile</p>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                Email Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/bookmarks" className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                Bookmarks
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                Get Help
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer py-2 mt-2 font-bold text-red-500 hover:text-red-400">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
