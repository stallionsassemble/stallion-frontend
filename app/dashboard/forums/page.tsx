"use client";

import { CreateCategoryDialog } from "@/components/forum/create-category-dialog";
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog";
import { ForumDiscussionCard } from "@/components/forum/forum-discussion-card";
import { ForumFilters } from "@/components/forum/forum-filters";
import { ForumStats } from "@/components/forum/forum-stats";
import { Button } from "@/components/ui/button";
import { useGetCategories, useSearchThreads } from "@/lib/api/forum/queries";
import { ChevronLeft, ChevronRight, Loader2, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const ITEMS_PER_PAGE = 10;

export default function ForumPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('latest');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryId, debouncedSearch, sortBy, dateRange]);

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();

  // Fetch threads without sorting from API (client-side sort enabled)
  const { data: threads = [], isLoading: isThreadsLoading } = useSearchThreads(
    debouncedSearch,
    activeCategoryId === 'all' ? undefined : activeCategoryId,
    undefined, // Do not pass sortBy to API
    dateRange
  );

  // Client-side sorting
  const sortedThreads = [...threads].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0);
      case 'active':
        // Fallback to createdAt if updatedAt is not available on SearchThread
        // Ideally checking for last activity
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Client-side pagination
  const totalPages = Math.ceil(sortedThreads.length / ITEMS_PER_PAGE);
  const paginatedThreads = sortedThreads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[36px] md:text-4xl font-inter -tracking-[4%] font-bold text-foreground">Community Forum</h1>
          <p className="text-foreground font-medium font-inter text-[14px]">Discuss, share, and learn with the community</p>
        </div>
        <div className="flex gap-3">
          <Button variant={'outline'} onClick={() => setIsCategoryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
          <Button variant={'stallion'} onClick={() => setIsDialogOpen(true)}>
            <Send className="h-4 w-4 rotate-0 mr-2" />
            New Discussion
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ForumStats />

      {/* Filters & Content Container */}
      <div className="space-y-6">
        <ForumFilters
          categories={categories}
          activeTab={activeCategoryId}
          onTabChange={setActiveCategoryId}
          onSearch={setSearchQuery}
          onSortChange={setSortBy}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Discussions List */}
        <div className="overflow-hidden space-y-4">
          {isThreadsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : paginatedThreads.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No discussions found.
            </div>
          ) : (
            <>
              {paginatedThreads.map((discussion) => (
                <Link href={`/dashboard/forums/${discussion.slug || discussion.id}`} key={discussion.id}>
                  <ForumDiscussionCard
                    id={discussion.id}
                    title={discussion.title}
                    description={(discussion.description || discussion.content || "").length > 150
                      ? (discussion.description || discussion.content || "").substring(0, 150) + "..."
                      : (discussion.description || discussion.content || "")}
                    author={discussion.author.username}
                    timeAgo={new Date(discussion.createdAt).toLocaleDateString()}
                    replies={discussion.replyCount ?? discussion.postCount}
                    likes={discussion.likeCount ?? 0}
                    views={discussion.viewCount}
                    category={discussion.category?.name || "General"}
                  />
                </Link>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CreateThreadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <CreateCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />
    </div>
  );
}