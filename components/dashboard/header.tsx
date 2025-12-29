"use client";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, DollarSign, PanelLeft, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/use-auth";

export function Header() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

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
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
      {/* Left: Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger (Hidden on Desktop) */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        {/* Desktop Sidebar Toggle (PanelLeft) */}
        <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground">
          <PanelLeft className="h-5 w-5" />
        </Button>

        {/* Vertical Separator */}
        <div className="hidden md:block h-6 w-px bg-border"></div>

        {/* Page Title */}
        <h1 className="text-lg md:text-xl font-medium text-muted-foreground">{pageTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground border border-white/20 rounded-[8px] w-9 h-9">
          <Search className="h-4 w-4" />
        </Button>

        {/* Wallet Address Button - Hidden as per design */}
        {/* <button className="hidden md:flex items-center gap-3 rounded-full border border-background bg-transparent px-4 py-2 transition-colors hover:bg-muted/50">
          <div className="h-2 w-2 rounded-full bg-background"></div>
          <span className="text-sm font-medium text-muted-foreground">Wallet Address</span>
          <span className="text-sm font-medium text-muted-foreground/50">G...X4KL</span>
        </button> */}

        {/* Theme Toggle - Hidden as per design */}
        {/* <ThemeToggle /> */}

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0066FF] border border-background"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] bg-popover border-border text-popover-foreground p-0 shadow-2xl flex flex-col rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/[0.08]">
              <span className="font-bold text-base">Notifications</span>
              <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full border border-border">2 News</span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] py-2 flex flex-col gap-2">
              {/* Payment Received Notification - Blue Highlight */}
              <div className="w-[290px] h-[60px] mx-auto px-3 rounded-lg bg-primary text-primary-foreground flex gap-3 items-center relative group cursor-pointer transition-transform active:scale-[0.98] shrink-0">
                {/* Icon */}
                <div className="h-8 w-8 rounded-full border border-primary-foreground/30 flex items-center justify-center shrink-0">
                  <DollarSign className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center w-full">
                    <h5 className="text-[12px] font-bold leading-none truncate pr-2">Payment Received</h5>
                    <span className="text-[9px] opacity-80 shrink-0">2h ago</span>
                  </div>
                  <p className="text-[10px] opacity-90 font-light truncate leading-tight mt-1">You received 500 USDC for Summer...</p>
                </div>

                {/* Dot */}
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground shrink-0" />
              </div>

              {/* Generic Notification 1 */}
              <div className="w-[290px] h-[60px] mx-auto px-3 rounded-lg hover:bg-muted/50 transition-colors flex gap-3 items-center relative group cursor-pointer shrink-0">
                {/* Icon */}
                <div className="h-8 w-8 relative shrink-0 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <div className="absolute -bottom-0.5 -right-0.5 text-[8px]">⭐</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center w-full">
                    <h5 className="text-[12px] font-bold text-foreground leading-none truncate pr-2">New bounty matches your...</h5>
                    <span className="text-[9px] text-muted-foreground shrink-0">1d ago</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-light truncate leading-tight mt-1">Techbrands - Design of new company...</p>
                </div>

                {/* Dot */}
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              </div>

              {/* Generic Notification 2 */}
              <div className="w-[290px] h-[60px] mx-auto px-3 rounded-lg hover:bg-muted/50 transition-colors flex gap-3 items-center relative group cursor-pointer shrink-0">
                {/* Icon */}
                <div className="h-8 w-8 relative shrink-0 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <div className="absolute -bottom-0.5 -right-0.5 text-[8px]">⭐</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center w-full">
                    <h5 className="text-[12px] font-bold text-foreground leading-none truncate pr-2">New bounty matches your...</h5>
                    <span className="text-[9px] text-muted-foreground shrink-0">1d ago</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-light truncate leading-tight mt-1">Techbrands - Design of new company...</p>
                </div>

                {/* Dot */}
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              </div>

              {/* Generic Notification 3 */}
              <div className="w-[290px] h-[60px] mx-auto px-3 rounded-lg hover:bg-muted/50 transition-colors flex gap-3 items-center relative group cursor-pointer shrink-0">
                {/* Icon */}
                <div className="h-8 w-8 relative shrink-0 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <div className="absolute -bottom-0.5 -right-0.5 text-[8px]">⭐</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center w-full">
                    <h5 className="text-[12px] font-bold text-foreground leading-none truncate pr-2">New bounty matches your...</h5>
                    <span className="text-[9px] text-muted-foreground shrink-0">1d ago</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-light truncate leading-tight mt-1">Techbrands - Design of new company...</p>
                </div>

                {/* Dot */}
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              </div>
            </div>

            {/* Footer */}
            <div className="p-0 border-t border-border">
              <Link href="/dashboard/notifications" className="block w-full">
                <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium h-10 rounded-none">
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
              <div className="h-9 w-9 overflow-hidden rounded-full border border-border transition-colors group-hover:border-primary/50">
                <Image
                  src={user?.profilePicture || `https://avatar.vercel.sh/${user?.firstName}`}
                  width={36}
                  height={36}
                  alt={user?.firstName || "User"}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {user?.firstName}
                <ChevronDown className="h-4 w-4" />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground font-inter mt-2">
            <div className="bg-primary -mt-1 -mx-1 p-3 rounded-t-md mb-2">
              <p className="text-sm font-medium text-primary-foreground">Profile</p>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="focus:bg-accent focus:text-accent-foreground cursor-pointer py-2">
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="focus:bg-accent focus:text-accent-foreground cursor-pointer py-2">
                Email Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/bookmarks" className="focus:bg-accent focus:text-accent-foreground cursor-pointer py-2">
                Bookmarks
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="focus:bg-accent focus:text-accent-foreground cursor-pointer py-2">
                Get Help
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer py-2" asChild>
              <button onClick={logout}>Logout</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
