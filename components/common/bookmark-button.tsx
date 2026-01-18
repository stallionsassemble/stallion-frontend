"use client";

import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

interface BookmarkButtonProps {
  id: string;
  type: "bounty" | "project";
  className?: string;
  variant?: "ghost" | "outline" | "solid";
}

export function BookmarkButton({ id, type, className, variant = "ghost" }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [marked, setMarked] = useState(false);

  // Sync with hook state
  useEffect(() => {
    setMarked(isBookmarked(id, type));

    // Listen for global updates (e.g. from other tabs or components)
    const handleUpdate = () => {
      const saved = localStorage.getItem("stallion_bookmarks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const exists = parsed.some((b: any) => b.id === id && b.type === type);
          setMarked(exists);
        } catch (e) { }
      }
    };

    window.addEventListener("bookmarks-updated", handleUpdate);
    return () => window.removeEventListener("bookmarks-updated", handleUpdate);
  }, [id, type, isBookmarked]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(id, type);
    setMarked(!marked); // Optimistic UI
  };

  return (
    <Button
      variant={variant === "solid" ? "secondary" : "ghost"}
      size="icon"
      className={cn(
        "transition-colors",
        marked ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleClick}
    >
      <Bookmark className={cn("h-5 w-5", marked && "fill-current")} />
    </Button>
  );
}
