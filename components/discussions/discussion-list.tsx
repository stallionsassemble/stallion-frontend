"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { DiscussionsService } from "@/lib/api/discussions"
import { DISCUSSION_KEYS, useCreateDiscussion } from "@/lib/api/discussions/queries"
import { useAuth } from "@/lib/store/use-auth"
import { useQuery } from "@tanstack/react-query"
import { MessageSquare, MessageSquareX } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { DiscussionItem } from "./discussion-item"


interface DiscussionListProps {
  id: string
  type: 'BOUNTY' | 'PROJECT'
}

export function DiscussionList({ id, type }: DiscussionListProps) {
  const [newComment, setNewComment] = useState("")
  const { user } = useAuth()

  const { data: discussions, isLoading, isError } = useQuery({
    queryKey: type === 'BOUNTY' ? DISCUSSION_KEYS.bounty(id) : DISCUSSION_KEYS.project(id),
    queryFn: () => type === 'BOUNTY'
      ? DiscussionsService.getBountyDiscussions(id)
      : DiscussionsService.getProjectDiscussions(id),
    enabled: !!id
  })

  const createDiscussion = useCreateDiscussion()

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    const payload = {
      content: newComment,
      bountyId: type === 'BOUNTY' ? id : undefined,
      projectId: type === 'PROJECT' ? id : undefined
    }

    await createDiscussion.mutateAsync(payload)
    setNewComment("")
  }

  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
        <MessageSquareX className="w-8 h-8 opacity-50" />
        <p>Failed to load discussions</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 mt-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            Discussion <span className="text-muted-foreground font-normal text-base ml-1">({discussions?.length || 0} comments)</span>
          </h3>
        </div>

        {/* Input Area */}
        <div className="flex gap-4 items-start">
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted border border-border">
            <Image
              src={user?.profilePicture || `https://avatar.vercel.sh/${user?.username || 'guest'}`}
              width={40}
              height={40}
              alt={user?.username || "User"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Ask Question or leave comment...."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-y bg-background border-primary/30 rounded-xl focus-visible:ring-primary/50 text-base p-4"
            />
            <div className="flex justify-start">
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || createDiscussion.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-lg"
              >
                {createDiscussion.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        {discussions?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No discussions yet.</p>
          </div>
        ) : (
          discussions?.map(discussion => (
            <DiscussionItem
              key={discussion.id}
              item={discussion}
              type={type}
            />
          ))
        )}
      </div>
    </div>
  )
}
