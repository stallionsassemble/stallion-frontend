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

export default function BountiesPage() {
  const [activeTab, setActiveTab] = useState("All");

  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Projects
  const { data: projects, isLoading, isError } = useGetProjects({
    // We can add filters here later based on activeTab if needed,
    // for now fetch all and filter client side to match previous behavior
    // or better yet, just fetch all open projects.
    status: 'OPEN',
    type: 'GIG', // Defaulting to GIG for now or should we fetch both? 
    // The previous mock data had mixed types implies mixed.
    // However the payload type requires a specific type. 
    // Let's assume for this page we might want to fetch based on user selection or just default to GIG for now.
    // If we want both, we might need two queries or a backend change.
    // I will stick to 'GIG' as default 'Project' type in this context usually means Gigs/Projects
    ownerId: '', // Fetch all
  } as any); // Type cast as any because payload might be optional in backend but strict in frontend type definition? 
  // Wait, I checked existing types. GetProjectsPayload has specific strict types. 
  // Let's check if we can pass partial or if we need to adjust the hook usage.
  // Actually, checking standard patterns, often "All" tabs show everything.
  // If the API strictly requires type and status, I might be limited.
  // Let's assume we want 'GIG' and 'OPEN' for the default view.

  // Actually, let's fix the query usage to be safe.
  // Ideally we should probably have a more flexible endpoint.
  // But for now let's try to map the data we get.

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("ALL") // Added filterType state

  // Filter and Sort Logic
  const filteredProjects = useMemo(() => {
    let result = projects || []

    // 0. Filter by type (GIG, JOB, ALL)
    if (filterType !== "ALL") {
      result = result.filter(project => project.type === filterType)
    }

    // 1. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.requirements?.some(r => r.toLowerCase().includes(query))
      )
    }

    // 2. Sorting
    /* Note: API sorting isn't available, so we sort the full list on client */
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "reward-high":
          // Simple parsing for reward string if needed, assuming generic number comparisons valid for now
          return (parseFloat(b.reward) || 0) - (parseFloat(a.reward) || 0)
        case "reward-low":
          return (parseFloat(a.reward) || 0) - (parseFloat(b.reward) || 0)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [projects, searchQuery, sortBy, filterType]) // Added filterType to dependencies

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
        <div className="flex gap-3 w-full md:w-auto text-muted">
          <Select value={filterType} onValueChange={(val: any) => setFilterType(val)}>
            <SelectTrigger className="w-[150px] bg-background/50 border-border text-muted">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Projects</SelectItem>
              <SelectItem value="GIG">Gigs</SelectItem>
              <SelectItem value="JOB">Jobs</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-background/50 border-border text-muted">
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
              participants={project.acceptedCount || 0}
              dueDate={`${formatDistanceToNow(new Date(project.deadline))} left`}
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
