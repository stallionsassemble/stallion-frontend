"use client";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/store/use-auth";

export function SkillsSection() {
  const { user } = useAuth();
  const skills = user?.skills || [];
  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-6 mb-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-4 text-foreground">Skills & Expertise</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="bg-primary/20 text-foreground hover:bg-primary/30 border-[0.68px] border-primary/20 px-3 py-1 font-medium text-xs rounded-full transition-colors"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
