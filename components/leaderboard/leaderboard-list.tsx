"use client";

import { LeaderboardEntry } from "@/lib/types/reputation";
import { LeaderboardRow } from "./leaderboard-row";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface LeaderboardListProps {
  users: LeaderboardEntry[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function LeaderboardList({
  users,
  pagination,
  onPageChange,
  onLimitChange
}: LeaderboardListProps) {

  const showPagination = pagination && pagination.total > 10;

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="overflow-x-auto">
        <div className="min-w-[800px] flex flex-col gap-3">
          {users.map((user) => (
            <LeaderboardRow key={user.rank} user={user} />
          ))}
        </div>
      </div>

      {showPagination && onPageChange && (
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-x-6 gap-y-4 pt-4 border-t border-border">
          {onLimitChange && (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground hidden sm:flex">
              <span>Rows per page</span>
              <Select
                value={String(pagination.limit)}
                onValueChange={(val) => onLimitChange(Number(val))}
              >
                <SelectTrigger className="h-8 px-2 w-[60px] rounded-md bg-card border border-border text-foreground focus:ring-0 focus:ring-offset-0 gap-1">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onPageChange(1)}
                disabled={pagination.page === 1}
                className="h-8 w-8 rounded-md bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:bg-secondary/80"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="h-8 w-8 rounded-md bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:bg-secondary/80"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="h-8 w-8 rounded-md bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={pagination.page >= pagination.totalPages}
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
