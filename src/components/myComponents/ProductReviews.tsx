"use client";

import { toast } from "../ui/toast";
import { useProductReviews } from "@/hooks/useProductReviews";
import { Loader2, MessageSquare, Pencil, Star, Trash2, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function ProductReviews({ productId }: { productId: string }) {
  const { status, data: session } = useSession();
  const {
    reviews,
    isLoading,
    createReview,
    isCreating,
    updateReview,
    isUpdating,
    deleteReview,
    isDeleting,
  } = useProductReviews(productId);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // Edit state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) {
      toast.add({ type: "error", description: "Please enter your review text" });
      return;
    }

    try {
      const res = await createReview({
        review: comment.trim(),
        rating,
      });

      if (res.status === "success") {
        toast.add({
          type: "success",
          description: "Thank you! Your review has been submitted.",
        });
        setComment("");
        setRating(5);
      } else {
        toast.add({
          type: "error",
          description: res.message || "Failed to post review",
          priority: "high",
        });
      }
    } catch {
      toast.add({
        type: "error",
        description: "An unexpected error occurred while posting your review.",
      });
    }
  }

  async function handleUpdateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!editingReviewId || !editComment.trim()) return;

    try {
      const res = await updateReview({
        reviewId: editingReviewId,
        data: { review: editComment.trim(), rating: editRating },
      });
      if (res.status === "success") {
        toast.add({ type: "success", description: "Review updated!" });
        setEditingReviewId(null);
      } else {
        toast.add({ type: "error", description: res.message || "Failed to update review" });
      }
    } catch {
      toast.add({ type: "error", description: "Error updating review" });
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      const res = await deleteReview(reviewId);
      if (res.status === "success") {
        toast.add({ type: "info", description: "Review removed" });
      } else {
        toast.add({
          type: "error",
          description: res.message || "Failed to delete review",
        });
      }
    } catch {
      toast.add({ type: "error", description: "Error deleting review" });
    }
  }

  function startEditing(reviewId: string, currentComment: string, currentRating: number) {
    setEditingReviewId(reviewId);
    setEditComment(currentComment);
    setEditRating(currentRating);
  }

  return (
    <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-6">
        <MessageSquare size={22} className="text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span>Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center rounded-xl bg-gray-50/70 p-6">
              <p className="text-sm font-semibold text-gray-700">No reviews yet</p>
              <p className="mt-1 text-xs text-gray-500">
                Be the first to share your thoughts about this product!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 space-y-4">
              {reviews.map((rev) => {
                const isAuthor =
                  session?.user?.id &&
                  rev.user &&
                  (session.user.id === rev.user._id ||
                    session.user.email === rev.user._id);

                const reviewDate = rev.createdAt
                  ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "";

                const isCurrentlyEditing = editingReviewId === rev._id;

                return (
                  <div key={rev._id} className="pt-4 first:pt-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700 text-xs">
                          {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : <User size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-gray-900">
                            {rev.user?.name || "Customer"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="flex text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < rev.rating
                                      ? "fill-amber-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            {reviewDate && (
                              <span className="text-[11px] text-gray-400">
                                • {reviewDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isAuthor && !isCurrentlyEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditing(rev._id, rev.review || "", rev.rating)}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                            title="Edit your review"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev._id)}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete your review"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                      {isCurrentlyEditing && (
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          title="Cancel editing"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {isCurrentlyEditing ? (
                      <form onSubmit={handleUpdateReview} className="mt-3 pl-12 space-y-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className="text-amber-400"
                            >
                              <Star
                                size={16}
                                className={star <= editRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows={2}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          type="submit"
                          disabled={isUpdating || !editComment.trim()}
                          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUpdating && <Loader2 size={12} className="animate-spin" />}
                          Save Changes
                        </button>
                      </form>
                    ) : (
                      rev.review && (
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed pl-12">
                          {rev.review}
                        </p>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Write a Review Section */}
        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
          <h3 className="font-bold text-gray-900 text-base mb-2">Write a Review</h3>
          <p className="text-xs text-gray-500 mb-4">
            Share your rating and thoughts with fellow customers
          </p>

          {status !== "authenticated" ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
              <p className="text-xs text-gray-600 mb-3">
                You must be logged in to leave a review.
              </p>
              <Link
                href={`/login?callbackUrl=/products/${productId}`}
                className="inline-block rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
              >
                Sign In to Review
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-amber-400 transition-transform hover:scale-110 p-0.5"
                    >
                      <Star
                        size={22}
                        className={
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-gray-700">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Review Comment Text */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Your Comments
                </label>
                <textarea
                  rows={3}
                  placeholder="What did you like or dislike about this product?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !comment.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-green-700 disabled:opacity-50"
              >
                {isCreating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                <span>Submit Review</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

