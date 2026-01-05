import { User } from './index'

export interface UserReview {
  id: string
  rating: number
  message: string
  reviewerId: string
  reviewedUserId: string
  createdAt: string
  updatedAt: string
  reviewer: User
}

export interface UserReviewsResponse {
  reviews: UserReview[]
  averageRating: number
  totalReviews: number
}

export interface CreateReviewPayload {
  rating: number
  message: string
}
