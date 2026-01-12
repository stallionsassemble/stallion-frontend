import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProjectMilestones } from "@/lib/api/projects/queries";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, User, Users } from "lucide-react";

interface ProjectCardProps {
  projectId: string; // Added to fetch milestones
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
  projectId,
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

  const { data: milestones = [] } = useGetProjectMilestones(projectId);

  const statusColors: { [key: string]: string } = {
    "OPEN": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    "IN_PROGRESS": "bg-blue-600 text-white hover:bg-blue-700",
    "COMPLETED": "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    "CANCELLED": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    "CLOSED": "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
    "Hiring": "bg-orange-500 text-white hover:bg-orange-600",
    "Ended": "bg-transparent text-red-500 p-0 hover:bg-transparent", // Custom for text only
  };

  // Map backend status to UI label/color
  let uiStatus = status;
  let statusClass = "bg-primary/10 text-primary";
  let isEnded = false;

  if (status === 'OPEN') {
    uiStatus = 'Hiring';
    statusClass = statusColors['Hiring'];
  } else if (status === 'IN_PROGRESS') {
    uiStatus = 'In Progress';
    statusClass = statusColors['IN_PROGRESS'];
  } else if (status === 'COMPLETED' || status === 'CLOSED') {
    uiStatus = 'Ended';
    isEnded = true;
    statusClass = "text-red-500 bg-transparent border-0 p-0";
  } else if (statusColors[status]) {
    statusClass = statusColors[status];
  }

  // Calculate Progress
  const totalMilestones = milestones.length;
  // stored status might be "COMPLETED" or similar. Adjust based on API
  const completedMilestones = milestones.filter((m: any) => m.status === 'COMPLETED' || m.status === 'PAID').length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Hired logic
  const isHired = hiredCount > 0;

  return (
    <Card className="bg-background border-primary overflow-hidden relative group hover:border-blue-600/50 transition-all duration-300">
      <CardContent className="p-5 pt-4 flex flex-col h-full">
        {/* Header Tags */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            {!isEnded && (
              <Badge variant="secondary" className={cn("border-0 rounded-full text-[10px] px-2 py-0.5 font-medium", statusClass)}>
                {uiStatus}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-0 rounded-full text-[10px] px-2 py-0.5">
              {type}
            </Badge>
          </div>
        </div>

        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-white tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 overflow-hidden text-ellipsis leading-relaxed min-h-[3em]">
          {description}
        </p>

        {/* Reward & Progress */}
        <div className="mb-6 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {currency === 'XLM' ? '' : '$'}{Number(reward).toLocaleString()}
            </span>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-[10px] px-2 h-5 rounded-sm uppercase">
              {currency}
            </Badge>
          </div>


          {/* Progress Bar */}
          {uiStatus !== 'Hiring' && totalMilestones > 0 && (
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                Milestone {Math.min(completedMilestones + 1, totalMilestones)}
              </p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {skills.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" className="bg-primary/20 text-foreground text-[10px] px-2.5 py-1 transition-colors border-0 rounded-full">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="bg-primary/20 text-foreground border-0 text-[10px] px-2 py-1 rounded-full">+{skills.length - 3}</Badge>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
            {/* Applicant Count */}
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-500" />
              <span>{applicants}</span>
            </div>

            {/* Submissions (Mocked or passed props? Using applicants for now as placeholder if submissions not passed, but interface has applicants. User asked for submissions. Reusing applicant count for now or need submissions prop?)
                User prompt says: "20 Submissions". 
                Usually applicants = submissions in this context? Or distinct?
                I'll assume applicants prop holds this value for now based on previous ProjectCard usage.
              */}
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{applicants} Submissions</span>
            </div>

            {/* Dynamic Status / Hired */}
            {isEnded && (
              <div className="flex items-center gap-1.5 text-red-500">
                <Clock className="h-4 w-4" />
                <span>Ended</span>
              </div>
            )}

            {isHired && (
              <div className="flex items-center gap-1.5 text-green-500 ml-2">
                <div className="h-5 w-5 rounded-full bg-slate-700 overflow-hidden">
                  {/* Avatar placeholder - in real app pass hired user avatar */}
                  <img src="/assets/icons/sdollar.png" alt="Hired" className="h-full w-full object-cover" />
                </div>
                <span>Hired</span>
              </div>
            )}
          </div>

          <Button size="icon" className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-lg shadow-blue-900/20">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
