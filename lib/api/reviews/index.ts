import { api } from '@/lib/api'
import {
  CreateReviewPayload,
  Review,
  ReviewsResponse,
} from '@/lib/types/reviews'

class ReviewsService {
  async createReview(payload: CreateReviewPayload) {
    const response = await api.post<Review>('/reviews', payload)
    return response.data
  }

  async getUserReviews(userId: string) {
    const response = await api.get<ReviewsResponse>(`/reviews/user/${userId}`)
    return response.data
  }

  async getMyGivenReviews() {
    const response = await api.get<ReviewsResponse>('/reviews/given')
    return response.data
  }
}

export const reviewsService = new ReviewsService()
