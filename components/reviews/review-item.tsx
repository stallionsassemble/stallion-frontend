
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserReview } from "@/lib/types/reviews";
import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";

interface ReviewItemProps {
  review: UserReview;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={review.reviewer.profilePicture || "/assets/icons/sdollar.png"} />
            <AvatarFallback>{review.reviewer.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{review.reviewer.username}</span>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed font-inter">
        {review.message}
      </p>
    </div>
  );
}
