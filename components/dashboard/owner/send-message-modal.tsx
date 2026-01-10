'use client'

import { Contributor } from "@/components/dashboard/owner/contributor-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useChatSocket } from "@/lib/hooks/use-chat-socket"
import { Loader2, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface SendMessageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contributor: Contributor | null
}

export function SendMessageModal({ open, onOpenChange, contributor }: SendMessageModalProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { sendMessage } = useChatSocket()

  const handleSend = async () => {
    if (!contributor || !message.trim()) return

    setIsSending(true)
    try {
      const response = await sendMessage({
        recipientId: contributor.id,
        content: message.trim(),
      })

      if (response?.success && response.message) {
        toast.success("Message sent!")
        onOpenChange(false)

        // Redirect to the conversation
        // Using project-owner specific route with search param for deep linking
        router.push(`/dashboard/project-owner/messages?id=${response.message.conversationId}`)
      } else {
        toast.error(response?.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("An error occurred while sending the message")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#09090b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Message {contributor?.name}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Send a direct message to start a conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] bg-[#0B0E14] border-white/10 text-white focus:border-blue-500/50 resize-none"
          />
        </div>
        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-white hover:bg-white/5"
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
