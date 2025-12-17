"use client";

import { SubmissionCard } from "@/components/submissions/submission-card";
import { SubmissionDetailsModal } from "@/components/submissions/submission-details-modal";
import { SubmissionStats } from "@/components/submissions/submission-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { useState } from "react";

// Mock Data
const submissions = [
  {
    id: 1,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Approved",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 2,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Pending Review",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 3,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Revision Requested",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 4,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Rejected",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 5,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Approved",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
] as const;

export default function MySubmissionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const categories = ["All", "Design", "Development", "Content", "Marketing", "Research", "Other"];

  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSubmissions = activeTab === "All"
    ? submissions
    : submissions.filter(s => s.title.includes(activeTab) || s.description.includes(activeTab) || s.status.includes(activeTab)); // Mock filtering

  const totalPages = Math.ceil(filteredSubmissions.length / Number(rowsPerPage));
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * Number(rowsPerPage), currentPage * Number(rowsPerPage));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-inter -tracking-[4%] font-bold text-white">My Submissions</h1>
        <p className="text-[#FAFAFAE5] font-medium font-inter">Track and manage all your submissions across bounties, grants, and projects.</p>
      </div>

      <SubmissionStats />

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
            <div className="relative flex-1 sm:w-72 border border-[#404040] rounded-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or skill..."
                className="pl-9 h-9 bg-black border-white/10 text-muted-foreground placeholder:text-muted-foreground rounded-lg w-full focus:ring-1 "
              />
            </div>

            {/* Sort */}
            <Select defaultValue="newest">
              <SelectTrigger className="w-[120px] h-9 bg-[#0A0A0A] border-[#404040] text-white text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10 text-white">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {paginatedSubmissions.map((sub) => (
            <div key={sub.id} onClick={() => setSelectedSubmission(sub)} className="cursor-pointer">
              <SubmissionCard
                {...sub}
                type={sub.type as any}
              />
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-end gap-x-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <span>Rows per page</span>
            <Select
              value={rowsPerPage}
              onValueChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}
            >
              <SelectTrigger className="h-8 w-[60px] bg-black border-white/10 text-white text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10 text-white">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm font-medium text-gray-400">Page {currentPage} of {totalPages || 1}</span>

          <div className="flex items-center gap-2 ml-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-md bg-zinc-600/50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 hover:bg-zinc-600/50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-md bg-zinc-600/50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 hover:bg-zinc-600/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-md bg-black border-white/10 text-white hover:bg-black/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-md bg-black border-white/10 text-white hover:bg-black/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <SubmissionDetailsModal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
        />

        {/* Footer info - Removed or kept? Design shows just pagination. 
            I'll keep a minimal spacer or remove the old 'Get Help' since it's not in the new design mockup 
            but kept the details modal functionality.
        */}
      </div>
    </div>
  );
}
