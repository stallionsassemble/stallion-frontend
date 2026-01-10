import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, Users } from "lucide-react";

interface BountyCardProps {
  status: string;
  type: "Bounty";
  title: string;
  description: string;
  reward: string;
  currency: string;
  skills: string[];
  applicants: number;
  submissions: number;
  date: string;
}

export function BountyCard({ status, type, title, description, reward, currency, skills, applicants, submissions, date }: BountyCardProps) {
  const statusColors: { [key: string]: string } = {
    "Open": "bg-yellow-500/10 text-foreground hover:bg-yellow-500/20",
    "Completed": "bg-green-500/10 text-foreground hover:bg-green-500/20",
    "In Progress": "bg-blue-500/10 text-foreground hover:bg-blue-500/20"
  };

  return (
    <Card className="bg-background border-primary overflow-hidden relative group hover:border-blue-600/50 transition-all duration-300">
      <CardContent className="p-3 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <Badge variant="secondary" className={cn("border-0 rounded-sm text-[10px] px-1.5", statusColors[status])}>{status}</Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0 rounded-sm text-[10px] px-1.5">{type}</Badge>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white">{title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 overflow-hidden text-ellipsis flex-1">{description}</p>

        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">
              {currency === 'XLM' ? '' : '$'}{reward}
            </span>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-[10px]">{currency}</Badge>
          </div>
        </div>


        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.map(skill => (
            <Badge key={skill} variant="secondary" className="bg-primary/20 text-foreground hover:bg-primary/30 text-[10px] px-2 py-0.5 transition-colors border-0">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {applicants}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {submissions} Submissions</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {date}</span>
          </div>

          <Button size="icon" className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shrink-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
