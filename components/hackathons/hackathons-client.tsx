"use client";

import { useGetHackathons } from "@/lib/api/hackathon/queries";
import { HackathonCard } from "./hackathon-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { EmptyState } from "@/components/ui/empty-state";

export function HackathonsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("8");
  
  // Filters
  const [techStack, setTechStack] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useGetHackathons({
    page: currentPage,
    limit: Number(rowsPerPage),
    search: debouncedSearch,
    // Add other filters if the API supports them
  });

  const hackathons = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Derive unique tags for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach(h => h.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [hackathons]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight font-syne">
          Hackathons
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
          Participate in the world's best remote and in-person upcoming Web3 hackathons 2026. 
          Work together and build something amazing on Web3, Blockchain, Solidity, Crypto and more.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#09090B] p-4 rounded-xl border border-white/5 shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Hackathons..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select value={techStack} onValueChange={setTechStack}>
            <SelectTrigger className="w-full md:w-[160px] bg-white/5 border-white/10 text-white h-11 rounded-lg">
              <SelectValue placeholder="Tech Stack" />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="all">All Tech</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[160px] bg-white/5 border-white/10 text-white h-11 rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full md:w-auto bg-white/5 border-white/10 text-white h-11 rounded-lg gap-2">
            More Filters
          </Button>
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hackathons found"
          description="Check back later or try adjusting your filters."
          icon={Search}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 mx-4">
            <span className="text-sm text-gray-400">Page</span>
            <span className="text-sm font-bold text-white">{currentPage}</span>
            <span className="text-sm text-gray-400">of {totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-9 w-9 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
