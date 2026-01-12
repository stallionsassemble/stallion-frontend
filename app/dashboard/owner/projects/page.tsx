'use client'

import { CreateProjectModal } from "@/components/dashboard/owner/create-project-modal";
import { ProjectCard } from "@/components/dashboard/owner/project-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjects } from "@/lib/api/projects/queries";
import { useAuth } from "@/lib/store/use-auth";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OwnerProjectsPage() {
  const { user } = useAuth();
  // Pass ownerId to fetch only MY projects
  const { data: projectsData, isLoading } = useGetProjects({ ownerId: user?.id });
  const myProjects = projectsData || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // More Filter State
  const [sortOrder, setSortOrder] = useState("newest");
  const [currencyFilter, setCurrencyFilter] = useState("All");

  // Filter and Sort Logic
  const filteredProjects = myProjects.filter((p: any) => {
    // 1. Search Filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Status Filter
    let matchesStatus = true;
    if (statusFilter !== "All") {
      // UI "Hiring" maps to "OPEN" status generally
      if (statusFilter === "Hiring" && p.status === "OPEN") matchesStatus = true;
      else if (statusFilter === "In Progress" && p.status === "IN_PROGRESS") matchesStatus = true;
      else if (statusFilter === "Completed" && p.status === "COMPLETED") matchesStatus = true;
      else if (statusFilter === "Draft" && p.status === "OPEN" && false) { } // Placeholder
      else matchesStatus = p.status === statusFilter.toUpperCase();
    }

    // 3. Currency Filter
    let matchesCurrency = true;
    if (currencyFilter !== "All") {
      matchesCurrency = p.currency === currencyFilter;
    }

    return matchesStatus && matchesCurrency;
  }).sort((a: any, b: any) => {
    // Sort Logic
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest-budget":
        return Number(b.reward.replace(/,/g, '')) - Number(a.reward.replace(/,/g, ''));
      case "lowest-budget":
        return Number(a.reward.replace(/,/g, '')) - Number(b.reward.replace(/,/g, ''));
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Main Column */}
      <div className="space-y-6 min-w-0 flex-1 pb-20 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">Project</h1>
            <p className="text-muted-foreground">Browse and manage available projects</p>
          </div>
          <CreateProjectModal>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Create Project
            </Button>
          </CreateProjectModal>
        </div>

        {/* Filters & Search */}
        <div className="flex p-5 border-primary border rounded-xl items-center gap-4 bg-background">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or skill..."
              className="pl-9 bg-transparent border-slate-800 text-white placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {["All", "Draft", "Hiring", "In Progress", "In Review", "Completed"].map((filter) => (
              <Button
                key={filter}
                variant={statusFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(filter);
                  setCurrentPage(1);
                }}
                className={`h-9 px-4 ${statusFilter === filter ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent border-blue-900/40 text-slate-400 hover:text-blue-400 hover:border-blue-500/50"}`}
              >
                {filter}
              </Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent border-blue-900/40 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 h-9 px-4 gap-2 ml-2">
                  <SlidersHorizontal className="h-3 w-3" /> More Filter
                  {(sortOrder !== "newest" || currencyFilter !== "All") && (
                    <span className="ml-1 bg-blue-600 text-white text-[10px] w-2 h-2 rounded-full inline-block" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0A0A0A] border-slate-800 text-slate-200">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                  <DropdownMenuRadioItem value="newest" className="focus:bg-slate-800 focus:text-white">Newest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest" className="focus:bg-slate-800 focus:text-white">Oldest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="highest-budget" className="focus:bg-slate-800 focus:text-white">Highest Budget</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lowest-budget" className="focus:bg-slate-800 focus:text-white">Lowest Budget</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuLabel>Currency</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuRadioGroup value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <DropdownMenuRadioItem value="All" className="focus:bg-slate-800 focus:text-white">All Currencies</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="USDC" className="focus:bg-slate-800 focus:text-white">USDC</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="XLM" className="focus:bg-slate-800 focus:text-white">XLM</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                {(sortOrder !== "newest" || currencyFilter !== "All") && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => {
                          setSortOrder("newest");
                          setCurrencyFilter("All");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-background border-primary/20 overflow-hidden h-full flex flex-col">
                <CardContent className="p-6 flex flex-col h-full gap-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-20 bg-slate-800" />
                    <Skeleton className="h-5 w-16 bg-slate-800" />
                  </div>
                  <Skeleton className="h-7 w-3/4 bg-slate-800" />
                  <Skeleton className="h-20 w-full bg-slate-800" />
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <Skeleton className="h-4 w-24 bg-slate-800" />
                    <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : paginatedProjects.length > 0 ? (
            paginatedProjects.map((project: any) => (
              <Link
                key={project.id}
                href={`/dashboard/owner/projects/${project.id}`}
                className="block h-full"
              >
                <ProjectCard
                  projectId={project.id}
                  status={project.status}
                  type="Project"
                  title={project.title}
                  description={project.shortDescription || project.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || ''}
                  reward={project.reward}
                  currency={project.currency}
                  skills={project.skills || []}
                  applicants={project.applications?.length || 0}
                  hiredCount={project.acceptedCount}
                  peopleNeeded={project.peopleNeeded}
                  date={project.createdAt ? format(new Date(project.createdAt), 'M/dd/yyyy') : ''}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              {isLoading ? "Loading projects..." : "No projects found matching your criteria."}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/5">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              Rows per page
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px] border-slate-800 bg-background text-xs">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {[6, 10, 20, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1">
                <Button
                  variant="outline" size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline" size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
