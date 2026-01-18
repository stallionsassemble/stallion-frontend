"use client";

import { BountyCard } from "@/components/bounties/bounty-card";
import { Button } from "@/components/ui/button";
import { bountyService } from "@/lib/api/bounties";
import { projectService } from "@/lib/api/projects";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookmarksPage() {
  const { bookmarks, isLoaded: isBookmarksLoaded } = useBookmarks();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      if (!isBookmarksLoaded) return;
      if (bookmarks.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = bookmarks.map(async (b) => {
          try {
            if (b.type === "bounty") {
              const data = await bountyService.getBounty(b.id);
              return { ...data, _type: "bounty", _savedAt: b.savedAt };
            } else {
              const data = await projectService.getProject(b.id);
              return { ...data, _type: "project", _savedAt: b.savedAt };
            }
          } catch (error) {
            console.error(`Failed to fetch ${b.type} ${b.id}`, error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        // Filter out failed fetches (null)
        setItems(results.filter(Boolean));
      } catch (error) {
        console.error("Error fetching bookmarks", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [bookmarks, isBookmarksLoaded]);

  if (!isBookmarksLoaded || loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-full p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-inter mb-2">Bookmarks</h1>
        <p className="text-muted-foreground">Manage your saved bounties and projects.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-xl border border-dashed border-primary/20">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Save interesting bounties and projects to access them quickly later.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/bounties">
              <Button>Browse Bounties</Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button variant="outline">Browse Projects</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <BountyCard
              key={`${item._type}-${item.id}`}
              id={item.id}
              title={item.title}
              description={item.shortDescription || item.description}
              company={
                item.owner?.companyName || item.owner?.username || "Stallion User"
              }
              logo={
                item.owner?.companyLogo ||
                item.owner?.profilePicture ||
                "/assets/icons/sdollar.png"
              }
              amount={item.reward?.toString() || "0"}
              type={item.rewardCurrency || item.currency}
              tags={item.skills || []}
              participants={item.applicationCount || item.applications?.length || 0}
              dueDate={
                item.submissionDeadline || item.deadline
                  ? formatDistanceToNow(
                    new Date(item.submissionDeadline || item.deadline),
                    { addSuffix: true }
                  )
                  : "No deadline"
              }
              version={item._type === "bounty" ? "BOUNTY" : "PROJECT"}
              status={item.status === "ACTIVE" ? "Submission Open" : item.status}
              className="w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
