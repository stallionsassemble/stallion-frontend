"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/store/use-auth";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, accessToken, isAuthenticated, checkAuth, logout } = useAuth();
  // The session is stored in the browser, so render the signed-out state until we have mounted.
  // This avoids a hydration mismatch and a flash of the wrong buttons.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useEffect(() => {
    if (useAuth.getState().accessToken) void checkAuth();
  }, [checkAuth]);

  const signedIn = mounted && Boolean(accessToken) && (isAuthenticated || Boolean(user));
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Account";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.refresh();
  };

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/#why-us", label: "Why Us" },
    { href: "/hackathons", label: "Hackathons" },
    { href: "/#bounties", label: "Bounties" },
    { href: "/#faqs", label: "FAQs" },
  ];

  return (
    <header className="top-0 z-50 w-full ">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            width={140}
            height={50}
            alt="Stallion Logo"
            className="h-auto w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {signedIn ? (
            <>
              <Button asChild className="bg-white text-black hover:bg-gray-200 font-semibold">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" aria-label="Account menu" className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profilePicture ?? undefined} alt={displayName} />
                      <AvatarFallback className="bg-white/10 text-white text-xs">{initials || "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border bg-popover">
                  <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/0">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="bg-white text-black hover:bg-gray-200 font-semibold">
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 6H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 18H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>

          {isOpen && (
            <div className="absolute top-20 left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top-5">
              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                {signedIn ? (
                  <>
                    <p className="truncate text-sm text-gray-400">{displayName}</p>
                    <Button asChild className="w-full bg-white text-black hover:bg-gray-200 font-semibold">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 px-0"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 px-0"
                    >
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-white text-black hover:bg-gray-200 font-semibold">
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
