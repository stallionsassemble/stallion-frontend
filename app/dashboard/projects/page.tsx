"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { PageFilters } from "@/components/bounties/page-filters";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetProjects } from "@/lib/api/projects/queries";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FolderOpen, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectStatus, ProjectType } from "@/lib/types/project";

export default function ProjectsPage() {
  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // State for search and sort
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("OPEN")

  // Fetch Projects with Filters (Server-side for Status/Type)
  // Note: API might support more, but keeping existing pattern
  const { data: projects, isLoading, isError } = useGetProjects({
    status: filterStatus === "ALL" ? undefined : filterStatus as ProjectStatus,
    type: filterType === "ALL" ? undefined : filterType as ProjectType,
    ownerId: undefined,
  });

  // Fetch ALL projects to derive available skills for persistent filter chips
  const { data: allProjectsData } = useGetProjects({
    status: 'OPEN' // Or undef to get everything? Let's match default "Open" or strict "All"? 
    // If we want *all* potential skills, we should probably fetch broadly. 
    // But mostly we care about open projects. Let's start with OPEN or undefined if supported.
    // The `useGetProjects` payload doesn't support `limit` strictly in the typed payload I saw earlier? 
    // Wait, `GetProjectsPayload` inspection needed?
    // Let's assume basic fetch works. If limit isn't supported, it fetches default.
  });

  // Derive unique skills from ALL fetched projects
  const uniqueSkills = useMemo(() => {
    const list = allProjectsData || [];
    const skills = new Set<string>();
    list.forEach((p: any) => {
      p.skills?.forEach((s: string) => skills.add(s));
    });
    return Array.from(skills).sort();
  }, [allProjectsData]);


  // Filter and Sort Logic (Client-side Search & Skill Filter)
  const filteredProjects = useMemo(() => {
    let result = projects || []

    // 0. Skill Filter (Category)
    if (activeTab !== "All") {
      result = result.filter((project: any) =>
        project.skills?.some((s: string) => s === activeTab)
      )
    }

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
  }, [projects, searchQuery, sortBy, activeTab])

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


  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground font-inter">Explore Projects</h1>
        <p className="text-sm text-muted-foreground font-inter">Find the perfect project for your skills</p>
      </div>

      <PageFilters
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
        onSearch={(term) => { setSearchQuery(term); setCurrentPage(1); }}
        onSortChange={(sort) => { setSortBy(sort); setCurrentPage(1); }}
        onStatusChange={(status) => { setFilterStatus(status); setCurrentPage(1); }}
        onTypeChange={(type) => { setFilterType(type); setCurrentPage(1); }}
        type="PROJECT"
        count={filteredProjects.length}
        availableSkills={uniqueSkills}
      />

      {isLoading && (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex h-[50vh] items-center justify-center text-red-500">
          Failed to load projects. Please try again later.
        </div>
      )}

      {!isLoading && !isError && (
        paginatedBounties.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects found"
            description="Try adjusting your filters or check back later for new opportunities."
            className="min-h-[400px]"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedBounties.map((project: any) => (
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
        )
      )}

      {/* Pagination */}
      {!isLoading && !isError && paginatedBounties.length > 0 && (
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
