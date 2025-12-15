"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  User,
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

interface SidebarContentProps {
  onLinkClick?: () => void;
}

function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#04020E]">
      {/* Logo Area */}
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onLinkClick}>
          <Image
            src="/logo.png"
            width={120}
            height={40}
            alt="Stallion Logo"
            className="h-auto w-28 object-contain"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-3 text-[20px] leading-[29px] font-normal font-inter transition-colors hover:bg-white/5",
                isActive ? "bg-[#007AFF66] text-white" : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/help"
          onClick={onLinkClick}
          className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <CircleHelp className="h-5 w-5 text-gray-400 group-hover:text-white" />
          <span>Get Help</span>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-white/10 bg-[#04020E] md:flex sticky top-0">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-r border-white/10 bg-[#04020E] w-72">
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
