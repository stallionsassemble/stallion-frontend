"use client";

import { CreateProjectModal } from "@/components/dashboard/owner/create-project-modal";

import { HireTalentModal } from "@/components/dashboard/owner/hire-talent-modal"; // Keep existing imports
import { MilestoneReviewModal } from "@/components/dashboard/owner/milestone-review-modal";
import { ProjectApplicantCard } from "@/components/dashboard/owner/project-applicant-card";
import { ProjectDetailsSidebar } from "@/components/dashboard/owner/project-details-sidebar";
import { ProjectMilestoneCard } from "@/components/dashboard/owner/project-milestone-card";
import { ProjectSubmissionDetailsModal } from "@/components/dashboard/owner/project-submission-details-modal";
import { RequestRevisionModal } from "@/components/dashboard/owner/request-revision-modal";
import { SendMessageModal } from "@/components/dashboard/owner/send-message-modal"; // New import
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGetApplicationMilestones, useGetProject, useGetProjectApplications, useGetProjectMilestones, useReviewApplication, useReviewMilestone } from "@/lib/api/projects/queries";
import { useChatSocket } from "@/lib/hooks/use-chat-socket";
import { ProjectMilestone } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BriefcaseBusiness, Calendar, Edit, FileText, Filter, Search, Share2, User, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: project, isLoading } = useGetProject(id);
  const { data: projectMilestones, isLoading: projectMilestonesLoading } = useGetProjectMilestones(id);
  const { data: projectApplications, isLoading: projectApplicationsLoading } = useGetProjectApplications(id);

  const { mutate: reviewApplication, isPending: isReviewing } = useReviewApplication();
  const { mutate: reviewMilestone, isPending: isReviewingMilestone } = useReviewMilestone();

  /* 
    If a talent is accepted, we fetch the *Application Milestones* which contain valid status/submission data.
    Otherwise, we use the generic *Project Milestones* (definitions only).
  */
  const acceptedTalent = projectApplications?.find((a: any) => a.status === "ACCEPTED");
  console.log("Accepted Talent", acceptedTalent)
  const { data: applicationMilestones, isLoading: applicationMilestonesLoading } = useGetApplicationMilestones(acceptedTalent?.id || "");
  console.log("Accepted Milestones", applicationMilestones)

  // Use application milestones if available (hired), otherwise fallback to generic project milestones
  const displayMilestones = acceptedTalent ? applicationMilestones : projectMilestones;


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("milestones");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, ACCEPTED, REJECTED

  // Milestone Review States
  const [selectedReviewMilestone, setSelectedReviewMilestone] = useState<ProjectMilestone | null>(null);
  const [isReviewMilestoneModalOpen, setIsReviewMilestoneModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  // Message Modal State
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

  // Reset pagination when filters change
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

  // Milestone Actions
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

    // Send message via socket immediately
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

    // Close modals immediately - No API call
    setIsRevisionModalOpen(false);
    setIsReviewMilestoneModalOpen(false);
    setSelectedReviewMilestone(null);
  };


  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Link href="/dashboard/owner/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  // Calculate Progress
  const totalReward = parseFloat(project.reward?.replace(/,/g, '') || '0');
  const releasedAmount = parseFloat(project.released?.replace(/,/g, '') || '0');
  let progressPercentage = totalReward > 0 ? Math.round((releasedAmount / totalReward) * 100) : 0;

  if (project.status === 'COMPLETED' || project.status === 'CLOSED') {
    progressPercentage = 100;
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1600px] mx-auto pb-20 relative">

      {/* Back Nav */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/owner/projects">
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2 h-9">
            <ArrowLeft className="h-3.5 w-3.5" /> Back Projects
          </Button>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-border text-foreground hover:text-white gap-2 h-9"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-border text-foreground hover:text-white gap-2 h-9">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main Content (Left Column) */}
        <div className="flex-1 space-y-8">

          {/* Header */}
          <div className="space-y-4">
            <Badge className="bg-[#FFE500] hover:bg-[#FFE500] text-black font-bold mb-4 rounded-full px-3">Open</Badge>
            <h1 className="text-3xl font-bold text-foreground leading-tight">{project.title}</h1>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="w-5 h-5 text-primary" />
                <span className="text-foreground/70">{project.owner.companyName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground/70">{project.applications?.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground/70">Due in {formatDistanceToNow(project.deadline)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground/70">Submission {new Date(project.deadline) > new Date() ? "Open" : "Closed"}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
              <p className="text-xs text-muted-foreground mb-1">Submissions</p>
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-foreground">{project.applications?.length}</h3>
                <FileText className="text-muted-foreground/30 w-5 h-5 mb-1" />
              </div>
            </Card>
            <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
              <p className="text-xs text-muted-foreground mb-1">Deadline</p>
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-bold text-foreground">{new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</h3>
                <Calendar className="text-muted-foreground/30 w-5 h-5 mb-1" />
              </div>
            </Card>
            <Card className="bg-background border-[1.17px] border-border p-4 relative overflow-hidden">
              <p className="text-xs text-muted-foreground mb-1">Released</p>
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-foreground">{project.released} {project.currency}</h3>
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

          {/* Tabs & Milestones */}
          <div className="space-y-4">
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
                  // Normalize data structure: applicationMilestones have nested 'milestone' object, generic ones are flat
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
                      status={m.status || 'Pending'} // Status is always at root if present
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

                        {/* Mini Pagination Controls */}
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
          </div>

        </div>

        {/* Right Sidebar */}
        <ProjectDetailsSidebar
          totalPrizes={project.reward}
          currency={project.currency}
          hiredTalent={{
            name: acceptedTalent?.user.firstName + ' ' + acceptedTalent?.user.lastName || '',
            role: acceptedTalent?.user.skills?.[0] || '',
            avatar: acceptedTalent?.user.profilePicture || 'https://github.com/shadcn.png',
          }}
          progress={progressPercentage}
          isHired={acceptedTalent ? true : false}
          paidAmount={project.released || '0'}
          totalAmount={project.reward}
          onMessage={() => setIsSendMessageModalOpen(true)}
        />

      </div>

      <CreateProjectModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        existingProject={project}
      />

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

