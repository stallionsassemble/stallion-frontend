
import { useGetUserReviews } from "@/lib/api/reviews/queries";
import { useAuth } from "@/lib/store/use-auth";
import { Loader2, MessageSquare } from "lucide-react";
import { CreateReviewDialog } from "./create-review-dialog";
import { ReviewItem } from "./review-item";

interface ReviewListProps {
  userId: string;
  username: string;
}

export function ReviewList({ userId, username }: ReviewListProps) {
  const { data, isLoading } = useGetUserReviews(userId);
  const { user: currentUser } = useAuth();

  const reviews = data?.reviews || [];
  const isOwnProfile = currentUser?.id === userId;

  if (isLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-4 md:p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold font-inter">
          Reviews <span className="text-muted-foreground text-sm font-normal ml-1">({reviews.length})</span>
        </h3>
        {!isOwnProfile && currentUser && (
          <CreateReviewDialog userId={userId} username={username} />
        )}
      </div>

      <div className="space-y-0"> {/* Removed gap because items have their own padding/border */}
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-primary/5 rounded-xl border border-dashed border-primary/20">
            <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
            {!isOwnProfile && currentUser && (
              <div className="mt-4">
                <CreateReviewDialog
                  userId={userId}
                  username={username}
                  trigger={<button className="text-primary hover:underline text-sm font-medium">Be the first to leave a review</button>}
                />
              </div>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
