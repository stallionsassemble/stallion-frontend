"use client";

import { Button } from "@/components/ui/button";
import { Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Github, label: "github.com/johndoe", href: "https://github.com" },
  { icon: Twitter, label: "@johndoe", href: "https://twitter.com" },
  { icon: Linkedin, label: "linkedin.com/in/johndoe", href: "https://linkedin.com" },
  { icon: Globe, label: "johndoe.dev", href: "https://example.com" },
];

export function ProfileSidebar() {
  return (
    <div className="space-y-3">
      <div className="border-[0.68px] border-primary/20 rounded-xl p-4 w-[477px] h-[202px] bg-background">
        <h3 className="text-lg font-bold font-inter mb-2 text-foreground">Links</h3>
        <div className="space-y-1 mb-3">
          {socialLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              target="_blank"
              className="flex items-center gap-3 text-muted-foreground hover:text-[#0066FF] transition-colors group"
            >
              <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#0066FF] transition-colors" />
              <span className="text-[14px] font-inter font-light">{link.label}</span>
            </Link>
          ))}
        </div>

        <Button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white gap-2 h-8 font-inter font-medium text-xs">
          <Mail className="w-4 h-4" />
          Contact
        </Button>
      </div>
    </div>
  );
}
