import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CircleCheckBig, Clock, Eye, Trophy } from "lucide-react";

interface SubmissionItemProps {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  submittedDate: string;
  status: "Pending Review" | "Under Review" | "Winner" | "First Runner-up" | "Second Runner-up" | "Approved";
  onView: () => void;
  onSelectWinner?: () => void;
  onMarkUnderReview?: () => void;
}

export function SubmissionItem({
  candidateName,
  candidateAvatar,
  submittedDate,
  status,
  onView,
  onSelectWinner,
  onMarkUnderReview
}: SubmissionItemProps) {

  const isWinner = status === "Winner" || status.includes("Runner-up");

  return (
    <Card className="bg-background border-primary overflow-hidden relative group hover:border-primary/50 transition-colors">
      <CardContent className="p-3">
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          {(() => {
            let badgeStyle = "bg-slate-500/10 text-slate-400 border-slate-500/20";
            if (status === "Pending Review") badgeStyle = "bg-pending/10 text-pending border-pending/20";
            else if (status === "Approved") badgeStyle = "bg-green-500/10 text-green-500 border-green-500/20";
            else if (status === "Winner") badgeStyle = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            else if (status.includes("Runner-up")) badgeStyle = "bg-blue-500/10 text-blue-500 border-blue-500/20";

            return (
              <Badge variant="outline" className={`${badgeStyle} border rounded-full text-[10px] px-2 py-0.5 flex items-center`}>
                <CircleCheckBig className="w-3 h-3 mr-1" />
                {status}
              </Badge>
            );
          })()}
        </div>

        <div className="flex flex-col md:flex-row items-start gap-3">
          {/* Avatar */}
          <Avatar className="h-12 w-12 border-2 border-slate-800 shrink-0">
            <AvatarImage src={candidateAvatar} alt={candidateName} />
            <AvatarFallback>{candidateName.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full">
            {/* Header Row */}
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600 border-0 rounded-full text-[10px] px-2 py-0.5">Fair Payer</Badge>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-lg">{candidateName}</h3>
              {isWinner && (
                <div className="flex items-center gap-1 text-xs font-medium text-orange-400">
                  <Trophy className="h-3 w-3" />
                  <span>Winner</span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 mb-2">
              <span className="flex items-center gap-1"><span className="text-slate-400">200</span> Followers</span>
              <span className="flex items-center gap-1"><span className="text-slate-400">20</span> Submissions</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {submittedDate}</span>
            </div>

            {/* Actions (Moved Here) */}
            <div className="flex flex-wrap items-center gap-2 w-full">
              {!isWinner && (
                <Button
                  variant="stallion-outline"
                  size="sm"
                  className="border-primary text-foreground hover:text-white h-8 text-xs"
                  onClick={onMarkUnderReview}
                >
                  <Check className="h-3 w-3 mr-2" /> Mark under review
                </Button>
              )}

              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-foreground h-8 text-xs"
                onClick={onView}
              >
                <Eye className="h-3 w-3 mr-2" /> View Submissions
              </Button>

              {!isWinner && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-primary/30 hover:bg-slate-700 text-foreground h-8 text-xs"
                  onClick={onSelectWinner}
                >
                  <Trophy className="h-3 w-3 mr-2" /> Select Winner
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
