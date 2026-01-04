"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetProjects } from "@/lib/api/projects/queries";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FolderOpen, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectStatus, ProjectType } from "@/lib/types/project";

export default function BountiesPage() {
  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("GIG") // Default to GIG as per requirements
  const [filterStatus, setFilterStatus] = useState("OPEN")

  // Fetch Projects with Filters
  const { data: projects, isLoading, isError } = useGetProjects({
    status: filterStatus === "ALL" ? undefined : filterStatus as ProjectStatus,
    type: filterType === "ALL" ? undefined : filterType as ProjectType,
    ownerId: undefined,
  });

  // Filter and Sort Logic (Client-side Search & Sort)
  const filteredProjects = useMemo(() => {
    let result = projects || []

    // 1. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((project: any) =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.requirements?.some((r: any) => r.toLowerCase().includes(query))
      )
    }

    // 2. Sorting
    result = [...result].sort((a: any, b: any) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "reward-high":
          return (parseFloat(b.reward) || 0) - (parseFloat(a.reward) || 0)
        case "reward-low":
          return (parseFloat(a.reward) || 0) - (parseFloat(b.reward) || 0)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [projects, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / Number(rowsPerPage))
  const paginatedBounties = filteredProjects.slice(
    (currentPage - 1) * Number(rowsPerPage),
    currentPage * Number(rowsPerPage)
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Loading/Error states
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Failed to load projects. Please try again later.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground font-inter">Explore Projects</h1>
        <p className="text-sm text-muted-foreground font-inter">Find the perfect project for your skills</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-lg border-[0.69px] border-primary">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-background/50 border-border text-muted placeholder:text-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 w-full md:w-auto text-muted justify-end">
          <Select value={filterStatus} onValueChange={(val: any) => setFilterStatus(val)}>
            <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border text-muted">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={(val: any) => setFilterType(val)}>
            <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border text-muted">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="GIG">Gigs</SelectItem>
              <SelectItem value="JOB">Jobs</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-border text-muted">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="reward-high">High Reward</SelectItem>
              <SelectItem value="reward-low">Low Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedBounties.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects found"
          description="Try adjusting your filters or check back later for new opportunities."
          className="min-h-[400px]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {paginatedBounties.map((project) => (
            <BountyCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.shortDescription || project.description}
              company={project.owner?.companyName || project.owner?.username || "Stallion User"}
              logo={project.owner?.companyLogo || project.owner?.profilePicture || "/assets/icons/sdollar.png"}
              amount={project.reward}
              type={project.currency as any}
              tags={project.skills}
              participants={project.applications?.length || 0}
              dueDate={`${formatDistanceToNow(new Date(project.deadline))}`}
              className="w-full min-w-0 md:w-full md:min-w-0"
              version="PROJECT"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {paginatedBounties.length > 0 && (
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-x-6 gap-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>Rows per page</span>
            <Select value={rowsPerPage} onValueChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}>
              <SelectTrigger className="h-8 px-2 w-[60px] rounded-md bg-card border border-border text-foreground focus:ring-0 focus:ring-offset-0 gap-1">
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
    </div>
  );
}
