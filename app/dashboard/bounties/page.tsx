"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { PageFilters } from "@/components/bounties/page-filters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { useGetAllBounties } from "@/lib/api/bounties/queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useAuth } from "@/lib/store/use-auth";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BountiesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params
  const urlOwnerId = searchParams.get('ownerId');

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [activeSort, setActiveSort] = useState("newest");
  const [activeStatus, setActiveStatus] = useState<string>("ACTIVE");

  // Pagination Logic
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Derive sort params
  let sortBy: 'createdAt' | 'reward' | 'submissionDeadline' | undefined = 'createdAt';
  let sortOrder: 'asc' | 'desc' | undefined = 'desc';

  if (activeSort === 'reward_desc') {
    sortBy = 'reward';
    sortOrder = 'desc';
  } else if (activeSort === 'ending_soon') {
    sortBy = 'submissionDeadline';
    sortOrder = 'asc';
  }

  // Determine effective ownerId filter:
  // Only use URL ownerId parameter if present
  const filterOwnerId = urlOwnerId || undefined;

  const { data, isLoading } = useGetAllBounties({
    page: currentPage,
    limit: Number(rowsPerPage),
    skills: activeTab !== "All" ? activeTab : undefined,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: activeStatus !== "ALL" ? activeStatus as any : undefined,
    ownerId: filterOwnerId,
  });

  // Fetch all bounties to derive available skills (filters) so they don't disappear when filtering
  const { data: allBountiesData } = useGetAllBounties({
    limit: 100,
    status: 'ACTIVE'
  });

  const bounties = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  // Derive unique skills from ALL fetched bounties (not just filtered ones)
  const uniqueSkills = useMemo(() => {
    const list = allBountiesData?.data || [];
    const skills = new Set<string>();
    list.forEach((b: any) => {
      b.skills?.forEach((s: string) => skills.add(s));
    });
    return Array.from(skills).sort();
  }, [allBountiesData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Browse Bounties</h1>
          <p className="text-muted-foreground">Browse and manage available bounties.</p>
        </div>
        {filterOwnerId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/bounties')}
            className="text-xs h-8"
          >
            Clear Owner Filter
          </Button>
        )}
      </div>

      <PageFilters
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
        onSearch={(term) => { setSearchQuery(term); setCurrentPage(1); }}
        onSortChange={(sort) => { setActiveSort(sort); setCurrentPage(1); }}
        onStatusChange={(status) => { setActiveStatus(status); setCurrentPage(1); }}
        type="BOUNTY"
        count={meta?.total || 0}
        availableSkills={uniqueSkills}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {bounties.map((bounty: any) => (
            <BountyCard
              key={bounty.id}
              id={bounty.id}
              title={bounty.title}
              description={bounty.shortDescription}
              company={bounty.owner?.companyName || bounty.owner?.username || "Stallion User"}
              logo={bounty.owner?.companyLogo || bounty.owner?.profilePicture || "/assets/icons/sdollar.png"}
              amount={bounty.reward.toString()}
              type={bounty.rewardCurrency as any}
              tags={bounty.skills || []}
              participants={bounty.applicationCount || 0}
              dueDate={bounty.submissionDeadline ? formatDistanceToNow(new Date(bounty.submissionDeadline), { addSuffix: true }) : "No deadline"}
              className="w-full min-w-0 md:w-full md:min-w-0"
              version="BOUNTY"
            />
          ))}
          {!isLoading && bounties.length === 0 && (
            <EmptyState
              title="No bounties found"
              description="Try adjusting your filters or search to find what you're looking for."
              className="col-span-full py-20 flex flex-col items-center justify-center text-center"
              icon={Search}
            />
          )}
        </div>
      )}

      {/* Pagination */}
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
    </div>
  );
}
