import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, Users } from "lucide-react";

interface ProjectCardProps {
  status: string;
  type: "Project";
  title: string;
  description: string;
  reward: string;
  currency: string;
  skills: string[];
  applicants: number;
  // Project specific
  hiredCount: number;
  peopleNeeded: number;
  date: string;
}

export function ProjectCard({
  status,
  type,
  title,
  description,
  reward,
  currency,
  skills,
  applicants,
  hiredCount,
  peopleNeeded,
  date
}: ProjectCardProps) {

  const statusColors: { [key: string]: string } = {
    "OPEN": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    "IN_PROGRESS": "bg-blue-600 text-white hover:bg-blue-700",
    "COMPLETED": "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    "CANCELLED": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    "CLOSED": "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
    // Mapped statuses for UI if different
    "Hiring": "bg-orange-500 text-white hover:bg-orange-600",
  };

  // Map backend status to UI label/color
  let uiStatus = status;
  let statusClass = "bg-primary/10 text-primary";

  if (status === 'OPEN') {
    uiStatus = 'Hiring';
    statusClass = statusColors['Hiring'];
  } else if (status === 'IN_PROGRESS') {
    uiStatus = 'In Progress';
    statusClass = statusColors['IN_PROGRESS'];
  } else if (statusColors[status]) {
    statusClass = statusColors[status];
  }

  return (
    <Card className="bg-background border-primary overflow-hidden relative group hover:border-blue-600/50 transition-all duration-300">
      <CardContent className="p-5 pt-3 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            <Badge variant="secondary" className={cn("border-0 rounded-full text-[10px] px-2 py-0.5 font-medium", statusClass)}>
              {uiStatus}
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-0 rounded-full text-[10px] px-2 py-0.5">
              {type}
            </Badge>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white tracking-tight">{title}</h3>
        <p className="text-slate-400 text-xs mb-4 line-clamp-2 overflow-hidden text-ellipsis leading-relaxed min-h-[2.5em]">
          {description}
        </p>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {currency === 'XLM' ? '' : '$'}{Number(reward).toLocaleString()}
            </span>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-[10px] px-1.5 h-5">
              {currency}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {skills.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" className="bg-primary/20 text-foreground hover:bg-primary/30 text-[10px] px-2 py-0.5 transition-colors border-0">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="bg-primary/20 text-foreground border-0 text-[10px] px-2 py-0.5">+{skills.length - 3}</Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5" title="Applicants">
              <Users className="h-3.5 w-3.5" /> {applicants}
            </span>
            <span className="flex items-center gap-1.5" title="Hired / Needed">
              {hiredCount}/{peopleNeeded} Hired
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {date}
            </span>
          </div>

          <Button size="icon" className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-lg shadow-blue-900/20">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
