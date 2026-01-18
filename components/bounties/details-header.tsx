import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, Gift, MessageSquare, Timer, Users } from "lucide-react";
import Image from "next/image";

interface DetailsHeaderProps {
  type: "BOUNTY" | "PROJECT";
  title: string;
  company: string;
  logo: string;
  participants: number;
  dueDate: string;
  tags: string[];
  status?: string;
  commentsCount?: number;
}

export function DetailsHeader({
  type,
  title,
  company,
  logo,
  participants,
  dueDate,
  tags,
  status = "Submission Open",
  commentsCount = 20,
}: DetailsHeaderProps) {
  const isProject = type === "PROJECT";

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 font-inter">
      {/* Logo */}
      <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full bg-background flex items-center justify-center border border-border">
        <Image src={logo} width={64} height={64} alt={company} className="object-contain h-full w-full" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2.5">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            <span>{company}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>{participants}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Due in {dueDate.replace(" left", "")}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 text-primary" />
            <span>{status}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>{commentsCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-primary" />
            <span>{isProject ? "Project" : "Bounty"}</span>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/20 hover:bg-primary/30 text-foreground border-0 rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-medium transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
