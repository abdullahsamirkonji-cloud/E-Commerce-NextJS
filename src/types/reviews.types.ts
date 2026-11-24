export interface ReviewUser {
  _id: string;
  name: string;
}

export interface ReviewItem {
  _id: string;
  review?: string;
  rating: number;
  user: ReviewUser;
  product?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductReviewsResponse {
  results: number;
  data: ReviewItem[];
}

export interface CreateReviewData {
  review: string;
  rating: number;
}
