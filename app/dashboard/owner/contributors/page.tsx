"use client";

import { Contributor, ContributorCard } from "@/components/dashboard/owner/contributor-card";
import { InviteContributorModal } from "@/components/dashboard/owner/invite-contributor-modal";
import { SendMessageModal } from "@/components/dashboard/owner/send-message-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateConversation } from "@/lib/api/chat/queries";
import { useProjectContributors } from "@/lib/api/dashboard/queries";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SlidersHorizontal, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OwnerContributorsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { mutateAsync: createConversation, isPending: isCreatingChat } = useCreateConversation();
  const { data: contributors, isLoading } = useProjectContributors();

  // 1. Map API Data to UI Interface
  const allContributors: Contributor[] = (contributors || []).map((c) => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    role: c.skills?.[0] || "Contributor", // Fallback role from skills or valid default
    avatar: c.profilePicture,
    initials: `${c.firstName?.[0] || ""}${c.lastName?.[0] || ""}`.toUpperCase(),
    bio: c.bio || `No bio provided. Location: ${c.location || "Unknown"}`,
    stats: {
      bounties: c.totalBountiesParticipated || 0,
      projects: c.totalProjectsParticipated || 0,
      totalEarned: c.totalEarnings || 0,
      currency: "USDC"
    }
  }));

  // Extract unique roles based on the mapped data
  const uniqueRoles = Array.from(new Set(allContributors.map(c => c.role)));

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
    setCurrentPage(1); // Reset pagination on filter change
  };

  // 2. Filter Logic
  const filteredContributors = allContributors.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(c.role);

    return matchesSearch && matchesRole;
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredContributors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContributors = filteredContributors.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInvite = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setIsInviteModalOpen(true);
  };

  const handleMessage = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setIsMessageModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-[1600px] mx-auto w-full">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">Contributors</h1>
        <p className="text-muted-foreground">View and manage contributors who have worked on your bounties</p>
      </div>

      <div className="flex p-5 border-primary border rounded-xl items-center gap-4 bg-background">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role or skill..."
            className="pl-9 bg-transparent border-slate-800 text-white placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent border-blue-900/40 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 h-9 px-4 gap-2 ml-2">
                <SlidersHorizontal className="h-3 w-3" /> More Filter
                {selectedRoles.length > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {selectedRoles.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0A0A0A] border-slate-800 text-slate-200">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              {uniqueRoles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => toggleRole(role)}
                  className="focus:bg-slate-800 focus:text-white"
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedRoles.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                      onClick={() => setSelectedRoles([])}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-background border-primary overflow-hidden flex flex-col h-full">
              <CardContent className="p-4 flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full border border-white/10 bg-slate-800" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-5 w-20 bg-slate-800" />
                    <Skeleton className="h-6 w-32 bg-slate-800" />
                    <div className="flex gap-4 mt-2">
                      <Skeleton className="h-4 w-16 bg-slate-800" />
                      <Skeleton className="h-4 w-16 bg-slate-800" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-6 bg-slate-800" />
                <div>
                  <Skeleton className="h-3 w-20 mb-1 bg-slate-800" />
                  <Skeleton className="h-8 w-24 bg-slate-800" />
                </div>
              </CardContent>
              <div className="p-4 pt-0 mt-auto grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800" />
              </div>
            </Card>
          ))
        ) : paginatedContributors.map((contributor) => (
          <ContributorCard
            key={contributor.id}
            contributor={contributor}
            onInvite={handleInvite}
            onMessage={handleMessage}
          />
        ))}
        {!isLoading && paginatedContributors.length === 0 && (
          <div className="col-span-full py-12">
            <EmptyState
              icon={Users}
              title="No contributors found"
              description="No contributors found matching your search criteria."
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredContributors.length > 0 && (
        <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/5">

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            Rows per page
            <select
              className="bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white text-xs outline-none"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1">
              <Button
                variant="outline" size="icon"
                className="h-8 w-8 bg-[#0A0A0A] border-white/10 hover:bg-white/5 p-0"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline" size="icon"
                className="h-8 w-8 bg-[#0A0A0A] border-white/10 hover:bg-white/5 p-0"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline" size="icon"
                className="h-8 w-8 bg-[#0A0A0A] border-white/10 hover:bg-white/5 p-0"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline" size="icon"
                className="h-8 w-8 bg-[#0A0A0A] border-white/10 hover:bg-white/5 p-0"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <InviteContributorModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        contributor={selectedContributor}
      />

      <SendMessageModal
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        contributor={selectedContributor}
      />
    </div>
  );
}
