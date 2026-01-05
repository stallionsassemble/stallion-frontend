
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/lib/api/reviews/queries";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";

interface CreateReviewDialogProps {
  userId: string;
  username: string;
  trigger?: React.ReactNode;
}

export function CreateReviewDialog({ userId, username, trigger }: CreateReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) return;

    createReview(
      { userId, payload: { rating, message } },
      {
        onSuccess: () => {
          setOpen(false);
          setRating(0);
          setMessage("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            Write a Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review {username}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2 flex flex-col items-center">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder={`Share your experience working with ${username}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none h-32"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending || rating === 0 || !message.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
