"use client";

import { SearchPalette } from "@/components/dashboard/search-palette";
import * as React from "react";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/store/use-auth";
import { useUI } from "@/lib/store/use-ui";
import { Bell, ChevronDown, DollarSign, PanelLeft, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useNotifications, useUnreadNotificationsCount } from "@/lib/api/notifications/queries";
import { Notification } from "@/lib/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

// Helper for icon (duplicated locally for simplicity or could be extracted)
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'PAYMENT_RECEIVED':
      return <DollarSign className="h-4 w-4" />;
    case 'BOUNTY_MATCH':
      return <User className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export function Header() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { toggleSidebar } = useUI();

  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { data: notifications = [], isLoading: isLoadingNotifications } = useNotifications();

  // Helper to determine page title from pathname...
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/bounties":
        return "Browse Bounties";
      case "/dashboard/projects":
        return "Browse Projects";
      case "/dashboard/my-submission":
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
      case "/dashboard/forums":
        return "Community Forum";
      case "/dashboard/leaderboard":
        return "Leaderboard";
      case "/dashboard/owner/projects":
        return "Project Details";
      case "/dashboard/owner/bounties":
        return "Bounty Details";
      default:
        // Handle dynamic routes (wildcard logic)
        // Expected pattern: /dashboard/<section>/<id>
        const segments = path.split("/").filter(Boolean); // ['dashboard', 'projects', '123']

        if (segments.length >= 3 && segments[0] === 'dashboard') {
          const section = segments[1];

          if (section === 'owner') {
            const subSection = segments[2];
            if (subSection === 'bounties') return 'Bounty Details';
            if (subSection === 'projects') return 'Project Details';
          }

          switch (section) {
            case 'projects': return 'Project Details';
            case 'bounties': return 'Bounty Details';
            case 'forums': return 'Forum Discussion';
            case 'profile': return 'User Profile';
            case 'submissions': return 'Submission Details';
          }
        }

        // Fallback: Capitalize first letter of the last segment
        const lastSegment = segments[segments.length - 1];
        return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : "Dashboard";
    }
  };

  const pageTitle = getPageTitle(pathname);

  // Filter for top 5 recent notifications for the dropdown
  const recentNotifications = notifications.slice(0, 5);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
      {/* Left: Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger (Hidden on Desktop) */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        {/* Desktop Sidebar Toggle (PanelLeft) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
        >
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
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground border border-white/20 rounded-[8px] w-9 h-9"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0066FF] border border-background"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] bg-popover border-border text-popover-foreground p-0 shadow-2xl flex flex-col rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/8">
              <span className="font-bold text-base">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full border border-border">{unreadCount} New</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] py-2 flex flex-col gap-2">
              {isLoadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                recentNotifications.map((notification: Notification) => (
                  <Link href="/dashboard/notifications" key={notification.id} className="block">
                    <div className={`w-[290px] h-[60px] mx-auto px-3 rounded-lg flex gap-3 items-center relative group cursor-pointer shrink-0 transition-colors ${!notification.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}`}>
                      {/* Icon */}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'PAYMENT_RECEIVED' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-center w-full">
                          <h5 className="text-[12px] font-bold leading-none truncate pr-2 text-foreground">{notification.title}</h5>
                          <span className="text-[9px] text-muted-foreground shrink-0">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: false }).replace('about ', '')}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-light truncate leading-tight mt-1">{notification.message}</p>
                      </div>

                      {/* Dot */}
                      {!notification.isRead && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  </Link>
                ))
              )}
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
                  src={user?.companyLogo || user?.profilePicture || `https://avatar.vercel.sh/${user?.firstName}`}
                  width={36}
                  height={36}
                  alt={user?.firstName || "User"}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {user?.companyName || user?.firstName}
                <ChevronDown className="h-4 w-4" />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border text-popover-foreground font-inter mt-2">
            <div className="bg-primary -mt-1 -mx-1 p-2 rounded-t-md mb-1">
              <p className="text-xs font-medium text-primary-foreground">Profile</p>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer py-1.5">
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer py-1.5">
                Email Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/bookmarks" className="text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer py-1.5">
                Bookmarks
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer py-1.5">
                Get Help
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer py-1.5" onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SearchPalette open={open} onOpenChange={setOpen} />
    </header>
  );
}
