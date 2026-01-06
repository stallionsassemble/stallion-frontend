import { api } from '@/lib/api'
import {
  CreateReviewPayload,
  UserReview,
  UserReviewsResponse,
} from '@/lib/types/reviews'

class ReviewsService {
  async createReview(userId: string, payload: CreateReviewPayload) {
    const response = await api.post<UserReview>(
      `/users/${userId}/reviews`,
      payload
    )
    return response.data
  }

  async getUserReviews(userId: string) {
    const response = await api.get<UserReviewsResponse>(
      `/users/${userId}/reviews`
    )
    return response.data
  }

  async getMyGivenReviews() {
    const response = await api.get<UserReviewsResponse>('/reviews/given')
    return response.data
  }
}

export const reviewsService = new ReviewsService()
