"use client";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, DollarSign, PanelLeft, Search, User } from "lucide-react";
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
      {/* Left: Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger (Hidden on Desktop) */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        {/* Desktop Sidebar Toggle (PanelLeft) */}
        <Button variant="ghost" size="icon" className="hidden md:flex text-gray-400 hover:text-white">
          <PanelLeft className="h-5 w-5" />
        </Button>

        {/* Vertical Separator */}
        <div className="hidden md:block h-6 w-px bg-white/10"></div>

        {/* Page Title */}
        <h1 className="text-lg md:text-xl font-medium text-gray-400">{pageTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white border border-white/10 rounded-md w-10 h-10">
          <Search className="h-5 w-5" />
        </Button>

        {/* Wallet Address Button */}
        <button className="hidden md:flex items-center gap-3 rounded-full border border-[#007AFF] bg-transparent px-4 py-2 transition-colors hover:bg-[#007AFF]/10">
          <div className="h-2 w-2 rounded-full bg-[#007AFF]"></div>
          <span className="text-sm font-medium text-gray-400">Wallet Address</span>
          <span className="text-sm font-medium text-white/50">G...X4KL</span>
        </button>

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[312px] h-[425px] bg-[#020617] border-white/10 text-white p-0 shadow-2xl flex flex-col gap-[10px]">
            <div
              className="flex items-center justify-between px-[10px] h-[30px] w-full bg-primary/8 rounded-[6.2px] shrink-0"
              style={{ border: "0.77px solid #007AFF5C" }}
            >
              <span className="font-bold text-xs">Notifications</span>
              <span className="text-[10px] bg-primary/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">2 News</span>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-[10px] p-[10px]">

              {/* Payment Received Notification - Blue Highlight */}
              <div className="w-[290px] h-[60px] mx-auto p-[10px] rounded-[5px] bg-primary flex justify-between items-center group relative shrink-0">
                <div className="flex gap-3 items-center w-full">
                  <div className="h-full w-full rounded-full bg-primary/8 flex items-center justify-center border border-primary/20">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-bold text-white leading-none truncate pr-2">Payment Received</p>
                      <span className="text-[9px] text-white/80 shrink-0">2h ago</span>
                    </div>
                    <p className="text-[10px] text-white/90 font-light truncate leading-tight mt-1">You received 500 USDC for Summer...</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-white shrink-0 self-center" />
                </div>
              </div>

              {/* Generic Notification 1 */}
              <div className="w-[290px] h-[60px] mx-auto p-[10px] rounded-[5px] hover:bg-white/5 transition-colors flex justify-between items-center group relative shrink-0">
                <div className="flex gap-3 items-center w-full">
                  <div className="h-8 w-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center shrink-0 text-primary relative">
                    <User className="h-4 w-4" />
                    <div className="absolute bottom-0 right-0 text-[6px]">⭐</div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-bold text-white leading-none truncate pr-2">New bounty matches</p>
                      <span className="text-[9px] text-gray-500 shrink-0">1d ago</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-light truncate leading-tight mt-1">Techbrands - Design of new...</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                </div>
              </div>

              {/* Generic Notification 2 */}
              <div className="w-[290px] h-[60px] mx-auto p-[10px] rounded-[5px] hover:bg-white/5 transition-colors flex justify-between items-center group relative shrink-0">
                <div className="flex gap-3 items-center w-full">
                  <div className="h-8 w-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center shrink-0 text-primary relative">
                    <User className="h-4 w-4" />
                    <div className="absolute bottom-0 right-0 text-[6px]">⭐</div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-bold text-white leading-none truncate pr-2">New bounty matches</p>
                      <span className="text-[9px] text-gray-500 shrink-0">1d ago</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-light truncate leading-tight mt-1">Techbrands - Design of new...</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                </div>
              </div>

              {/* Generic Notification 3 */}
              <div className="w-[290px] h-[60px] mx-auto p-[10px] rounded-[5px] hover:bg-white/5 transition-colors flex justify-between items-center group relative shrink-0">
                <div className="flex gap-3 items-center w-full">
                  <div className="h-8 w-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center shrink-0 text-primary relative">
                    <User className="h-4 w-4" />
                    <div className="absolute bottom-0 right-0 text-[6px]">⭐</div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-bold text-white leading-none truncate pr-2">New bounty matches</p>
                      <span className="text-[9px] text-gray-500 shrink-0">1d ago</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-light truncate leading-tight mt-1">Techbrands - Design of new...</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
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
            <div className="flex items-center gap-3 cursor-pointer group">
              {/* Blue dot indicator for profile? Image has a blue dot floating? Or maybe it's spacing. */}
              {/* Actually image shows a blue dot between wallet and profile? "•" or just alignment? */}
              {/* I'll skip the random dot. */}
              <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 transition-colors group-hover:border-white/30">
                <Image
                  src="https://avatar.vercel.sh/tunde"
                  width={36}
                  height={36}
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Tunde</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#09090B] border-white/10 text-white font-inter mt-2">
            <div className="bg-[#004085] -mt-1 -mx-1 p-3 rounded-t-md mb-2">
              <p className="text-sm font-medium text-white">Profile</p>
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
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
