"use client";

import { SubmissionCard } from "@/components/submissions/submission-card";
import { SubmissionDetailsModal } from "@/components/submissions/submission-details-modal";
import { SubmissionStats } from "@/components/submissions/submission-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileQuestion, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { useGetUserSubmissions } from "@/lib/api/users/queries";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MySubmissionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Fetch Data
  const { data: submissionsData, isLoading } = useGetUserSubmissions();
  console.log("Submission", submissionsData)

  const allSubmissions = useMemo(() => {
    if (!submissionsData?.data) return [];

    return submissionsData.data.map((item: any) => {
      const isProject = item.type === 'project';
      const entity = isProject ? item.project : item.bounty;

      return {
        ...item,
        details: {
          id: item.id, // Submission ID for key/tracking
          entityId: isProject ? item.projectId : item.bountyId, // The project/bounty ID
          source: isProject ? 'PROJECT' : 'BOUNTY',
          title: entity.title,
          description: entity.shortDescription, // Or just description
          orgName: (entity as any).owner?.companyName || "",
          ownerId: (entity as any).ownerId,
          logo: "/assets/icons/sdollar.png", // TODO: Update if API provides
          amount: isProject ? (entity as any).reward : (entity as any).reward,
          currency: isProject ? (entity as any).currency : (entity as any).rewardCurrency,
          status: item.status, // "PENDING", "ACCEPTED", "REJECTED"
          date: item.createdAt,
          updated: item.updatedAt,
          feedback: item.rejectionReason,
          skills: entity.skills || [],
          attachments: item.attachments || [],
          deadline: isProject ? (entity as any).deadline : (entity as any).submissionDeadline,
          projectStatus: (entity as any).status,
        }
      };
    });
  }, [submissionsData]);

  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    allSubmissions.forEach((sub: any) => {
      if (sub.details.skills) {
        sub.details.skills.forEach((skill: string) => skills.add(skill));
      }
    });
    return Array.from(skills).sort();
  }, [allSubmissions]);

  const categories = useMemo(() => ["All", "Bounties", "Projects", ...uniqueSkills], [uniqueSkills]);

  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedSubmissions = useMemo(() => {
    let result = [...allSubmissions];

    // 1. Filter by Category/Tab
    if (activeTab !== "All") {
      if (activeTab === "Bounties") {
        result = result.filter(s => s.details.source === "BOUNTY");
      } else if (activeTab === "Projects") {
        result = result.filter(s => s.details.source === "PROJECT");
      } else {
        // Skill filter
        result = result.filter(s => s.details.skills?.includes(activeTab));
      }
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.details.title?.toLowerCase().includes(query) ||
        s.details.orgName?.toLowerCase().includes(query) ||
        s.details.description?.toLowerCase().includes(query)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      const dateA = new Date(a.details.date).getTime();
      const dateB = new Date(b.details.date).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [allSubmissions, activeTab, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedSubmissions.length / Number(rowsPerPage)) || 1;
  const paginatedSubmissions = filteredAndSortedSubmissions.slice((currentPage - 1) * Number(rowsPerPage), currentPage * Number(rowsPerPage));
  console.log("Paginated Submissions", paginatedSubmissions)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-inter -tracking-[4%] font-bold text-foreground">My Submissions</h1>
          <p className="text-muted-foreground font-medium font-inter">Track and manage all your submissions across bounties, grants, and projects.</p>
        </div>
      </div>

      <SubmissionStats totalSubmissions={submissionsData?.total || 0} />

      <div className="space-y-6">
        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar mask-linear-fade w-full sm:w-auto">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeTab === cat ? "default" : "outline"}
                onClick={() => { setActiveTab(cat); setCurrentPage(1); }}
                className={`h-8 font-inter font-medium text-[14px] whitespace-nowrap px-4 ${activeTab === cat
                  ? "bg-primary hover:bg-primary/90 text-white border-0"
                  : "bg-[#0A0A0A] border-[#404040] shadow-[box-shadow: 0px 1px 2px 0px #0000001A] text-white hover:bg-white/5"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-72 border border-border rounded-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-9 bg-card border-none text-foreground placeholder:text-muted-foreground rounded-lg w-full focus-visible:ring-1 "
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px] h-9 bg-secondary border-border text-foreground text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedSubmissions.map((sub: any) => (
              <div key={sub.details.id} onClick={() => setSelectedSubmission(sub)} className="cursor-pointer">
                <SubmissionCard
                  id={sub.details.id}
                  project={sub.details.orgName}
                  source={sub.details.source}
                  title={sub.details.title}
                  description={sub.details.description || ""}
                  logo={sub.details.logo}
                  amount={sub.details.amount || "0"}
                  type={sub.details.currency as any}
                  status={
                    sub.details.status === "PENDING" ? "Pending Review" :
                      sub.details.status === "ACCEPTED" ? "Approved" :
                        sub.details.status === "REJECTED" ? "Rejected" :
                          sub.details.status === "COMPLETED" ? "Completed" : sub.details.status as any
                  }
                  projectStatus={sub.details.projectStatus}
                  submittedAt={sub.details.date ? new Date(sub.details.date).toLocaleDateString() : ""}
                  lastUpdated={sub.details.updated ? formatDistanceToNow(new Date(sub.details.updated), { addSuffix: true }) : ""}
                  ownerId={sub.details.ownerId}
                  projectId={sub.details.source === 'PROJECT' ? sub.details.entityId : undefined}
                  bountyId={sub.details.source === 'BOUNTY' ? sub.details.entityId : undefined}
                />
              </div>
            ))}
            {!isLoading && paginatedSubmissions.length === 0 && (
              <EmptyState
                icon={FileQuestion}
                title="No submissions found"
                description={activeTab === 'All' && !searchQuery
                  ? "You haven't submitted work to any bounties or projects yet. Start exploring opportunities to earn rewards."
                  : "No submissions match your current filter."}
                action={
                  (activeTab === 'All' && !searchQuery) ? (
                    <Button onClick={() => router.push('/dashboard/bounties')} variant="stallion" className="mt-4">
                      Explore Opportunities
                    </Button>
                  ) : (
                    <Button onClick={() => { setActiveTab('All'); setSearchQuery(""); }} variant="outline" className="mt-4">
                      Clear Filters
                    </Button>
                  )
                }
              />
            )}
          </div>
        )}

        {/* Pagination Footer */}
        {paginatedSubmissions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-x-6 gap-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>Rows per page</span>
              <Select
                value={rowsPerPage}
                onValueChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}
              >
                <SelectTrigger className="h-8 w-[60px] bg-card border-border text-foreground text-xs">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-muted-foreground mr-2">Page {currentPage} of {totalPages || 1}</span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-md bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:bg-secondary/80"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-md bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:bg-secondary/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-md bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-md bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <SubmissionDetailsModal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
        />
      </div>
    </div>
  );
}
