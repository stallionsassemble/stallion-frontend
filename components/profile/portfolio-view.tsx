"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllBounties, useGetMyBountySubmissions } from "@/lib/api/bounties/queries";
import { useGetMyApplications, useGetProjects } from "@/lib/api/projects/queries";
import { useAuth } from "@/lib/store/use-auth";
import { format } from "date-fns";
import { Briefcase, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gift, Loader2, Search } from "lucide-react";
import * as React from "react";

interface PortfolioViewProps {
  viewType?: 'owner' | 'talent';
}

export function PortfolioView({ viewType = 'owner' }: PortfolioViewProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // --- Data Fetching ---

  // 1. Owner - Bounties
  // We fetch a larger limit to facilitate client-side merging and sorting with projects.
  const { data: ownerBountiesData, isLoading: isLoadingOwnerBounties } = useGetAllBounties({
    ownerId: user?.id,
    status: 'COMPLETED',
    page: 1,
    limit: 100
  }, { enabled: viewType === 'owner' });

  // 2. Owner - Projects
  const { data: ownerProjectsData, isLoading: isLoadingOwnerProjects } = useGetProjects({
    ownerId: user?.id,
    status: 'COMPLETED'
  }, { enabled: viewType === 'owner' });

  // 3. Talent - Bounties (Submissions)
  const { data: talentSubmissionsData, isLoading: isLoadingTalentSubmissions } = useGetMyBountySubmissions({ enabled: viewType === 'talent' });

  // 4. Talent - Projects (Applications)
  const { data: talentApplicationsData, isLoading: isLoadingTalentApplications } = useGetMyApplications({ enabled: viewType === 'talent' });


  // --- Data Normalization & Merging ---

  const isLoading =
    viewType === 'owner'
      ? (isLoadingOwnerBounties || isLoadingOwnerProjects)
      : (isLoadingTalentSubmissions || isLoadingTalentApplications);

  let mergedItems: any[] = [];

  if (viewType === 'owner') {
    // Owner Mode: Combined Created Bounties and Projects
    const bounties = (ownerBountiesData?.data || []).map((b: any) => ({
      ...b,
      uniqueId: `bounty-${b.id}`,
      typeLabel: 'Bounty',
      displayType: b.type,
      displayDate: b.createdAt
    }));

    const projects = (Array.isArray(ownerProjectsData) ? ownerProjectsData : []).map((p: any) => ({
      ...p,
      uniqueId: `project-${p.id}`,
      typeLabel: 'Project',
      displayType: 'Project',
      displayDate: p.createdAt
    }));

    mergedItems = [...bounties, ...projects];

  } else {
    // Talent Mode: Combined Submissions and Applications
    // Filter for positive outcomes (Accepted, Paid, Completed)
    const submissions = (talentSubmissionsData || [])
      .filter((s: any) => ['ACCEPTED', 'PAID', 'COMPLETED'].includes(s.status))
      .map((s: any) => ({
        ...s,
        id: s.bounty?.id || s.id,
        uniqueId: `sub-${s.id}`,
        title: s.bounty?.title || 'Unknown Bounty',
        shortDescription: s.bounty?.shortDescription || s.bounty?.description,
        reward: s.bounty?.reward,
        currency: s.bounty?.currency,
        typeLabel: 'Bounty',
        displayType: s.bounty?.type || 'Standard',
        displayDate: s.submittedAt || s.createdAt
      }));

    const applications = (talentApplicationsData || [])
      .filter((a: any) => a.status === 'ACCEPTED')
      .map((a: any) => ({
        ...a,
        id: a.project?.id || a.id,
        uniqueId: `app-${a.id}`,
        title: a.project?.title || 'Unknown Project',
        shortDescription: a.project?.shortDescription || a.project?.description,
        reward: a.project?.reward,
        currency: a.project?.currency,
        typeLabel: 'Project',
        displayType: 'Project',
        displayDate: a.createdAt
      }));

    mergedItems = [...submissions, ...applications];
  }

  // Sort by Date Descending
  mergedItems.sort((a, b) => new Date(b.displayType).getTime() - new Date(a.displayType).getTime());
  // Fallback sort if dates are invalid or equal? Use createdAt logic safely
  mergedItems.sort((a, b) => {
    const dateA = new Date(a.displayDate || 0).getTime();
    const dateB = new Date(b.displayDate || 0).getTime();
    return dateB - dateA;
  });

  // Client-Side Pagination
  const totalPages = Math.ceil(mergedItems.length / itemsPerPage) || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedItems = mergedItems.slice(start, start + itemsPerPage);


  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar - Simplified without Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-background border-border w-full md:w-[300px] h-[36px] shadow-none"
          />
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[120px] h-[36px] bg-background border-border shadow-none">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio List Container */}
      <div className="border-[0.68px] border-primary/20 rounded-xl p-4 md:p-6 bg-background">
        <h3 className="text-lg font-bold font-inter mb-6">
          {viewType === 'owner' ? 'Completed Work' : 'My Portfolio'}
        </h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No portfolio items found.
          </div>
        ) : (
          <div>
            {paginatedItems.map((item, i) => (
              <div
                key={item.uniqueId || i}
                className="flex items-start justify-between py-4 border-b border-primary bg-primary/14 p-3 last:border-0 last:mb-0 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
                  <p className="text-sm font-normal font-inter text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-sm font-normal font-inter text-muted-foreground/80 line-clamp-2">
                    {item.shortDescription || item.description?.replace(/<[^>]*>/g, '').substring(0, 100)}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/60 flex-wrap">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <CalendarIcon className="w-3 h-3 text-primary" /> {item.displayDate ? format(new Date(item.displayDate), "MMM yyyy") : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Briefcase className="w-3 h-3 text-primary" /> {item.typeLabel}
                    </span>
                    {item.typeLabel !== item.displayType && (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Gift className="w-3 h-3 text-primary" /> {item.displayType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold font-inter text-foreground text-base">
                    ${Number(item.reward || 0).toLocaleString()}
                  </span>
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] px-2 py-0.5 h-auto rounded-full font-bold border-0">
                    {item.currency || 'USDC'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
