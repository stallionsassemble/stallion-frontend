
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useReplyToBountyDiscussion, useReplyToProjectDiscussion, useToggleBountyReaction, useToggleProjectReaction, useToggleReplyReaction } from "@/lib/api/discussions/queries"
import { useAuth } from "@/lib/store/use-auth"
import { Discussion, DiscussionReply } from "@/lib/types/discussions"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Heart, Loader2, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface DiscussionItemProps {
  item: Discussion | DiscussionReply
  type: 'BOUNTY' | 'PROJECT'
  parentId?: string
}

export function DiscussionItem({ item, type, parentId }: DiscussionItemProps) {
  const { user } = useAuth()
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const replyToBounty = useReplyToBountyDiscussion()
  const replyToProject = useReplyToProjectDiscussion()
  const toggleBountyReaction = useToggleBountyReaction()
  const toggleProjectReaction = useToggleProjectReaction()
  const toggleReplyReaction = useToggleReplyReaction()

  // Counts strictly from data
  const likeCount = item.reactions?.filter(r => r.emoji === 'heart').reduce((acc, curr) => acc + curr.count, 0) || 0
  const replyCount = (item as any).replies?.length || 0

  const handleReply = async () => {
    if (!replyContent.trim()) return

    if (type === 'BOUNTY') {
      if (parentId) {
        await replyToBounty.mutateAsync({ discussionId: parentId, payload: { content: replyContent, parentId: item.id } })
      } else {
        await replyToBounty.mutateAsync({ discussionId: item.id, payload: { content: replyContent } })
      }
    } else {
      if (parentId) {
        await replyToProject.mutateAsync({ discussionId: parentId, payload: { content: replyContent, parentId: item.id } })
      } else {
        await replyToProject.mutateAsync({ discussionId: item.id, payload: { content: replyContent } })
      }
    }

    setReplyContent("")
    setIsReplying(false)
  }

  const handleReaction = async () => {
    const isRoot = !parentId
    if (isRoot) {
      if (type === 'BOUNTY') {
        await toggleBountyReaction.mutateAsync({ discussionId: item.id, payload: { emoji: 'heart' } })
      } else {
        await toggleProjectReaction.mutateAsync({ discussionId: item.id, payload: { emoji: 'heart' } })
      }
    } else {
      await toggleReplyReaction.mutateAsync({ replyId: item.id, payload: { emoji: 'heart' } })
    }
  }

  const hasLiked = item.reactions?.some(r => r.emoji === 'heart' && r.hasReacted)

  return (
    <div className={cn("flex gap-3 md:gap-4", parentId && "ml-4 md:ml-12 mt-4")}>
      <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted border border-border">
        <Image
          src={item.author.profilePicture || `https://avatar.vercel.sh/${item.author.username}`}
          width={40}
          height={40}
          alt={item.author.username || ""}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {item.author.firstName || item.author.username} {item.author.lastName}
            </span>
            {/* Mock Project Owner Badge Logic - just checking specific name for demo or random */}
            {(item.author.username === 'Solana Foundation' || (item as any).author.isOwner) && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] h-5 px-1.5 font-normal">Project Owner</Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.content}
        </p>

        <div className="flex items-center gap-6 pt-1">
          <button
            onClick={handleReaction}
            className={cn("flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors group", hasLiked && "text-red-500")}
          >
            <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{replyCount}</span>
          </button>
        </div>

        {isReplying && (
          <div className="flex flex-col gap-3 mt-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[80px] text-sm resize-none bg-background border-primary/30 focus-visible:ring-primary/50 rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
              <Button size="sm" onClick={handleReply}>
                {false ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reply"}
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {item.replies && item.replies.length > 0 && (
          <div className="flex flex-col pt-2">
            {item.replies.map(reply => (
              <DiscussionItem
                key={reply.id}
                item={reply}
                type={type}
                parentId={parentId || item.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
