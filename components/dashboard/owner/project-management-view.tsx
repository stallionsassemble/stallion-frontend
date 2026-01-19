"use client";

import { HireTalentModal } from "@/components/dashboard/owner/hire-talent-modal";
import { MilestoneReviewModal } from "@/components/dashboard/owner/milestone-review-modal";
import { ProjectApplicantCard } from "@/components/dashboard/owner/project-applicant-card";
import { ProjectMilestoneCard } from "@/components/dashboard/owner/project-milestone-card";
import { ProjectSubmissionDetailsModal } from "@/components/dashboard/owner/project-submission-details-modal";
import { RequestRevisionModal } from "@/components/dashboard/owner/request-revision-modal";
import { SendMessageModal } from "@/components/dashboard/owner/send-message-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGetApplicationMilestones, useGetProjectApplications, useGetProjectMilestones, useReviewApplication, useReviewMilestone } from "@/lib/api/projects/queries";
import { useChatSocket } from "@/lib/hooks/use-chat-socket";
import { Project, ProjectMilestone } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { Calendar, FileText, Filter, Search, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProjectManagementViewProps {
  project: Project;
}

export function ProjectManagementView({ project }: ProjectManagementViewProps) {
  const id = project.id;

  const { data: projectMilestones, isLoading: projectMilestonesLoading } = useGetProjectMilestones(id);
  const { data: projectApplications, isLoading: projectApplicationsLoading } = useGetProjectApplications(id);

  const { mutate: reviewApplication, isPending: isReviewing } = useReviewApplication();
  const { mutate: reviewMilestone, isPending: isReviewingMilestone } = useReviewMilestone();

  const acceptedTalent = projectApplications?.find((a: any) => a.status === "ACCEPTED");

  // Use application milestones if available (hired), otherwise fallback to generic project milestones
  // Note: We need to handle the hook call conditionally or just handle the data
  // Hooks cannot be conditional. So we call it, but pass empty string if no talent.
  const { data: applicationMilestones, isLoading: applicationMilestonesLoading } = useGetApplicationMilestones(acceptedTalent?.id || "");

  const displayMilestones = acceptedTalent ? applicationMilestones : projectMilestones;


  const [activeTab, setActiveTab] = useState("milestones");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedReviewMilestone, setSelectedReviewMilestone] = useState<ProjectMilestone | null>(null);
  const [isReviewMilestoneModalOpen, setIsReviewMilestoneModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);

  const { sendMessage } = useChatSocket();

  const itemsPerPage = 5;

  const handleHireClick = (application: any) => {
    setSelectedApplication(application);
    setIsHireModalOpen(true);
  };

  const handleViewSubmission = (application: any) => {
    setSelectedApplication(application);
    setIsViewSubmissionModalOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredApplications = projectApplications ? projectApplications.filter((app: any) => {
    const fullName = `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || (app.status && app.status.toUpperCase() === statusFilter);
    return matchesSearch && matchesStatus;
  }) : [];

  const paginatedApplications = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const confirmHire = () => {
    if (!selectedApplication) return;

    reviewApplication({
      id: selectedApplication.id,
      payload: {
        status: 'ACCEPTED',
      }
    }, {
      onSuccess: () => {
        toast.success("Talent hired successfully");
        setIsHireModalOpen(false);
        setSelectedApplication(null);
      },
      onError: () => {
        toast.error("Failed to hire talent");
      }
    });
  };

  const openMilestoneReview = (milestone: ProjectMilestone) => {
    setSelectedReviewMilestone(milestone);
    setIsReviewMilestoneModalOpen(true);
  };

  const openRequestRevision = (milestone: ProjectMilestone) => {
    setSelectedReviewMilestone(milestone);
    setIsRevisionModalOpen(true);
  };

  const handleApproveMilestone = (notes: string) => {
    if (!selectedReviewMilestone) return;

    reviewMilestone({
      id: selectedReviewMilestone.id,
      payload: {
        approve: true,
        reviewNote: notes,
        revisionNote: ""
      }
    }, {
      onSuccess: () => {
        toast.success("Milestone approved successfully");
        setIsReviewMilestoneModalOpen(false);
        setSelectedReviewMilestone(null);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to approve milestone");
      }
    });
  };

  const handleSendRevision = async (notes: string) => {
    if (!selectedReviewMilestone) return;

    if (acceptedTalent?.user?.id) {
      try {
        await sendMessage({
          recipientId: acceptedTalent.user.id,
          content: `[Revision Requested] ${notes}`
        });
        toast.success("Revision request sent to talent");
      } catch (err) {
        console.error("Failed to send revision message via socket", err);
        toast.error("Failed to send message to talent");
      }
    }

    setIsRevisionModalOpen(false);
    setIsReviewMilestoneModalOpen(false);
    setSelectedReviewMilestone(null);
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
          <p className="text-xs text-muted-foreground mb-1">Submissions</p>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-foreground">{projectApplications?.length || 0}</h3>
            <FileText className="text-muted-foreground/30 w-5 h-5 mb-1" />
          </div>
        </Card>
        <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
          <p className="text-xs text-muted-foreground mb-1">Deadline</p>
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-foreground">{project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</h3>
            <Calendar className="text-muted-foreground/30 w-5 h-5 mb-1" />
          </div>
        </Card>
        <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
          <p className="text-xs text-muted-foreground mb-1">Released</p>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-foreground">{project.released || 0} {project.currency}</h3>
            <User className="text-muted-foreground/30 w-5 h-5 mb-1" />
          </div>
        </Card>
        <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
          <p className="text-xs text-muted-foreground mb-1">Escrowed</p>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-foreground">{project.reward} {project.currency}</h3>
            <div className="w-5 h-5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground font-serif mb-1">{project.currency}</div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex items-center bg-muted-foreground/10 border border-white/5 backdrop-blur-sm h-[44.58px] rounded-[11.76px] p-[4.41px]">
            <button
              onClick={() => setActiveTab("milestones")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-[9px] font-inter text-sm font-medium transition-all",
                activeTab === "milestones"
                  ? "bg-background text-foreground shadow-sm border border-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Milestones ({projectMilestones?.length})
            </button>
            <button
              onClick={() => setActiveTab("applicants")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-[9px] font-inter text-sm font-medium transition-all",
                activeTab === "applicants"
                  ? "bg-background text-foreground shadow-sm border border-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Applicants ({projectApplications?.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "applicants" && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applicants..."
                  className="pl-9 h-9 w-[200px] bg-background border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background border-border text-foreground hover:text-white h-9 text-xs gap-2">
                  <Filter className="w-3 h-3" /> Filter {statusFilter !== "ALL" && `(${statusFilter})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "ALL"}
                  onCheckedChange={() => setStatusFilter("ALL")}
                >
                  All Statuses
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "PENDING"}
                  onCheckedChange={() => setStatusFilter("PENDING")}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "ACCEPTED"}
                  onCheckedChange={() => setStatusFilter("ACCEPTED")}
                >
                  Accepted (Hired)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "REJECTED"}
                  onCheckedChange={() => setStatusFilter("REJECTED")}
                >
                  Rejected
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === "milestones" && displayMilestones?.map((m: any, i) => {
            const details = m.milestone || m;

            return (
              <ProjectMilestoneCard
                key={i}
                index={i + 1}
                title={details.title}
                description={details.description}
                amount={details.amount}
                currency={project.currency}
                dueDate={details.dueDate}
                status={m.status || 'Pending'}
                onViewSubmission={() => openMilestoneReview(m)}
                onApprove={() => openMilestoneReview(m)}
                onRequestRevision={() => openRequestRevision(m)}
                hasHiredTalent={!!acceptedTalent}
              />
            );
          })}

          {activeTab === "applicants" && (
            <div className="space-y-4">
              {paginatedApplications.length > 0 ? (
                <>
                  {paginatedApplications.map((app: any) => (
                    <ProjectApplicantCard
                      key={app.id}
                      user={app.user}
                      appliedAt={app.createdAt}
                      coverLetter={app.coverLetter}
                      totalBounties={app.user.bountySubmissionsCount}
                      totalProjects={app.user.projectApplicationsCount}
                      onHire={() => handleHireClick(app)}
                      onViewSubmission={() => handleViewSubmission(app)}
                      isHired={app.status === "ACCEPTED"}
                    />
                  ))}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <p className="text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                          &lt;
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                          &gt;
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-card/50">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No applicants yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <HireTalentModal
        open={isHireModalOpen}
        onOpenChange={setIsHireModalOpen}
        applicant={selectedApplication?.user || null}
        onConfirm={confirmHire}
        isConfirming={isReviewing}
      />

      <ProjectSubmissionDetailsModal
        open={isViewSubmissionModalOpen}
        onOpenChange={setIsViewSubmissionModalOpen}
        application={selectedApplication}
      />

      <MilestoneReviewModal
        open={isReviewMilestoneModalOpen}
        onOpenChange={setIsReviewMilestoneModalOpen}
        milestone={selectedReviewMilestone}
        applicant={acceptedTalent?.user || null}
        onApprove={handleApproveMilestone}
        onRequestRevision={handleSendRevision} // Using same revision handler but via review modal's button/textarea
        isProcessing={isReviewingMilestone}
        isReadOnly={selectedReviewMilestone?.status === "APPROVED" || selectedReviewMilestone?.status === "PAID"}
      />

      <RequestRevisionModal
        open={isRevisionModalOpen}
        onOpenChange={setIsRevisionModalOpen}
        applicant={acceptedTalent?.user || null}
        onSend={handleSendRevision}
        isProcessing={isReviewingMilestone}
      />

      {acceptedTalent && (
        <SendMessageModal
          open={isSendMessageModalOpen}
          onOpenChange={setIsSendMessageModalOpen}
          contributor={{
            id: acceptedTalent.user.id,
            name: `${acceptedTalent.user.firstName} ${acceptedTalent.user.lastName}`,
            role: acceptedTalent.user.skills?.[0] || 'Talent',
            avatar: acceptedTalent.user.profilePicture,
            initials: (acceptedTalent.user.firstName?.[0] || '') + (acceptedTalent.user.lastName?.[0] || ''),
            bio: '',
            stats: { bounties: 0, projects: 0, totalEarned: 0, currency: 'USD' }
          }}
          redirectPath="/dashboard/owner/messages"
        />
      )}
    </div>
  );
}
