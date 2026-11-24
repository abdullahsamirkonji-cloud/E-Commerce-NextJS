"use server";

import { getAuthHeaders } from "@/lib/auth-token";
import { CreateReviewData, ProductReviewsResponse, ReviewItem } from "@/types/reviews.types";
import { revalidatePath } from "next/cache";

export async function getProductReviews(
  productId: string,
): Promise<{ status: string; data: ReviewItem[]; results: number }> {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}/reviews`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { status: "fail", data: [], results: 0 };
    }

    const data: ProductReviewsResponse = await response.json();
    return {
      status: "success",
      data: data.data || [],
      results: data.results || 0,
    };
  } catch (err) {
    console.error("Error fetching product reviews:", err);
    return { status: "fail", data: [], results: 0 };
  }
}

export async function createProductReview(
  productId: string,
  reviewData: CreateReviewData,
) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Please sign in to write a review" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}/reviews`,
      {
        method: "POST",
        body: JSON.stringify(reviewData),
        headers: authHeaders,
      },
    );

    const data = await response.json();
    if (response.ok && (data.message === "success" || data.data)) {
      revalidatePath(`/products/${productId}`);
      return { status: "success", message: "Review posted successfully!", data: data.data };
    }
    return {
      status: "fail",
      message: data.message || "Failed to post review. You may have already reviewed this product.",
    };
  } catch (err) {
    console.error("Error creating review:", err);
    return { status: "fail", message: "Failed to post review. Please try again." };
  }
}

export async function updateProductReview(
  reviewId: string,
  reviewData: CreateReviewData,
  productId?: string,
) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Authentication required" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`,
      {
        method: "PUT",
        body: JSON.stringify(reviewData),
        headers: authHeaders,
      },
    );

    const data = await response.json();
    if (response.ok) {
      if (productId) revalidatePath(`/products/${productId}`);
      return { status: "success", message: "Review updated successfully!", data: data.data };
    }
    return { status: "fail", message: data.message || "Failed to update review" };
  } catch (err) {
    console.error("Error updating review:", err);
    return { status: "fail", message: "Failed to update review" };
  }
}

export async function deleteProductReview(
  reviewId: string,
  productId?: string,
) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Authentication required" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: authHeaders,
      },
    );

    // DELETE /api/v1/reviews/:id returns 204 No Content on success — do NOT call .json()
    if (response.ok || response.status === 204) {
      if (productId) revalidatePath(`/products/${productId}`);
      return { status: "success", message: "Review deleted successfully" };
    }
    // Only try to parse body on error responses
    const data = await response.json().catch(() => ({}));
    return { status: "fail", message: data.message || "Failed to delete review" };
  } catch (err) {
    console.error("Error deleting review:", err);
    return { status: "fail", message: "Failed to delete review" };
  }
}
