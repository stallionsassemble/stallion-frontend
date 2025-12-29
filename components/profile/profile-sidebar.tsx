import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store/use-auth";
import { Gamepad2, Github, Globe, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function ProfileSidebar() {
  const { user } = useAuth();
  const socials = user?.socials || {};

  const socialLinks = [
    { key: "github", icon: Github, label: socials.github || "Github", href: socials.github && !socials.github.startsWith("http") ? `https://github.com/${socials.github}` : socials.github },
    { key: "twitter", icon: Twitter, label: socials.twitter || "Twitter", href: socials.twitter && !socials.twitter.startsWith("http") ? `https://x.com/${socials.twitter}` : socials.twitter },
    { key: "linkedin", icon: Linkedin, label: "Linkedin", href: socials.linkedin && !socials.linkedin.startsWith("http") ? `https://linkedin.com/in/${socials.linkedin}` : socials.linkedin },
    { key: "website", icon: Globe, label: "Website", href: socials.website },
    { key: "instagram", icon: Instagram, label: "Instagram", href: socials.instagram && !socials.instagram.startsWith("http") ? `https://instagram.com/${socials.instagram}` : socials.instagram },
    { key: "discord", icon: Gamepad2, label: "Discord", href: socials.discord },
  ].filter(link => link.href);

  return (
    <div className="space-y-3">
      <div className="border-[0.68px] border-primary/20 rounded-xl p-4 w-full md:w-[477px] h-auto md:h-auto min-h-[100px] bg-background">
        <h3 className="text-lg font-bold font-inter mb-2 text-foreground">Links</h3>
        <div className="space-y-1 mb-3">
          {socialLinks.length > 0 ? (
            socialLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href!}
                target="_blank"
                className="flex items-center gap-3 text-muted-foreground hover:text-[#0066FF] transition-colors group"
              >
                <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#0066FF] transition-colors" />
                <span className="text-[14px] font-inter font-light truncate">{link.label === link.href ? link.href : link.label}</span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No links added.</p>
          )}
        </div>

        <Button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white gap-2 h-8 font-inter font-medium text-xs">
          <Mail className="w-4 h-4" />
          Contact
        </Button>
      </div>
    </div>
  );
}
