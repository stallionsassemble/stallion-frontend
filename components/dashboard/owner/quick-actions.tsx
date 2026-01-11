import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Blocks, FileStack, Gift } from "lucide-react";
import Link from "next/link";

import { useGetMyBounties } from "@/lib/api/bounties/queries";
import { useState } from "react";
import { CreateBountyModal } from "./create-bounty-modal";
import { CreateProjectModal } from "./create-project-modal";

// Updated to accept onClick instead of just href
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

function ActionCard({ title, description, icon: Icon, href, onClick, primary }: ActionCardProps) {
  const CardContentComponent = (
    <Card className={cn(
      "h-full transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden cursor-pointer",
      primary ? "bg-blue-600 border-blue-600 text-white" : "bg-background border-[1.17px] border-border hover:bg-card/50"
    )}>
      {/* Background Pattern for Primary Card */}
      {primary && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
      )}

      <CardContent className="p-3 flex flex-col items-start justify-between h-full">
        <Icon className={cn("h-4 w-4 mb-2", primary ? "text-white" : "text-blue-400 group-hover:text-blue-300")} />

        <div className="w-full">
          <h3 className={cn("font-medium text-[15px]", primary ? "text-white" : "text-foreground")}>{title}</h3>
          <div className="flex items-center justify-between mt-0.5">
            <p className={cn("text-xs", primary ? "text-blue-100" : "text-muted-foreground")}>{description}</p>
            {primary && <ArrowRight className="h-3 w-3 text-white opacity-80" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{CardContentComponent}</Link>;
  }

  return <div onClick={onClick}>{CardContentComponent}</div>;
}

export function QuickActions() {
  const [openBountyModal, setOpenBountyModal] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);

  const { data: bounties } = useGetMyBounties();
  const totalSubmissions = bounties?.reduce((acc, b) => acc + (b.submissionCount || 0), 0) || 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="Post Bounty"
          description="Launch a competition"
          icon={Gift}
          onClick={() => setOpenBountyModal(true)}
          primary
        />
        <ActionCard
          title="Create Project"
          description="Post a new job for freelancers"
          icon={Blocks}
          onClick={() => setOpenProjectModal(true)}
        />
        <ActionCard
          title={`Review Submissions ${totalSubmissions > 0 ? `(${totalSubmissions})` : ''}`}
          description="Check received submissions"
          icon={FileStack}
          href="/dashboard/owner/bounties"
        />
      </div>

      <CreateBountyModal open={openBountyModal} onOpenChange={setOpenBountyModal} />
      <CreateProjectModal open={openProjectModal} onOpenChange={setOpenProjectModal} />
    </>
  )
}
