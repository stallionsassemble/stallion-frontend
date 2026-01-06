import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserReview } from "@/lib/types/reviews";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, Calendar as CalendarIcon, Gift, Star } from "lucide-react";

interface ReviewItemProps {
  review: UserReview;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-primary bg-primary/14 p-3">
      {/* Logo */}
      <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
        <Avatar className="h-full w-full">
          <AvatarImage src={review.reviewer.profilePicture || "/assets/icons/sdollar.png"} className="object-cover" />
          <AvatarFallback className="text-black">{review.reviewer.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-bold font-inter text-foreground">
              {review.reviewer.username || "Anonymous"}
            </h4>
            <p className="text-sm font-normal font-inter text-muted-foreground/80">
              {review.message}
            </p>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/60">

              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3 text-primary" />
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>

              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-primary" />
                {review.reviewer.firstName + ' ' + review.reviewer.lastName}
              </span>

              <span className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-primary" />
                Project
              </span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-5 h-5",
                  star <= review.rating
                    ? "fill-[#3B82F6] text-[#3B82F6]"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
