"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bell,
  Briefcase,
  CircleHelp,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Trophy,
  User,
  Users,
  Wallet
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Browse Bounties",
    href: "/dashboard/bounties",
    icon: Search,
  },
  {
    title: "Browse Projects",
    href: "/dashboard/projects",
    icon: Briefcase,
  },
  {
    title: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: Trophy,
  },
  {
    title: "My Submission",
    href: "/dashboard/my-submission",
    icon: Briefcase,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    badge: 2,
  },
  {
    title: "Forums",
    href: "/dashboard/forums",
    icon: Users,
    badge: 2,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
  {
    title: "Notification",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: 2,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

import { useConversations } from "@/lib/api/chat/queries";
import { useUnreadNotificationsCount } from "@/lib/api/notifications/queries";
import { useUI } from "@/lib/store/use-ui";

// ... existing imports

interface SidebarContentProps {
  onLinkClick?: () => void;
  isCollapsed?: boolean;
}

function SidebarContent({ onLinkClick, isCollapsed = false }: SidebarContentProps) {
  const pathname = usePathname();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount();
  const { data: conversations = [] } = useConversations();

  const unreadMessagesCount = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Logo Area */}
      <div className={cn("flex h-20 items-center", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href="/" className="flex items-center gap-2" onClick={onLinkClick}>
          {isCollapsed ? (
            <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center font-bold text-primary-foreground">
              S
            </div>
          ) : (
            <Image
              src="/logo.png"
              width={120}
              height={40}
              alt="Stallion Logo"
              className="h-auto w-28 object-contain"
            />
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          // Dynamic badge logic
          let currentBadge = item.badge;
          if (item.title === "Notification" && unreadNotificationsCount > 0) {
            currentBadge = unreadNotificationsCount;
          } else if (item.title === "Notification") {
            currentBadge = undefined;
          } else if (item.title === "Messages" && unreadMessagesCount > 0) {
            currentBadge = unreadMessagesCount;
          } else if (item.title === "Messages") {
            currentBadge = undefined;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              title={isCollapsed ? item.title : undefined}
              className={cn(
                "group flex items-center rounded-lg py-2.5 text-sm font-medium font-inter transition-colors hover:bg-accent",
                isActive ? "bg-primary/40 text-foreground" : "text-muted-foreground hover:text-foreground",
                isCollapsed ? "justify-center px-0" : "justify-between px-3"
              )}
            >
              <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </div>
              {!isCollapsed && currentBadge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {currentBadge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/help"
          onClick={onLinkClick}
          title={isCollapsed ? "Get Help" : undefined}
          className={cn(
            "group flex items-center rounded-lg py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            isCollapsed ? "justify-center" : "gap-3 px-3"
          )}
        >
          <CircleHelp className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          {!isCollapsed && <span>Get Help</span>}
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUI();

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-border bg-background md:flex sticky top-0 transition-all duration-300 ease-in-out group/sidebar",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent isCollapsed={isSidebarCollapsed} />

    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-r border-border bg-background w-72">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
