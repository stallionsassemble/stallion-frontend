
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useReplyToBountyDiscussion, useReplyToProjectDiscussion, useToggleBountyReaction, useToggleProjectReaction, useToggleReplyReaction } from "@/lib/api/discussions/queries"
import { useAuth } from "@/lib/store/use-auth"
import { Discussion, DiscussionReply } from "@/lib/types/discussions"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Reply, ThumbsUp } from "lucide-react"
import { useState } from "react"

interface DiscussionItemProps {
  item: Discussion | DiscussionReply
  type: 'BOUNTY' | 'PROJECT'
  parentId?: string // The ID of the top-level discussion if this is a reply
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

  const isReply = 'replies' in item === false // Simplistic check, realistically Discussion has replies, Reply has replies too in types but simplified here
  // Actually types say both have replies. Let's rely on parentId presence passed from parent or recursive structure.
  // The item itself is either Discussion or DiscussionReply.

  const handleReply = async () => {
    if (!replyContent.trim()) return

    const payload = { content: replyContent, parentId: item.id }
    // If it's a BOUNTY discussion
    if (type === 'BOUNTY') {
      // If we are replying to a reply, the backend might expect the discussionID as the param, and parentId in body.
      // But my service signature is `replyToBountyDiscussion(discussionId, payload)`.
      // If this item IS a reply, we need the root discussion ID.
      // The current types and service might be slightly mismatched for nested replies if not passed strictly.
      // Let's assume for now 1 level nesting or the parentId prop handles the root ID.
      // Actually, standard pattern: Reply to the Discussion ID, with parentId pointing to the specific comment you are replying to.
      // BUT `parentId` in `DiscussionItemProps` usage suggests it might be the root discussion ID?

      const rootId = parentId || item.id // If no parentId, this item IS the root discussion.
      // Wait, if I reply to a reply, I still need to hit /discussions/bounty/:discussionId/reply
      // So I need the root discussion ID.
      // Let's ensure parentId is passed correctly for replies.

      if (parentId) {
        // This is a reply to a reply (or reply to discussion, but item is a reply).
        // The service expects discussionId.
        await replyToBounty.mutateAsync({ discussionId: parentId, payload: { content: replyContent, parentId: item.id } })
      } else {
        // This is the root discussion
        await replyToBounty.mutateAsync({ discussionId: item.id, payload: { content: replyContent } })
      }
    } else {
      const rootId = parentId || item.id
      if (parentId) {
        await replyToProject.mutateAsync({ discussionId: parentId, payload: { content: replyContent, parentId: item.id } })
      } else {
        await replyToProject.mutateAsync({ discussionId: item.id, payload: { content: replyContent } })
      }
    }

    setReplyContent("")
    setIsReplying(false)
  }

  const handleReaction = async (emoji: string) => {
    // Check if it's a reply or root discussion
    // Logic: If it has a parentId prop passed to this component, it DOES NOT mean it's a reply object necessarily if I recursively render.
    // Actually, `Discussion` type has `replies`. `DiscussionReply` type also has `replies`.
    // The API distinguishes endpoints: `/discussions/bounty/:id/react` vs `/discussions/reply/:id/react`

    // We need to know if 'item' is a Reply or a Discussion.
    // A reliable way is checking if `bountyId` or `projectId` exists on it (Discussion) or not (Reply).
    // Or just use a prop `isRoot`.

    const isRoot = !parentId
    if (isRoot) {
      if (type === 'BOUNTY') {
        await toggleBountyReaction.mutateAsync({ discussionId: item.id, payload: { emoji } })
      } else {
        await toggleProjectReaction.mutateAsync({ discussionId: item.id, payload: { emoji } })
      }
    } else {
      await toggleReplyReaction.mutateAsync({ replyId: item.id, payload: { emoji } })
    }
  }

  const thumbsUpReaction = item.reactions.find(r => r.emoji === '👍')
  const hasLiked = thumbsUpReaction?.hasReacted

  return (
    <div className={cn("flex gap-3", parentId && "mt-4 ml-4 md:ml-10 border-l-2 pl-4 border-muted")}>
      <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer border border-border">
        <AvatarImage src={item.author.profilePicture || ""} alt={item.author.username} />
        <AvatarFallback>{item.author.firstName?.[0] || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">
            {item.author.firstName} {item.author.lastName}
          </span>
          <span className="text-xs text-muted-foreground">
            • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>

        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {item.content}
        </p>

        <div className="flex items-center gap-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-6 px-2 text-xs gap-1.5 hover:bg-muted/50", hasLiked && "text-blue-600")}
            onClick={() => handleReaction('👍')}
          >
            <ThumbsUp className={cn("w-3.5 h-3.5", hasLiked && "fill-current")} />
            {thumbsUpReaction?.count || 0 > 0 ? thumbsUpReaction?.count : 'Like'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs gap-1.5 hover:bg-muted/50"
            onClick={() => setIsReplying(!isReplying)}
          >
            <Reply className="w-3.5 h-3.5" />
            Reply
          </Button>
        </div>

        {isReplying && (
          <div className="flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[80px] text-sm resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
              <Button size="sm" onClick={handleReply}>Reply</Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {item.replies && item.replies.length > 0 && (
          <div className="flex flex-col">
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
