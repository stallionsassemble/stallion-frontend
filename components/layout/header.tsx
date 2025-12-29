"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "#why-us", label: "Why Us" },
    { href: "#bounties", label: "Bounties" },
    { href: "#faqs", label: "FAQs" },
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
          <Button
            asChild
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/0"
          >
            <Link href="/auth/login">
              Login
            </Link>
          </Button>
          <Button asChild className="bg-white text-black hover:bg-gray-200 font-semibold">
            <Link href="/auth/register">
              Sign Up
            </Link>
          </Button>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
