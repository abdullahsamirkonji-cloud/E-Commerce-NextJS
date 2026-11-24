"use client";

import {
  createProductReview,
  deleteProductReview,
  getProductReviews,
  updateProductReview,
} from "@/actions/reviews.action";
import { CreateReviewData } from "@/types/reviews.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProductReviews(productId: string) {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await getProductReviews(productId);
      return res.data;
    },
    enabled: !!productId,
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewData) =>
      createProductReview(productId, data),
    onSuccess: (res) => {
      if (res.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      }
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: CreateReviewData;
    }) => updateProductReview(reviewId, data, productId),
    onSuccess: (res) => {
      if (res.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      }
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) =>
      deleteProductReview(reviewId, productId),
    onSuccess: (res) => {
      if (res.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      }
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    refetch: reviewsQuery.refetch,
    createReview: createReviewMutation.mutateAsync,
    isCreating: createReviewMutation.isPending,
    updateReview: updateReviewMutation.mutateAsync,
    isUpdating: updateReviewMutation.isPending,
    deleteReview: deleteReviewMutation.mutateAsync,
    isDeleting: deleteReviewMutation.isPending,
  };
}
