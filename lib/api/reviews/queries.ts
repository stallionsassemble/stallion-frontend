import { CreateReviewPayload } from '@/lib/types/reviews'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { reviewsService } from './index'

export function useGetUserReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => reviewsService.getUserReviews(userId),
    enabled: !!userId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string
      payload: CreateReviewPayload
    }) => reviewsService.createReview(userId, payload),
    onSuccess: (data) => {
      toast.success('Review submitted successfully')
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'user', data.reviewedUserId],
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    },
  })
}
