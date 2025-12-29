
"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/store/use-auth";
import { ChevronDown, Linkedin, LogOut, Mail, X, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen  font-sans text-white">
        {/* BACKGROUND GRID */}


        {/* HEADER */}
        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={120}
              height={40}
              alt="Stallion Logo"
              className="h-auto w-28 object-contain"
            />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <div className="h-6 w-6 rounded-full bg-gray-700 overflow-hidden">
                  {/* Placeholder for avatar */}
                </div>
                <span className="hidden md:inline">{user?.email}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#090715] border-white/10 text-white">
              <DropdownMenuItem asChild>
                <button onClick={logout} className="flex w-full items-center gap-2 text-red-500 focus:bg-white/5 focus:text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* MAIN CONTENT */}
        <main className="relative z-10 flex min-h-[calc(100vh-300px)] flex-col items-center justify-center p-6 md:p-12">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-white/5 px-6 py-12 md:px-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-12 md:flex-row">
            {/* Logo Column */}
            <div className="space-y-4 md:w-1/3">
              <Image
                src="/logo.png"
                width={100}
                height={30}
                alt="Stallion Logo"
                className="h-auto w-24 object-contain"
              />
              <p className="max-w-xs text-sm font-inter font-medium leading-relaxed text-gray-400">
                Discover high paying crypto bounties, projects and grants from the best Stellar companies in one place and apply to them using a single profile.
              </p>
              <div className="flex gap-2">
                <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" /></svg>
                </Link>
                <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </Link>
                <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  <Youtube className="h-4 w-4" />
                </Link>
                <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex flex-1 flex-wrap gap-12 md:justify-end">
              <div className="space-y-4">
                <h4 className="text-xs font-medium font-inter uppercase tracking-wider text-white">Opportunities</h4>
                <ul className="space-y-2 text-xs font-light font-inter text-gray-400">
                  <li><Link href="#" className="hover:text-white">Bounties</Link></li>
                  <li><Link href="#" className="hover:text-white">Projects</Link></li>
                  <li><Link href="#" className="hover:text-white">Grants</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-meidum font-inter uppercase tracking-wider text-white">Categories</h4>
                <ul className="space-y-2 text-xs font-light font-inter text-gray-400">
                  <li><Link href="#" className="hover:text-white">Content</Link></li>
                  <li><Link href="#" className="hover:text-white">Design</Link></li>
                  <li><Link href="#" className="hover:text-white">Development</Link></li>
                  <li><Link href="#" className="hover:text-white">Others</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-medium font-inter uppercase tracking-wider text-white">Legal</h4>
                <ul className="space-y-2 text-xs font-light font-inter text-gray-400">
                  <li><Link href="#" className="hover:text-white">Terms</Link></li>
                  <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-[11.65px] font-inter text-[#A1A1AA]">
            Copyright © 2025 Stallion. All rights reserved.
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
