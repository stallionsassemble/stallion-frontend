
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useBountyDiscussions, useCreateDiscussion, useProjectDiscussions } from "@/lib/api/discussions/queries"
import { MessageSquarePlus, MessageSquareX } from "lucide-react"
import { useState } from "react"
import { DiscussionItem } from "./discussion-item"

interface DiscussionListProps {
  id: string
  type: 'BOUNTY' | 'PROJECT'
}

export function DiscussionList({ id, type }: DiscussionListProps) {
  const [newComment, setNewComment] = useState("")

  const { data: discussions, isLoading, isError } = type === 'BOUNTY'
    ? useBountyDiscussions(id)
    : useProjectDiscussions(id)

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
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Discussion
          <span className="text-muted-foreground font-normal text-sm ml-1">
            ({discussions?.length || 0})
          </span>
        </h3>

        <div className="flex gap-4 items-start">
          {/* We could show user avatar here if we wanted */}
          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              placeholder="Ask a question or share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-y"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || createDiscussion.isPending}
                className="w-full md:w-auto"
              >
                {createDiscussion.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {discussions?.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg bg-muted/20">
            <MessageSquarePlus className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No discussions yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          discussions?.map(discussion => (
            <DiscussionItem
              key={discussion.id}
              item={discussion}
              type={type}
            // Root items don't have parentId passed
            />
          ))
        )}
      </div>
    </div>
  )
}
